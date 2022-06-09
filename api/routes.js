const github = require('./routes/github');
const translator = require('./routes/translator');

const routes = [
    //{ path: '/github', module: github },
    { path: '/translator', module: translator }
];

module.exports = routes;