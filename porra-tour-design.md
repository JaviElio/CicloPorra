# Porra Tour de Francia — Documento de Diseño

## 1. Descripción General

Web app estática para gestionar una porra del Tour de Francia entre amigos/familia (menos de 10 participantes). Permite consultar la clasificación de participantes, los ciclistas asignados a cada uno y el listado completo de corredores con su información detallada.

**Naturaleza de la app:** Solo lectura para los usuarios. Los datos se actualizan manualmente (edición de JSON o script Python) y se despliegan via push al repositorio.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Motivo |
|---|---|---|
| Frontend | React + Vite | Ligero, rápido de desarrollar, ideal para apps pequeñas |
| Datos | JSON estático en el repo | Sin backend, sin base de datos, fácil de editar |
| Hosting | GitHub Pages | Gratuito, sin servidor, despliegue automático con push |
| Actualización (opcional) | Script Python + GitHub Actions | Para automatizar scraping de resultados del Tour |
| Estilos | CSS Modules o Tailwind CSS | A decidir según preferencia |

**No se requiere backend ni base de datos.**

---

## 3. Estructura de Datos (JSON)

### 3.1 `ciclistas.json`

```json
[
  {
    "dorsal": 1,
    "nombre": "Tadej Pogačar",
    "equipo": "UAE Team Emirates",
    "nacionalidad": "Eslovenia",
    "participante_id": "alice",
    "redes_sociales": {
      "twitter": "https://twitter.com/tadejpogacar",
      "instagram": "https://instagram.com/tadejpogacar"
    },
    "puntos": 45,
    "logros": {
      "victorias_etapa": 3,
      "etapa_reina": true,
      "clasificacion_general": true,
      "maillot_amarillo": true,
      "maillot_verde": false,
      "maillot_polka": false,
      "maillot_blanco": false
    }
  }
]
```

### 3.2 `participantes.json`

```json
[
  {
    "id": "alice",
    "nombre": "Alice",
    "avatar": "🚴",
    "ciclistas_dorsales": [1, 14, 27, 53, 88],
    "puntos_total": 0
  }
]
```
> Nota: `puntos_total` puede calcularse en tiempo de ejecución sumando los puntos de los ciclistas asignados, o precalcularse en el JSON.

### 3.3 `config.json`

```json
{
  "edicion": 2025,
  "etapa_actual": 12,
  "total_etapas": 21,
  "ultima_actualizacion": "2025-07-15T18:00:00Z",
  "puntuacion": {
    "victoria_etapa": 10,
    "etapa_reina": 15,
    "top3_etapa": 5,
    "clasificacion_general": 30,
    "maillot_amarillo_dia": 2,
    "maillot_verde_dia": 2,
    "maillot_polka_dia": 2,
    "maillot_blanco_dia": 2
  }
}
```

---

## 4. Estructura del Proyecto

```
porra-tour/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/           # Imágenes, logos
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ClasificacionCard.jsx
│   │   ├── CiclistaRow.jsx
│   │   └── MaillotBadge.jsx
│   ├── pages/
│   │   ├── Clasificacion.jsx    # Vista principal: ranking de participantes
│   │   ├── Participante.jsx     # Vista detalle de un participante y sus ciclistas
│   │   └── Ciclistas.jsx        # Listado completo por dorsal
│   ├── data/
│   │   ├── ciclistas.json
│   │   ├── participantes.json
│   │   └── config.json
│   ├── App.jsx
│   └── main.jsx
├── scripts/
│   └── update_puntos.py         # Script opcional de actualización/scraping
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions: build + deploy a GitHub Pages
├── index.html
├── vite.config.js
└── package.json
```

---

## 5. Páginas y Vistas

### 5.1 Clasificación General (`/`)

**Propósito:** Vista principal. Muestra el ranking de participantes de la porra ordenados por puntos totales.

**Contenido:**
- Cabecera con nombre de la porra, edición del Tour y etapa actual
- Tarjeta por participante con:
  - Posición en el ranking (1º, 2º, 3º...)
  - Nombre y avatar
  - Puntos totales
  - Número de ciclistas asignados
