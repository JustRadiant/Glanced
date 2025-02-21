# Discord Network Mapper (Glance)

A fork of [humboldt123's Mutuals](https://github.com/humboldt123/mutuals) but with works in discord but less graphs because sometimes you just need to know things bestie.

## Token Warning or whatever
Yeah this needs your Discord token like the original. Don't share it with anyone unless you want your account stolen fr fr. Read the code first if you're paranoid (you should be tbh).

## How to Use This Thing

### Getting Your Data
1. Open Discord in browser 
2. F12 for DevTools 
3. Console tab -> paste the collector script
4. Wait for `combined.json` to download
   * Gonna take forever if you have friends
   * Added delays because Discord gets mad if you go too fast

### Bot Setup (the easy part)
1. Make a folder (organization queen)
2. Create a `Data` folder inside it
3. Drop that `combined.json` in there
4. Make `problematic_ids.json` with:
```json
{
    "problematic": []
}
```
5. Install the stuff:
```bash
npm init -y
npm install discord.js
```
6. Put your bot token and ID at the top (you know where)
7. Run it like you're running from your problems:
```bash
node bot.js
```

### Commands
* `!glance <user>` - A glorified broken follower list 
* `!glance overview` - Get the numbers
* `!glance list` - See how many people you can *GLANCE* upon

## Notes
* This is old code, don't judge
* Basic version because who needs features
* Made with Discord.js v14 
* If it breaks, try turning it off and on again

## Credits
Original mutual friends concept by [humboldt123](https://github.com/humboldt123). We just made it messier.

## License
MIT - Do whatever but don't blame me when it breaks bestie

---
Note: This is what happens when you fork a project at 3am and decide to make it public a year later. Enjoy ig 💅
