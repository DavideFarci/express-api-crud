const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Rotte per l'entità post

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port http://localhost:" + process.env.PORT);
});
