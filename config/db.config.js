const sql = require("mssql");
var config = {
    user: "yasithsarada",
    password: "Yasith1999",
    server: "shopping-store-app.database.windows.net",
    database: "shoppingStoreApp",
    options: {
      encrypt: true,
    },
  };
  
  async function dbConnect() {
    try {
      await sql.connect(config);
      console.log("succeeded");
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
    }
  }
  async function dbConnectionClose(){
    try {
        await sql.close();
        console.log('Connection closed');
    } catch (error) {
        console.error("Error closing the connection to database:", error.message);
    }
  }
  
  module.exports = {
    dbConnect,
    dbConnectionClose
  }