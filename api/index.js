const express = require('express');
const cors = require('cors');
const mongoose = require('../db/conn');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = 3000; // 
const router = require('../routes/UserRoutes');
const PetRouter = require('../routes/PetRouters');

app.use('/users', router);
app.use('/pets', PetRouter);

app.get('/tentando', (req, res) => {
  res.send('API de Petshop');
});

mongoose.connection.once('open', () => {
  console.log('Conectado ao MongoDB');

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}/`);  
});
});

// Export the app for serverless functions
module.exports = app;
