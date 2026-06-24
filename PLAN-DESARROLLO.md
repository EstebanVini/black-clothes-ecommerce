# Plan de Desarrollo — Black Clothes · Tienda de ropa (demo)

> Ecommerce de ropa **demo** que debe verse 100% real. Stack: **HTML + CSS + JavaScript puro** (sin frameworks, sin build, sin dependencias). Estética **idéntica** a `catan-assistant`: tema oscuro madera/noche, fondo océano con degradado radial + olas animadas, superficies de madera cálida sólidas, **dorado reservado** para marca/títulos/insignias, escala neutra cálida (arena↔nogal), tipografía display serif + sans del sistema, y sistema de movimiento estricto (solo `transform`/`opacity`, respeta `prefers-reduced-motion`).

## 1. Producto

**Marca:** Black Clothes — moda con alma artesanal. Editorial, premium, cálida.
**Idioma:** Español. **Moneda:** MXN.
**Medios:** imágenes y video de uso libre (Pexels/Unsplash), hotlink directo, verificados.

### Páginas (estáticas, multi-archivo)
| Archivo | Página | Contenido clave |
|---|---|---|
| `index.html` | Home | Hero con video, colecciones destacadas, novedades, tira editorial/lookbook, newsletter, footer |
| `tienda.html` | Catálogo | Grid de productos, filtros (categoría, talla, precio), orden, contador de resultados |
| `producto.html` | Detalle | Galería, selector de talla/color, cantidad, añadir al carrito, descripción, sugeridos (lee `?id=`) |
| `carrito.html` | Carrito | Líneas editables, resumen, cupón, checkout simulado, estado vacío |

### Estado y datos
- Catálogo en `js/data.js` (≈16 productos). Carrito en `localStorage`. Sin backend.

### Estructura de archivos
```
index.html  tienda.html  producto.html  carrito.html
css/  tokens.css  base.css  components.css  pages.css  motion.css
js/   data.js  cart.js  ui.js  main.js
docs/ briefs y especificaciones de cada agente
assets/ logo / iconos SVG locales
```

## 2. Pipeline de agentes

Flujo: **brief → sistema visual + copy (paralelo) → implementación → movimiento → QA.**
Cada agente recibe contexto completo (tokens de catán + marca + medios) porque no comparten mi contexto. La escritura de código se secuencia para evitar conflictos de archivos; los archivos de planeación van en paralelo.

```
ux-architect ─► ┌ visual-designer ┐ ─► ui-engineer ─► motion-engineer ─► qa-auditor
                └ ux-writer       ┘
```

### Asignaciones específicas por agente

#### 🧭 `ux-architect` — Arquitectura UX (sin código)
- Definir arquitectura de información y navegación de las 4 páginas.
- Diagramar los flujos: descubrir → ver producto → añadir → carrito → checkout (simulado).
- Especificar cada página: secciones, jerarquía, componentes necesarios, estados (vacío, error, primer uso, hover, agotado, oferta).
- Inventario de componentes reutilizables (nav, card de producto, badge, botón, selector de talla, line item, etc.).
- Casos extremos: carrito vacío, producto agotado, filtro sin resultados, imagen rota, JS deshabilitado.
- **Entrega:** `docs/01-brief-ux.md`. Indicar handoff a `visual-designer` y `ux-writer`.

#### 🎨 `visual-designer` — Sistema visual en código
- Adaptar **fielmente** los tokens de catán a la marca Black Clothes (paleta, superficies, dorado, neutros cálidos, sombras, tipografía display serif).
- Escribir `css/tokens.css` (custom properties: color, espaciado, radios, sombras, tipografía, z-index) y `css/base.css` (reset, fondo océano fijo + olas animadas, tipografía base, foco dorado, utilidades).
- Especificar el tratamiento visual de componentes (cards, botones, badges, nav) para guiar al `ui-engineer`.
- **Entrega:** `css/tokens.css`, `css/base.css`, `docs/02-sistema-visual.md`. Handoff a `ui-engineer`.

#### ✍️ `ux-writer` — Voz de marca, catálogo y copy
- Definir voz/tono de Black Clothes y glosario.
- Escribir `js/data.js`: ≈16 productos reales (nombre, categoría, precio MXN, colores, tallas, descripción editorial, materiales, badges, imágenes desde `docs/media-assets.json`).
- Redactar TODO el copy de UI: nav, hero, CTAs ("Añadir al carrito", "Finalizar compra"…), labels de filtros, estados vacíos/error, newsletter, footer, confirmaciones.
- **Entrega:** `js/data.js`, `docs/03-copy-deck.md`. Handoff a `ui-engineer`.

#### 🏗️ `ui-engineer` — Implementación (HTML/CSS/JS puro)
- Construir las 4 páginas HTML semánticas y accesibles consumiendo tokens + base + data + copy.
- Escribir `css/components.css` y `css/pages.css`.
- Escribir `js/cart.js` (estado + localStorage), `js/ui.js` (nav, filtros, galería, selector de talla, render de grid), `js/main.js` (init por página).
- Carrito persistente, filtros/orden funcionales, detalle dinámico por `?id=`, contador del carrito en el nav.
- **Reglas duras:** sin frameworks, sin emojis (iconos SVG), `min-height: 100dvh` en hero, sin código truncado, layouts centrados ~max 1400px.
- **Entrega:** `*.html`, `css/components.css`, `css/pages.css`, `js/*.js`. Handoff a `motion-engineer`.

#### ✨ `motion-engineer` — Movimiento
- Escribir `css/motion.css` y conectar hooks de animación en el HTML/JS ya construido.
- Scroll reveals (IntersectionObserver), hover de cards (imagen/zoom suave), transiciones de filtros, feedback de "añadir al carrito" (flyto/pulse), micro-interacciones de botones, header al hacer scroll.
- Solo `transform`/`opacity`; 150–400 ms; stagger en grids; `prefers-reduced-motion` siempre.
- **Entrega:** `css/motion.css` + ediciones puntuales de hooks. Handoff a `qa-auditor`.

#### 🔍 `qa-auditor` — Auditoría final y correcciones
- Auditar a11y (WCAG AA, foco, teclado, alt, contraste), performance (lazy loading de imágenes, CWV, sin layout thrashing), responsive (mobile-first, sin overflow, touch targets ≥44px), theming y anti-patrones.
- Corregir P0/P1 directamente; documentar P2/P3.
- **Entrega:** `docs/04-qa-reporte.md` + correcciones. Veredicto de "listo para demo".

## 3. Orquestación

1. **Fase 0 (orquestador):** andamiaje + sourcing de medios verificados (`docs/media-assets.json`) + este plan. ✅ en curso
2. **Fase 1:** `ux-architect` → brief.
3. **Fase 2 (paralelo):** `visual-designer` (sistema visual) ‖ `ux-writer` (catálogo + copy).
4. **Fase 3:** `ui-engineer` → implementación completa.
5. **Fase 4:** `motion-engineer` → movimiento.
6. **Fase 5:** `qa-auditor` → auditoría + fixes.
7. **Cierre (orquestador):** verificación, ajustes finales, resumen.

## 4. Criterios de éxito
- Se ve como una tienda real, no como demo de IA.
- Estética fiel a catán: océano + madera + dorado + serif display.
- Funciona: navegar, filtrar, ver detalle, añadir/editar carrito, checkout simulado — todo en HTML/CSS/JS puro.
- Responsive, accesible (WCAG AA), 60fps, respeta `prefers-reduced-motion`.
- Imágenes y video reales cargando correctamente.
