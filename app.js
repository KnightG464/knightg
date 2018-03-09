const Discord = require("discord.js");
const { version } = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client({disablEveryone: true});

var ownerID = '315774012972204033';

const ms = require("ms");
const nan = require("nan");
const moment = require("moment");
require("moment-duration-format");
const urban = module.require("urban");
const shorten = require("isgd");
const superagent = require("superagent");
const fs = require("fs");

bot.on("ready", async () => {
  console.log(`${bot.user.tag} launched and ready to serve EK Clan!`);
  bot.user.setActivity("EK Clan! | =help", {type: "WATCHING"});
  bot.user.setStatus('dnd');

});

bot.on('guildCreate', (guild) => {
  if(!guild.available) return;
  let server_owner = guild.owner;
  server_owner.send(`**Hi,** **${server_owner.user.username}!,** **Thanks for Inviting Me to EK Clan!, I am ready to serve all!**`)
});

bot.on("guildMemberAdd", function(member) {

  let gma = new Discord.RichEmbed()

  .setColor("#0000ff")
  .addField(`**${member.user.tag}**, Welcome!`, `Member Joined Elite Knight Clan`);


member.guild.channels.find("name", "welcome-goodbye").send(gma)

});

bot.on("guildMemberRemove", function(member) {

  let gmr = new Discord.RichEmbed()

  .setColor("#0000ff")
  .addField(`**${member.user.tag}**, Goodbye!`, `Member Left Elite Knight Clan`);


member.guild.channels.find("name", "welcome-goodbye").send(gmr)

});

