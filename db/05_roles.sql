DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_analytics') THEN
      CREATE ROLE app_analytics WITH LOGIN PASSWORD 'secure_pass_123';
   END IF;
END
$do$;

-- 2. Asegurar que pueda conectarse a la BD
GRANT CONNECT ON DATABASE awos TO app_analytics;

-- 3. Permisos sobre el esquema público
GRANT USAGE ON SCHEMA public TO app_analytics;

-- 4. REVOCAR cualquier permiso sobre tablas
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_analytics;

-- 5. DAR PERMISO SELECT SOLO A LAS VISTAS
GRANT SELECT ON vw_sales_daily TO app_analytics;
GRANT SELECT ON vw_top_products_ranked TO app_analytics;
GRANT SELECT ON vw_inventory_risk TO app_analytics;
GRANT SELECT ON vw_customer_value TO app_analytics;
GRANT SELECT ON vw_payment_mix TO app_analytics;