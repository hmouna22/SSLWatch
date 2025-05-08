const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const certificatsRoutes = require('./routes/certificats');
const utilisateursRoutes = require('./routes/users');
require('dotenv').config();
require('./scheduler');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/certificats', certificatsRoutes);
app.use('/utilisateurs', utilisateursRoutes);

app.listen(port, () => {
    console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
