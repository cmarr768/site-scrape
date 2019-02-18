const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const routes = require('./routes/routes');
const appService = require('./app/app');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.use((req, res) => {
    res.status(404);
});

// let this function run every x amount of time to process pending items in the queue
setInterval(async () => {
    try {
        await appService.processQueue();
    } catch (e) {
        console.log(e.message);
    }
}, 10000);

console.log(`Listening on port ${port}`);
http.createServer(app).listen(port);
