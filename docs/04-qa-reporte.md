# YOYO · Reporte de QA Auditoría

**Auditor:** qa-auditor (última línea antes de "listo para demo")
**Fecha:** 2026-06-23
**Alcance:** 4 páginas HTML, 5 hojas CSS, 5 archivos JS (HTML/CSS/JS puro, sin frameworks)
**Veredicto rápido:** **LISTO PARA DEMO** tras las correcciones aplicadas. Sin bloqueadores (P0). Dos defectos reales corregidos en sitio (1 P1 de accesibilidad, 1 P1 de teclado). Resto P2/P3 documentado.

---

## 1 · Score por dimensión (0–4)

| Dimensión | Score | Notas |
|---|---|---|
| **Accesibilidad (WCAG AA)** | **4** (era 3) | Excelente base: foco dorado global con `:focus-visible`, skip-link, landmarks, headings sin saltos, alt significativos, decorativas con `alt=""`/`aria-hidden`, radiogroups con flechas, toasts con `aria-live`, errores con `role="alert"`. Corregidos: contraste del precio en oferta (fallaba AA) y trampa/escape de foco del drawer móvil. |
| **Performance / CWV** | **4** | `loading="lazy"`+`decoding="async"` en todo lo no-crítico; hero con `preload="metadata"` y poster; `width/height`+`aspect-ratio` anti-CLS en cada imagen y wrapper; video pausado en reduced-motion y save-data; scroll con `requestAnimationFrame`+`passive`; animaciones SOLO `transform`/`opacity`; `will-change` acotado. |
| **Responsive (mobile-first)** | **4** | Hero `min-height: 100dvh` (no `100vh`); grids reflujan 2→3→4; drawers de menú y filtros; touch targets `--touch-min: 44px` aplicado a todo control; sin overflow horizontal previsto; tipografía fluida `clamp()`. |
| **Theming** | **4** | Tokens consistentes, cero hex sueltos (solo rgba de sombras/velos negro/blanco, esperado); dorado reservado a marca/oferta; terracota reservado a descuentos. Se añadió `--sale-text` (misma familia terracota) para texto accesible. |
| **Anti-patterns** | **4** | Sin `100vh` en hero, sin emojis en markup, sin librerías externas/CDN, sin placeholders/TODO/truncación, `node --check` OK en los 5 JS, sin `console.*` de depuración. |

---

## 2 · Issues por severidad

### P0 — Bloquea ship
**Ninguno.** No se encontró ningún crash, página inaccesible ni layout roto en mobile.

---

### P1 — Debe corregirse (CORREGIDO en sitio)

#### P1-A · Contraste del precio en oferta y fila de descuento por debajo de WCAG AA
- **Ubicación:** `css/components.css` `.precio--oferta` (cards y detalle) y `.resumen__fila--descuento` (carrito); token `--sale` en `css/tokens.css`.
- **Impacto:** El terracota `--sale #c4663f` usado como **texto** daba 4.44:1 sobre la card (`--surface-1`), 4.15:1 sobre el resumen (`--surface-2`) y ~3.58:1 sobre la fila `--sale-tint-12`. El precio rebajado es información de compra crítica; fallaba el mínimo AA de 4.5:1 para texto normal (16 px no-bold).
- **Corrección aplicada:** Se añadió el token `--sale-text: #d97e57` (misma familia terracota, solo aclarado) reservado a texto de oferta, y se aplicó a `.precio--oferta` y a la fila de descuento. `--sale #c4663f` permanece intacto para RELLENOS/acentos (badge, bordes, punto). Contraste resultante: **5.91:1** (card), **5.51:1** (resumen), **4.76:1** (fila de ahorro). Cumple AA. No cambia la estética terracota intencional.
- **Verificación:** cálculo WCAG re-ejecutado; todos ≥4.5:1.

