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
-- ==============================================================================
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
-- ==============================================================================
CREATE OR REPLACE VIEW vw_inventory_risk AS
SELECT
    p.id,
    p.name,
    p.stock,
    c.name as category,
    CASE
        WHEN p.stock = 0 THEN 'CRITICAL'
        WHEN p.stock < 10 THEN 'HIGH_RISK'
        ELSE 'NORMAL'
    END as risk_level
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.active = true;
-- ==============================================================================
CREATE OR REPLACE VIEW vw_customer_value AS
WITH CustomerStats AS (
    SELECT
        o.customer_id,
        COUNT(o.id) as num_ordenes,
        SUM(pay.paid_amount) as total_gastado
    FROM orders o
    JOIN payments pay ON o.id = pay.order_id
    GROUP BY o.customer_id
)
SELECT
    c.id,
    c.name,
    c.email,
    COALESCE(cs.num_ordenes, 0) as num_ordenes,
    COALESCE(cs.total_gastado, 0) as total_gastado,
    (COALESCE(cs.total_gastado, 0) / NULLIF(cs.num_ordenes, 0)) as gasto_promedio
FROM customers c
LEFT JOIN CustomerStats cs ON c.id = cs.customer_id;
-- ==============================================================================
CREATE OR REPLACE VIEW vw_payment_mix AS
SELECT
    method,
    COUNT(*) as total_transacciones,
    SUM(paid_amount) as total_monto,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM payments)), 2) as porcentaje_uso
FROM payments
GROUP BY method
HAVING SUM(paid_amount) > 0;