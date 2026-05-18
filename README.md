# Frontend — Inventario App (Vue 3 + Vite + Pinia)

Repositorio frontend de la evaluación técnica Full Stack. Migrado desde Vue 2 legacy a Vue 3 moderno.

---

## Requisitos

- **Docker + Docker Compose** (recomendado — no requiere Node local)
- Node.js 20+ y npm (solo para desarrollo local sin Docker)

---

## Levantar con Docker

### Opción A — Stack completo (backend + MySQL + frontend) ✅ Recomendado para evaluación

El `docker-compose.yml` principal está en el repositorio del backend e incluye todos los servicios.

```bash
# 1. Clonar ambos repositorios como carpetas hermanas
git clone https://github.com/HaroldATdev/backend-laravel11.git backend-laravel11
git clone https://github.com/HaroldATdev/frontend-vue3.git frontend-vue3

# 2. Configurar el entorno del backend
cd backend-laravel
cp .env.example .env
# El .env.example ya incluye FRONTEND_PATH=../frontend-vue3

# 3. Levantar todo (backend + nginx + MySQL + frontend)
docker compose up -d --build

# 4. Ejecutar migraciones y seeders
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate --seed
```

### Opción B — Solo el frontend (requiere backend corriendo por separado)

Este repositorio incluye su propio `docker-compose.yml` para levantar únicamente el frontend:

```bash
git clone https://github.com/HaroldATdev/frontend-vue3.git frontend-vue3
cd frontend-vue3
docker compose up
```

> El frontend estará disponible en http://localhost:5173 y apuntará al backend en http://localhost:8080/api.

### URLs disponibles

| Servicio        | URL                          |
|-----------------|------------------------------|
| Frontend (Vite) | http://localhost:5173        |
| API Laravel     | http://localhost:8080/api    |
| Swagger UI      | http://localhost:8080/api/documentation |
| Telescope       | http://localhost:8080/telescope |

---

## Desarrollo local sin Docker

```bash
cp .env.example .env
npm install
npm run dev
```

---

## Variables de entorno

| Variable        | Descripción                          | Valor por defecto           |
|-----------------|--------------------------------------|-----------------------------|
| `VITE_API_URL`  | URL base de la API del backend       | `http://localhost:8080/api` |

---

## Stack migrado

| Área              | Antes (legacy)              | Después (migrado)                        |
|-------------------|-----------------------------|------------------------------------------|
| Framework         | Vue 2.7                     | Vue 3.4 + Composition API (`<script setup>`) |
| Estado global     | Sin Pinia                   | Pinia (stores: auth, products, categories, stockMovements) |
| HTTP              | Axios directo en componentes | Servicio centralizado `src/api/http.js`  |
| Interceptores     | Sin manejo global de errores | Global: 401, 403, 422, 500, errores de red |
| Estilos           | CSS plano                   | Tailwind CSS v3                          |
| Router            | Vue Router 3                | Vue Router 4 con guards por meta         |
| Build tool        | Vite 4 + plugin-vue2        | Vite 5 + @vitejs/plugin-vue              |

---

## Arquitectura

```
src/
├── api/
│   └── http.js              # Axios centralizado con interceptores globales
├── services/
│   ├── authService.js       # login, logout, me
│   ├── productService.js    # CRUD productos
│   ├── categoryService.js   # CRUD categorías
│   ├── stockService.js      # movimientos de stock
│   └── dashboardService.js  # KPIs del dashboard
├── stores/                  # Pinia stores
│   ├── auth.js
│   ├── products.js
│   ├── categories.js
│   └── stockMovements.js
├── components/              # Componentes reutilizables
│   ├── AppAlert.vue         # Alertas error/success/warning/info
│   ├── AppLoading.vue       # Spinner de carga
│   ├── AppConfirm.vue       # Modal de confirmación
│   └── AppPagination.vue    # Paginación con ellipsis
└── views/
    ├── Login.vue            # Validación frontend + manejo de token
    ├── Dashboard.vue        # KPIs, bajo stock, últimos movimientos
    ├── Products.vue         # Tabla paginada con filtros y ordenamiento
    ├── ProductForm.vue      # Crear/editar con validaciones fuertes
    ├── Categories.vue       # CRUD inline con confirmación de borrado
    └── StockMovements.vue   # Historial paginado + registro con validación
```

---

## Decisiones técnicas

- **Pinia sobre Vuex**: API más simple con Composition API, sin mutations boilerplate.
- **Servicios separados por dominio**: cada entidad tiene su propio service, desacoplado de los componentes y stores.
- **Interceptor centralizado en `http.js`**: maneja redirección automática en 401, mensajes normalizados en 422 (errores de validación de Laravel), y mensajes genéricos en 500 y errores de red. Evita repetir lógica de error en cada componente.
- **Importación dinámica del router en el interceptor**: evita dependencia circular entre `http.js` y `router.js`.
- **Tailwind CSS**: utilidades inline en lugar de CSS global, consistencia visual sin hojas de estilo personalizadas.
- **Validación en dos capas**: frontend (antes de enviar) y backend (errores 422 mostrados desde el interceptor).

