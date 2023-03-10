/*
Author: SylphicXen
Discnarok

Automated purge bot for Discord servers
*/

// Requirements

const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const { Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection } = require('discord.js');
// const internal = require('node:stream');

// Further requirements


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });

// Setting up command handling

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command)
    }
    else {
        console.log(`[WARNING The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Handling command interactions

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) 
        return; // If it's not a slash command, ignore it.

    const command = interaction.client.commands.get(interaction.commandName);

    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: `There was an error while executing this command!`, ephemeral: true });
        }
        else {
            await interaction.reply({ content: `There was an error while executing this command!`, ephemeral: true })
        }
    }
});



// Ensure it's working

client.once(Events.ClientReady, c => {
    console.log (`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token

client.login(process.env.DISCORD_TOKEN);
