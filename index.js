const Discord = require("discord.js");
const client = new Discord.Client();
require('dotenv').config();


// TODO
// Provide Reasons for ban & kick

// Channels
const logsChannel = process.env.LOGS_CHANNEL;
const purgRoleName = process.env.PURG_ROLE;
const tempBanRoleName = process.env.
const CabeyGangRole = process.env.CABEY_GANG_ROLE;

const allowedRoles = process.env.BOT_USER_ROLES.split(',');

client.login(process.env.TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
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
