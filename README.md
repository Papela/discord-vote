# Discord-vote

[![npm version](https://img.shields.io/npm/v/discord-vote.svg)](https://www.npmjs.com/package/discord-vote)
[![license](https://img.shields.io/npm/l/discord-vote.svg)](https://github.com/Papela/discord-vote/blob/main/LICENSE)

Un paquete NPM para poder tener un sistema de votaciones para Discord.js 14 de manera sencilla.

## Imágenes de ejemplo
> Notas: _Puede que algunos ejemplos ya no se vean exactamente así debido a nuevas actualizaciones._
#### Modo normal
<img src="https://i.ibb.co/CMSN2Pj/image.png" />&nbsp; &nbsp;<img src="https://i.ibb.co/8sRXFcq/image.png" />

<img src="https://i.ibb.co/BCGCFhx/image.png" />

#### Modo Avanzado
<img src="https://i.ibb.co/54xJY5n/image.png" />&nbsp; &nbsp;<img src="https://i.ibb.co/StQF81G/image.png" />

<img src="https://i.ibb.co/T8B3nhs/image.png" />

## Instalación

Para instalar el paquete, utiliza el siguiente comando:

```bash
npm install discord-vote
```

## Ejemplo de uso en el Modo Normal
> Notas: _En en modo "normal", en caso de que el bot se desconecte, se perdera todo el progreso de las votaciones que no hayan terminado. En el modo "Avanzado" no se perdera ningun progreso._
```javascript
const DiscordVote = require('discord-vote');
const votacion = new DiscordVote({
    client:client, //El cliente
    mode:0}); //Modo de votacion. (0 = Normal, 1 = Avanzado)
client.on('messageCreate', async (message) => {
      if (message.content.startsWith("!votacion")) {
        if (args.length >= 2) {
          const duration = args[0]; //Tiempo en minutos
          const title = args.slice(1).join(" "); // Titulo de la votacion
  
          votacion.createVote(message, title, duration);
        } else {
          message.channel.send('Uso incorrecto. Ejemplo: `!votacion 5 Titulo`');
        }
      }

client.login("TOKEN DEL BOT");
```

## Ejemplo de uso en el modo Avanzado

```javascript
const DiscordVote = require('discord-vote');
const votacion = new DiscordVote({
  client:client, //El cliente
  mode:1, //Modo de votacion. (0 = Normal, 1 = Avanzado)
  savePath: './votaciones.json', //Ruta de guardado (Avanzado)
  checkTime: 60000, //tiempo de comprobacion (Avanzado)
  debug: false}); //Muestra mas logs con informacion de las votaciones (no recomendado)
//*Todo lo del modo avanzado es completamente opcional.*/
votacion.checkVotaciones(); //Utilizado para llamar a la funcion que comprueba las votaciones usando checkTime (por defeto 1 Minuto). *Necesario al usar el modo avanzado

client.on('messageCreate', async (message) => {
      if (message.content.startsWith("!votacion")) {
        if (args.length >= 2) {
          const duration = args[0]; //Tiempo en minutos
          const title = args.slice(1).join(" "); // Titulo de la votacion
  
          votacion.createVote(message, title, duration);
        } else {
          message.channel.send('Uso incorrecto. Ejemplo: `!votacion 5 Titulo`');
        }
      }

client.login("TOKEN DEL BOT");
```

## Funciones
```javascript
+ createVote(message, duration, title, savePath, debug);
+ checkVotaciones();
+ checkVotacionManual();
```
#### createVote
_Inicia una votación con la duración, título y canal especificados._
- *message*: Mensaje del la accion que tiene el cliente. (client.on('messageCreate',async(message) => {})En algunos casos puede ser: "msg"
- *title*: Título de la votación.
- *duration*: Duración de la votación en minutos.
- *savePath*: Ruta de guardado personalizado. (opcional y solo para el modo Avanzado).
- *debug*: true o false (opcional).
#### checkVotaciones
_Comprueba las votaciones cada X tiempo. Definido anteriormente. (checkTime)_
#### checkVotacionManual
_Comprueba las votaciones al momento de llamar al metodo._

## Licencia
Este proyecto está licenciado bajo la Licencia GPL-3.0. Ver el archivo [LICENSE](https://github.com/Papela/discord-vote/blob/main/LICENSE) para más detalles.

## Autor
+ [@Papela](https://github.com/Papela)

## Contribuir
Si quieres contribuir a este proyecto, puedes seguir los siguientes pasos:
1. Haz un fork del repositorio.
2. Crea una rama con tu nueva funcionalidad: *git checkout -b nueva-funcionalidad*.
3. Realiza tus cambios y haz commit: *git commit -m "Agrega nueva funcionalidad"*.
4. Haz push a la rama: *git push origin nueva-funcionalidad*.
5. Abre un pull request en GitHub.
