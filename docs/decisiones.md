# Decisiones Técnicas

## Entidades de Dominio

### Benefit como Entidad Principal [2024-03-19]

**Contexto:**
Durante el desarrollo inicial, se identificó que el sistema estaba modelado alrededor de `BenefitRequest` sin tener una entidad que represente los beneficios en sí mismos.

**Decisión:**
Se decide crear una entidad `Benefit` como parte fundamental del dominio por las siguientes razones:
1. Permite gestionar un catálogo de beneficios disponibles
2. Facilita la categorización de beneficios (cursos, licencias, viandas, coworking)
3. Hace el sistema más escalable para futuros tipos de beneficios
4. Proporciona una referencia clara en las solicitudes
5. Permite agregar metadatos específicos a cada tipo de beneficio

**Consecuencias:**
- Positivas:
  - Mayor flexibilidad para agregar nuevos tipos de beneficios
  - Mejor organización y categorización de beneficios
  - Posibilidad de agregar reglas específicas por tipo de beneficio
  - Facilita la implementación de filtros y búsquedas
- Negativas:
  - Agrega complejidad adicional al modelo de dominio
  - Requiere mantener un catálogo de beneficios actualizado

**Estado:** Aceptada 