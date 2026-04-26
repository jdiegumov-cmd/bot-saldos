const Client = require("../models/client.model");

exports.getSaldo = async (req, res) => {
  try {
    let user = await Client.findOne({
      number: req.params.phone,
    });

    if (!user) {
      user = await Client.create({
        number: req.params.phone,
      });
    }

    return res.status(200).json({
      number: user.number,
      balance: user.balance,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error interno",
    });
  }
};

exports.addSaldo = async (req, res) => {
  try {
    const { user, amount } = req.body;

    if (!user || amount === undefined || Number(amount) <= 0) {
      return res.status(400).json({
        error: "Monto inválido",
      });
    }

    let client = await Client.findOne({
      number: user,
    });

    if (!client) {
      client = await Client.create({
        number: user,
      });
    }

    client.balance += Number(amount);

    await client.save();

    return res.status(200).json({
      balance: client.balance,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error interno",
    });
  }
};

exports.removeSaldo = async (req, res) => {
  try {
    const { user, amount } = req.body;

    if (!user || amount === undefined || Number(amount) <= 0) {
      return res.status(400).json({
        error: "Monto inválido",
      });
    }

    const client = await Client.findOne({
      number: user,
    });

    if (!client) {
      return res.status(404).json({
        error: "Usuario no existe",
      });
    }

    if (client.balance < Number(amount)) {
      return res.status(400).json({
        error: `saldo insuficiente
El usuario no tiene suficiente saldo para realizar esta acción.`,
      });
    }

    client.balance -= Number(amount);

    await client.save();

    return res.status(200).json({
      balance: client.balance,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error interno",
    });
  }
};
