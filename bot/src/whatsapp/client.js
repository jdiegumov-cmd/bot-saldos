const { Client, LocalAuth } = require("whatsapp-web.js");
const QRCode = require("qrcode");
const express = require("express");

const messageRouter = require("./messageRouter");

const app = express();
const PORT = process.env.PORT_WEB || 4000;

/*
 Guarda el QR como imagen base64
*/
let qrImage = null;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

/*
===========
QR EVENT
===========
*/
client.on("qr", async (qr) => {
  console.log("QR generado");

  try {
    qrImage = await QRCode.toDataURL(qr);
  } catch (error) {
    console.error("Error generando QR:", error);
  }
});

/*
====================
AUTHENTICATED
====================
*/
client.on("authenticated", () => {
  console.log("Sesión autenticada");
});

/*
====================
READY
====================
*/
client.on("ready", () => {
  console.log("Bot listo");
});

/*
====================
DISCONNECTED
====================
*/
client.on("disconnected", (reason) => {
  console.log("WhatsApp desconectado:", reason);
});

/*
====================
MENSAJES
====================
*/
client.on("message", async (msg) => {
  try {
    const chat = await msg.getChat();
    if (!chat.isGroup) {
      const contact = await msg.getContact();
      await msg.reply(`Ola solo soy un bot
        No me escribas en privato porque me muero
        Dirijete con el administrador del grupo`);
      //const flag = await contact.block();
    } else {
      await messageRouter(msg, client);
    }
  } catch (error) {
    console.error(error);
    await msg.reply("Error procesando comando");
  }
});

app.get("/", (req, res) => {
  res.send("Bot activo");
});

app.get("/qr", (req, res) => {
  if (!qrImage) {
    return res.send(`
     <h2>Aún no se genera QR o ya estás autenticado.</h2>
   `);
  }

  res.send(`
 <html>
 <head>
   <title>WhatsApp QR</title>
 </head>

 <body style="
 display:flex;
 justify-content:center;
 align-items:center;
 height:100vh;
 font-family:Arial;
 ">
   <div style="text-align:center;">
      <h2>Escanea con WhatsApp</h2>
      <img src="${qrImage}" />
   </div>
 </body>
 </html>
 `);
});

app.listen(PORT, () => {
  console.log("Servidor web iniciado puerto", PORT);
});

module.exports = client;
