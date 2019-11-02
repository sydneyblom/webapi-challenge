//importing express
const express = require("express");

//importing server from server js
const server = require("./server.js");


//setting ip api port
const PORT = 5000;
server.listen(PORT, () => console.log(`Listening on PORT ${PORT}`)); 