bot.on("message", async message => {

  if(message.author.bot) return;
  if(!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(' ')[0];
  command = command.slice(config.prefix.length);
  let args = message.content.split(' ').slice(1);

 if (command === "cat"){
   const { body } = await superagent
   .get(`http://random.cat/meow`)
   let catembed = new Discord.RichEmbed()
   .setColor("#E0FFFF")
   .setTitle("Meow :cat:", "Cat Image")
   .setImage(body.file)
   message.channel.send(catembed);
 } else

 if (command === "urban"){

    if(args.length < 1) return message.channel.send('**Please enter something to search!**');
    let str = args.join(" ");

    urban(str).first(json => {
        if(!json) return message.channel.send('**No results found.**');
        console.log(json);

        let urbanembed = new Discord.RichEmbed()
        .setTitle(json.word)
        .setDescription(json.definition)
        .setTimestamp()
        .setColor("#000000")
        .setFooter(`Written By ${json.author}`)
        .addField("Upvotes", json.thumbs_up, true)
        .addField("Downvotes", json.thumbs_down, true);

        message.channel.send(urbanembed);
 })
}

 if (command === "purge"){

 if (isNaN(args[0])) return message.reply('**Please supply a valid amount to purge**');
 if(args[0] > 100) return message.reply('**Please enter a number below 100!**');
 message.channel.bulkDelete(args[0]).then( messages => message.channel.send(`**Successfully deleted \`${messages.size}/${args[0]}\` messages**`)).then( message => ({ timeout: 5000 }));

 }

  if (command === "shorten"){

  if (!args[0]) return message.channel.send("**Proper Usage: =shorten <URL> [title]**")
  if (!args[1]) {
    shorten.shorten(args[0], function(res) {
      if (res.startsWith('Error:')) message.channel.send('**Down There!**');
      message.channel.send(`**${res}**`);
  });

} else {
  shorten.custom(args[0], args[1], function(res) {
    if (res.startsWith('Error')) return message.channel.send(`**${res}**`);
    message.chanel.send(`**<${res}>**`);
  })};

  }

  if (command === "timemute"){

    let tUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!tUser) return message.channel.send('**User not found**');
    let muteRole = message.guild.roles.find('name', "imuted");
    if(!muteRole) return  message.channel.send('**imuted role not found or you do not have it**');
    let params = message.content.split(" ").slice(1)
    let time = params[1];
    if(!time) return message.channel.send('**No time mentioned!**');

    let tmembed = new Discord.RichEmbed()
    .setColor("#A52A2A")
    .setDescription("~Mutes~")
    .setFooter("Muted |")
    .setTimestamp()
    .addField("Muted User", `<@${tUser.id}>`)
    .addField("Time", time)
    .addField("Muted By", `<@${message.author.id}> with ID: ${message.author.id}`)

    let logchannel = message.guild.channels.find(`name`, "logs");
    if(!logchannel) return message.channel.send('logs channel not found');
    logchannel.send(tmembed);

    tUser.addRole(muteRole.id)
    let mutedembed = new Discord.RichEmbed()
    .setTitle("~TimeMute Success~")
    .setColor("#E0FFFF")
    .setFooter("Muted |")
    .setTimestamp()
    .setDescription(`${tUser} was Muted! :boom:`)
    message.channel.send(mutedembed);

    setTimeout(function() {
        tUser.removeRole(muteRole.id);
        let unmutedembed = new Discord.RichEmbed()
        .setTitle("~TimeMute Over~")
        .setColor("#E0FFFF")
        .setFooter("Mute Over |")
        .setTimestamp()
        .setDescription(`${tUser} was Unmuted! :boom:`)
        message.channel.send(unmutedembed);
}, ms(time));

  }

  if (command === "mute") {

    let mUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!mUser) return message.channel.send('**User not found**');
    let muteRole = message.guild.roles.find('name', "imuted");
    if(!muteRole) return  message.channel.send('**imuted role not found**');

    let nmembed = new Discord.RichEmbed()
    .setTitle("~Mute Success~")
    .setColor("#E0FFFF")
    .setFooter("Muted |")
    .setTimestamp()
    .setDescription(`${mUser} was Muted! :boom:`)
    message.channel.send(nmembed);
    mUser.addRole(muteRole.id)
  }

  if (command === "unmute") {

    let mUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!mUser) return message.channel.send('**User not found**');
    let muteRole = message.guild.roles.find('name', "imuted");
    let unmute = new Discord.RichEmbed()
    .setTitle("~Mute Over~")
    .setColor("#E0FFFF")
    .setFooter("Unmuted |")
    .setTimestamp()
    .setDescription(`${mUser} was Unmuted! :boom:`)
    message.channel.send(unmute);
    mUser.removeRole(muteRole.id);
  }

  if (command === "announce-everyone"){
     message.delete()
     if(!message.guild.me.hasPermission("MENTION_EVERYONE")) return message.channel.send("I don't have mention everyone perms")
     if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply(`You do not have perms`)
     const text = args.join(" ");
     if (text.length < 0) return message.reply("Say some stuff to announce!");
     let announce = new Discord.RichEmbed()
      .addField(`${message.author.tag}, Says:`, text)
     .setTitle("Important Announcement")
     message.channel.send("@everyone")
     message.channel.send(announce);

  }

  if (command === "announce-here"){
     message.delete()
     if(!message.guild.me.hasPermission("MENTION_EVERYONE")) return message.channel.send("I don't have mention everyone perms")
     if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply(`You do not have perms`)
     const text = args.join(" ");
     if (text.length < 0) return message.reply("Say some stuff to announce!");
     let announce = new Discord.RichEmbed()
      .addField(`${message.author.tag}, Says:`, text)
     .setTitle("Important Announcement")
     message.channel.send("@here")
     message.channel.send(announce);

  }

  if (command === "say") {
    message.delete()
    message.channel.send(args.join(" "));
  }

  if (command === "add") {
    let numArray = args.map(n=> parseInt(n));
    let total = numArray.reduce( (p, c) => p+c);
    message.channel.send(total);
  }

  if (command === "ping") {

    message.channel.send('Pinging...').then((msg) => {
    msg.edit(':ping_pong:Pong! `' + `${msg.createdTimestamp - message.createdTimestamp}` + 'ms`')
  })
}

  if (command === "love") {
      message.react('❤');
  }

  if (command === "addrole"){

    if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send('You do not have perms')
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!rMember) return message.channel.send("Couldn't find that user.");

   if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send('I have no perms')

    let role = args.join(" ").slice(22);
    if(!role) return message.reply("Specify a role!");
    let gRole = message.guild.roles.find(`name`, role);
    if(!gRole) return message.reply("Couldn't find that role.");

    if(rMember.roles.has(gRole.id)) return message.reply("They already have that role.");
    await(rMember.addRole(gRole.id));

    try{
      await rMember.send(`You have been given the role **${gRole.name}**`)
    }catch(e){
      message.channel.send(` <@${rMember.id}> was given the role **${gRole.name}**`)
    }
  }

