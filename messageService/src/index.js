require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const messagesController = require("./controller/messageController");
const app = express();

app.use(morgan("dev"));
app.use(express.json());

const PORT_MESSAGES = process.env.PORT_MESSAGES || 3002;

app.use(messagesController);

app.listen(PORT_MESSAGES, () => {
    console.log(`Microservicio Mensajes ejecutandose en el puerto ${PORT_MESSAGES}`);
});