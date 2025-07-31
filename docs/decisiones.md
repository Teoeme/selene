# Decisiones Técnicas

## Entidades de Dominio

### Benefit como Entidad Principal

Durante el desarrollo inicial, se identificó que el sistema estaba modelado alrededor de `BenefitRequest` sin tener una entidad que represente los beneficios en sí mismos.

Se decide crear una entidad `Benefit` como parte fundamental del dominio por las siguientes razones:
1. Permite gestionar un catálogo de beneficios disponibles
2. Facilita la categorización de beneficios (cursos, licencias, viandas, coworking)
3. Hace el sistema más escalable para futuros tipos de beneficios
4. Proporciona una referencia clara en las solicitudes
5. Permite agregar metadatos específicos a cada tipo de beneficio

  - Mayor flexibilidad para agregar nuevos tipos de beneficios
  - Mejor organización y categorización de beneficios
  - Posibilidad de agregar reglas específicas por tipo de beneficio
  - Facilita la implementación de filtros y búsquedas

  - Agrega complejidad adicional al modelo de dominio
  - Requiere mantener un catálogo de beneficios actualizado


### Implementación Multi-Tenant

El enunciado menciona "empresa" en múltiples lugares pero no es claro si se refiere a una única empresa o múltiples empresas.

Se implementa como multi-tenant simple donde:
- Cada empresa es completamente independiente
- Los usuarios solo pueden acceder a datos de su empresa
- Los beneficios son específicos por empresa
- El middleware valida pertenencia a la empresa

  - Sistema más escalable
  - Mejor separación de datos
  - Más seguro (aislamiento por empresa)

  - Mayor complejidad en validaciones
  - Necesidad de validar empresa en todas las operaciones


### Desacoplamiento del ID de las entidades

Se decide manejar la creacion de identificadores únicos para cada entidad para desacoplar la base de datos de los datos en sí. El manejo de IDs actualmente se hace con la libreria crypto usando el método uuid(). Esto rompe el principio de desacoplamiento y la arquitectura limpia, pero se ha decidido hacerlo asi por simplicidad.

- Menor complejidad de implementación
- Completamente agnóstico al motor de base de datos

- Acoplamiento en los casos de uso orientados a la creación de entidades
- Menor escalabilidad


## Contenedor de inversión de dependencias

Se decide desarrollar un contenedor de inversión de dependencias para centralizar la inyección de dependencias ya que evita instanciar manualmente los repositorios.

- Reduce la posibilidad de errores al instanciar repositorios
- Permite cambiar de manera centralizada el repositorio
- Facilita testing con repositorios mock/in-memory
- Agrega complejidad adicional al inicializar la aplicación


## Arquitectura Hexagonal

Se decide implementar Arquitectura Hexagonal (Ports & Adapters) en lugar de una arquitectura en capas tradicional.

- Completo desacoplamiento del dominio de infraestructura
- Facilita testing unitario con mocks
- Permite cambiar tecnologías sin afectar la lógica de negocio
- Separación clara de responsabilidades por capas
- Mayor complejidad inicial de setup
- Requiere más archivos y abstracciones
- Curva de aprendizaje más alta para el equipo


## Validación con Zod

Se decide validar a nivel de controlador usando Zod.

 Validación en controladores con `safeParse()`

- Mayor flexibilidad en manejo de errores de validación
- Type safety automático con TypeScript
- Schemas reutilizables para input/output
- Mejor integración con el patrón ResponseFactory
- Código de validación mezclado en controladores
- Posible duplicación si no se reutilizan schemas


## ResponseFactory Estandarizado

Se implementa un factory pattern para estandarizar todas las respuestas HTTP de la API.

 Estructura consistente `{ success, message, data, error, timestamp }`

- Respuestas consistentes en toda la API
- Facilita integración del frontend
- Manejo centralizado de códigos HTTP
- Mejor debugging y logging
- Overhead adicional en cada response
- Menor flexibilidad para responses especiales


## Autenticación JWT + bcrypt

Se decide implementar autenticación stateless con JWT y hashing de contraseñas con bcrypt.
- JWT con `jsonwebtoken` library
- bcrypt con saltRounds: 12
- Tokens en header `Authorization: Bearer <token>`

- Escalabilidad (stateless)
- Seguridad robusta con hashing salt
- Estándar de la industria
- Fácil integración con frontends
- Tokens no revocables hasta expiración
- Overhead de verificación en cada request


## Middleware de Autenticación y Autorización

Se implementa middleware en capas para autenticación (JWT) y autorización (roles).

- `authenticate()` → verifica JWT y carga usuario
- `requireAdmin()` / `requireEmployee()` → valida roles específicos

- Separación clara de responsabilidades
- Reutilizable en múltiples rutas
- Validación automática de empresa (multi-tenant)
- Múltiples middleware por ruta protegida
- Dependencia fuerte de JWT en toda la aplicación


## Manejo de Errores Centralizado

Se implementa ErrorMiddleware global para manejo consistente de errores.

- Global error handler con `ResponseFactory`
- Manejo específico para `ZodError`, `JsonWebTokenError`, etc.
- Logging de errores para debugging

- Respuestas de error consistentes
- Logging centralizado de errores
- Manejo específico por tipo de error
- Posible pérdida de contexto específico del error
- Complejidad adicional en el stack de middleware


## Mappers para DTOs

Se decide implementar mappers explícitos para transformar entidades de dominio a DTOs de respuesta.

 Mappers estáticos en la capa de interfaces (`BenefitRequestMapper`)

- Control explícito sobre qué datos se exponen
- Transformación consistente de datos
- Desacoplamiento entre dominio y API responses
- Código adicional de transformación
- Posible duplicación de lógica de mapeo


## Configuración por Ambiente

Se implementa carga dinámica de archivos `.env` según `NODE_ENV`.

- `.env.development`, `.env`
- Variables específicas por ambiente

- Configuración flexible por ambiente
- Secrets separados por ambiente
- Fácil deployment en diferentes stages
- Múltiples archivos de configuración a mantener
- Posible inconsistencia entre ambientes


## Estrategia de tests
Se decide usar Vitest para testing con repositorios in-memory para aislamiento.

- Unit tests para entidades y casos de uso
- Repositorios in-memory para testing aislado
- Integration tests pendientes
- Tests rápidos y aislados
- No dependencia de base de datos real
- Fácil setup de datos de prueba
- Repositorios in-memory requieren mantenimiento

