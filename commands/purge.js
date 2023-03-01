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
        .addBooleanOption(option =>
            option
                .setName('kick')
                .setDescription('Should it kick these members? If not, it will list them out.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // While I could do those with kick permissions, in theory this command should only be ran by those with the power to ban members.

    async execute(interaction) {
        const purgeRole = interaction.options.getRole('role');
        const purgeDays = interaction.options.getInteger('days') ?? 30;
        const kickBool = interaction.options.getBoolean('kick') ?? false;

        // Send the initial reply.

        await interaction.reply({ content: `Checking for users without the role ${purgeRole.name}.` });

        // Now that we have that, we need to get the members in question.

        await interaction.guild.members.fetch();

        originalMemberList = interaction.guild.members.cache.filter(member => !member.roles.cache.has(purgeRole.id));

        // Now that we have the members, we need to check how long they have been in the server.

        finalCount = 0;

        // There are 86400000 milliseconds in a day.

        currentEpochDay = Date.now() / 86400000;
        targetEpochDay = currentEpochDay - purgeDays;

        console.log(`Current epoch day is ${currentEpochDay}`);

        originalMemberList.forEach(member => {
            joinTime = member.joinedAt.getTime();
            joinTimeInDays = joinTime / 86400000;

            if(joinTimeInDays < targetEpochDay){
                finalCount++;
                console.log(`User ${member.user.username} joined more than ${purgeDays} days ago.`);
                if (kickBool) {
                    interaction.followUp(`User ${member} has been kicked! Reason:\nKicked by Discnarok for not having role ${purgeRole.name} for over ${purgeDays} days`);
                    member.kick(`Kicked by Discnarok for not having role ${purgeRole.name} for over ${purgeDays} days`).catch(
                        console.error); 
                }
                else {
                    interaction.followUp(`User ${member} *would* have been kicked, but kicking is set to **false**.`);
                }
            }
        });
        
        interaction.followUp(`Of the ${originalMemberList.size} members without the role, ${finalCount} joined over ${purgeDays} days ago.\nKicking was set to **${kickBool}**.`);
    },
};