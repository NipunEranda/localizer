require('dotenv').config();

const host = process.env.HOST;
const port = process.env.PORT;

//Exports list
module.exports = {
    host,
    port
}