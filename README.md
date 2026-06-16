# Food Store

Aplicación frontend desarrollada como proyecto integrador de **Programación III** (UTN).

## Descripción

Food Store es un e-commerce de comida que incluye:
- Sistema de autenticación con registro y login (localStorage)
- Protección de rutas por rol (admin / client)
- Catálogo de productos con búsqueda y filtrado por categoría
- Carrito de compras con persistencia en localStorage

## Tecnologías

- HTML5 + CSS3
- TypeScript
- Vite (bundler)

## Cómo ejecutarlo

```bash
# 1. Instalar dependencias
pnpm install

# 2. Levantar el servidor de desarrollo
pnpm dev
```

El servidor estará disponible en `http://localhost:5173`.

## Credenciales de prueba

| Rol    | Email                    | Contraseña |
|--------|--------------------------|------------|
| Admin  | admin@foodstore.com      | admin1234  |
| Client | Registrarse en /registro | (libre)    |

## Estructura del proyecto

```
src/
├── data/
│   └── data.ts
├── pages/
│   ├── auth/login/
│   ├── auth/registro/
│   ├── admin/home/
│   ├── client/home/
│   └── store/
│       ├── store.css  ← styles  
│       ├── admin/    ← admin
│       ├── home/    ← catálogo
│       └── cart/    ← carrito
├── types/
│   ├── IUser.ts 
│   ├── Rol.ts
│   ├── product.ts
│   └── category.ts
└── utils/
    ├── auth.ts
    ├── localStorage.ts
    └── navigate.ts
```
