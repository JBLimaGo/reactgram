const mongoose = require("mongoose");

// connection
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
    //  `mongodb+srv://jeffersonlimapb:<db_password>@cluster0.plh1ecc.mongodb.net/?retryWrites=true&w=majority`, 
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.plh1ecc.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    ).then(() => console.log("Conectado ao MongoDB"))
    .catch(err => console.error(err));

   // console.log("Conectou ao banco!");

    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

conn();

module.exports = conn;
