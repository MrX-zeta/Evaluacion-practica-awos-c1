CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_products_category ON products(category_id);