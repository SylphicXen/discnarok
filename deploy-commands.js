require('dotenv').config()
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment

for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// REST module instance

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Deploy the commands

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.}`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            // Routes.applicationCommands(process.env.CLIENT_ID, process.env.DEV_GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }
    catch (error) {
        console.error(error);
    }
})();