if (command === "removerole"){
if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply("No perms");
let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
if(!rMember) return message.channel.send('Member not found')
let role = args.join(" ").slice(22);
if(!role){
let roleusage = new Discord.RichEmbed()
.setDescription("Incorrect Usage")
.setColor("#A52A2A")
.setFooter("Incorrect Usage |")
.setTimestamp()
.addField("Usage:", '=removerole @user#0000')
.addField("Correct Usage:", '=removerole @user#0000 <role name>')
message.channel.send(roleusage);
}
let gRole = message.guild.roles.find(`name`, role);
if(!gRole){
  let rolen = new Discord.RichEmbed()
  .setColor("#A52A2A")
  .addField("Error", 'Role not found')
  message.channel.send(rolen);
}

if(!rMember.roles.has(gRole.id)) return message.reply("They don't have that role.");
await(rMember.removeRole(gRole.id));

try{
await rMember.send(`Your role **${gRole.name}** was removed from you!`)
}catch(e){
message.channel.send(`<@${rMember.id}>'s role **${gRole.name}** was removed! `)
}

}

  if (command === "avatar"){

    const user = message.mentions.users.first();
    if (!user) return message.reply('Mention a user to get there avatar');
    const embed = new Discord.RichEmbed()
    .setTitle('Avatar of ' + user.tag)
    .setColor(0xC93457)
    .setImage(user.avatarURL)
    .addField("Avatar URL:", user.avatarURL)
    .addField("Avatar:", "Avatar or requested person:",)
    message.channel.send({embed});
  };

  if (command === "shutdown") {
    process.exit(1);
    message.channel.send("Bot is shutting down.");

  }

  if (command === "leaveguild") {
    if (!message.member.permissions.has('MANAGE_SERVER'))
        return message.reply("You have no permisson to use this command");

    message.reply("I am `leaving`, goodbye")
    message.guild.leave()
  }

  if (command === "help"){

   let help = new Discord.RichEmbed()
   .setTitle("Help")
   .setDescription("Showing all commands")
   .setTimestamp()
   .setFooter("Help")
   .setColor("#FFD700")
   .addField("Moderation", "=timemute, (=mute =unmute), =vwarn(verbal warn), =kick, =ban, =purge", true)
   .addField("Info", "=avatar, =help, =serverinfo, =botinfo, =announce-here, =announce-everyone, =shorten <link>", true)
   .addField("Manage User", "=addrole, =removerole", true)
   .addField("Search", "=urban", true)
   .addField("Fun", "=8ball, =say, =add, =love, =ping", true)
   message.channel.send(":mailbox: **Private messages sent!, please check them!**");
   message.author.send(help);
  }

  if (command == "finduser"){

    let users = bot.users;

    let searchTerm = args[0];
    if(!searchTerm) return message.channel.send("**Please provide a search term**");

    let matches = users.filter(u => u.tag.toLowerCase().includes(searchTerm.toLowerCase()));

    let founded = new Discord.RichEmbed()
    .setDescription("~Users~")
    .setColor("#0000ff")
    .addField("Users Found:", matches.map(u => u.tag).join(", "));
    message.channel.send(founded);

  }

  if (command === "userinfo"){

    const user = message.mentions.users.first();
    if (!user) return message.reply('Mention someone to get their userinfo.');

    let userinfo = new Discord.RichEmbed()
    .setTitle('Userinfo of ' + user.tag)
    .setColor("#FFD700")
    .setTimestamp()
    .setImage(user.avatarURL)
    .addField("ID:", user.id)
    .addField("Created At", user.createdAt)
    .addField("Joined Server", message.member.joinedAt)
    .addField("Avatar:", user.avatarURL)
    message.channel.send(userinfo);
  }


  if (command === "serverinfo") {
    var siembed = new Discord.RichEmbed()
    .setDescription(`${message.guild.name}'s Info and Details`)
    .setThumbnail(message.guild.iconURL)
    .setTimestamp()
    .setFooter(`${message.guild.owner.user.tag} is Owner of this Guild | Serverinfo`)
    .setColor("#15f153")
    .addField('ID:', message.guild.id)
    .addField('Name:', message.guild.name)
    .addField('Owner:', message.guild.owner)
    .addField('Server Created At:', message.guild.createdAt)
    .addField('Joined Server:', message.member.joinedAt)
    .addField('Total Members:', `${message.guild.memberCount} members`)
    .addField('Bots of Total Members:', `${message.guild.members.filter(member => member.user.bot).size} bots of ${message.guild.memberCount} members.`)
    .addField('Channels:', `${message.guild.channels.filter(chan => chan.type === 'voice').size} voice channels / ${message.guild.channels.filter(chan => chan.type === 'text').size} text channels`)
    .addField('Roles:', message.guild.roles.map(role => role.name).join(', '));
    message.channel.send(siembed);
  }

  if (command === "botinfo") {
    const duration = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    let btembed = new Discord.RichEmbed()
        .setTitle(`${bot.user.tag}'s info!`)
        .setDescription("Full details of bot")
        .setColor("#15f153")
        .setFooter("Botinfo")
        .setTimestamp()
        .setThumbnail(bot.user.avatarURL)
        .addField("ID", bot.user.id, true)
        .addField("Created At", `${bot.user.createdAt}`, true)
        .addField("Memory Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
        .addField("Uptime", `${duration}`, true)
        .addField("Servers", `${bot.guilds.size.toLocaleString()}`, true)
        .addField("Discord.js version", `${version}`, true)
        .addField("Node version", `${process.version}`, true)
        .addField("Bot Version", "1.0.5", true)
        .addField("Support Server", `https://discord.gg/WDbxpZH`, true)
    message.channel.sendMessage(btembed);
  }

  if(command === "vwarn"){

  let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!rUser) {
  let wiusage = new Discord.RichEmbed()
  .setDescription("Incorrect Usage")
  .setColor("#A52A2A")
  .setFooter("Incorrect Usage |")
  .setTimestamp()
  .addField("Usage:", '=vwarn')
  .addField("Correct Usage:", '=vwarn @user#0000 <reason>')

  message.channel.send(wiusage);
}

  if(!rUser) return message.channel.send("User was not found.");
  let reason = args.join(" ").slice(22);

  let reportEmbed = new Discord.RichEmbed()
  .setDescription("~Verbal Warns~")
  .setColor("#a020f0")
  .setFooter("Verbal Warned User |")
  .setTimestamp()
  .addField("Verbal Warned User", `${rUser} with ID: ${rUser.id}`)
  .addField("Verbal Warned By", `${message.author} with ID ${message.author.id}`)
  .addField("Channel Verbal Warned In", message.channel)
  .addField("Time of Verbal Warn", message.createdAt)
  .addField("Reason", reason)

  let reportschannel = message.guild.channels.find(`name`, "logs");
  if(!reportschannel) return message.channel.send("Couldn't find the channel `logs`.")

  let reportedEmbed = new Discord.RichEmbed()
  .setDescription("~Verbal Warn Success!~")
  .setColor("#E0FFFF")
  .setFooter("Verbal Warn Success |")
  .setTimestamp()
  .addField("Verbal Warned User", `${rUser} with ID: ${rUser.id}`)

  message.channel.send(reportedEmbed);

  reportschannel.send(reportEmbed);
  return;

}

