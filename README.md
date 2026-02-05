# Dashboard de Reportes - Cafetería del Campus

Sistema de Business Intelligence para analítica de una cafetería universitaria. Permite consultar reportes de ventas, productos estrella, inventario en riesgo, clientes frecuentes y mezcla de pagos.

## Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Ejecución](#-ejecución)
- [Reportes Disponibles](#-reportes-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Variables de Entorno](#-variables-de-entorno)

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose)
- [Node.js](https://nodejs.org/) v18 o superior (solo para desarrollo local sin Docker)
- [Git](https://git-scm.com/)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/MrX-zeta/Evaluacion-practica-awos-c1.git
cd Evaluacion-practica-awos-c1
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
POSTGRES_DB=db
POSTGRES_USER=user
POSTGRES_PASSWORD=password
DB_PORT_EXTERNAL=5432
DB_PORT_INTERNAL=5432

# Aplicación
WEB_PORT=3000
DATABASE_URL=postgresql://awos_user:awos_password@db:5432/awos_db
```

## Ejecución

### Opción 1: Con Docker (Recomendado) 🐳

Ejecuta todo el sistema con un solo comando:

```bash
docker compose up -d
```

Esto iniciará:
- **PostgreSQL** en el puerto `5432`
- **Aplicación Next.js** en el puerto `3000`

Accede a la aplicación en: **http://localhost:3000**

#### Comandos útiles de Docker

```bash
# Ver logs de los contenedores
docker compose logs -f

# Detener los servicios
docker compose down

# Reiniciar con datos limpios (elimina volúmenes)
docker compose down -v && docker compose up -d
```

### Opción 2: Desarrollo Local

Si prefieres ejecutar sin Docker:

#### 1. Iniciar solo la base de datos con Docker

```bash
docker compose up -d db
```

#### 2. Configurar la aplicación

```bash
cd evaluacion-c1
npm install
```

#### 3. Crear archivo de entorno local

Crea `evaluacion-c1/.env.local`:

```env
DATABASE_URL=postgresql://awos_user:awos_password@localhost:5432/awos_db
```

#### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

Accede a la aplicación en: **http://localhost:3000**

## Reportes Disponibles

| Reporte | Ruta | Descripción |
|---------|------|-------------|
| **Ventas Diarias** | `/reports/sales` | Resumen de ventas por día con filtros de fecha |
| **Productos Estrella** | `/reports/top-products` | Top 10 productos más vendidos |
| **Inventario** | `/reports/inventory` | Stock actual y productos en riesgo |
| **Clientes** | `/reports/customers` | Clientes frecuentes y su historial |
| **Mezcla de Pagos** | `/reports/payments` | Distribución de métodos de pago |

## Estructura del Proyecto

```
evaluacion_c1/
├── docker-compose.yml      # Orquestación de contenedores
├── .env                    # Variables de entorno (no commitear)
├── db/                     # Scripts de base de datos
│   ├── 01_schema.sql       # Estructura de tablas
│   ├── 02_seed.sql         # Datos de prueba
│   ├── 03_reports_vw.sql   # Vistas para reportes
│   ├── 04_indexes.sql      # Índices de optimización
│   ├── 05_roles.sql        # Roles y permisos
│   └── 06_migrate.sql      # Migraciones
└── evaluacion-c1/          # Aplicación Next.js
    ├── src/
    │   ├── app/            # Rutas y páginas
    │   │   ├── page.tsx    # Dashboard principal
    │   │   └── reports/    # Páginas de reportes
    │   ├── lib/
    │   │   └── db.ts       # Conexión a PostgreSQL
    │   └── types/
    │       └── index.ts    # Tipos TypeScript
    ├── package.json
    └── Dockerfile
```

## Autor

Universidad Politécnica de Chiapas  
Materia: Aplicaciones Web Orientadas a Servicios  
Evaluación Corte 1 - Quinto Cuatrimestre

---
