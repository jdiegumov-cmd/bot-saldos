const BalanceService = require("../../services/balance.service");
async function isAdmin(msg) {
  const chat = await msg.getChat();

  if (!chat.isGroup) return false;
  const contact = await msg.getContact();
  if (!contact?.id?._serialized) return false;
  const realId = contact.id._serialized;
  const participant = chat.participants.find(
    (p) => p.id._serialized === realId,
  );

  return Boolean(participant?.isAdmin || participant?.isSuperAdmin);
}

exports.consultar = async (msg, args) => {
  try {
    if (args.length === 1) {
      const contact = await msg.getContact();
      const saldo = await BalanceService.getBalance(contact.id.user);
      if (saldo.balance == 0)  return msg.reply(`💰 Tu saldo actual:
$0

🏆 Nivel de pobreza desbloqueado`);

      return msg.reply(`👤💰 Tu saldo
      
💵 Saldo actual: $${saldo.balance}`);
    }

    if (!(await isAdmin(msg))) return msg.reply(`🔒 Solo Administradores

⚠️ Este comando es exclusivo para administradores`);

    const mentions = await msg.getMentions();

    if (!mentions.length) return msg.reply(`✨ Uso correcto:

  !saldo @usuario`);
    //console.log(mentions[0]);
    //console.log(mentions[0].number);
    //console.log(mentions[0].id);
    //console.log(mentions[0].id.user);
    const saldo = await BalanceService.getBalance(mentions[0].id.user);

    if (saldo.balance == 0) return msg.reply(`💰 Saldo actual:
$0

🏆 Nivel de pobreza desbloqueado`);

    return msg.reply(`👤💰 Saldo de usuario
      
💵 Saldo actual: $${saldo.balance}`);
  } catch (error) {
    return msg.reply(`❌ Error: ${error.message}`);
  }
};

exports.agregar = async (msg, args) => {
  try {
    if (!(await isAdmin(msg))) return msg.reply(`🔒 Solo Administradores

⚠️ Este comando es exclusivo para administradores`);

    const mentions = await msg.getMentions();

    if (!mentions.length || !args[2]) return msg.reply(`✨ Uso correcto:

!agregar @usuario monto`);

    const amount = parseFloat(args[2]);

    if (isNaN(amount)) return msg.reply(` ⚠️ Monto inválido
Por favor, ingresa una cantidad válida`);

    const result = await BalanceService.addBalance({
      user: mentions[0].id.user,

      amount,
    });

    msg.reply(
      `💰✨ Saldo actualizado

➕ Se ha agregado correctamente

💵 Nuevo saldo:
$${result.balance}`,
    );
  } catch (error) {
    msg.reply(`❌ Error: ${error.message}`);
  }
};

exports.quitar = async (msg, args) => {
  try {
    if (!(await isAdmin(msg))) return msg.reply(`🔒 Solo Administradores

⚠️ Este comando es exclusivo para administradores`);

    const mentions = await msg.getMentions();

    if (!mentions.length || !args[2]) return msg.reply(`✨ Uso correcto:
!agregar @usuario monto`);

    const amount = parseFloat(args[2]);

    if (isNaN(amount)) return msg.reply(`⚠️ Monto inválido
Por favor, ingresa una cantidad válida`);

    const result = await BalanceService.removeBalance({
      user: mentions[0].id.user,

      amount,
    });

    msg.reply(
      `💸 Saldo actualizado

➖ Se ha descontado correctamente

💰 Nuevo saldo:
$${result.balance}`,
    );
  } catch (error) {
    msg.reply(`❌ Error: ${error.message}`);
  }
};