if(message.channel.id === 419599223877664769){
   if (isNaN(message.content)) {
      message.delete()
      message.author.send('Please only say numbers in counting');
   }
}

if (command === "8ball"){

    if(!args[0]) return message.channel.send('Invalid Question');
    let replies = ["Yes!:8ball:", "No!:8ball:", "Better not tell you now:8ball:", "Maybe:8ball:", "Try again later:8ball:", "Definitely!:8ball:"];

    let result = Math.floor((Math.random() * replies.length));
    let question = args.slice(0).join(" ");

    let ballembed = new Discord.RichEmbed()
    .setAuthor(message.author.tag)
    .setColor("#000000")
    .addField("Question", question)
    .addField("Answer", replies[result]);

    message.channel.send(ballembed);

}

if (command === "kick"){

   let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
   if(!kUser) {
   let kiusage = new Discord.RichEmbed()
   .setDescription("Incorrect Usage")
   .setColor("#A52A2A")
   .setFooter("Incorrect Usage |")
   .setTimestamp()
   .addField("Usage:", '=kick')
   .addField("Correct Usage:", '=kick @user#0000 <reason>')

   message.channel.send(kiusage);
}

   if(!kUser) return message.channel.send('User was not Found');
   let kReason = args.join(" ").slice(22);

   if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send('That user has the same perms `KICK_MEMBERS`');
   if(kUser.hasPermission("KICK_MEMBERS")) return message.channel.send('**That user cannot be kicked!**')

   if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('That user is a admin');
   if(kUser.hasPermission("ADMINISTRATOR")) return message.channel.send('**That user cannot be kicked!**')

   if (!message.guild.me.hasPermission("BAN_MEMBERS"))
     return message.channel.send("I have no perms to `KICK_MEMBERS`");

   let kickEmbed = new Discord.RichEmbed()
   .setDescription("~Kick~")
   .setColor("#FFA500")
   .setFooter("Kicked User |")
   .setTimestamp()
   .addField("Kicked User", `${kUser} with ID: ${kUser.id}`)
   .addField("Kicked By", `<@${message.author.id}> with ID: ${message.author.id}`)
   .addField("Kicked In", message.channel)
   .addField("Time", message.createdAt)
   .addField("Reason", kReason)

   let kickedEmbed = new Discord.RichEmbed()
   .setDescription("~Kick Success~")
   .setColor("#15f153")
   .setFooter("Kick Success |")
   .setTimestamp()
   .addField(`Kicked User`, `${kUser} with ID: ${kUser.id}`);

   message.channel.send(kickedEmbed);

   let kickChannel = message.guild.channels.find(`name`, "logs");
   if(!kickChannel) return message.channel.send("Couldn't find channel `logs`.")

   message.guild.member(kUser).kick(kReason);
   kickChannel.send(kickEmbed);

   return;

}

