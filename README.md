# Discord-Vote (English)

[![npm version](https://img.shields.io/npm/v/discord-vote.svg)](https://www.npmjs.com/package/discord-vote)
[![downloads](https://img.shields.io/npm/dt/discord-vote.svg)](https://github.com/Papela/discord-vote/)
[![license](https://img.shields.io/npm/l/discord-vote.svg)](https://github.com/Papela/discord-vote/blob/main/LICENSE)

An NPM package to easily have a voting system for Discord.js 14.

## Example images
> _Some examples may no longer look exactly like this due to new updates._
#### Normal Mode
<img src="https://i.ibb.co/CMSN2Pj/image.png" />&nbsp; &nbsp;<img src="https://i.ibb.co/8sRXFcq/image.png" />

<img src="https://i.ibb.co/BCGCFhx/image.png" />

#### Advanced Mode
<img src="https://i.ibb.co/54xJY5n/image.png" />&nbsp; &nbsp;<img src="https://i.ibb.co/StQF81G/image.png" />

<img src="https://i.ibb.co/T8B3nhs/image.png" />

## Instalation

To install the package, use one of the following commands:

#### NPM
```bash
npm install discord-vote
```
#### YARN
```bash
yarn add discord-vote
```
#### PNPM
```bash
pnpm add discord-vote
```

## Example of use in Normal Mode
> Notes: _In "normal" mode, in case the bot disconnects, all the progress of the votes that have not finished or have the time to 0 will be lost. In the "Advanced" mode, no progress will be lost and the votes will be will update when reconnected._
```javascript
const DiscordVote = require('discord-vote');
const votacion = new DiscordVote({
    client:client, //The Client
    mode:0, //Voting mode. (0 = Normal, 1 = Advanced) (Optional. Default: "normal")
    lang: "en"}); //The language of the package. For example: "en" (english), "es" (spanish) or ./custom.json (Optional. Default: English)

client.on('messageCreate', async (message) => {
      if (message.content.startsWith("!vote")) {
        if (args.length >= 2) {
          const duration = args[0]; //Time in minutes
          const title = args.slice(1).join(" "); //Title of the vote
  
          votacion.createVote(message, title, duration);
        } else {
          message.channel.send('Incorrect use. Example: `!vote 5 Title`');
        }
      }

client.login("BOT TOKEN");
```

## Example of use in Advanced mode (Recommended)

```javascript
const DiscordVote = require('discord-vote');
const votacion = new DiscordVote({
  client:client, //The Client
  mode:0, //Voting mode. (0 = Normal, 1 = Advanced) (Optional. Default: "normal")
  savePath: './votaciones.json', //Voting saving path (Advanced)
  checkTime: 60000, //Check time in milliseconds (Advanced)
  debug: false, //Show more logs with voting information (not recommended if there are many votes!)
  lang: "en"}); //The language of the package. For example: "en" (english), "es" (spanish) or ./custom.json (Optional. Default: English)

//*Everything in advanced mode, except the client, is completely optional.*/

client.on('messageCreate', async (message) => {
      if (message.content.startsWith("!vote")) {
        if (args.length >= 2) {
          const duration = args[0]; //Time in minutes
          const title = args.slice(1).join(" "); //Title of the vote
  
          votacion.createVote(message, title, duration);
        } else {
          message.channel.send('Incorrect use. Example: `!vote 5 Title`');
        }
      }

client.login("BOT TOKEN");
```

## Functions
```javascript
+ createVote(message, title, duration, savePath, debug);
+ checkVotaciones();
```
#### createVote
_Start a vote with the specified duration, title and channel._
- *message*: Event message that the client has. (client.on('messageCreate', async(**message**) => {})In some cases it can be: "msg"
- *title*: Vite title.
- *duration*: Voting duration in milliseconds.
- *savePath*: Custom save path. (optional and only for Advanced mode).
- *debug*: true or false (Optional and not recommended if there are many votes!).
#### checkVotaciones
_Check and update the votes._
- You can automate calls using _checkTime_ in the options
- By calling the function, you will execute the update of the votes manually.
- Using a time equal to "0", will disable the automatic check.

## License
This project is licensed under the GPL-3.0 License. View the file [LICENSE](https://github.com/Papela/discord-vote/blob/main/LICENSE) file for more details.

## Author
+ [@Papela](https://github.com/Papela)

## Contribute
If you want to contribute to this project, you can follow the following steps:
1. Fork the repository.
2. Create a branch with your new feature: *git checkout -b new-feature*.
3. Make your changes and commit: *git commit -m "Add new functionality"*.
4. Push to the branch: *git push origin new-feature*.
5. Open a pull request on GitHub.

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/Papela/discord-vote) 

&nbsp; 

# Discord-Vote (Español)

[![npm version](https://img.shields.io/npm/v/discord-vote.svg)](https://www.npmjs.com/package/discord-vote)
[![downloads](https://img.shields.io/npm/dt/discord-vote.svg)](https://github.com/Papela/discord-vote/)
[![license](https://img.shields.io/npm/l/discord-vote.svg)](https://github.com/Papela/discord-vote/blob/main/LICENSE)

Un paquete NPM para poder tener un sistema de votaciones para Discord.js 14 de manera sencilla.

## Imágenes de ejemplo
> _Puede que algunos ejemplos ya no se vean exactamente así debido a nuevas actualizaciones._
#### Modo normal
<img src="https://i.ibb.co/CMSN2Pj/image.png" />&nbsp; &nbsp;<img src="https://i.ibb.co/8sRXFcq/image.png" />

<img src="https://i.ibb.co/BCGCFhx/image.png" />

#### Modo Avanzado
<img src="https://i.ibb.co/54xJY5n/image.png" />&nbsp; &nbsp;<img src="https://i.ibb.co/StQF81G/image.png" />

<img src="https://i.ibb.co/T8B3nhs/image.png" />

## Instalación

Para instalar el paquete, utiliza alguno de los siguientes comandos:

#### NPM
```bash
npm install discord-vote
```
#### YARN
```bash
yarn add discord-vote
```
#### PNPM
```bash
pnpm add discord-vote
```

## Ejemplo de uso en el Modo Normal
> Notas: _En en modo "normal", en caso de que el bot se desconecte, se perdera todo el progreso de las votaciones que no hayan terminado o tengan el tiempo a 0. En el modo "Avanzado" no se perdera ningun progreso y las votaciones se actualizaran al volver a contectarse._
```javascript
const DiscordVote = require('discord-vote');
const votacion = new DiscordVote({
    client:client, //El cliente
    mode:0, //Modo de votacion. (0 = Normal, 1 = Avanzado) (Opcional. Por defecto: Ingles)
    lang: "en"}); //El lenguaje del paquete. Por ejemplo: "es" (Español), "en" (Ingles) o ./miidioma.json (Opcional. Por defecto: Ingles)

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
  mode:1, //Modo de votacion. (0 = Normal, 1 = Avanzado) (Opcional. Por defecto: Ingles)
  savePath: './votaciones.json', //Ruta de guardado de las votaciones (Avanzado)
  checkTime: 60000, //tiempo de comprobacion en milisegundos. (Avanzado)
  debug: false, //Muestra mas logs con informacion de las votaciones (no recomendado si hay muchas votaciones!)
  lang: "en"}); //El lenguaje del paquete. Por ejemplo: "es" (Español), "en" (Ingles) o ./miidioma.json (Opcional. Por defecto: Ingles) 

//*Todo lo del modo avanzado, excepto el cliente, es completamente opcional.*/

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
+ createVote(message, title, duration, savePath, debug);
+ checkVotaciones();
```
#### createVote
_Inicia una votación con la duración, título y canal especificados._
- *message*: Mensaje del evento que tiene el cliente. (client.on('messageCreate',async(**message**) => {})En algunos casos puede ser: "msg"
- *title*: Título de la votación.
- *duration*: Duración de la votación en minutos.
- *savePath*: Ruta de guardado personalizado. (opcional y solo para el modo Avanzado).
- *debug*: true o false (opcional).
#### checkVotaciones
_Comprueba y actualiza las votaciones._
- Puedes automatizar las llamadas usando _checkTime_ en las opciones
- Al llamar a la funcion, ejecutaras la actualizacion de las votaciones manualmente.
- Usar un tiempo igual a "0", deshabilitara la comprobacion automatica.

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

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/Papela/discord-vote)