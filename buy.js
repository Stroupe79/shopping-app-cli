exports.buy = function productBuy(){
    // productList();
    inquirer
        .prompt({
            type: "input",
            message: "What is the ID of the item you are purchasing on?",
            name: "item"
        })
        .then(function(response){
            itemReturn(response);
        })
    };

exports.list = function itemReturn(id){
        console.log(id.item);
        connection.query(`SELECT product_name, price, stock_quantity FROM products WHERE item_id = ?`, id.item, function(err, res, fields) {
            if (err) throw err;
            prettyJson(res);
            closeConnection();
     
       })
    }


// module.exports = {
//     buy,
//     list
// }