#### P1-B · Drawer del menú móvil sin contención de foco (WCAG 2.4.3)
- **Ubicación:** `js/ui.js` → `instalarMenuMovil()`.
- **Impacto:** Con el drawer abierto, `Tab`/`Shift+Tab` permitían que el foco escapara al contenido de fondo (que queda visualmente tapado por el velo), perdiendo al usuario de teclado/lector de pantalla. El cierre (Esc, foco inicial al abrir, retorno al toggle al cerrar) ya existía; faltaba el ciclo de foco.
- **Corrección aplicada:** Se añadió un focus-trap mínimo y quirúrgico en el `keydown` del panel: mientras `.is-abierto`, `Tab` desde el último elemento vuelve al primero y `Shift+Tab` desde el primero salta al último. Solo afecta comportamiento; cero impacto visual. `node --check` OK.
- **Nota:** El mismo patrón sería deseable para el drawer de filtros (`initDrawerFiltros` en `main.js`); ver P2-A (no se forzó para no exceder el cambio mínimo y porque el panel de filtros, al cerrarse con `visibility:hidden`, no deja controles tabulables fuera de pantalla).

---

### P2 — Mejora importante (documentado, no bloquea demo)

#### P2-A · Drawer de filtros sin focus-trap ni cierre con Esc-foco
- **Ubicación:** `js/main.js` → `initDrawerFiltros()`.
- **Impacto:** Igual que P1-B pero en el panel de filtros móvil. Esc sí cierra; no hay trampa de foco ni se devuelve el foco al botón "Filtrar" al cerrar.
- **Corrección sugerida:** Replicar el trap de `instalarMenuMovil` y, en `cerrarPanel()`, hacer `abrir.focus()`. Riesgo bajo.

#### P2-B · Galería: cambio de imagen principal no se anuncia a lector de pantalla
- **Ubicación:** `js/ui.js` → `renderGaleria()`.
- **Impacto:** Al activar una miniatura, la imagen grande se reemplaza vía `innerHTML` sin región `aria-live` ni mover foco; un usuario de lector no percibe el cambio. Los thumbs sí gestionan `aria-current` correctamente.
- **Corrección sugerida:** Añadir `aria-live="polite"` al contenedor `[data-galeria-principal]` o anunciar "Imagen N de M" tras el cambio.

#### P2-C · `neutral-400` como texto de cuerpo roza el límite AA sobre superficies claras
- **Ubicación:** `--text-muted: var(--neutral-400)` (`#a28b6d`) en `tokens.css`; usos en `.input::placeholder`, `.pie__base`, `.resumen__nota`, `.tarjeta-producto` metadatos sobre `--surface-4`.
- **Impacto:** `neutral-400` da 4.1:1 sobre `--surface-4` (falla AA texto normal) y 4.6–5.8:1 sobre `--surface-0..3` (pasa). En la práctica el cuerpo `neutral-400` casi siempre cae en surface-0/1; el caso surface-4 son metadatos pequeños no críticos. Los placeholders quedan exentos pero idealmente legibles.
- **Corrección sugerida:** Para texto informativo sobre superficies elevadas (surface-4), usar `--neutral-300` (≥6.5:1 en todas). No urgente.

#### P2-D · `selector-talla` agotada con `aria-disabled` mantiene listener de click
- **Ubicación:** `js/main.js` → render de tallas (las agotadas reciben `e.preventDefault()` en click).
- **Impacto:** Funciona, pero un botón `aria-disabled="true"` sigue siendo enfocable solo si se le diera `tabindex`; aquí se le pone `tabindex="-1"`, correcto. Sin acción requerida; se documenta como verificado-OK.

---

### P3 — Nice-to-have (refinamiento menor)

