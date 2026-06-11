# 🚴 CicloPorra — Porra del Tour de Francia

Aplicación web para gestionar la porra del Tour de Francia entre amigos/familia. Permite consultar la clasificación de los participantes, los ciclistas que tiene cada uno, el listado completo de corredores y el sistema de puntuación.

## 🔗 Acceso

👉 **https://javielio.github.io/CicloPorra**

## ✨ Funcionalidades

- **Clasificación general** (`/`) — ranking de participantes ordenado por puntos totales, con la etapa actual y la fecha de última actualización.
- **Detalle de participante** (`/participante/:id`) — ciclistas asignados a cada participante, sus maillots y puntos individuales.
- **Listado de ciclistas** (`/ciclistas`) — directorio completo de corredores con equipo, nacionalidad, maillots y puntuación.
- **Tabla de premios** (`/premios`) — sistema de puntuación: puntos por victorias de etapa, maillots, clasificación general, etc.

La app es **solo lectura**: los datos se actualizan editando los ficheros JSON del proyecto y haciendo push al repositorio.

## 🛠️ Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/) + TypeScript
- [React Router](https://reactrouter.com/) (`HashRouter`)
- Datos estáticos en JSON (sin backend ni base de datos)
- Despliegue automático a **GitHub Pages** mediante GitHub Actions

## 📂 Estructura

```
porra-tour/
├── src/
│   ├── components/   # Header, ClasificacionCard, CiclistaRow, MaillotBadge, TablaPremios...
│   ├── pages/         # ClasificacionPage, ParticipantePage, CiclistasPage, PremiosPage
│   ├── data/          # ciclistas.json, participantes.json, config.json, scoring.ts
│   └── styles/
└── .github/workflows/deploy.yml
```

## 💻 Desarrollo

```bash
cd porra-tour
npm install
npm run dev       # servidor de desarrollo
npm run build     # build de producción
npm run preview   # previsualizar el build
npm run lint      # linter
```

## 📝 Actualización de datos

1. Editar `src/data/ciclistas.json`, `participantes.json` y/o `config.json` (etapa actual, puntuación, logros, etc.).
2. Hacer commit y push a `main`.
3. GitHub Actions construye la app y la despliega automáticamente en GitHub Pages.

## 🚀 Despliegue

El workflow [`deploy.yml`](.github/workflows/deploy.yml) compila el proyecto con Vite y publica el contenido de `porra-tour/dist` en la rama `gh-pages` cada vez que se hace push a `main`.
