require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.port;

const app = express();

// config JSON ad form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Solve CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// routes
const router = require("./routes/Router.js");

// __dirname - Nome do Diretorio Atual
// Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// DB Connection
require("./config/db.js");

app.use(router);

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
