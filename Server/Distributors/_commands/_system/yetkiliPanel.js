const { Client, Message, Util, MessageActionRow, MessageButton, MessageSelectMenu, Collection, Permissions} = Discord = require("discord.js");
const Mute = require('../../../../Global/Databases/Schemas/Punitives.Mutes');
const voiceMute = require('../../../../Global/Databases/Schemas/Punitives.Vmutes');
const ms = require('ms');
const CategoryChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Category.Channels");
const TextChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Text.Channels");
const VoiceChannels = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Voice.Channels");
const { genEmbed } = require("../../../../Global/Init/Embed");
const voiceCollection = new Collection()
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const Kullanici = require('../../../../Global/Databases/Schemas/Client.Users')
let selectSebep;
let selectMute;
const Jail = require('../../../../Global/Databases/Schemas/Punitives.Jails')
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const getLimitVoiceMute = new Map();
const getLimitMute = new Map()
const getLimit = new Map();
const getUnderLimit = new Map();
const getReklamLimit = new Map();
const table = require('table')
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
module.exports = {
    Isim: "komut",
    Komut: ["komutcuk","acarcik"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.on("messageCreate", async (message) => {
      if(message.author.bot) return;
      if(message.channel.name == "yetkili-paneli") {
          message.delete().catch(err => {})
      }
    })
   client.on("interactionCreate", async (i) => {
    const member = i.guild.members.cache.get(i.user.id) 
    if(!member) return;
    if(i.values == "yge??mi??") {
      i.reply({embeds: [new genEmbed().setDescription(`Bulundu??unuz ${i.guild.channels.cache.get(i.channelId)} kanal??na l??tfen yetkili ge??mi??i sorgulanacak bir ??ye belirtin.`).setFooter("30 saniye i??inde iptal olcakt??r.")], ephemeral: true})
      var filter = (msg) => msg.author.id == i.user.id
      let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
      collector.on("collect", async (msg) => { 
        let message = msg
        if(!msg.content || msg.content.length < 0) return i.editReply({embeds: [new genEmbed().setDescription(`??ye belirtmeyi bo?? b??rakamazs??n.`)]});
        let uye = msg.mentions.members.first() || i.guild.members.cache.get(msg.content)
        if(!uye) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} B??yle bir ??ye bulunamad??.`)]});
        if(uye && uye.user.bot) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.bot}`)]});
  Users.findOne({_id: uye.id }, async (err, res) => {
  if (!res) return i.editReply({embeds: [new genEmbed().setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true})).setDescription(`${uye} isimli yetkilinin y??kseltim ge??mi?? bilgisi bulunamad??.`)]})
  if(!res.StaffLogs) return i.editReply({embeds: [new genEmbed().setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true})).setDescription(`${uye} isimli yetkilinin y??kseltim ge??mi?? bilgisi bulunamad??.`)]})
  let pages = res.StaffLogs.sort((a, b) => b.Date - a.Date).chunk(20); 
  var currentPage = 1
  if (!pages && !pages.length || !pages[currentPage - 1]) return i.editReply({embeds: [new genEmbed().setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true})).setDescription(`${uye} isimli yetkilinin y??kseltim ge??mi?? bilgisi bulunamad??.`)]})
  let embed = new genEmbed().setColor("WHITE").setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true})).setFooter(`${ayarlar.serverName ? ayarlar.serverName : message.guild.name} ??? ${currentPage} / ${pages.length} ??? Di??er Sayfalar Yetkili Analiz Komutunda`, message.guild.iconURL({dynamic: true}))

  const curPage = await i.editReply({
  embeds: [embed.setDescription(`${pages[currentPage - 1].map((x, index) => `\` ${index + 1} \` ${message.guild.roles.cache.get(x.Role) ? message.guild.roles.cache.get(x.Role) : "@Rol Bulunamad??"} <t:${Number(String(x.Date).substring(0, 10))}:R> [**${x.Process}**] (<@${x.Author}>)`).join("\n")}`)],
  components: [], fetchReply: true,
  })
})
      })

  
    }
    if(i.values == "istifa") {
        let data = await Users.findOne({_id: member.id})
        if(!data) return i.reply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} ??stifa verebilmen i??in ??nce bir yetkin olmal?? :)`)],ephemeral: true});
        if(data && !data.Staff) return i.reply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} ??stifa verebilmen i??in ??nce bir yetkin olmal?? :)`)],ephemeral: true});
        if(data && data.Staff) {
          member.removeStaff()
          let yetkiliRol = i.guild.roles.cache.get(roller.altilkyetki);
          i.reply({embeds: [new genEmbed().setDescription(`${i.guild.emojiG??ster(emojiler.Onay)} Ba??ar??yla ??zerinizde bulunan ${member.roles.cache.filter(rol => yetkiliRol.position <= rol.position && rol.id != roller.boosterRol??).map(x => x).join(",")} rolleri ??zerinizden al??nd?? ve yetkiniz sistemsel olarak ??ekildi.`).setFooter(`Bu i??in d??n?????? yok.`)], ephemeral: true})
          await member.roles.remove(member.roles.cache.filter(rol => yetkiliRol.position <= rol.position && rol.id != roller.boosterRol??)).catch(err =>{});
        }

    }
    if(i.values == "cezabilgisi") {
      i.reply({embeds: [new genEmbed().setDescription(`Bulundu??unuz ${i.guild.channels.cache.get(i.channelId)} kanal??na l??tfen ceza bilgisi getirelecek ceza numaras?? giriniz.`).setFooter("30 saniye i??inde iptal olcakt??r.")], ephemeral: true})
      var filter = (msg) => msg.author.id == i.user.id
      let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
      collector.on("collect", async (collect) => {
        if(!collect.content || collect.content.length < 0) return i.editReply({embeds: [new genEmbed().setDescription(`Ceza numaras?? belirtmeyi bo?? b??rakamazs??n.`)]});
        if(!Number(collect.content)) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} Ceza numaras?? yerine rakam girmemelisin!`)]});
        let res = await Punitives.findOne({ No: collect.content})
        if(!res) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} B??yle bir ceza numaras??na ait bir ceza bulunamad??.`)]});
        collect.delete().catch(err => {})
        let cezalanan = await client.getUser(res.Member);
        let cezalananbilgi;
        if(cezalanan != `\`Bulunamayan ??ye\`` && cezalanan.username) cezalananbilgi = `${cezalanan} (\`${cezalanan.id}\`)`;
        if(!cezalananbilgi) cezalananbilgi = "<@"+res.Member+">" + `(\`${res.Member}\`)`
        // Ceza Veren ??ye
        let yetkili = await client.getUser(res.Staff);
        let yetkilibilgi;
        if(yetkili != `\`Bulunamayan ??ye\`` && yetkili.username) yetkilibilgi = `${yetkili} (\`${yetkili.id}\`)`;
        if(!yetkilibilgi) yetkilibilgi = "Bilinmiyor"
        // Manuel Komut ??le Kald??r??ld??ysa
        let kald??r??lmadurumu;
        if(!res.Remover) kald??r??lmadurumu = `` 
        if(res.Remover) kald??r??lmadurumu = "??? Ceza'y?? Kald??ran: " + `${await client.getUser(res.Remover) ? i.guild.members.cache.get(res.Remover) ? i.guild.members.cache.get(res.Remover) : `<@${res.Remover}> (\`${res.Remover}\`)` : `<@${res.Remover}> (\`${res.Remover}\`)` }`
        i.editReply({embeds: [new genEmbed().setDescription(`**Ceza Detay??** (\`#${res.No}/${res.Type}\`)
??? ??ye Bilgisi: ${cezalanan}
??? Yetkili Bilgisi: ${yetkili}
??? Ceza Tarihi: \`${tarihsel(res.Date)}\`
??? Ceza S??resi: \`${res.Duration ? moment.duration(res.Duration - res.Date).format('Y [Y??l,] M [Ay,] d [G??n,] h [Saat,] m [Dakika] ') : "Kal??c??"}\`
??? Ceza Durumu: \`${res.Active == true ? "Aktif ???" : "Aktif De??il ???"}\`
${kald??r??lmadurumu}`).addField(`Ceza Sebepi`,`\`${res.Reason}\``)]})
      })
    }
    if(i.values == "cezakontrol") {
      i.reply({embeds: [new genEmbed().setDescription(`Bulundu??unuz ${i.guild.channels.cache.get(i.channelId)} kanal??na l??tfen cezas?? listelenecek bir ??ye belirtin.`).setFooter("30 saniye i??inde iptal olcakt??r.")], ephemeral: true})
      var filter = (msg) => msg.author.id == i.user.id
      let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
      collector.on("collect", async (collect) => {
        if(!collect.content || collect.content.length < 0) return i.editReply({embeds: [new genEmbed().setDescription(`??ye belirtmeyi bo?? b??rakamazs??n.`)]});
        let uye = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
        if(!uye) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} B??yle bir ??ye bulunamad??.`)]});
        if(uye && uye.user.bot) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.bot}`)]});
        collect.delete().catch(err => {})
        let Cezalar = await Punitives.find({Member: uye.id})
        let data = [["ID", "????", "Ceza Tarihi", "Ceza T??r??", "Ceza Sebebi"]];
        data = data.concat(Cezalar.sort((a, b) => b.Date - a.Date).slice(0, 10).map(value => {          
            return [
                `#${value.No}`,
                `${value.Active == true ? "???" : `???`}`,
                `${tarihsel(value.Date)}`,
                `${value.Type}`,
                `${value.Reason}`
            ]
        }));
        let veriler = table.table(data, {
           columns: { 0: { paddingLeft: 1 }, 1: { paddingLeft: 1 }, 2: { paddingLeft: 1 }, 3: { paddingLeft: 1, paddingRight: 1 }, },
           border : table.getBorderCharacters(`void`),  
           drawHorizontalLine: function (index, size) {
               return index === 0 || index === 1 || index === size;
           }
        });
        if(!await Punitives.findOne({Member: uye.id})) return i.editReply({embeds: [new genEmbed().setDescription(`${i.guild.emojiG??ster(emojiler.Onay)} ${uye} isimli ??yesine ait herhangi bir ??ekilde ceza bulunamad??.`)]})
        i.editReply({embeds: [], content:`A??a????da ${uye} ki??isine ait cezalar son 10 ceza listelenmektedir. (Detayl?? Bilgi: \`${global.sistem.botSettings.Prefixs[0]}cezalar <@pashq/ID>\`)
\`\`\`${veriler}\`\`\``})
      })
    }
    if(i.values == "reklam") {
      if(!roller.jailHammer.some(oku => member.roles.cache.has(oku)) && !roller.??stY??netimRolleri.some(oku => member.roles.cache.has(oku)) && !roller.altY??netimRolleri.some(oku => member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => member.roles.cache.has(oku)) && !roller.y??netimRolleri.some(oku => member.roles.cache.has(oku))  && !member.permissions.has('ADMINISTRATOR')) return i.reply({embeds: [new genEmbed().setDescription(`${cevaplar.noyt}`)], ephemeral: true})
      i.reply({embeds: [new genEmbed().setDescription(`Bulundu??unuz ${i.guild.channels.cache.get(i.channelId)} kanal??na l??tfen reklam olarak cezaland??r??lacak bir ??ye belirtin.`).setFooter("30 saniye i??inde iptal olcakt??r.")], ephemeral: true})
      var filter = (msg) => msg.author.id == i.user.id
      let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
      collector.on("collect", async (collect) => {
       if (collect.content == ("iptal" || "i") || !collect) {
         collect.delete();
         i.editReply({embeds: [new genEmbed().setDescription(`????lem iptal edildi.`)], ephemeral: true, components: []});
         return;
       };
       collect.delete().catch(err => {})
       let uye = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
       let sunucudabul = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
       if(!uye) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} B??yle bir ??ye bulunamad??.`)]});
       if(collect.author.id === uye.id) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.kendi}`)]});
       if(sunucudabul && sunucudabul.user.bot) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.bot}`)]});
       if(sunucudabul && collect.member.roles.highest.position <= sunucudabul.roles.highest.position) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.yetkiust}`)]});
       if(await Jail.findById(uye.id)) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} Belirtilen ${uye} uyesinin aktif bir cezaland??r??lmas?? mevcut.`)]});
       uye.removeStaff()
       uye.dangerRegistrant()
       if(Number(ayarlar.reklamLimit)) {
           if(!collect.member.permissions.has('ADMINISTRATOR') && !ayarlar.staff.includes(collect.member.id) && !roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku))) {
               getLimit.set(`${collect.member.id}`, (Number(getReklamLimit.get(`${collect.member.id}`) || 0)) + 1)
               setTimeout(() => {
                   getLimit.set(`${collect.member.id}`, (Number(getReklamLimit.get(`${collect.member.id}`) || 0)) - 1)
               },1000*60*5)
           }
       }
       return uye.addPunitives(3, collect.member, "Sunucu i??erisinde reklam yapmak!", i, undefined, false, false, 0)
      })
    }
    if(i.values == "uyari") {
      if(!roller.warnHammer.some(oku => member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => member.roles.cache.has(oku)) && !member.permissions.has('ADMINISTRATOR')) return i.reply({embeds: [new genEmbed().setDescription(`${cevaplar.noyt}`)], ephemeral: true})
      i.reply({embeds: [new genEmbed().setDescription(`Bulundu??unuz ${i.guild.channels.cache.get(i.channelId)} kanal??na l??tfen uyar??lacak bir ??ye belirtin.`).setFooter("30 saniye i??inde iptal olcakt??r.")], ephemeral: true})
      var filter = (msg) => msg.author.id == i.user.id
      let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
      collector.on("collect", async (collect) => {
       if (collect.content == ("iptal" || "i") || !collect) {
         collect.delete();
         i.editReply({embeds: [new genEmbed().setDescription(`????lem iptal edildi.`)], ephemeral: true, components: []});
         return;
       };
       
       collect.delete().catch(err => {})
       let uye = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
       let sunucudabul = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
       if(!uye) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} B??yle bir ??ye bulunamad??.`)]});
       if(collect.author.id === uye.id) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.kendi}`)]});
       if(sunucudabul && sunucudabul.user.bot) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.bot}`)]});
       if(sunucudabul && collect.member.roles.highest.position <= sunucudabul.roles.highest.position) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.yetkiust}`)]});
       i.editReply({embeds: [new genEmbed().setDescription(`${uye} ??yesine ${i.channel} kanal??na uyar?? sebebini yazmal??s??n.`).setFooter(`30 saniye i??erisinde girmelisin.`)]}).then(async (msg) => {
        var filter = (uye) => uye.author.id == i.user.id
        let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000})
        collector.on('collect', async (collect) => {
          if(!collect.content || collect.content.length < 0) return i.editReply({embeds: [new genEmbed().setDescription(`Ge??erli bir sebep girilmedi??inden dolay?? i??lem iptal edildi.`)]});
          let sebep = collect.content || "Bir sebep girilmedi."
          collect.delete().catch(err => {})
          let lastWarn = await Punitives.find({Member: uye.id, Type: "Uyar??lma"})
          let checkRoles = [...roller.Yetkiler, ...roller.jailHammer, ...roller.??stY??netimRolleri, ...roller.y??netimRolleri,...roller.altY??netimRolleri, ...roller.kurucuRolleri]
          if(!checkRoles.some(x => uye.roles.cache.has(x)) && !uye.permissions.has("ADMINISTRATOR") && lastWarn.length >= 3) {
              if(roller.jailHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.??stY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.y??netimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR')) {
                  if(Number(ayarlar.jailLimit) && client.fetchJailLimit.get(collect.member.id) >= ayarlar.jailLimit) return await uye.addPunitives(6, collect.member, sebep, i, undefined, false, false, 1)
                  uye.removeStaff()
                  uye.dangerRegistrant() 
                  return uye.addPunitives(3, collect.member, "Gere??inden fazla uyar?? cezas?? bulunmak!" + ` (${sebep})`, i, undefined, false, false, 1) 
              }
         }
         await uye.addPunitives(6, collect.member, sebep, i, undefined, false, false, 0)
        })
      })
      })
    }


    if(i.values == "underworld") {
      if(!roller.banHammer.some(oku => member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => member.roles.cache.has(oku)) && !member.permissions.has('ADMINISTRATOR')) return i.reply({embeds: [new genEmbed().setDescription(`${cevaplar.noyt}`)], ephemeral: true})
      i.reply({embeds: [new genEmbed().setDescription(`Bulundu??unuz ${i.guild.channels.cache.get(i.channelId)} kanal??na l??tfen underworld'e g??nderilecek bir ??ye belirtin.`).setFooter("30 saniye i??inde iptal olcakt??r.")], ephemeral: true})
      var filter = (msg) => msg.author.id == i.user.id
      let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
      collector.on("collect", async (collect) => {
       if (collect.content == ("iptal" || "i") || !collect) {
         collect.delete();
         i.editReply({embeds: [new genEmbed().setDescription(`????lem iptal edildi.`)], ephemeral: true, components: []});
         return;
       };
       collect.delete().catch(err => {})
       let uye = collect.mentions.members.first() || i.guild.members.cache.get(collect.content) || await client.getUser(collect.content)
       let sunucudabul = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
       if(!uye) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} B??yle bir ??ye bulunamad??.`)]});
       if(collect.author.id === uye.id) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.kendi}`)]});
       if(sunucudabul && sunucudabul.user.bot) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.bot}`)]});
       if(sunucudabul && collect.member.roles.highest.position <= sunucudabul.roles.highest.position) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.yetkiust}`)]});
       if(sunucudabul && roller.Yetkiler.some(oku => sunucudabul.roles.cache.has(oku)) && !collect.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku))) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.yetkilinoban}`)]});
       if(getUnderLimit.get(collect.member.id) >= ayarlar.banLimit) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} Underworld i??in yeterli limite sahip de??ilsin.`)]});
       let bul = await Punitives.findOne({Member: uye.id, Type: "Underworld", Active: true})
       if(bul) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} Belirtilen ${uye} isimli ??yenin aktif bir **Underworld** cezas?? bulunmakta.`)]})
        i.editReply({embeds: [new genEmbed().setDescription(`${uye} ??yesini Underworld'e g??ndermek i??in ${i.channel} kanal??na sebep yazmal??s??n.`).setFooter(`30 saniye i??erisinde girmelisin.`)]}).then(async (msg) => {
        var filter = (uye) => uye.author.id == i.user.id
        let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000})
        collector.on('collect', async (collect) => {
          if(!collect.content || collect.content.length < 0) return i.editReply({embeds: [new genEmbed().setDescription(`Ge??erli bir sebep girilmedi??inden dolay?? i??lem iptal edildi.`)]});
          let sebep = collect.content || "Bir sebep girilmedi."
          collect.delete().catch(err => {})
          if(sunucudabul) {
            uye.removeStaff()
            uye.dangerRegistrant()
            uye.addPunitives(8, collect.member, sebep, i,  undefined, false, false, 0)
            message.react(i.guild.emojiG??ster(emojiler.Onay))
          } else {
            let cezano = await Punitives.countDocuments()
            cezano = cezano == 0 ? 1 : cezano + 1;
            let ceza = new Punitives({ 
                No: cezano,
                Member: uye.id,
                Staff: msg.member.id,
                Type: "Underworld",
                Reason: sebep,
                Date: Date.now()
            })
            ceza.save().catch(err => {})
            let findedChannel = i.guild.kanalBul("underworld-log")
            if(findedChannel) findedChannel.send({embeds: [new genEmbed().setFooter(`${i.guild.name ? `${i.guild.name} ???` : ''} Ceza Numaras??: #${cezano}`,i.guild.name ? i.guild.iconURL({dynamic: true}) : uye.avatarURL({dynamic: true})).setDescription(`${uye.toString()} ??yesine, <t:${String(Date.now()).slice(0, 10)}:R> \`${sebep}\` nedeniyle ${collect.member} taraf??ndan ceza-i i??lem uyguland??.`)]})
            i.editReply({embeds: [new genEmbed().setDescription(`${i.guild.emojiG??ster(emojiler.Onay)} ${uye.toString()} isimli ??yeye **${sebep}** sebebiyle "__Underworld__" t??r??nde ceza-i i??lem uyguland??.`).setFooter(`${uye.tag} ??? Ceza Numaras??: #${cezano} ??? Underworld`,uye.avatarURL({dynamic: true}))]})
            await Users.updateOne({ _id: collect.member.id } , { $inc: { "Uses.Underworld": 1 } }, {upsert: true})
          }
          if(Number(ayarlar.banLimit)) {
            if(!i.member.permissions.has('ADMINISTRATOR') && !ayarlar.staff.includes(i.member.id) && !roller.kurucuRolleri.some(oku => i.member.roles.cache.has(oku))) {
                getLimit.set(`${i.member.id}`, (Number(getLimit.get(`${i.member.id}`) || 0)) + 1)
                setTimeout(() => {
                    getLimit.set(`${i.member.id}`, (Number(getLimit.get(`${i.member.id}`) || 0)) - 1)
                },1000*60*5)
            }
        }
        })
      })
      })
    }


    if(i.values == "gg") {
      if(!roller.jailHammer.some(oku => member.roles.cache.has(oku)) && !roller.??stY??netimRolleri.some(oku => member.roles.cache.has(oku)) && !roller.altY??netimRolleri.some(oku => member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => member.roles.cache.has(oku)) && !roller.y??netimRolleri.some(oku => member.roles.cache.has(oku))  && !member.permissions.has('ADMINISTRATOR')) return i.reply({embeds: [new genEmbed().setDescription(`${cevaplar.noyt}`)], ephemeral: true})
      i.reply({embeds: [new genEmbed().setDescription(`Bulundu??unuz ${i.guild.channels.cache.get(i.channelId)} kanal??na l??tfen cezaland??r??lacak bir ??ye belirtin.`).setFooter("30 saniye i??inde iptal olcakt??r.")], ephemeral: true})
     var filter = (msg) => msg.author.id == i.user.id
     let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
     collector.on("collect", async (collect) => {
      if (collect.content == ("iptal" || "i")) {
        collect.delete();
        i.reply({embeds: [new genEmbed().setDescription(`Yasaklamktan vaz ge??ildi!`)], ephemeral: true, components: []});
        return;
      };
      let uye = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
      if(!uye) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} B??yle bir ??ye bulunamad??.`)]});
      if(collect.author.id === uye.id) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.kendi}`)]});
      if(uye && uye.user.bot) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.bot}`)]});
      if(uye && collect.member.roles.highest.position <= uye.roles.highest.position) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.yetkiust}`)]});
    let jailButton = new MessageButton()
    .setCustomId(`onayla`)
    .setLabel(await Jail.findById(uye.id) ? `Aktif Cezaland??r??lmas?? Mevcut!` : getLimit.get(collect.member.id) >= ayarlar.jailLimit ? `Limit Doldu (${getLimit.get(collect.member.id) || 0} / ${ayarlar.jailLimit})` : '????lemi Onayl??yorum!')
    .setEmoji(i.guild.emojiG??ster(emojiler.Cezaland??r??ld??))
    .setStyle('SUCCESS')
    .setDisabled(await Jail.findById(uye.id) ? true : getLimit.get(collect.member.id) >= ayarlar.jailLimit ? true : false )
    let iptalButton =  new MessageButton()
    .setCustomId(`iptal`)
    .setLabel('????lemi ??ptal Et')
    .setEmoji(i.guild.emojiG??ster(emojiler.Iptal))
    .setStyle('DANGER')
    let jailOptions = new MessageActionRow().addComponents(
            jailButton,
            iptalButton
    );

  i.editReply({embeds: [new genEmbed().setDescription(`${uye} isimli ??yeyi cezaland??rmak istiyor musun?`)], components: [jailOptions]}).catch(err => {}).then(async (msg) => {

    const filter = i => i.user.id == collect.member.id 
    const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 30000 })
    const sebeps = [
      { label: "K????k??rtma, Trol ve Dalgac?? Davran????", description: "3 G??n", emoji: {name: "1??????"} , value: "1", date: "3d", type: 3},
      { label: `Ortam?? (${ayarlar.serverName}) K??t??lemek`, description: "5 G??n", emoji: {name: "2??????"} ,value: "2", date: "5d", type: 3},
      { label: "K??f??r, Argo, Hakaret ve Rahats??z Edici Davran????", description: "1 G??n", emoji: {name: "3??????"} ,value: "3", date: "1d", type: 3},
      { label: "Sunucu D??zeni Ve Huzursuzluk Yaratmak", description: "4 G??n", emoji: {name: "4??????"} ,value: "4", date: "4d", type: 3},
      { label: "Kay??t Odalar??nda Gereksiz Trol Yapmak", description: "3 G??n", emoji: {name: "5??????"}, value: "5", date: "3d", type: 3},
  ]

    collector.on('collect', async cl => {
        if (cl.customId === `onayla`) {
            cl.deferUpdate()
            i.editReply({embeds: [new genEmbed().setDescription(`${i.guild.emojiG??ster(emojiler.Cezaland??r??ld??)} ${uye} isimli ??yesini hangi sebep ile cezaland??rmak istiyorsun?\n${!roller.kurucuRolleri.some(x => collect.member.roles.cache.has(x)) && !ayarlar.staff.includes(collect.member.id) && !collect.member.permissions.has('ADMINISTRATOR') ? Number(ayarlar.jailLimit) ? `Kullan??labilir Limit: \`${getLimit.get(collect.member.id) || 0} / ${ayarlar.jailLimit}\`` : `` : ``}`)], components: [new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setCustomId(`sebep`)
                .setPlaceholder('Cezaland??rmak istedi??iniz sebepi se??iniz!')
                .addOptions([
                    sebeps.filter(x => x.type == 3)
                ]),
            )]})
            }
        if (cl.customId === `sebep`) {
           let se??ilenSebep = sebeps.find(x => x.value == cl.values[0])
           if(se??ilenSebep) {
                if(Number(ayarlar.jailLimit)) {
                    if(!collect.member.permissions.has('ADMINISTRATOR') && !ayarlar.staff.includes(collect.member.id) && !roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku))) {
                        getLimit.set(`${collect.member.id}`, (Number(getLimit.get(`${collect.member.id}`) || 0)) + 1)
                        setTimeout(() => {
                            getLimit.set(`${collect.member.id}`, (Number(getLimit.get(`${collect.member.id}`) || 0)) - 1)
                        },1000*60*5)
                    }
                }
                cl.deferUpdate()  
                uye.removeStaff()
                uye.dangerRegistrant()
                return uye.addPunitives(se??ilenSebep.type, collect.member, se??ilenSebep.label, i, se??ilenSebep.date, false, false, 0)
        } else {
               return i.deferUpdate({components: [], embeds: [ new genEmbed().setDescription(`${i.guild.emojiG??ster(emojiler.Iptal)} ????lem s??ras??nda hata olu??tu l??tfen bot sahibine ba??vurun.`)]})
           }
         }
        if (cl.customId === `iptal`) {
            msg.delete().catch(err => {})
            return await i.editReply({components: [], embeds: [new genEmbed().setDescription(`${i.guild.emojiG??ster(emojiler.Iptal)} ${uye} isimli ??yenin cezaland??r??lma i??lemi ba??ar??yla iptal edildi.`)] , ephemeral: true});
        }
    });
    collector.on("end", async i => {
        msg.delete().catch(err => {})
    })

      collect.delete().catch(err => {})
       
       
     })
    })
    }


    // mute 


    if(i.values == "gg3") {
      if(!roller.muteHammer.some(oku => member.roles.cache.has(oku)) && !roller.voiceMuteHammer.some(oku => member.roles.cache.has(oku)) && !roller.??stY??netimRolleri.some(oku => member.roles.cache.has(oku)) && !roller.altY??netimRolleri.some(oku => member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => member.roles.cache.has(oku)) && !roller.y??netimRolleri.some(oku => member.roles.cache.has(oku))  && !member.permissions.has('ADMINISTRATOR')) return i.reply({embeds: [new genEmbed().setDescription(`${cevaplar.noyt}`)], ephemeral: true})
      i.reply({embeds: [new genEmbed().setDescription(`Bulundu??unuz ${i.guild.channels.cache.get(i.channelId)} kanal??na l??tfen metin kanalar??nda veya ses kanallar??nda susturulcak bir ??ye belirtin.`).setFooter("30 saniye i??inde iptal olcakt??r.")], ephemeral: true})
     var filter = (msg) => msg.author.id == i.user.id
     let collector = i.channel.createMessageCollector({filter: filter, max: 1, time: 30000, errors: ["time"]})
     collector.on("collect", async (collect) => {
      if (collect.content == ("iptal" || "i")) {
        collect.delete();
        i.reply({embeds: [new genEmbed().setDescription(`Yasaklamktan vaz ge??ildi!`)], ephemeral: true, components: []});
        return;
      };
      collect.delete().catch(err => {})
      let uye = collect.mentions.members.first() || i.guild.members.cache.get(collect.content)
      if(!uye) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.prefix} B??yle bir ??ye bulunamad??.`)]});
      if(collect.author.id === uye.id) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.kendi}`)]});
      if(uye && uye.user.bot) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.bot}`)]});
      if(uye && collect.member.roles.highest.position <= uye.roles.highest.position) return i.editReply({embeds: [new genEmbed().setDescription(`${cevaplar.yetkiust}`)]});
      const sebeps = [
        { label: "K????k??rtma, Trol, Dalgac?? ve Ortam Bozucu Davran????", description: "10 Dakika", emoji: {name: "1??????"} , value: "1", date: "10m", type: 5},
        { label: "Dizi, Film ve Hikayeler Hakk??nda Spoiler Vermek", description: "5 Dakika", emoji: {name: "2??????"} ,value: "2", date: "5m", type: 5},
        { label: "K??????mseyici Ve A??alay??c?? Davran????", description: "20 Dakika", emoji: {name: "3??????"} ,value: "3", date: "20m", type: 5},
        { label: "K??f??r, Argo, Hakaret ve Rahats??z Edici Davran????", description: "20 Dakika", emoji: {name: "4??????"} ,value: "4", date: "20m", type: 5},
        { label: "Ailevi De??erlere K??f??r/Hakaret", description: "15 Dakika", emoji: {name: "5??????"} ,value: "5", date: "15m", type: 5},
        { label: `Ortam?? (${ayarlar.serverName}) K??t??lemek`, description: "30 Dakika", emoji: {name: "6??????"} ,value: "6", date: "30m", type: 5},
        { label: "Seste Ya??anan Olaylar?? Chat'e Yans??tmak ve Uzatmak", description: "10 Dakika", emoji: {name: "7??????"} ,value: "7", date: "10m", type: 5},
        
        { label: "K????k??rtma, Trol, Dalgac?? ve Ortam Bozucu Davran????", description: "10 Dakika", emoji: {name: "1??????"} , value: "8", date: "10m", type: 4},
        { label: "K??????mseyici Ve A??alay??c?? Davran????", description: "20 Dakika", emoji: {name: "2??????"} ,value: "9", date: "20m", type: 4},
        { label: "??zel Odalara Uyar??lmalara Ra??men ??zinsiz Giri??", description: "30 Dakika", emoji: {name: "3??????"} ,value: "10", date: "30m", type: 4},
        { label: "K??f??r, Argo, Hakaret ve Rahats??z Edici Davran????", description: "20 Dakika", emoji: {name: "4??????"} ,value: "11", date: "20m", type: 4},
        { label: "Soundpad, Efekt ve Ses Programlar?? Kullan??m??", description: "10 Dakika", emoji: {name: "5??????"} ,value: "12", date: "10m", type: 4},
        { label: "Ailevi De??erlere K??f??r/Hakaret", description: "15 Dakika", emoji: {name: "6??????"} ,value: "13", date: "15m", type: 4},
        { label: `Ortam?? (${ayarlar.serverName}) K??t??lemek`, description: "30 Dakika", emoji: {name: "7??????"} ,value: "14", date: "30m", type: 4} 
    ]
    let chatMuteButton = new MessageButton()
    .setCustomId(`chatmute`)
    .setLabel(`Metin Kanallar??nda ${roller.muteHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.??stY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.y??netimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR') ? await Mute.findById(uye.id) ? `(Aktif Cezas?? Var!)` : getLimitMute.get(collect.member.id) >= ayarlar.muteLimit ? `(Limit ${getLimitMute.get(collect.member.id)}/${ayarlar.muteLimit})` : `${!roller.kurucuRolleri.some(x => collect.member.roles.cache.has(x)) && !ayarlar.staff.includes(collect.member.id) && !collect.member.permissions.has('ADMINISTRATOR') ? Number(ayarlar.muteLimit) ? `(Limit: ${getLimitMute.get(collect.member.id) || 0}/${ayarlar.muteLimit})`: `` : ``}` : "(Yetki Yok)"}`)
    .setEmoji(i.guild.emojiG??ster(emojiler.chatSusturuldu))
    .setStyle('PRIMARY')
    .setDisabled(roller.muteHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.??stY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.y??netimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR') ? await Mute.findById(uye.id) ? true : getLimitMute.get(collect.member.id) >= ayarlar.muteLimit ? true : false : true)
    let voiceMuteButton = new MessageButton()
    .setCustomId(`voicemute`)
    .setLabel(`Ses Kanallar??nda ${roller.voiceMuteHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.??stY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.y??netimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR') ? await voiceMute.findById(uye.id) ? `(Aktif Cezas?? Var!)` : getLimitVoiceMute.get(collect.member.id) >= ayarlar.voiceMuteLimit ? `(Limit Doldu ${getLimitVoiceMute.get(collect.member.id)}/${ayarlar.voiceMuteLimit})` : `${!roller.kurucuRolleri.some(x => collect.member.roles.cache.has(x)) && !ayarlar.staff.includes(collect.member.id) && !collect.member.permissions.has('ADMINISTRATOR') ? Number(ayarlar.voiceMuteLimit) ? `(Limit: ${getLimitVoiceMute.get(collect.member.id) || 0}/${ayarlar.voiceMuteLimit})`: `` : ``}` : "(Yetki Yok)"}`)
    .setEmoji(i.guild.emojiG??ster(emojiler.sesSusturuldu))
    .setStyle('PRIMARY')
    .setDisabled(roller.voiceMuteHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.??stY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.y??netimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR') ? await voiceMute.findById(uye.id) ? true : getLimitVoiceMute.get(collect.member.id) >= ayarlar.voiceMuteLimit ? true : false : true)
    let iptalButton =  new MessageButton()
    .setCustomId(`iptal`)
    .setLabel('????lemi ??ptal Et')
    .setEmoji(i.guild.emojiG??ster(emojiler.Iptal))
    .setStyle('DANGER')
    let muteOptions = new MessageActionRow().addComponents(
            chatMuteButton,
            voiceMuteButton,
            iptalButton,
    );
       i.editReply({embeds: [new genEmbed().setDescription(`${uye} isimli ??yeyi hangi t??rde susturmak istiyorsun?`)], components: [muteOptions]}).then(ggwp => {
         var filter = (uye) => uye.user.id == collect.member.id
         let collector  = ggwp.createMessageComponentCollector({filter: filter, max: 3, time: 30000, errors: ["time"]})
         collector.on('collect', async cl => {
          if (cl.customId === `chatmute`) {
          selectMute = 5
          cl.deferUpdate() 
          i.editReply({embeds: [new genEmbed().setDescription(`${i.guild.emojiG??ster(emojiler.chatSusturuldu)} ${uye} isimli ??yesini hangi sebep ile **metin kanallar??ndan** susturmam?? istiyorsun?`)], components: [new MessageActionRow().addComponents(
              new MessageSelectMenu()
              .setCustomId(`sebep`)
              .setPlaceholder('Susturmak istedi??iniz sebepi se??iniz!')
              .addOptions([
                  sebeps.filter(x => x.type == 5)
              ]),
          )]})
          }
          if (cl.customId === `voicemute`) {
              selectMute = 4
              cl.deferUpdate() 
              i.editReply({embeds: [new genEmbed().setDescription(`${i.guild.emojiG??ster(emojiler.sesSusturuldu)} ${uye} isimli ??yesini hangi sebep ile **ses kanallar??ndan** susturmam?? istiyorsun?`)], components: [new MessageActionRow().addComponents(
                  new MessageSelectMenu()
                  .setCustomId(`sebep`)
                  .setPlaceholder('Susturmak istedi??iniz sebepi se??iniz!')
                  .addOptions([
                      sebeps.filter(x => x.type == 4)
                  ]),
              )]})
              }
          if (cl.customId === `sebep`) {
             let se??ilenSebep = sebeps.find(x => x.value == cl.values[0])
             if(se??ilenSebep) {
                 if(selectMute == 4) {
                  if(Number(ayarlar.voiceMuteLimit)) {
      let voiceMuteCheck = await voiceMute.findById(uye.id)
      if(voiceMuteCheck) return await i.editReply({content: `Belirti??in ${uye} ??yesinin, aktif bir susturulma cezas?? mevcut!`, ephemeral: true}),msg.delete().catch(err => {}),message.react(i.guild.emojiG??ster(emojiler.Iptal))
                      if(!collect.member.permissions.has('ADMINISTRATOR') && !ayarlar.staff.includes(collect.member.id) && !roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku))) {
                          getLimitVoiceMute.set(`${collect.member.id}`, (Number(getLimitVoiceMute.get(`${collect.member.id}`) || 0)) + 1)
                              setTimeout(() => {
                                  getLimitVoiceMute.set(`${collect.member.id}`, (Number(getLimitVoiceMute.get(`${collect.member.id}`) || 0)) - 1)
                              },1000*60*5)
                          }
                      }
                  }
                 if(selectMute == 5) {
      let chatMuteCheck = await Mute.findById(uye.id)
      if(chatMuteCheck) return await i.editReply({content: `Belirti??in ${uye} ??yesinin, aktif bir susturulma cezas?? mevcut!`, ephemeral: true}),msg.delete().catch(err => {}),message.react(i.guild.emojiG??ster(emojiler.Iptal))
                  if(Number(ayarlar.muteLimit)) {
                      if(!collect.member.permissions.has('ADMINISTRATOR') && !ayarlar.staff.includes(collect.member.id) && !roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku))) {
                          getLimitMute.set(`${collect.member.id}`, (Number(getLimitMute.get(`${collect.member.id}`) || 0)) + 1)
                              setTimeout(() => {
                                  getLimitMute.set(`${collect.member.id}`, (Number(getLimitMute.get(`${collect.member.id}`) || 0)) - 1)
                              },1000*60*5)
                          }
                      }
                  }
                  cl.deferUpdate()  
                return uye.addPunitives(se??ilenSebep.type, collect.member, se??ilenSebep.label, i, se??ilenSebep.date, false, false, 0)
          } else {
                 return i.editReply({components: [], embeds: [ new genEmbed().setDescription(`${i.guild.emojiG??ster(emojiler.Iptal)} ????lem s??ras??nda hata olu??tu l??tfen bot sahibine ba??vurun.`)]})
             }
           }
          if (i.customId === `iptal`) {
              return await i.editReply({ content: `${i.guild.emojiG??ster(emojiler.Onay)} Ba??ar??yla mute i??lemleri men??s?? kapat??ld??.`, components: [], embeds: [], ephemeral: true });
          }
      });
      collector.on("end", async i => {
          
      })
       })
     })
     function yetkiKontrol(message, type = 0) {
      if(type = 1) if(roller.voiceMuteHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.??stY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.y??netimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR')) return true
      
      if(type = 2) if(roller.muteHammer.some(oku => collect.member.roles.cache.has(oku)) || roller.??stY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.altY??netimRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.kurucuRolleri.some(oku => collect.member.roles.cache.has(oku)) || roller.y??netimRolleri.some(oku => collect.member.roles.cache.has(oku))  || collect.member.permissions.has('ADMINISTRATOR')) return true
  }
    }
   })
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    console.log("undefined")
  }
};

async function rolDedect(rol) {
  return new Promise(function (resolve, reject) {
      if(rol && client.guilds.cache.get(sistem.SERVER.ID).roles.cache.get(rol)) {
        rol = client.guilds.cache.get(sistem.SERVER.ID).roles.cache.get(rol)
        resolve(rol);
    } else {
        reject("Rol Bulunamad??!");
    }
})
}