- Al hacer clic en un participante → navega a su vista de detalle
- Indicador de última actualización

---

### 5.2 Detalle de Participante (`/participante/:id`)

**Propósito:** Ver los ciclistas asignados a un participante y sus puntos individuales.

**Contenido:**
- Nombre del participante y puntos totales
- Tabla/lista de ciclistas asignados con:
  - Dorsal
  - Nombre
  - Equipo
  - Maillots actuales (iconos/badges)
  - Puntos acumulados
  - Desglose de logros (victorias etapa, clasificación general, etc.)

---

### 5.3 Listado de Ciclistas (`/ciclistas`)

**Propósito:** Directorio completo de todos los corredores del Tour, ordenado por dorsal.

**Contenido:**
- Buscador/filtro por nombre, equipo, participante o nacionalidad
- Tabla con:
  - Dorsal
  - Nombre
  - Equipo
  - Nacionalidad (con bandera emoji)
  - Participante de la porra al que pertenece
  - Maillots actuales (badges de colores)
  - Puntos
  - Links a redes sociales (iconos)
- Ordenación por columnas (dorsal, puntos, nombre)

---

## 6. Sistema de Puntuación

Los puntos se definen en `config.json` y son configurables. Ejemplo orientativo:

| Logro | Puntos |
|---|---|
| Victoria de etapa | 10 |
| Victoria etapa reina | 15 |
| Top 3 en etapa | 5 |
| Clasificación general final | 30 |
| Maillot amarillo (por día) | 2 |
| Maillot verde (por día) | 2 |
| Maillot de la montaña (por día) | 2 |
| Maillot blanco (por día) | 2 |

> El sistema de puntuación puede ajustarse antes del Tour editando `config.json`.

---

## 7. Actualización de Datos

### Opción A — Manual (mínimo esfuerzo)
1. Editar `ciclistas.json` tras cada etapa
2. `git add . && git commit -m "Etapa 12 actualizada" && git push`
3. GitHub Actions despliega automáticamente

### Opción B — Script Python
```bash
python scripts/update_puntos.py
# Genera/actualiza ciclistas.json con los resultados del día
git add src/data/ciclistas.json
git commit -m "Auto: resultados etapa 12"
git push
```

### Opción C — GitHub Actions automático (avanzado)
- Cron job diario que ejecuta el script de scraping
- Hace commit automático si hay cambios
- Dispara el redeploy de GitHub Pages

---

## 8. Navegación

```
Header (siempre visible)
├── 🏆 Clasificación  →  /
├── 🚴 Ciclistas      →  /ciclistas
└── [Nombre tour] + etapa actual (solo informativo)
```

---

## 9. Consideraciones de Diseño UI

- **Tema:** Inspirado en el Tour de Francia (amarillo, rojo, blanco)
- **Responsive:** Debe funcionar bien en móvil (se consulta desde el teléfono)
- **Sin login:** App pública, solo lectura
- **Sin paginación compleja:** El número de ciclistas (~180) y participantes (<10) es manejable en una sola página con filtros
- **Maillots:** Representar con badges de colores (amarillo, verde, blanco, rojo/blanco lunar)

---

## 10. Despliegue en GitHub Pages

1. Crear repositorio en GitHub
2. Configurar `vite.config.js` con el `base` correcto:
   ```js
   export default defineConfig({
     base: '/nombre-del-repo/',
   })
   ```
3. Añadir workflow `.github/workflows/deploy.yml` con build + deploy a rama `gh-pages`
4. Activar GitHub Pages en Settings → Pages → rama `gh-pages`

---

## 11. Futuras Mejoras (fuera de alcance inicial)

- Historial de puntuación etapa a etapa (gráfica de evolución)
- Notificaciones (difícil sin backend)
- Panel de admin protegido con contraseña para editar datos desde la web
- Soporte para múltiples porras/años
- Modo oscuro

---

*Documento generado como referencia para el desarrollo. Actualizar si cambian requisitos.*
