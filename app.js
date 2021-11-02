const express = require('express');
const apiRouter = require('./routers/api.router');
const { handle404, handle400 } = require('./controllers/error.controller');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use('*', (req, res) => {
    res.status(404).send({ msg: 'Invalid path' })
})

app.use(handle404);
app.use(handle400);

module.exports = app;