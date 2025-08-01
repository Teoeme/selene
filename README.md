# Selene - Prueba Técnica

```
Empresa: Selene
Cargo: Desarrollador MERN Semi Senior
Autor: Mancinelli Mateo Atilio
```

*Este repositorio contiene el código correspondiente a la ejecución de una prueba técnica cuyo enunciado se encuentra en [enunciado.md](./docs/enunciado.md)*

---

## Resumen

Aplicación web de **Gestión de Beneficios Empresariales** desarrollada con el stack **MERN** (MongoDB, Express, React, Node.js) como tecnologías base, implementando **Domain-Driven Design** bajo una **arquitectura hexagonal**.

El sistema permite a empleados solicitar beneficios corporativos y a administradores gestionarlos, con soporte multi-tenant para múltiples empresas.

## Arquitectura

**Arquitectura Hexagonal (Ports & Adapters)** dividida en capas:

- **`domain/`** - Entidades, Value Objects, interfaces de repositorios y servicios
- **`application/`** - Casos de uso y lógica de aplicación  
- **`infrastructure/`** - Implementaciones concretas (MongoDB, JWT, bcrypt)
- **`interfaces/`** - Controllers, middleware, rutas y validaciones

## Stack Tecnológico

### Backend
- **Node.js** + **TypeScript** + **Express**
- **MongoDB** + **Mongoose** 
- **JWT** + **bcrypt** (autenticación)
- **Zod** (validación de schemas)
- **Vitest** (testing)

### Frontend 
- **React** + **TypeScript** + **Vite**
- **React Query** (estado del servidor)
- **Zustand** (estado global)
- **React Router** (navegación)
- **Tailwind CSS** (estilos)
- **Headless UI** (componentes accesibles)
- **Axios** (cliente HTTP)

## Funcionalidades Principales

### **Multi-tenant**
- Soporte para múltiples empresas
- Aislamiento completo de datos por empresa
- Usuarios y beneficios específicos por organización

### **Autenticación & Autorización**
- Login con JWT stateless
- Roles: `ADMIN` y `EMPLOYEE`
- Middleware de protección por endpoints
- Manejo seguro de tokens con httpOnly cookies

### **Gestión de Beneficios**
- **Empleados**: Solicitar beneficios disponibles
- **Administradores**: Aprobar/rechazar solicitudes
- Estados: `PENDING`, `APPROVED`, `REJECTED`
- Filtros por estado y fechas (admin)

###  **Arquitectura Limpia**
- Inyección de dependencias
- Responses HTTP estandarizadas
- Manejo centralizado de errores
- Validación con type safety

## Estructura del Proyecto

```
selene/
├── backend/           # API con arquitectura hexagonal
│   ├── src/
│   │   ├── domain/           # Entidades y lógica de negocio
│   │   ├── application/      # Casos de uso
│   │   ├── infrastructure/   # MongoDB, JWT, bcrypt
│   │   └── interfaces/       # Controllers, routes, middleware
│   └── tests/         # Tests unitarios e integración
├── frontend/          # App React con features completas
│   ├── src/
│   │   ├── core/            # Auth, API, router, types
│   │   ├── features/        # auth, benefits, requests
│   │   └── shared/          # Componentes reutilizables
├── docs/             # Documentación del proyecto
└── README.md
```

## Decisiones Técnicas

Las decisiones de arquitectura y implementación están documentadas en [decisiones.md](./docs/decisiones.md), incluyendo el razonamiento detrás de cada elección técnica.

---