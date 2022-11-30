
const express = require('express');
const bcrypt = require('bcrypt-node');
const cors = require('cors');
const knex = require('knex');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');


const database = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'tincho',
    password: 'tincho',
    database: 'smart-brain'
  }
});


const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => { res.json("Servidor de Face Recognition Brain Project") });

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, database) });

app.post('/signin', signin.handleSignIn(database, bcrypt));

app.post('/register', register.handleRegister(database, bcrypt));

app.put('/image', image.handleImage(database));

app.post('/imageurl', image.handleApiCall());



app.listen(PORT, () => {
  console.log(`TODO OK EN PUERTO ${PORT}`)
});


