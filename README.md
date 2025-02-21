# Discord Network Mapper (Glance)

A simple set of scripts to map Discord user connections. This is an older project being made public for educational purposes.

## How to Use

### Collecting Data
1. Open Discord in your browser
2. Press F12 to open DevTools
3. Go to Console tab
4. Paste the collector script and run it
5. Wait for `combined.json` to download
   - This might take a while depending on your friend count
   - The script has delays to avoid Discord rate limits

### Setting Up the Bot
1. Make a new folder for your bot
2. Create a `Data` folder inside it
3. Put your `combined.json` file in the `Data` folder
4. Make a new file called `problematic_ids.json` in `Data` with:
```json
{
    "problematic": []
}
```
5. Install what you need:
```bash
npm init -y
npm install discord.js
```
6. Put your bot token and user ID in the config section at the top of the code
7. Run it:
```bash
node bot.js
```

### Commands
- `!glance <user>` - Look up user info
- `!glance overview` - See stats
- `!glance list` - View tracked users

## Notes
- This is an old project shared for learning purposes
- Both collector and bot are basic versions
- Made with Discord.js v14

## License
MIT License - Do whatever you want with it
