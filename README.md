# Discord-vote

[![npm version](https://img.shields.io/npm/v/discord-votaciones.svg)](https://www.npmjs.com/package/discord-vote)
[![license](https://img.shields.io/npm/l/discord-votaciones.svg)](https://github.com/Papela/discord-vote/blob/main/LICENSE)

Un paquete NPM para poder tener un sistema de votaciones para Discord.js 14 de manera sencilla.

## Instalación

Para instalar el paquete, utiliza el siguiente comando:

```bash
npm install discord-vote
```

## Ejemplo de uso en el Modo Normal
> Notas: _En en modo "normal", en caso de que el bot se desconecte, se perdera todo el progreso de las votaciones que no hayan terminado. En el modo "Avanzado" no._
```javascript
const DiscordVote = require('discord-vote');
const votacion = new DiscordVote({ client:client, mode:0); //El cliente, modo (0 = normal, 1 = avanzado)
client.on('messageCreate', async (message) => {
      if (message.content.startsWith("!votacion")) {
        if (args.length >= 2) {
          const duration = args[0]; //Tiempo en minutos
          const title = args.slice(1).join(" ");
  
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
const votacion = new DiscordVote({ client:client, mode:1, savePath: './votaciones.json', checkTime: 10000});
/*El cliente, modo de votacion (0 = normal, 1 = avanzado), ruta de guardado (avanzado), tiempo de comprobacion (Avanzado).
*Todo lo del modo avanzado es completamente opcional.*/
votacion.checkVotaciones(); //Para llamar a la funcion que comprueba las votaciones usando checkTime (por defeto 1 Minuto). *Necesario al usar el modo avanzado

client.on('messageCreate', async (message) => {
      if (message.content.startsWith("!votacion")) {
        if (args.length >= 2) {
          const duration = args[0]; //Tiempo en minutos
          const title = args.slice(1).join(" ");
  
          votacion.createVote(message, title, duration);
        } else {
          message.channel.send('Uso incorrecto. Ejemplo: `!votacion 5 Titulo`');
        }
      }

client.login("your-token-goes-here");
```

## Funciones
```javascript
+ createVote(message, title, duration);
+ checkVotaciones();
```
#### createVote
_Inicia una votación con la duración, título y canal especificados._
- *message*: Mensaje del la accion que tiene el cliente. (client.on('messageCreate',async(message) => {})En algunos casos puede ser: "msg"
- *duration*: Duración de la votación en minutos.
- *title*: Título de la votación.
#### checkVotaciones
_Comprueba las votaciones cada X tiempo. Definido anteriormente. (checkTime)_

## Licencia
Este proyecto está licenciado bajo la Licencia LGPL-3.0-only. Ver el archivo [LICENSE](https://github.com/Papela/discord-vote/blob/main/LICENSE) para más detalles.

## Autor
+ [@Papela](https://github.com/Papela)

## Contribuir
Si quieres contribuir a este proyecto, puedes seguir los siguientes pasos:
1. Haz un fork del repositorio.
2. Crea una rama con tu nueva funcionalidad: *git checkout -b nueva-funcionalidad*.
3. Realiza tus cambios y haz commit: *git commit -m "Agrega nueva funcionalidad"*.
4. Haz push a la rama: *git push origin nueva-funcionalidad*.
5. Abre un pull request en GitHub.