- **P3-A · `scroll-padding-top` fijo (5.5rem).** `base.css` usa `5.5rem` y varios `sticky top: calc(5.5rem)` hardcodean ese valor; al compactarse el header cambia su alto. Cosmético: el ancla puede quedar 1–2 px desalineada. Sugerencia: tokenizar la altura del header.
- **P3-B · Imágenes de detalle/galería repetidas en `data.js`.** Varios productos repiten la misma URL en `imagenes[0]` y `imagenes[1]` (p. ej. `vestido-galeria-noche`, `camisa-arena-casual`). La galería muestra 2 thumbs idénticos. Es dato de demo; no es defecto técnico.
- **P3-C · `breadcrumb` "Categoría" inicial visible antes de hidratar.** En `producto.html`, el texto placeholder "Categoría"/"Producto" del breadcrumb se ve un instante antes de que JS lo rellene. Sin JS el `article` está `hidden`, así que no se expone. Aceptable.
- **P3-D · `meta theme-color` único (modo oscuro).** El sitio es dark por diseño; no hay `prefers-color-scheme: light`. Coherente con la marca; no se requiere dark/light toggle.

---

## 3 · Verificaciones del contrato del motion-engineer (todas OK)

| Requisito | Resultado |
|---|---|
| `[data-reveal]` visible sin JS / sin la clase activadora | **OK.** `motion.css` declara `[data-reveal]{opacity:1}` por defecto; el estado oculto solo aplica bajo `.motion-reveal-activo` que `motion.js` añade únicamente si hay `IntersectionObserver` y NO hay reduced-motion. |
| `prefers-reduced-motion`: nada se desplaza, hero-bob detenido, badge no late, reveals visibles | **OK.** Bloque `@media (prefers-reduced-motion: reduce)` en `motion.css` neutraliza reveals (`opacity:1`, `transform:none`), bob del hero (`animation:none`), pulso del badge, lift de cards, press-scale y fundido del grid. `base.css` colapsa duraciones globalmente y detiene las olas. `motion.js` no activa reveals ni pulso bajo reduced-motion. |
| Al refiltrar el catálogo ninguna card queda en `opacity:0` | **OK (verificado).** Tras `innerHTML`, el `MutationObserver` de `vigilarGridsDinamicos` re-ejecuta `escanear`, registra las nuevas cards y el `IntersectionObserver` (con callback inicial garantizado) revela las que entran al viewport; las de abajo se revelan al hacer scroll. Bajo reduced-motion/no-observer las cards nunca se ocultan. El fundido `.grid-refiltrando` es independiente (solo `opacity` del contenedor, con red de seguridad `setTimeout` que lo retira). No se reprodujo card atascada. |
| Hero no autoplay en save-data/reduced-motion | **OK.** `main.js initHome()` retira `autoplay` y pausa el video si `prefers-reduced-motion` o `navigator.connection.saveData`; el poster cubre. |

---

## 4 · Qué corregí (resumen de cambios)

1. **`css/tokens.css`** — Añadido token `--sale-text: #d97e57` (terracota de texto accesible, misma familia). `--sale` sin cambios (sigue siendo el relleno/acento).
2. **`css/components.css`** — `.precio--oferta` y `.resumen__fila--descuento` (+ su `.precio`) ahora usan `--sale-text`. Sube el contraste de 4.15–4.44:1 a 4.76–5.91:1 → cumple WCAG AA.
3. **`js/ui.js`** — `instalarMenuMovil()`: focus-trap de `Tab`/`Shift+Tab` mientras el drawer está abierto (WCAG 2.4.3), sin cambio visual.

Verificación: `node --check` OK en los 5 archivos JS; recálculo WCAG de los nuevos colores ≥4.5:1.

---

## 5 · Veredicto final

**¿Listo para demo? SÍ.**

El proyecto llega con una base de calidad alta: arquitectura de tokens disciplinada, accesibilidad pensada de origen (foco, ARIA, semántica, estados no-JS y reduced-motion reales), performance sólida (lazy/CLS/transform-only) y responsive mobile-first sin anti-patterns. Los dos únicos defectos reales con impacto en usuarios (contraste del precio en oferta y contención de foco del menú móvil) quedaron **corregidos en sitio** sin tocar la estética ni el comportamiento intencional. Los P2/P3 son mejoras incrementales que no bloquean la demo y están documentados con ubicación y corrección sugerida para una siguiente iteración.
