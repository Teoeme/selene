# Prueba Técnica

## Objetivo

Evaluar tus habilidades para diseñar una aplicación realist con nuestro stack: **Node.js, Express, TypeScript, Mongoose y React**.

Se espera que tomes decisiones técnicas autónomas, priorices la mantenibilidad del código, apliques un enfoque Domain-Driven y utilices buenas prácticas en diseño de software.

---

## Dominio del Problema: Gestión de Beneficios para Empleados

Una empresa ofrece beneficios (como cursos, licencias, viandas, coworking) que los empleados pueden solicitar. Los administradores (RRHH) deben revisar, aprobar o rechazar dichas solicitudes.

### Roles

- **Empleado**: solicita beneficios, visualiza su historial.
- **Administrador**: aprueba/rechaza solicitudes, filtra por estado, empleado, fecha.

---

## Requerimientos Técnicos

### Backend (Node.js + TS + Express + MongoDB)

- Aplicar **arquitectura hexagonal** con:
    - `/domain` → entidades, value objects, lógica de dominio
    - `/application` → casos de uso puros
    - `/infrastructure` → adaptadores de entrada (HTTP) y salida (MongoDB)
    - `/interfaces` → controladores, middlewares, validadores
- Entidades mínimas:
    - `BenefitRequest`: título, motivo, fecha, estado (`pending`, `approved`, `rejected`), usuario, empresa
- Casos de uso:
    - `requestBenefit`
    - `approveBenefit`
    - `rejectBenefit`
    - `listBenefits` con filtros
- Middleware para autenticación (con empresa y rol)

### Frontend (React + TS)

- Arquitectura por features/modules
- Manejo de estado con React Query o Zustand
- Páginas requeridas:
    - Crear solicitud de beneficio
    - Listar solicitudes propias
    - Si es admin: aprobar/rechazar solicitudes, filtros por estado y fecha
- Buen manejo de errores, loaders, estados vacíos, feedback

---

## Criterios de Evaluación

- Correcta implementación de Clean Architecture
- Código mantenible, desacoplado, testeable
- Dominio del stack Node + Express + Mongoose + React
- Pensamiento autónomo, claridad en decisiones
- Tests unitarios en lógica de negocio
- Documentación clara (README con instrucciones y decisiones)

## Entrega

Podés entregar tu código en un repositorio de GitHub o carpeta ZIP. Incluí:
- Código fuente backend y frontend
- Instrucciones claras de ejecución (README)
- Opcional: dockerización, deploy online, postman collection