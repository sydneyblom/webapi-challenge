//import express
const express = require('express');


//importing routing
const projectRouter = require('./routers/projectRouter.js');
const actionRouter = require('./routers/actionRouter.js');


const server = express();

//global middleware
server.use(express.json());


server.use("/api/actions", actionRouter);
server.use("/api/project", projectRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Global get requests </h2>`)
  });

module.exports = server;