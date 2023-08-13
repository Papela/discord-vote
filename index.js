//TODO Modo debug? Que muestre mas logs?
// Color amarillo al tener empate?
//TODO Modo 0: Actualizar y ver el empate
//Preparar tiempo = 0 y que sea INTEGER automaticamente.
//Comprobar que el fichero sea json
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require("fs");

class DiscordVote {
  constructor(options = {}) {
    this.votes = new Map();
    this.client = options.client;
    this.mode = options.mode || 0;
    this.savePath = options.savePath || "./discord-vote.json";
    this.checkTime = options.checkTime || 60000;
  }

  async checkVotaciones() {
    const intervalTime = this.checkTime; // Intervalo en milisegundos (1 minuto)
    setInterval(async () => {
      this.checkVotacionManual();
    }, intervalTime);
  }

  async createVote(message, title, duration) {
    if (this.mode == 0) {
    const filter = (interaction) => interaction.customId === 'dvote-yes' || interaction.customId === 'dvote-no';

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('dvote-yes')
          .setLabel('Yes')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('dvote-no')
          .setLabel('No')
          .setStyle(ButtonStyle.Danger)
      );

      const Votacion = new EmbedBuilder()
          .setTitle(title)
          .setFooter({ text: `Votacion iniciada por ${message.author.username}`})
          .setColor(8463563)
          .setTimestamp();
       const voteMessage = await message.channel.send({ embeds: [Votacion], components: [row] })

    const collector = voteMessage.createMessageComponentCollector({ filter, time: duration * 60 * 1000 });

    const votesByUser = new Map();
    const results = {
      yes: 0,
      no: 0,
    };
    collector.on('collect', (interaction) => {
      const previousVote = votesByUser.get(interaction.user.id);
      if (previousVote) {
        if (previousVote === interaction.customId) {
          return interaction.reply({
            content: "Tu voto no ha cambiado!",
            ephemeral: true
          });
        } else {
          votesByUser.delete(interaction.user.id);
          if (previousVote === 'dvote-yes') {
            results.yes--;
          } else if (previousVote === 'dvote-no') {
            results.no--;
          }
        }
      }

      if (interaction.customId === 'dvote-yes') {
        interaction.reply({
          content: "Has votado correctamente!",
          ephemeral: true
        });
        votesByUser.set(interaction.user.id, 'dvote-yes');
        results.yes++;
      } else if (interaction.customId === 'dvote-no') {
        interaction.reply({
          content: "Has votado correctamente!",
          ephemeral: true
        });
        votesByUser.set(interaction.user.id, 'dvote-no');
        results.no++;
      }
    });

    collector.on('end', () => {
      let color = 8463563;
      if(results.yes > results.no){
        color = 5763719
      }else if(results.yes < results.no){
        color = 15548997
      }
      const VotacionResultados = new EmbedBuilder()
              .setTitle(title)
              .setDescription(`Resultados de la votación: \n✅: ${results.yes} votos \n❌: ${results.no} votos`)
              .setColor(color)
              .setTimestamp();
              voteMessage.edit({ embeds: [VotacionResultados], components: [] });
    });
  }else if (this.mode == 1) {
    if ((!this.savePath) || (this.savePath == null) || (!this.savePath.includes(".json"))) {
      return console.error("Ruta no valida!");
    }
    if (isNaN(duration)) {
      duration = 1; //Tendra que ser 0 Minutos
    }

    if (!fs.existsSync(this.savePath)) {
      console.warn('El fichero de guardado no exite. Creando...');
      fs.writeFile(this.savePath, '{}', err => {
        if (err) {
          console.error("El fichero no se ha creado debido a un error. Error: " + err);
        }else{
          console.warn('Fichero de guardado creado.');
        }
      });
    }

      if (!duration || !title || (duration <0 || duration > 4320)) {
        return console.log("Datos no validos!");
      }else{
        const startTime = new Date(); // Guarda la fecha y hora de inicio de la votación
        const endTime = new Date(startTime.getTime() + duration * 60000); // Calcula la fecha y hora de finalización de la votación
        let channelId = message.channel.id;
        
        const Votacion = new EmbedBuilder()
          .setTitle(title)
          .setFooter({ text: `Votación iniciada por ${message.author.username}`})
          .setColor(8463563)
          .setTimestamp(endTime);
          message.channel.send({ embeds: [Votacion] }).then(message => {
            const votacionData = fs.readFileSync(this.savePath, 'utf8');
            let votaciones = JSON.parse(votacionData);
      votaciones[message.id] = {
        nombreServer: message.guild.name, // Guardar el nombre del servidor
        idMensaje: message.id, // Guardar el ID del mensaje de votación
        idServer: message.guild.id,
        idCanal: channelId, //Guardar el ID del canal de votacion
        titulo: title,
        fechaInicio: startTime.toISOString(), // Guardar la fecha y hora de inicio en formato ISO
        fechaFin: endTime.toISOString() // Guardar la fecha y hora de finalización en formato ISO
      };
          fs.writeFile(this.savePath, JSON.stringify(votaciones, null, 2), err => {
          if (err) {
            console.error(err);
          } else {
            //console.log('Votacion iniciada!');
          }
        });
          
        message.react("✅");
        message.react("❌");
        });
      }
      if (this.savePath) {
        //this.checkVotaciones(message, this.savePath)
        //setInterval(this.checkVotaciones(message, this.savePath), 60000);
      }
  }else{
    console.error("Modo no valido. Utiliza 0 (Sencillo) o 1 (Avanzado)");
  }
  }


  checkVotacionManual(client = this.client) {
    //console.log("Checkeando Votaciones...");
    if (!fs.existsSync(this.savePath)) {
      console.warn('El fichero de guardado no exite. Creando...');
      fs.writeFile(this.savePath, '{}', err => {
        if (err) {
          console.error("El fichero no se ha creado debido a un error. Error: " + err);
        }else{
          console.warn('Fichero de guardado creado.');
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
        const votacion = votaciones[idMensaje];
        const endTime = new Date(votacion.fechaFin); // Obtener la fecha y hora de finalización de la votación
        //console.log("Hora actual: " + currentTime.getHours() +":" + currentTime.getMinutes() + ", endTime: " + endTime.getHours() +":" + endTime.getMinutes());
        // Comprobar si la hora actual es igual a la hora de finalización de la votaciónvotaciones:
        if ((currentTime.getFullYear() >= endTime.getFullYear() &&
            currentTime.getMonth() >= endTime.getMonth() &&
            currentTime.getDate() >= endTime.getDate()) && (
            (currentTime.getHours() > endTime.getHours()) ||((
            currentTime.getHours() == endTime.getHours()) &&
            currentTime.getMinutes() >= endTime.getMinutes()))) {
          const messageId = votacion.idMensaje; // Obtener el ID del mensaje de votación
          let server = client.guilds.cache.get(votacion.idServer);
          let channel = server.channels.cache.get(votacion.idCanal); // Obtener el canal correspondiente
          if (!channel) {
            console.error(`No se ha encontrado el canal con ID ${votacion.idCanal}`);
            delete votaciones[idMensaje];
            fs.writeFile('./databases/votaciones.json', JSON.stringify(votaciones, null, 2), err => {
                if (err) {
                  console.error(err);
                } else {
                  //console.log('Votacion Finalizada.');
                }
              });
          }
          // Obtener el mensaje de votación utilizando el ID del mensaje
          let mensajeVotacion = channel.messages.fetch(messageId);
          if(!mensajeVotacion){
            console.error(`No se ha encontrado el mensaje con ID ${votacion.idCanal}`);
            delete votaciones[idMensaje];
            fs.writeFile(ruta, JSON.stringify(votaciones, null, 2), err => {
                if (err) {
                  console.error(err);
                } else {
                  //console.log('Votacion Finalizada.');
                }
              });
          }
          
          channel.messages.fetch(messageId).then(async message => {
            // Obtener la cantidad de reacciones de cada tipo
            const reactions = message.reactions.cache;
            
            const upvoteUsers = await reactions.get("✅").users.fetch();
            const downvoteUsers = await reactions.get("❌").users.fetch();
          
            // Eliminar las reacciones de los usuarios que hayan reaccionado con ambos emojis
            const usersToRemove = upvoteUsers.filter(user => downvoteUsers.has(user.id));
            usersToRemove.forEach(user => {
              if (user.bot) return;
              reactions.get("✅").users.remove(user.id);
              reactions.get("❌").users.remove(user.id);
            });
              
              const upvotes = reactions.get("✅").count - 1; // Restar 1 para excluir la reacción del bot
              const downvotes = reactions.get("❌").count - 1; // Restar 1 para excluir la reacción del bot
              
              message.reactions.removeAll().catch(error => console.error('Failed to clear reactions:', error));

              let color = 8463563;
            if(upvotes > downvotes){
              color = 5763719
            }else if(upvotes < downvotes){
              color = 15548997
            }
            
              // Editar el mensaje de votación con los resultados
              const VotacionResultados = new EmbedBuilder()
                .setTitle(votacion.titulo)
                .setDescription(`Resultados de la votación: \n✅: ${upvotes} votos \n❌: ${downvotes} votos`)
                .setColor(color)
                .setTimestamp();
                await message.edit({ embeds: [VotacionResultados] });                                                         
              // Eliminar el registro de la votación del archivo de votaciones
              delete votaciones[idMensaje];
  
              // Guardar los cambios en el archivo de votaciones
              fs.writeFile(ruta, JSON.stringify(votaciones, null , 2), err => {
                if (err) {
                  console.error(err);
                } else {
                  //console.log('Votacion Finalizada.');
                }
              });
            })
            .catch(console.error);
        }
      }
    });
  }
  
}

module.exports = DiscordVote;