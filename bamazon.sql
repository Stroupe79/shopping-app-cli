CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT NOT NULL PRIMARY KEY auto_increment,
    product_name VARCHAR (50) NOT NULL,
    department_name VARCHAR (50) NOT NULL,
    price INT (5) NOT NULL,
    stock_quantity INT (5) NOT NULL
    );
    
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("Large Wooden Indian", "Home Decor", 200, 5),
("Logitech MX Master Mouse", "Technology", 100, 20),
("Wooden Stake", "Home Defense", 2, 1000),
("Ryobi Drill", "DIY", 45, 300);

SELECT * FROM products;