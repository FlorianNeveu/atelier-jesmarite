const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenue l\'atelier de Jesmarite!');
});

app.listen(port, () => {
    console.log(`Le serveur fonctionne normalement sur le port : ${port}`)
})