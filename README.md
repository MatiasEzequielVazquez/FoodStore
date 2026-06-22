# Food Store

**Trabajo Práctico Integrador — Programación III**
Tecnicatura Universitaria en Programación a Distancia — UTN

Sistema de gestión de pedidos de comida (e-commerce) desarrollado como aplicación full stack, compuesto por un backend en Spring Boot y un frontend en TypeScript + Vite.

## Descripción

Food Store permite a los usuarios registrarse, navegar un catálogo de productos organizados por categorías, gestionar un carrito de compras y confirmar pedidos, además de consultar su historial. Los administradores cuentan con un panel propio para gestionar categorías, productos y el estado de los pedidos.

## Estructura del repositorio

Este es un monorepo compuesto por dos proyectos independientes:

```
TPI-FoodStore/
├── foodstore-backend/     # API REST en Spring Boot
└── foodstore-frontend/    # Aplicación web en TypeScript + Vite
```

## Tecnologías

**Backend**
- Java 21
- Spring Boot 3.4.x
- Spring Data JPA / Hibernate
- PostgreSQL (via Docker Compose)
- Lombok
- Spring Security Crypto (BCrypt)
- SpringDoc OpenAPI (Swagger)
- Gradle

**Frontend**
- TypeScript
- Vite
- HTML5 + CSS3
- Vanilla JS (sin frameworks)

## Cómo ejecutar el proyecto

El proyecto requiere levantar **dos servidores en paralelo**: el backend y el frontend.

### 0. Base de datos (PostgreSQL con Docker)

**Requisitos:** Docker Desktop instalado y corriendo.

```bash
cd foodstore-backend
docker-compose up -d
```

Esto levanta PostgreSQL en el puerto 5432. La base de datos se recrea automáticamente al iniciar el backend.

### 1. Backend (Spring Boot)

**Requisitos:** Java 21, Gradle (o usar el wrapper incluido).

```bash
cd foodstore-backend
./gradlew bootRun
```
> En Windows usar `gradlew.bat bootRun`

El backend va a quedar disponible en `http://localhost:8080`.

> La base de datos PostgreSQL se recrea en cada arranque (`ddl-auto=create-drop`). Al iniciar, el sistema carga automáticamente:
> - Un usuario administrador por defecto
> - Un set inicial de categorías y productos de ejemplo


**Documentación interactiva de la API (Swagger):**
`http://localhost:8080/swagger-ui/index.html`

### 2. Frontend (Vite)

**Requisitos:** Node.js, pnpm (o npm/yarn).

```bash
cd foodstore-frontend
pnpm install
pnpm dev
```

El frontend va a quedar disponible en `http://localhost:5173`.

> El frontend espera que el backend esté corriendo en `http://localhost:8080/api`. Es necesario levantar el backend antes de usar la aplicación.

## Credenciales de prueba

| Rol      | Email                  | Contraseña  |
|----------|-------------------------|-------------|
| Admin    | admin@foodstore.com     | admin1234   |
| Cliente  | Registrarse desde `/registro` | (a elección) |

## Flujos principales

**Cliente:** registro → login → navegar catálogo → agregar productos al carrito → confirmar pedido (con teléfono y forma de pago) → consultar historial en "Mis Pedidos".

**Administrador:** login → dashboard con estadísticas → gestión de categorías (CRUD) → gestión de productos (CRUD) → gestión de pedidos (cambio de estado).

## Documentación y video

- Documentación técnica y académica (PDF): *Pendiente*
- Video demostrativo: *Pendiente*

## Autor

Matías Ezequiel Vazquez — Tecnicatura Universitaria en Programación (UTN)