INSERT INTO categories (name) VALUES ('Café'), ('Postres'), ('Bebidas Frías');

INSERT INTO products (name, category_id, price, stock, active) VALUES
('Americano', 1, 35.00, 100, true),
('Cappuccino', 1, 45.00, 50, true),
('Latte', 1, 45.00, 40, true),
('Muffin Chocolate', 2, 30.00, 15, true),
('Croissant', 2, 25.00, 5, true),
('Frappe Mocha', 3, 55.00, 80, true);

INSERT INTO customers (name, email) VALUES 
('Juan Pérez', 'juan@test.com'), 
('Ana López', 'ana@test.com'),
('Carlos Ruiz', 'carlos@test.com');

--  Órdenes
INSERT INTO orders (customer_id, created_at, status, channel) VALUES
(1, NOW() - INTERVAL '2 days', 'completed', 'store'),
(2, NOW() - INTERVAL '1 day', 'completed', 'app'),
(1, NOW(), 'completed', 'store'),
(3, NOW(), 'completed', 'web');

-- Detalles de las órdenes
INSERT INTO order_items (order_id, product_id, qty, unit_price) VALUES
(1, 1, 2, 35.00), -- 2 Americanos
(1, 4, 1, 30.00), -- 1 Muffin
(2, 6, 1, 55.00), -- 1 Frappe
(3, 2, 1, 45.00), -- 1 Cappuccino
(4, 3, 2, 45.00); -- 2 Lattes

-- Pagos
INSERT INTO payments (order_id, method, paid_amount) VALUES
(1, 'cash', 100.00),
(2, 'card', 55.00),
(3, 'cash', 45.00),
(4, 'app', 90.00);