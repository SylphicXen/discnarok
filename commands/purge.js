const { ModalBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;


module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purge all members who do not meet the criteria.')
        .addRoleOption(option => 
            option
                .setName('role')
                .setDescription('The role all members will be checked against')
                .setRequired(true))
        .addIntegerOption(option =>
            option 
                .setName('days')
                .setDescription('How many days the user must be in the server to be purged'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // While I could do those with kick permissions, in theory this command should only be ran by those with the power to ban members.

    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const days = interaction.options.getInteger('days') ?? 30;



        await interaction.reply({ content: `This would have purged people without ${role.name} who were here for longer than ${days} days.`, ephemeral: true });
        await wait(1000);
        await interaction.followUp({ content: `However, the bot is not yet done, so that won't be happening.`, ephemeral: true });
    },

};