const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

// put ur stuff here or whatever
const config = {
    token: 'bot token goes here... you know the drill',
    owners: ['ur user id here'], // yeah just ur discord id
    prefix: '!'
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const DATA_DIR = path.join(__dirname, 'Data');
const MAX_FRIENDS = 25;
const MAX_SERVERS = 10;

async function readJSONFile(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Failed to read ${filename}:`, error);
        throw new Error(`Failed to read ${filename}`);
    }
}

async function writeJSONFile(filename, data) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Failed to write ${filename}:`, error);
        throw new Error(`Failed to write ${filename}`);
    }
}

function formatList(list, maxItems) {
    return list.length <= maxItems ? list : 
           [...list.slice(0, maxItems), `and ${list.length - maxItems} more...`];
}

function getData(userId, combinedData, type = 'connections') {
    const userData = combinedData.find(user => user.ID === userId);
    if (!userData) return [];

    if (type === 'connections') {
        return formatList(
            (userData.connections || []).map(
                id => combinedData.find(u => u.ID === id)?.Username || 'Unknown'
            ),
            MAX_FRIENDS
        );
    }
    
    return formatList(userData.serverNames || [], MAX_SERVERS);
}

async function getUserFromArgs(args, message) {
    if (!args.length) return null;
    const idOrUsername = args.join(' ').toLowerCase();
    const mentionedUser = message.mentions.users.first();
    if (mentionedUser) return mentionedUser;

    try {
        return await message.client.users.fetch(idOrUsername.replace(/\D/g, ''));
    } catch {
        const combinedData = await readJSONFile('combined.json');
        const userData = combinedData.find(
            user => user.ID === idOrUsername.replace(/\D/g, '') || 
                   user.Username?.toLowerCase() === idOrUsername
        );
        return userData ? await message.client.users.fetch(userData.ID).catch(() => null) : null;
    }
}

client.on('messageCreate', async message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command !== 'glance') return;

    if (!config.owners.includes(message.author.id)) {
        return message.reply("You don't have permission to use this command.");
    }

    try {
        const combinedData = await readJSONFile('combined.json');
        const problematicIds = await readJSONFile('problematic_ids.json');
        const subcommand = args[0]?.toLowerCase();

        let embed;

        switch (subcommand) {
            case 'overview':
                embed = new EmbedBuilder()
                    .setTitle('Data Overview')
                    .addFields([
                        { name: 'Total Users', value: combinedData.length.toString() },
                        { name: 'Tracked Users', value: Object.values(problematicIds).flat().length.toString() }
                    ])
                    .setColor(0x00ff00);
                break;

            case 'list':
                embed = new EmbedBuilder()
                    .setTitle('Tracked Users List')
                    .addFields(
                        Object.entries(problematicIds).map(([category, ids]) => ({
                            name: category,
                            value: ids.join(', ') || 'None'
                        }))
                    )
                    .setColor(0xff0000);
                break;

            case 'help':
                embed = new EmbedBuilder()
                    .setTitle('Glance Command Help')
                    .setDescription('Available commands:')
                    .addFields([
                        { name: '!glance <user>', value: 'View user details' },
                        { name: '!glance overview', value: 'Show data overview' },
                        { name: '!glance list', value: 'List tracked users' },
                    ])
                    .setColor(0x8a2be2);
                break;

            default:
                const user = await getUserFromArgs(args, message);
                if (!user) {
                    return message.reply("Couldn't find that user.");
                }

                const userCategories = Object.entries(problematicIds)
                    .filter(([, ids]) => ids.includes(user.id))
                    .map(([category]) => category);

                const friendsData = getData(user.id, combinedData, 'connections');
                const serversData = getData(user.id, combinedData, 'servers');

                embed = new EmbedBuilder()
                    .setTitle(`User Details: ${user.username}`)
                    .setDescription(
                        `**In Servers:** ${serversData.join(', ') || 'None'}\n` +
                        `**Friends:** ${friendsData.join(', ') || 'None'}`
                    )
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setColor(userCategories.length ? 0xff0000 : 0x00ff00)
                    .setFooter({
                        text: `Account Created: ${new Date(user.createdAt).toUTCString()} | ID: ${user.id}`
                    });

                if (userCategories.length) {
                    embed.addFields({ 
                        name: 'Categories', 
                        value: userCategories.join(', ') 
                    });
                }
        }

        return message.reply({ embeds: [embed] });

    } catch (error) {
        console.error('Command error:', error);
        return message.reply(`Error: ${error.message}`);
    }
});

// dont touch this stuff below unless u wanna break it
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('error', console.error);
process.on('unhandledRejection', console.error);

client.login(config.token);
