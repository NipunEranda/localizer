const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes');
const config = require('./util/config');

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());

//Routes
routes.forEach(r => { app.use(r.path, r.module) });

//Create Server
app.listen(config.hostPORT, async (err) => {
    if (err) throw err
    console.log('Server running in http://' + config.host + ':' + config.port);
});