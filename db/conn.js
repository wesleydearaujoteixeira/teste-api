const mongoose = require('mongoose');

async function main() {
  try {
    console.log("Tentando conectar ao MongoDB...");
  
    // Conectando ao MongoDB usando o IPv4
    await mongoose.connect(`mongodb://127.0.0.1:27017/getApet`, {

    });

    console.log("Conectou ao mongoose");

  } catch (err) {
    console.error('Erro ao conectar ao MongoDB =>: ', err.message);
  }
}

// Chamando a função main para conectar ao banco de dados
main().catch((err) => console.log(err));

// Exportando o mongoose para uso em outros arquivos
module.exports = mongoose;
