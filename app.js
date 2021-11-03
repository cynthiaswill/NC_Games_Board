const express = require('express');
const apiRouter = require('./routers/api.router');
const { handleCustomErrors, handlePSQLErrors, handle500 } = require('./controllers/error.controller');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use('*', (req, res) => {
    res.status(404).send({ msg: 'Invalid path' })
})

app.use(handleCustomErrors);
app.use(handlePSQLErrors);

app.use(handle500);

module.exports = app;