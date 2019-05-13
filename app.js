require('dotenv').config();
const mysql = require ("mysql");
const inquirer = require ("inquirer");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    welcome();
    // productList();
  });


  function closeConnection(){
      connection.end();
      console.log("Connection Closed")
  };

 function welcome(){ 
  inquirer
    .prompt([{
            type: "list",
            message: "Hello, how can I help you?",
            choices: ["List Products", "Bid on Product by ID"],
            name: "action"
        }
    ])
    .then(function (response) {
        if (response.action === "List Products") {
            console.log("Got 'em")
            productList();
        } else if (response.action === "Bid on Product by ID") {
            productBid(response.action);
        } else console.log ("Nothing")
        closeConnection();
    });
};


function productList(){
    console.log("Listing products.....");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
      });
}