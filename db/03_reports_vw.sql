CREATE OR REPLACE VIEW vw_sales_daily AS
SELECT 
    DATE(o.created_at) AS sale_date,
    
    COUNT(DISTINCT o.id) AS tickets,
    
    SUM(oi.qty * oi.unit_price) AS total_ventas,
    
    (SUM(oi.qty * oi.unit_price) / NULLIF(COUNT(DISTINCT o.id), 0)) AS ticket_promedio,
    
    SUM(oi.qty) AS items_sold

FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.status = 'completed'
GROUP BY DATE(o.created_at)

HAVING SUM(oi.qty * oi.unit_price) > 0

ORDER BY sale_date DESC;

CREATE OR REPLACE VIEW vw_top_products_ranked AS
SELECT 
    p.id,
    p.name,
    c.name AS category,
    SUM(oi.qty) AS total_units,
    SUM(oi.qty * oi.unit_price) AS revenue,
    
    RANK() OVER (ORDER BY SUM(oi.qty) DESC) AS ranking

FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
JOIN categories c ON p.category_id = c.id
WHERE o.status = 'completed'
GROUP BY p.id, p.name, c.name;