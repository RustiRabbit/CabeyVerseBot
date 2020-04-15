const Discord = require("discord.js");
const client = new Discord.Client();
require('dotenv').config();


// TODO
// Provide Reasons for ban & kick

// Channels
const CabeyGangRole = process.env.CABEY_GANG_ROLE;
const logsChannel = process.env.LOGS_CHANNEL;
const purgRoleName = process.env.PURG_ROLE;
const tempBanRoleName = process.env.BAN_ROLE;


const allowedRoles = process.env.BOT_USER_ROLES.split(',');

client.login(process.env.TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("!modcommands for help"); 

})

client.on("message", msg => {
    if(msg.content.startsWith("!kick")) {
        var member = msg.mentions.members.first();

        if(checkPerms(msg) == true) {
            member.kick().then((member) => {
                // Successmessage
                const channel = msg.client.channels.resolve(logsChannel);
                const embed = new Discord.MessageEmbed();
                embed.setTitle("User was Kicked");
                embed.setColor(0xff0000);
                embed.setDescription(getName(msg.member) + " kicked " + getName(member));
                channel.send(embed)
                console.log(getName(msg.member) + " Kicked " + getName(member));
            }).catch((error) => {
                // Failmessage
                if(error.httpStatus == "403") {
                    msg.channel.send("Error: " + member.displayName + " was NOT kicked due to permissions (maybe remove admin)");
                } else {
                    msg.channel.send("Error: " + member.displayName + " was NOT kicked");
                }
                console.log(error);
            });
        } else {
            msg.channel.send("You do not have the correct perms");
        }

    } else if (msg.content.startsWith("!ban")) {
        var member = msg.mentions.members.first();

        if(checkPerms(msg) == true) {
            member.ban().then((member) => {
                // Successmessage
                const channel = msg.client.channels.resolve(logsChannel);
                const embed = new Discord.MessageEmbed();
                embed.setTitle("User was Banned");
                embed.setColor(0xff0000);
                embed.setDescription(getName(msg.member) + " banned " + getName(member));
                channel.send(embed)
                console.log(getName(msg.member) + " banned " + getName(member));
            }).catch((error) => {
                // Failmessage
                if(error.httpStatus == "403") {
                    msg.channel.send("Error: " + member.displayName + " was NOT banned due to permissions (maybe remove admin)");
                } else {
                    msg.channel.send("Error: " + member.displayName + " was NOT banned");
                }
                console.log(error);
            });
        }  else {
            msg.channel.send("You do not have the correct perms");
        }
    } else if (msg.content.startsWith("!mute") || msg.content.startsWith("!purg")) {
        var member = msg.mentions.members.first();

        if(checkPerms(msg) == true) {
            member.roles.member.roles.set([purgRoleName]).then( () => {
                msg.channel.send("`" + getName(member) + "` has been muted");
                const channel = msg.client.channels.resolve(logsChannel);
                const embed = new Discord.MessageEmbed();
                embed.setTitle("User was placed in purg");
                embed.setColor(0xff0000);
                embed.setDescription(getName(msg.member) + " muted " + getName(member));
                channel.send(embed)
                console.log(getName(msg.member) + " muted " + getName(member))
    
            }).catch( (error)=> {
                console.log(error);
                msg.channel.send("Error (ask RustiRabbit)");
            }); 
        } else {
            msg.channel.send("You do not have the correct perms");
        }

        
    } else if (msg.content.startsWith("!unmute") || msg.content.startsWith("!unpurg")) {
        var member = msg.mentions.members.first();
        
        if(checkPerms(msg) == true) {
            member.roles.member.roles.remove([purgRoleName]).then( () => {
                member.roles.member.roles.set([CabeyGangRole]);
                msg.channel.send("`" + getName(member) + "` has been removed from mute");
                const channel = msg.client.channels.resolve(logsChannel);
                const embed = new Discord.MessageEmbed();
                embed.setTitle("User was unmuted");
                embed.setColor(0xff0000);
                embed.setDescription(getName(msg.member) + " unmuted " + getName(member));
                channel.send(embed)
                console.log(getName(msg.member) + " unmuted " + getName(member))
            }).catch( (error) => {
                msg.channel.send("Error (ask RustiRabbit)");
                console.log(error);
            })
        } else {
            msg.channel.send("You do not have the correct perms");
        }
    } else if (msg.content.startsWith("!tempban")) {
        var member = msg.mentions.members.first();

        if(checkPerms(msg) == true) {
            member.roles.member.roles.set([tempBanRoleName]).then( () => {
                msg.channel.send("`" + getName(member) + "` has been temp banned");
                const channel = msg.client.channels.resolve(logsChannel);
                const embed = new Discord.MessageEmbed();
                embed.setTitle("User was given a temp ban");
                embed.setColor(0xff0000);
                embed.setDescription(getName(msg.member) + " temp banned " + getName(member));
                channel.send(embed)
                console.log(getName(msg.member) + " temp banned " + getName(member))
    
            }).catch( (error)=> {
                console.log(error);
                msg.channel.send("Error (ask RustiRabbit)");
            }); 
        } else {
            msg.channel.send("You do not have the correct perms");
        }
    } else if (msg.content.startsWith("!untempban")) {
        var member = msg.mentions.members.first();
        
        if(checkPerms(msg) == true) {
            member.roles.member.roles.remove([tempBanRoleName]).then( () => {
                member.roles.member.roles.set([CabeyGangRole]);
                msg.channel.send("`" + getName(member) + "` has been un-temp banned");
                const channel = msg.client.channels.resolve(logsChannel);
                const embed = new Discord.MessageEmbed();
                embed.setTitle("User was un-temp banned");
                embed.setColor(0xff0000);
                embed.setDescription(getName(msg.member) + " un-temp banned " + getName(member));
                channel.send(embed)
                console.log(getName(msg.member) + " un-temp banned " + getName(member))
            }).catch( (error) => {
                msg.channel.send("Error (ask RustiRabbit)");
                console.log(error);
            })
        } else {
            msg.channel.send("You do not have the correct perms");
        }
    } else if(msg.content.startsWith("!warn")) {
        if(checkPerms(msg)) {
            var member = msg.mentions.members.first();
            if(member == null) {
                msg.channel.send("You need to mention a person");
            } else {
                const args = msg.content.split(" ");
                args.splice(0, 2)
                var output = ""
                for( i = 0; i < args.length; i++) {
                    output = output + args[i] + " ";
                }
                output = output.trim();

                const embed = new Discord.MessageEmbed();
                embed.setTitle(getName(msg.member) + " has warned you");
                embed.setColor(0xff0000);
                if(output == "") {
                    embed.setDescription("You have been warned");
                } else {
                    embed.setDescription("Reason: `" + output + "`");

                }
                member.send(embed);

                // Logging
                const channel = msg.client.channels.resolve(logsChannel);
                const logsEmbed = new Discord.MessageEmbed();
                logsEmbed.setTitle("User was warned");
                logsEmbed.setColor(0xff0000);
                if(output == "") {
                    logsEmbed.setDescription(getName(msg.member) + " warned " + getName(member));
                } else {
                    logsEmbed.setDescription(getName(msg.member) + " warned " + getName(member) + " with reason `" + output + "`");
                }
                channel.send(logsEmbed)
                console.log(getName(msg.member) + " warned " + getName(member));
            } 
        } else {
            msg.channel.send("You don't have the permissions to warn someone")
        }
    } else if (msg.content.startsWith("!modcommands")) {
        if (checkPerms(msg)) {
            msg.author.send("**Commands**\n!kick <user> - Kicks a user\n!ban <user> Bans a user\n!warn <user> <reason> warns a user\n!mute <user> Puts the user in purg\n!unmute <user> brings a user out of purg\n!tempban <user> places a user in tempban\n!untempban <user> brings a user out of temp ban");
        } else {
            msg.author.send("Well Well Well. It appears that you dont have the correct permissions to use the bot so why would I tell you what the bot can do when your a bad boy/girl?")
        }
    }
})

function checkPerms(msg) {
    allowed = false;
    for(i = 0; i < allowedRoles.length; i++) {
        if(msg.member.roles.cache.has(allowedRoles[i]) == true) {
            allowed = true;
        }
    }
    return allowed;
}

function getName(member) {
    if(member.nickname == null) {
        return member.user.tag;
    } else {
        return member.nickname;
    }
}
