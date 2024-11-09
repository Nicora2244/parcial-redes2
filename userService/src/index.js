require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const userController = require("./controller/userController");
const authController = require("./controller/authController");
const followController = require("./controller/followController");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const PORT_USER = process.env.PORT_USER || 3002;

app.use(authController);
app.use(userController);
app.use(followController);

app.listen(PORT_USER, () => {
    console.log(`Microservicio Usuario ejecutandose en el puerto ${PORT_USER}`);
});