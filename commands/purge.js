const { ModalBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, PermissionFlagsBits, Guild, ThreadChannel } = require("discord.js");
const { fips } = require("node:crypto");
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
        const purgeRole = interaction.options.getRole('role');
        const purgeDays = interaction.options.getInteger('days') ?? 30;

        // Send the initial reply.

        await interaction.reply({ content: `Checking for users without the role ${purgeRole.name}.` });

        // Now that we have that, we need to get the members in question.

        await interaction.guild.members.fetch();

        originalMemberList = await interaction.guild.members.cache.filter(member => !member.roles.cache.has(purgeRole.id));

        // Now that we have the members, we need to check how long they have been in the server.

        finalCount = 0;

        // There are 86400000 milliseconds in a day.

        currentEpochDay = Date.now() / 86400000;
        targetEpochDay = currentEpochDay - purgeDays;

        await console.log(`Current epoch day is ${currentEpochDay}`);

        await originalMemberList.forEach(member => {
            joinTime = member.joinedAt.getTime();
            joinTimeInDays = joinTime / 86400000;

            if(joinTimeInDays > targetEpochDay){
                finalCount++;
                console.log(`User ${member.user.username} joined less than ${purgeDays} days ago.`);
            }
        });
        
        interaction.followUp(`Of the ${originalMemberList.size} members without the role, ${finalCount} joined within ${purgeDays} days.`);
        
    },
};