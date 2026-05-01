# Ascension Engine Backend

Scalable Node.js backend initialized with:

- TypeScript
- Express
- Clean architecture boundaries
- MVC-style HTTP delivery layer
- Lean dependency footprint

## Structure

```text
src/
  app.ts
  server.ts
  config/
  core/
  interfaces/
    http/
      middlewares/
      routes/
      utils/
  modules/
    system/
      application/
      domain/
      infrastructure/
      interfaces/
```

## Current endpoints

- `GET /health`
- `GET /api/v1/systems/current`
- `PATCH /api/v1/systems/theme`

## Theme update payload

```json
{
  "theme": "crimson"
}
```

Valid values are `crimson` and `violet`.
