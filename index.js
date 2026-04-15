
const { Client, GatewayIntentBits } = require("discord.js");
const util = require("minecraft-server-util");

const PREFIX = "!m";
const SERVER_IP = "play.mangomc.xyz";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log(`🥭 ${client.user.tag} ONLINE`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const cmd = args.shift()?.toLowerCase();

  // HELP
  if(cmd==="help"||cmd==="h"){
    return message.reply("🥭 Commands: !m help, ip, status, players, vote, apply, store, support, ban, kick, mute, unmute, warn, clear, lock, unlock");
  }

  // IP
  if(cmd==="ip"||cmd==="i"){
    return message.reply("🌐 IP: play.mangomc.xyz | Port: 19132");
  }

  // STATUS
  if(cmd==="status"||cmd==="s"){
    try{
      const res = await util.status(SERVER_IP);
      return message.reply(`🟢 Online | ${res.players.online}/${res.players.max} players | ${res.roundTripLatency}ms`);
    }catch{
      return message.reply("🔴 Server Offline");
    }
  }

  // PLAYERS
  if(cmd==="players"||cmd==="pl"){
    try{
      const res = await util.status(SERVER_IP);
      const list = res.players.sample?.map(p=>p.name).join(", ") || "No players online";
      return message.reply(`👥 Players: ${list}`);
    }catch{
      return message.reply("Cannot fetch players.");
    }
  }

  // SIMPLE INFO COMMANDS
  if(cmd==="vote"||cmd==="v") return message.reply("🗳 Vote Coming Soon");
  if(cmd==="apply"||cmd==="a") return message.reply("📝 Apply Link Added");
  if(cmd==="store"||cmd==="st") return message.reply("🛒 Store Coming Soon");
  if(cmd==="support"||cmd==="sup") return message.reply("🎫 Support Ticket Channel");

  // KICK
  if(cmd==="kick"||cmd==="k"){
    const member = message.mentions.members.first();
    if(!member) return message.reply("Mention user.");
    await member.kick();
    return message.reply("✅ User kicked.");
  }

  // WARN
  if(cmd==="warn"||cmd==="w"){
    const user = message.mentions.users.first();
    if(!user) return message.reply("Mention user.");
    await user.send("⚠️ You have been warned.");
    return message.reply("Warn sent.");
  }

  // CLEAR
  if(cmd==="clear"||cmd==="c"){
    const amount = parseInt(args[0]);
    await message.channel.bulkDelete(amount);
    return message.reply(`Deleted ${amount}`);
  }

  // LOCK
  if(cmd==="lock"||cmd==="l"){
    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone,{SendMessages:false});
    return message.reply("🔒 Locked.");
  }

  // UNLOCK
  if(cmd==="unlock"||cmd==="ul"){
    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone,{SendMessages:true});
    return message.reply("🔓 Unlocked.");
  }
});

client.login(process.env.TOKEN);
