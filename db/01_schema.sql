CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) 
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    category_id INT REFERENCES categories(id),
    price DECIMAL(10,2),
    stock INT  DEFAULT 0,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE 
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'completed',
    channel VARCHAR(20) DEFAULT 'store'
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    qty INT ,
    unit_price DECIMAL(10,2) 
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    method VARCHAR(20),
    paid_amount DECIMAL(10,2)
);