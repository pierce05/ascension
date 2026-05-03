# Ascension Engine Backend

Scalable Node.js backend initialized with:

- TypeScript
- Express
- Clean architecture boundaries
- MVC-style HTTP delivery layer
- Lean dependency footprint
- File-backed MVP persistence

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
- `POST /api/v1/systems/quests`
- `POST /api/v1/systems/quests/:questId/complete`
- `POST /api/v1/systems/bosses`
- `POST /api/v1/systems/shop/:itemId/purchase`
- `POST /api/v1/systems/events/dismiss`
- `POST /api/v1/systems/reset`

## Theme update payload

```json
{
  "theme": "crimson"
}
```

Valid values are `crimson` and `violet`.

## Persistence

The MVP now persists state to `data/system-state.json` by default.

You can override the file location with:

```env
STATE_FILE_PATH=C:\path\to\system-state.json
```

## Reset endpoint

Use this when you want to restore the seed state during testing:

```http
POST /api/v1/systems/reset
```
