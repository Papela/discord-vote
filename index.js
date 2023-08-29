//USAR RAMAS PARA LAS UPDATES!!
//FIXME A la hora de contar los votos (en modo 1) saber el tipo de reacciones, guardandolos en el json tambien (No se puede leer: 🥔 si la votacion de antes era: ✅).
//FIXME Arreglar el borrado del mensaje de votaciones en modo 0 y 1.
/*Posible forma para modo 0:
message.channel.client.on('messageDelete', (deletedMessage) => {
  if (deletedMessage.id === voteMessage.id) {
    collector.stop(); // Detener el colector si se elimina el mensaje de la votación
  }
});*/

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require("fs");

class DiscordVote {
  constructor(options = {}) {
    this.votes = new Map();
    this.client = options.client;
    this.mode = options.mode || 0;
    this.savePath = options.savePath || "./discord-vote.json";
    this.checkTime = options.checkTime || 60000;
    this.debug = options.debug || false;
    this.lang = options.lang || 'es';
    this.idioma = require('./LanguageFiles/es.json');
  }

  async checkVotaciones() {
    const intervalTime = this.checkTime; // Intervalo en milisegundos (1 minuto)
    setInterval(async () => {
      this.checkVotacionManual();
    }, intervalTime);
  }

  async createVote(message, title, duration, savePath = this.savePath, debug = this.debug, lang = this.lang) {
    const debugError = this.idioma['DEBUG-ERROR'];
    const modeNormal = this.idioma['MODE-NORMAL'];
    const modeAdvanced = this.idioma['MODE-ADVANCED'];
    
    if (!duration || isNaN(duration))
      duration = 0;
    
    if(!title)
      return console.error(debugError['errorTitle']);
    
    if(!this.savePath.includes(".json"))
      return console.error(debugError['errorSavePath']);

    if (this.mode == 0) {
      if(duration == 0)
        console.warn(debugError['warnMode0Time0']);
      if(duration >= 1440)
      console.warn(debugError['warnMode0TimeBig']);
    const filter = (interaction) => interaction.customId === 'dvote-yes' || interaction.customId === 'dvote-no';
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('dvote-yes')
          .setLabel(modeNormal['btnYes'])
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('dvote-no')
          .setLabel(modeNormal['btnNo'])
          .setStyle(ButtonStyle.Danger)
      );

      let Votacion = null;
      if(duration != 0){
        const startTime = new Date(); // Guarda la fecha y hora de inicio de la votación
        const endTime = new Date(startTime.getTime() + duration * 60000); // Calcula la fecha y hora de finalización de la votación
      Votacion = new EmbedBuilder()
          .setTitle(title)
          .setDescription(modeNormal['description'].replace('${Math.floor(endTime.getTime() / 1000)}', Math.floor(endTime.getTime() / 1000)))
          .setFooter({ text: modeNormal['footer'].replace('${message.author.username}', message.author.username)})
          .setColor(8463563)
          .setTimestamp();
      }else{
        Votacion = new EmbedBuilder()
        .setTitle(title)
        .setColor(8463563)
        .setFooter({ text: modeNormal['footerWithoutTime'].replace('${message.author.username}', message.author.username)})
        .setTimestamp();
      }
       const voteMessage = await message.channel.send({ embeds: [Votacion], components: [row] })
      let collector = null;
       if(duration != 0){
        collector = voteMessage.createMessageComponentCollector({ filter, time: duration * 60 * 1000 });
       }else{
        collector = voteMessage.createMessageComponentCollector({ filter, time: null });
       }

    const votesByUser = new Map();
    const results = {
      yes: 0,
      no: 0,
    };
    collector.on('collect', (interaction) => {
      const previousVote = votesByUser.get(interaction.user.id);
      if (previousVote) {
        if (previousVote === interaction.customId) {
          if(debug)
            console.debug(debugError['noVotesDeletes'].replace('${interaction.user.username}', interaction.user.username));
          return interaction.reply({
            content: modeNormal['voteNoChange'],
            ephemeral: true
          });
          
        } else {
          votesByUser.delete(interaction.user.id);
          if (previousVote === 'dvote-yes') {
            results.yes--;
            if(debug)
            console.debug(debugError['removeVoteYes'].replace('${interaction.user.username}', interaction.user.username));
          } else if (previousVote === 'dvote-no') {
            results.no--;
            if(debug)
            console.debug(debugError['removeVoteNo'].replace('${interaction.user.username}', interaction.user.username));
          }
        }
      }

      if (interaction.customId === 'dvote-yes') {
        interaction.reply({
          content: modeNormal['voteMsg'],
          ephemeral: true
        });
        votesByUser.set(interaction.user.id, 'dvote-yes');
        results.yes++;
        if(debug)
            console.debug(debugError['addVoteYes'].replace('${interaction.user.username}', interaction.user.username));
      } else if (interaction.customId === 'dvote-no') {
        interaction.reply({
          content: modeNormal['voteMsg'],
          ephemeral: true
        });
        votesByUser.set(interaction.user.id, 'dvote-no');
        results.no++;
        if(debug)
            console.debug(debugError['addVoteNo'].replace('${interaction.user.username}', interaction.user.username));
      }
      if(duration == 0){
        let color = 8463563;
          if(results.yes > results.no){
            color = 5763719
          }else if(results.yes < results.no){
            color = 15548997
          }else{
            color = 16776960
          }
          message.channel.messages.fetch(voteMessage).then((fetchedMessage) => {
            if (fetchedMessage) {
              const VotacionResultados = new EmbedBuilder()
                .setTitle(title)
                .setDescription(modeNormal['descriptionWithoutTime'].replace('${results.yes}',results.yes).replace('${results.no}',results.no).replace('[btnYes]',modeNormal['btnYes']).replace('[btnNo]', modeNormal['btnNo']))
                .setColor(color)
                .setTimestamp();
                voteMessage.edit({ embeds: [VotacionResultados] });
            }else{
              if(debug)
              console.debug(debugError['voteNotFound']);
            }
            });
      }
    });

    collector.on('end', () => {
      let color = 8463563;
      if(results.yes > results.no){
        color = 5763719
      }else if(results.yes < results.no){
        color = 15548997
      }else{
        color = 16776960
      }
      message.channel.messages.fetch(voteMessage).then((fetchedMessage) => {
      if (fetchedMessage) {
        const VotacionResultados = new EmbedBuilder()
              .setTitle(title)
              .setDescription(modeNormal['descriptionEnded'].replace('[btnYes]',modeNormal['btnYes']).replace('[btnNo]',modeNormal['btnNo']).replace('${results.yes}',results.yes).replace('${results.no}',results.no))
              .setColor(color)
              .setTimestamp();
              voteMessage.edit({ embeds: [VotacionResultados], components: [] });
      }else{
        if(debug)
        console.debug(debugError['voteNotFound']);
      }
      });
    });
  }else if (this.mode == 1) {
    if ((!this.savePath) || (this.savePath == null) || (!this.savePath.includes(".json"))) {
      return console.error(debugError['errorSavePath']);
    }

    if (!fs.existsSync(this.savePath)) {
      console.warn(debugError['creatingFile']);
      fs.writeFile(this.savePath, '{}', err => {
        if (err) {
          console.error(debugError['errorCreatingFile'] + err);
        }else{
          console.warn(debugError['fileCreated']);
        }
      });
    }
        if(debug)
        //Ejemplo variables: console.debug(translations.greeting.replace("${duration}", duration).replace("${title}", title));
        console.debug(debugError['voteInfo'].replace('${duration}', duration).replace('${title}', title));
      if (!duration || !title || (duration < 0)) {
        return console.log(debugError['invalidData']);
      }else{
        const startTime = new Date(); // Guarda la fecha y hora de inicio de la votación
        const endTime = new Date(startTime.getTime() + duration * 60000); // Calcula la fecha y hora de finalización de la votación
        let channelId = message.channel.id;
        let Votacion = null;
        if(duration == 0){
          Votacion = new EmbedBuilder()
            .setTitle(title)
            .setColor(8463563)
            .setFooter({ text: modeAdvanced['footer'].replace('${message.author.username}',message.author.username)});
        }else{
          Votacion = new EmbedBuilder()
            .setTitle(title)
            .setDescription(modeAdvanced['description'].replace('${Math.floor(endTime.getTime() / 1000)}', Math.floor(endTime.getTime() / 1000)))
            .setFooter({ text: modeAdvanced['footer'].replace('${message.author.username}',message.author.username)})
            .setColor(8463563)
            .setTimestamp(endTime);
        }

          message.channel.send({ embeds: [Votacion] }).then(message => {
            const votacionData = fs.readFileSync(this.savePath, 'utf8');
            let votaciones = JSON.parse(votacionData);
         if(duration != 0){
            votaciones[message.id] = {
              nombreServer: message.guild.name, // Guardar el nombre del servidor
              idMensaje: message.id, // Guardar el ID del mensaje de votación
              idServer: message.guild.id,
              idCanal: channelId, //Guardar el ID del canal de votacion
              titulo: title,
              fechaInicio: startTime.toISOString(), // Guardar la fecha y hora de inicio en formato ISO
              fechaFin: endTime.toISOString() // Guardar la fecha y hora de finalización en formato ISO
            };
          }else{
            votaciones[message.id] = {
              nombreServer: message.guild.name, // Guardar el nombre del servidor
              idMensaje: message.id, // Guardar el ID del mensaje de votación
              idServer: message.guild.id,
              idCanal: channelId, //Guardar el ID del canal de votacion
              titulo: title,
              fechaInicio: startTime.toISOString(), // Guardar la fecha y hora de inicio en formato ISO
              fechaFin: null // Guardar la fecha y hora de finalización en formato ISO
          }
        }
      if(debug)
       var votacionJson = JSON.stringify(votaciones[message.id]);
       console.debug(debugError['voteJson'].replace('${votacionJson}', votacionJson));
          fs.writeFile(this.savePath, JSON.stringify(votaciones, null, 2), err => {
          if (err) {
            console.error(err);
          }
        });
      
        if(debug)
            console.debug(debugError['voteStarted']);
        message.react(modeAdvanced['yesReaction']);
        message.react(modeAdvanced['noReaction']);
        });
      }
  }else{
    console.error(debugError['invalidMode']);
  }
  }


  checkVotacionManual(client = this.client, debug = this.debug) {
    const debugError = this.idioma['DEBUG-ERROR'];
    const modeNormal = this.idioma['MODE-NORMAL'];
    const modeAdvanced = this.idioma['MODE-ADVANCED'];
      if(debug)
        console.debug(debugError['checkingVote']);
    if (!fs.existsSync(this.savePath)) {
      console.warn(debugError['creatingFile']);
      fs.writeFile(this.savePath, '{}', err => {
        if (err) {
          console.error(debugError['errorCreatingFile'] + err);
        }else{
          console.warn(debugError['fileCreated']);
        }
      });
    }
    let ruta = this.savePath
    // Leer el archivo de votaciones
    fs.readFile(ruta, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const votaciones = JSON.parse(data); // Convertir el contenido del archivo a un objeto JavaScript
      // Obtener la hora actual
      const currentTime = new Date();
      
      // Recorrer todas las votaciones almacenadas
      for (const idMensaje in votaciones) {
        if(debug){
          let idvotacion = votaciones[idMensaje].idMensaje;
        console.debug(debugError['checkVoteMessageId'].replace('${idvotacion}', idvotacion));
        }
        const votacion = votaciones[idMensaje];
        const endTime = new Date(votacion.fechaFin); // Obtener la fecha y hora de finalización de la votación
         if(debug)
            console.debug(debugError['compareTime'].replace('${currentTime.getHours()}', currentTime.getHours()).replace('${currentTime.getMinutes()}', currentTime.getMinutes()).replace('${endTime.getHours()}', endTime.getHours()).replace('${endTime.getMinutes()}', endTime.getMinutes()));
          if(votacion.fechaFin != null){
        // Comprobar si la hora actual es igual a la hora de finalización de la votaciónvotaciones:
        if ((currentTime.getFullYear() >= endTime.getFullYear() &&
            currentTime.getMonth() >= endTime.getMonth() &&
            currentTime.getDate() >= endTime.getDate()) && (
            (currentTime.getHours() > endTime.getHours()) ||((
            currentTime.getHours() == endTime.getHours()) &&
            currentTime.getMinutes() >= endTime.getMinutes()))) {
          const messageId = votacion.idMensaje; // Obtener el ID del mensaje de votación
          let server = client.guilds.cache.get(votacion.idServer);
          if(!server){
            console.warn(debugError['serverNotFound'].replace('${votacion.idServer}', votacion.idServer));
            delete votaciones[idMensaje];
            fs.writeFile(this.savePath, JSON.stringify(votaciones, null, 2), err => {
                if (err) {
                  return console.error("Error: " + err);
                } else {
                  if(debug)
                  return console.debug(debugError['serverNotFound'].replace('${votacion.idServer}', votacion.idServer));
                }
              });
          }
          let channel = server.channels.cache.get(votacion.idCanal); // Obtener el canal correspondiente
          if (!channel) {
            console.warn(debugError['channelNotFound']);
            delete votaciones[idMensaje];
            fs.writeFile(this.savePath, JSON.stringify(votaciones, null, 2), err => {
                if (err) {
                  return console.error("Error: " + err);
                } else {
                  if(debug)
                  return console.debug(debugError['channelNotFound']);
                }
              });
          }
          // Obtener el mensaje de votación utilizando el ID del mensaje
          let mensajeVotacion = channel.messages.fetch(messageId);
          if(!mensajeVotacion){
            console.warn(debugError['voteNotFound']);
            delete votaciones[idMensaje];
            fs.writeFile(ruta, JSON.stringify(votaciones, null, 2), err => {
                if (err) {
                  console.error("Error: " + err);
                } else {
                  if(debug)
                  return console.debug(debugError['voteNotFound']);
                }
              });
          }else{
          
          channel.messages.fetch(messageId).then(async message => {
            // Obtener la cantidad de reacciones de cada tipo
            const reactions = message.reactions.cache;
            
            const upvoteUsers = await reactions.get(modeAdvanced['yesReaction']).users.fetch();
            const downvoteUsers = await reactions.get(modeAdvanced['noReaction']).users.fetch();
          
            // Eliminar las reacciones de los usuarios que hayan reaccionado con ambos emojis
            const usersToRemove = upvoteUsers.filter(user => downvoteUsers.has(user.id));
            usersToRemove.forEach(user => {
              if (user.bot) return;
              reactions.get(modeAdvanced['yesReaction']).users.remove(user.id);
              reactions.get(modeAdvanced['noReaction']).users.remove(user.id);
            });
              
              const upvotes = reactions.get(modeAdvanced['yesReaction']).count - 1; // Restar 1 para excluir la reacción del bot
              const downvotes = reactions.get(modeAdvanced['noReaction']).count - 1; // Restar 1 para excluir la reacción del bot
              if(debug)
                console.debug(debugError['finalResults'].replace('[yesReaction]', modeAdvanced['yesReaction']).replace('[noReaction]', modeAdvanced['noReaction']).replace('${upvotes}', upvotes).replace('${downvotes}', downvotes));
              message.reactions.removeAll().catch(error => console.error(debugError['errorRemoveReactions'], error));

              let color = 8463563;
            if(upvotes > downvotes){
              color = 5763719
            }else if(upvotes < downvotes){
              color = 15548997
            }else{
              color = 16776960
            }
            
              // Editar el mensaje de votación con los resultados
              const VotacionResultados = new EmbedBuilder()
                .setTitle(votacion.titulo)
                .setDescription( modeAdvanced['descriptionEnded'].replace('[yesReaction]',modeAdvanced['yesReaction']).replace('[noReaction]',modeAdvanced['noReaction']).replace('${upvotes}', upvotes).replace('${downvotes}', downvotes).replace('${Math.floor(endTime.getTime() / 1000)}', Math.floor(endTime.getTime() / 1000)))
                .setColor(color)
                .setTimestamp();
                await message.edit({ embeds: [VotacionResultados] });                                                         
              // Eliminar el registro de la votación del archivo de votaciones
              delete votaciones[idMensaje];
                if(debug)
                  console.debug(debugError['voteRemoved']);
              // Guardar los cambios en el archivo de votaciones
              fs.writeFile(ruta, JSON.stringify(votaciones, null , 2), err => {
                if (err) {
                  console.error("Error:" + err);
                } else {
                  if(debug)
                  return console.debug(debugError['voteEnded']);
                }
              });
            })
        
            .catch(console.error);
        }
        }
      }else{
          //CON TIEMPO A 0
        if(this.debug)
        console.debug(debugError['updateMsgWithoutTime']);

      const startTime = new Date(votacion.fechaInicio);
      const messageId = votacion.idMensaje; // Obtener el ID del mensaje de votación
        let server = client.guilds.cache.get(votacion.idServer);
        if(!server){
          console.warn(debugError['serverNotFound'].replace('${votacion.idServer}', votacion.idServer));
          delete votaciones[idMensaje];
          fs.writeFile(this.savePath, JSON.stringify(votaciones, null, 2), err => {
              if (err) {
                return console.error("Error: " + err);
              } else {
                if(debug)
                return console.debug(debugError['serverNotFound'].replace('${votacion.idServer}', votacion.idServer));
              }
            });
        }
        let channel = server.channels.cache.get(votacion.idCanal); // Obtener el canal correspondiente
        if (!channel) {
          console.warn(debugError['channelNotFound']);
          delete votaciones[idMensaje];
          fs.writeFile(this.savePath, JSON.stringify(votaciones, null, 2), err => {
              if (err) {
                return console.error("Error: " + err);
              } else {
                if(debug)
                return console.debug(debugError['channelNotFound'].replace('${votacion.idCanal}', votacion.idCanal));
              }
            });
        }
        // Obtener el mensaje de votación utilizando el ID del mensaje
        let mensajeVotacion = channel.messages.fetch(messageId);
        if(!mensajeVotacion){
          console.warn(debugError['voteNotFound']);
          delete votaciones[idMensaje];
          fs.writeFile(ruta, JSON.stringify(votaciones, null, 2), err => {
              if (err) {
                console.error("Error: " + err);
              } else {
                if(debug)
                return console.debug(debugError['voteNotFound']);
              }
            });
        }
        channel.messages.fetch(messageId).then(async message => {
          // Obtener la cantidad de reacciones de cada tipo
          const reactions = message.reactions.cache;
          
          const upvoteUsers = await reactions.get(modeAdvanced['yesReaction']).users.fetch();
          const downvoteUsers = await reactions.get(modeAdvanced['noReaction']).users.fetch();
        
          // Eliminar las reacciones de los usuarios que hayan reaccionado con ambos emojis
          const usersToRemove = upvoteUsers.filter(user => downvoteUsers.has(user.id));
          usersToRemove.forEach(user => {
            if (user.bot) return;
            reactions.get(modeAdvanced['yesReaction']).users.remove(user.id);
            reactions.get(modeAdvanced['noReaction']).users.remove(user.id);
          });
            
            const upvotes = reactions.get(modeAdvanced['yesReaction']).count - 1; // Restar 1 para excluir la reacción del bot
            const downvotes = reactions.get(modeAdvanced['noReaction']).count - 1; // Restar 1 para excluir la reacción del bot
            if(debug)
              console.debug(debugError['finalResultsWithoutTime'].replace('[yesReaction]', modeAdvanced['yesReaction']).replace('[noReaction]', modeAdvanced['noReaction']).replace('${upvotes}', upvotes).replace('${downvotes}', downvotes));

            let color = 8463563;
          if(upvotes > downvotes){
            color = 5763719
          }else if(upvotes < downvotes){
            color = 15548997
          }else{
            color = 16776960
          }
          
            // Editar el mensaje de votación con los resultados
            const VotacionResultados = new EmbedBuilder()
              .setTitle(votacion.titulo)
              .setDescription(modeAdvanced['description'].replace('[yesReaction]', modeAdvanced['yesReaction']).replace('[noReaction]', modeAdvanced['noReaction']).replace('${upvotes}',upvotes).replace('${downvotes}',downvotes))
              .setColor(color)
              .setTimestamp();
              await message.edit({ embeds: [VotacionResultados] });
          })
          .catch(console.error);
      }
        
      }
    });
  }
  
}

module.exports = DiscordVote;
