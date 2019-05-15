require('dotenv').config();
const mysql = require ("mysql");
const inquirer = require ("inquirer");
const prettyjson = require ("prettyjson");
// const buy = require ("./buy.js");

var productId = "";


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
    //   console.log("Connection Closed")
  };

 function welcome(){ 
  inquirer
    .prompt([{
            type: "list",
            message: "Hello, how can I help you?",
            choices: ["List Products", "Purchase Product by ID"],
            name: "action"
        }
    ])
    .then(function (response) {
        if (response.action === "List Products") {
            productList();
        } else if (response.action === "Purchase Product by ID") {
            productBuy(response.action);
        }
    });
};


function productList(){
    console.log("Listing products.....");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        prettyJson(res);
        closeConnection();
      });
}

function productBuy(){
    // productList();
    inquirer
        .prompt({
            type: "input",
            message: "What is the ID of the item you are purchasing?",
            name: "item"
        })
        .then(function(response){
            productId = response.item;
            itemReturn(response);
        })
    };

function itemReturn(id){
    console.log(id.item);
    connection.query(`SELECT product_name, price, stock_quantity FROM products WHERE item_id = ?`, productId, function(err, res, fields) {
        if (err) throw err;
        prettyJson(res);
        purchase(id.item);
        closeConnection();
 
   })
};

function purchase(){
    inquirer
        .prompt({
            type:"input",
            message: "How many you like to purchase?",
            name: "amount"
        })
        .then(function(response){
            // console.log(response.amount)
                // closeConnection();
                if (response.amount > productId){
                    console.log ("Not enough stock");
                    console.log(productId);
                    // closeConnection();
                } else {
                completePurchase(response.amount);
                // closeConnection();
                }
         
           })
        
        // })

};

function completePurchase(stock){
    // connection.query(`UPDATE stock_quantity FROM products WHERE item_id = ?`, productId, function(err, res, fields) {
    //     if (err) throw err;
    //     prettyJson(res);
    //     closeConnection();
    // });
    console.log("You have purchased " + stock + " of item " + productId)
}




function prettyJson(input){
        console.log(prettyjson.render(input, {
        keysColor: 'white',
        dashColor: 'green',
        stringColor: 'red',
        numberColor: 'green'
    }));
}