if (command === "ban"){

   let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
   if(!bUser) {
   let biusage = new Discord.RichEmbed()
   .setDescription("Incorrect Usage")
   .setColor("#A52A2A")
   .setFooter("Incorrect Usage |")
   .setTimestamp()
   .addField("Usage:", '=ban')
   .addField("Correct Usage:", '=ban @user#0000 <reason>')

   message.channel.send(biusage);
 }

   if(!bUser) return message.channel.send('User was not Found');
   let bReason = args.join(" ").slice(22);

   if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send('That user has the same perms `BANNED_MEMBERS`');
   if(bUser.hasPermission("BAN_MEMBERS")) return message.channel.send('**That user cannot be BANNED!**')

   if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('That user is a admin');
   if(bUser.hasPermission("ADMINISTRATOR")) return message.channel.send('**That user cannot be BANNED!**')

   if (!message.guild.me.hasPermission("BAN_MEMBERS"))
     return message.channel.send("I have no perms to `BAN_MEMBERS`");

   let banEmbed = new Discord.RichEmbed()
   .setDescription("~Ban~")
   .setColor("#ff0000")
   .setFooter("Banned User |")
   .setTimestamp()
   .addField("Banned User", `${bUser} with ID: ${bUser.id}`)
   .addField("Ban By", `<@${message.author.id}> with ID: ${message.author.id}`)
   .addField("Banned In", message.channel)
   .addField("Time", message.createdAt)
   .addField("Reason", bReason)

   let bannedEmbed = new Discord.RichEmbed()
   .setDescription("~Ban Success~")
   .setColor("#15f153")
   .setFooter("Ban Success |")
   .setTimestamp()
   .addField(`Banned User`, `${bUser} with ID: ${bUser.id}`);

   message.channel.send(bannedEmbed);

   let banChannel = message.guild.channels.find(`name`, "logs");
   if(!banChannel) return message.channel.send("Couldn't find channel `logs`.")

   message.guild.member(bUser).ban(bReason);
   banChannel.send(banEmbed);

   return;

}

});

bot.login(config.token);
