const saldoCommand=require('./commands/saldo.command');

module.exports=async(msg)=>{

 const text=msg.body.trim();

 if(!text.startsWith("!"))
   return;

 const args=text.split(" ");

 const command=args[0].toLowerCase();


 switch(command){

   case '!saldo':
      return saldoCommand.consultar(msg,args);


   case '!agregar':
      return saldoCommand.agregar(msg,args);


   case '!quitar':
      return saldoCommand.quitar(msg,args);

   case '!info':
      return msg.reply(
`📌 COMANDOS DISPONIBLES

💰 Consultar saldo

!saldo → Muestra tu saldo actual

🛠️ Comandos de Administrador

!saldo @usuario → Consulta el saldo de otro usuario
!agregar @usuario monto ➕ → Añade saldo a un usuario
!quitar @usuario monto ➖ → Resta saldo a un usuario`
      );

 }

}