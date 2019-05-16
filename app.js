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
        // console.log(res[0].product_name);
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
                connection.query(`SELECT product_name, price, stock_quantity FROM products WHERE item_id = ?`, productId, function(err, res, fields) {
                if (err) throw err;            
                if (response.amount > res[0].stock_quantity){
                    console.log ("Not enough stock");
                    closeConnection();
                } else {
                completePurchase(response.amount, res[0].product_name);
                }
            })
           })
};

function completePurchase(stock, name){
    var update = `UPDATE products SET stock_quantity = stock_quantity - ${stock} WHERE item_id = ${productId}`
    connection.query(update, function (err, result){
        if (err) throw err; 
        console.log(`You have purchased ${stock} of item ${name} leaving a remainder of ${newStock()}`);
        // console.log(newStock())
    })
};

function newStock(){
    connection.query(`SELECT product_name, price, stock_quantity FROM products WHERE item_id = ?`, productId, function(err, res, fields) {
        if (err) throw err;
        let stock = res[0].stock_quantity;
        console.log(stock);
        closeConnection();
        return stock;
    }
)};




function prettyJson(input){
        console.log(prettyjson.render(input, {
        keysColor: 'white',
        dashColor: 'green',
        stringColor: 'red',
        numberColor: 'green'
    }));
};