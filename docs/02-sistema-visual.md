# 02 · Sistema Visual — Black Clothes

> **Autor:** visual-designer · **Fase:** 2 · **Estado:** listo para handoff a `ui-engineer`
> **Entregables:** `css/tokens.css`, `css/base.css`, este documento.
> **Fuente de verdad de tokens:** `css/tokens.css`. Esta guía dice **cómo usarlos**; los valores viven solo ahí.

Adaptación **fiel** de la estética de `catan-assistant` (océano + madera + dorado reservado + neutros cálidos arena↔nogal) a una tienda de moda premium/editorial. Los hex, sombras, texturas, el SVG de olas y los keyframes son los **reales** de catán, verificados contra su `index.css` y `tailwind.config.js`.

---

## 0. Cómo cargar el sistema

En el `<head>` de **cada** página, en este orden:

```html
<link rel="stylesheet" href="css/tokens.css">   <!-- variables :root -->
<link rel="stylesheet" href="css/base.css">      <!-- reset, océano, foco, utilidades -->
<link rel="stylesheet" href="css/components.css"> <!-- (lo escribe ui-engineer) -->
<link rel="stylesheet" href="css/pages.css">      <!-- (lo escribe ui-engineer) -->
<link rel="stylesheet" href="css/motion.css">     <!-- (lo escribe motion-engineer) -->
```

`base.css` ya hace `@import "tokens.css"` por seguridad, pero el orden explícito de `<link>` es lo correcto y evita el bloqueo de render del `@import`.

---

## 1. Convención de nombres (decisión)

- **Tokens (`--variables`):** en **inglés** (`--surface-2`, `--gold`, `--neutral-100`, `--sale`). Hereda de catán, nombres técnicos cortos.
- **Clases utilitarias de marca:** en **español** (`.contenedor`, `.titulo-display`, `.titulo-dorado`, `.eyebrow`, `.texture-wood`, `.precio`, `.nums`).
- **Clases de componentes (las creas tú, ui-engineer):** español, en *kebab-case* (`.tarjeta-producto`, `.boton`, `.selector-talla`, `.chip-filtro`, `.linea-carrito`). Mantén un solo idioma por capa.
- **Contenido de UI:** español (México).

---

## 2. Las tres leyes no negociables

1. **Nada de texto/controles sobre el océano.** El océano es solo ambiente (fondo fijo del `body`). Todo contenido vive dentro de un `.contenedor` y sobre una **superficie de madera sólida** (`--surface-1..4`). Única excepción: el **hero**, donde el video va sobre el océano pero el texto se apoya en un **velo sólido** (`--hero-veil`), nunca sobre el video crudo.
2. **Dorado reservado.** `--gold-light / --gold / --gold-deep` solo para: logo Black Clothes, títulos display destacados, **badge de oferta** (único relleno dorado permitido, y pequeño), insignias y el **anillo de foco**. **Jamás** como relleno de botones grandes ni áreas extensas.
3. **Terracota (`--sale`) solo para ofertas.** Es el único color funcional añadido. Aparece exclusivamente en el precio rebajado y la etiqueta de porcentaje. No lo uses para errores, enlaces ni nada más.

---

## 3. Jerarquía tipográfica

Display **serif** (`--font-display`) para títulos, marca y precios destacados; **sans** del sistema (`--font-sans`) para cuerpo, labels y UI; **mono** (`--font-mono`) para precios/números con tabular-nums.

| Rol | Familia | Token de tamaño | Color | Notas |
|---|---|---|---|---|
| Título de **hero** | serif | `--fs-display-hero` | `--gold-light` (sobre velo) o `--neutral-50` | `text-wrap: balance`; usa `.titulo-display` + `.titulo-dorado` si es marca |
| **H1** de página ("Tienda", "Tu bolsa") | serif | `--fs-display-1` | `--neutral-50` | un solo H1 por página |
| **H2** de sección ("Novedades", "Colecciones") | serif | `--fs-display-2` | `--neutral-50` | precede de un `.eyebrow` dorado opcional |
| **H3** / nombre de producto en detalle | serif | `--fs-display-3` | `--neutral-50` | |
| Nombre de producto en **card** | sans | `--fs-md` (semibold) | `--neutral-100` | serif solo en piezas grandes; en grids el sans rinde mejor a tamaño pequeño |
| **Lead** / subtítulo | sans | `--fs-md` | `--neutral-200` | `--lh-snug` |
| **Cuerpo** | sans | `--fs-base` | `--neutral-100` | `--lh-normal`; medida ≤68ch |
| **Label / metadato** | sans | `--fs-sm` | `--neutral-300` | |
| **Caption / badge** | sans | `--fs-xs` | según badge | mayúsculas con `--tracking-wider` para "NOVEDAD" |
| **Eyebrow / kicker** | sans | `--fs-xs` | `--gold` | versalitas, `.eyebrow` |
| **Precio** (normal) | mono | `--fs-lg` | `--neutral-50` | `.precio`, tabular |
| **Precio grande** (detalle) | mono | `--fs-xl` | `--neutral-50` | |
| **Precio rebajado** | mono | igual al precio | `--sale` | el precio anterior va tachado en `--neutral-400` |

Reglas:
- **No saltar niveles de heading** (h1→h2→h3) por motivos de tamaño; usa utilidades para el tamaño, no headings semánticos incorrectos.
- El dorado tipográfico **permanente** del chrome se limita al **logo**. Títulos de sección normales van en `--neutral-50`; el dorado de títulos se reserva al hero y a hitos (confirmación de compra).
- Precios siempre con `.precio` o `.nums` (tabular) para que no "bailen" al cambiar cantidad.

---

## 4. Superficies y elevación

Pinta cada nivel con su color sólido + sombra. La **veta de madera** (`.texture-wood`) se añade encima del color en paneles grandes (no en chips minúsculos).

| Token | Uso típico | Sombra sugerida |
|---|---|---|
| `--surface-0` | raíz de página bajo el contenido (`<main>`) | — |
| `--surface-1` | secciones, **footer**, **card de producto**, drawer | `--shadow-card` |
| `--surface-2` | **panel de compra**, **resumen** del carrito, **line item**, header | `--shadow-soft` / `--shadow-card` |
| `--surface-3` | **inputs**, **chips**, **botón secundario**, selectores | `--shadow-wood` |
| `--surface-4` | **chip activo**, swatch seleccionado, estados fuertes | `--shadow-wood` |

- **Bordes:** `--border-subtle / --border-default / --border-strong` (hairlines cálidos translúcidos). Un hairline `--border-default` separa superficies del mismo nivel.
- **Elevación al hover** (cards): cambia a `--shadow-card-hover` y desplaza la imagen con `transform: scale()` **dentro** de un contenedor con `overflow:hidden` — **nunca** muevas el layout de la card.
- Aplica `.texture-wood` a: footer, panel de compra, resumen, cards de colección grandes, drawer de filtros, empty states. Mantenla sutil (los rgba ya están calibrados al ~1.6% y 5%).

---

## 5. Tratamiento por componente (inventario del brief §4)

> Para cada uno: superficie, color, foco, y los estados clave. El comportamiento lo define el brief; aquí va el **look**.

### Header / nav sticky
- `position: sticky; top: 0; z-index: var(--z-header)`. Fondo `--surface-2` + `.texture-wood`, hairline inferior `--border-default`.
- **Logo Black Clothes:** `.titulo-display` + `.titulo-dorado`, serif, `--gold-light`. Único dorado permanente del chrome.
- **Nav primaria:** sans, `--neutral-200`; hover → `--neutral-50`. **Ítem activo:** subrayado fino dorado (`box-shadow: 0 2px 0 var(--gold)` o `border-bottom: 2px solid var(--gold)`), o peso `--weight-semibold`.
- **Scrolled (compacto):** reduce padding vertical y sube a `--shadow-header`. Es un *hook* para motion-engineer; el estado lo activa una clase (p. ej. `.is-scrolled`) — define ambas variantes en CSS.
- **Móvil:** botón `☰` (44×44) abre drawer sobre `--surface-1` a pantalla con velo `--z-overlay`. Carrito siempre visible a la derecha.

### Badge contador de carrito
- Píldora `--radius-pill`, fondo `--gold`, texto `--text-on-gold` (oscuro), `--fs-xs`, `.nums` tabular. Tamaño mínimo 18px, centrado.
- **0 → oculto** (no renderizar "0"). **99+ → "9+"**. Micro-pulso al incrementar = *hook* de motion (`transform: scale`).

### Botón primario
- **El relleno es madera, no dorado.** Superficie `--surface-4` (o degradado sutil `--surface-3`→`--surface-4`), texto `--neutral-50` semibold, `--radius-sm`, `--shadow-cta` (glow cálido dorado tenue + relieve), borde superior `--border-strong`. Padding mínimo para `--touch-min`.
- `:hover` → leve aclarado de la superficie + `transform: translateY(-1px)` (hook motion). `:active` → `translateY(0)` y sombra más corta.
- `:focus-visible` → ya cubierto globalmente por `--focus-ring` (no lo quites).
- `:disabled` → `opacity: var(--disabled-opacity)`, `cursor: not-allowed`, sin sombra de glow. Usado por "Añadir al carrito" hasta elegir talla.
- **loading "Añadiendo…":** mismo botón, spinner inline o cambio de label; no cambies su ancho (evita salto).

### Botón secundario
- Superficie `--surface-3`, texto `--neutral-100`, borde `--border-default`, `--shadow-wood`. Hover → borde `--border-strong` + texto `--neutral-50`. Sin glow dorado.

### Botón de texto / link
- Sin fondo. Color `--neutral-200`; hover → `--neutral-50` con subrayado (`text-decoration: underline; text-underline-offset: 0.2em`). Foco dorado global. Para "Limpiar filtros", "Guía de tallas", breadcrumb.

### Product card
- Contenedor `--surface-1` + `.texture-wood`, `--radius-md`, `--shadow-card`, `overflow: hidden`. Imagen arriba (relación ~3:4 retrato, `object-fit: cover`), info abajo con padding `--space-4`.
- Nombre: sans `--fs-md` `--neutral-100`. Categoría/metadato: `--fs-sm` `--neutral-300`. Precio: `.precio` `--neutral-50`.
- **Hover:** `--shadow-card-hover` + zoom suave de la imagen (`scale(1.04)` dentro del `overflow:hidden`). Revelado opcional de "Ver prenda". **No mover layout.**
- **Foco teclado:** card enfocable (`tabindex` o enlace que envuelve), anillo dorado global; toda la card activable con Enter.
- **Con badge:** badge posicionado `absolute` arriba-izquierda sobre la imagen (ver Badge).
- **Agotado:** imagen a `opacity: var(--disabled-opacity)`, sin hover de zoom, badge "Agotado". Sigue enlazando al detalle.
- **Imagen rota:** placeholder de marca (ver §6).

### Card de colección (Home, variante grande)
- Igual base pero `--radius-xl`, full-bleed de imagen con velo inferior (`--hero-veil` recortado) y **título serif** (`--fs-display-3`) sobreimpreso en `--neutral-50`. Hover: zoom de imagen + leve aclarado del velo. Es la única card con título serif sobre imagen (siempre con velo para contraste AA).

### Badge
Tres variantes, todas `--radius-xs` o pill, `--fs-xs`, mayúsculas con `--tracking-wider`, padding `--space-1 --space-2`:
- **`novedad`** — neutro cálido/madera: fondo `--surface-4`, texto `--neutral-100`, hairline `--border-default`. Discreto.
- **`oferta`** — **dorado** (único relleno dorado pequeño permitido): fondo `--gold`, texto `--text-on-gold`, `--shadow-medal` (aro interior dorado). Puede incluir "−20%".
- **`agotado`** — apagado/nogal: fondo `--surface-2`, texto `--neutral-500`, sin brillo.

### Selector de talla
Grupo tipo radio. Cada talla = botón cuadrado ≥44×44, `--surface-3`, texto `--neutral-200`, `--radius-sm`, hairline `--border-default`.
- **hover:** borde `--border-strong`, texto `--neutral-50`.
- **seleccionado:** fondo `--surface-4`, texto `--neutral-50`, **borde `1px var(--gold)`** (anillo de marca, no dorado de relleno).
- **agotado para esa talla:** `opacity: var(--disabled-opacity)`, tachado diagonal (línea `--neutral-600`), no seleccionable, `aria-disabled`.
- **focus:** anillo dorado global. **grupo con error:** borde del grupo `--sale`… **no** — usa un tono de advertencia neutro: hairline `--border-strong` + mensaje inline en `--neutral-200` (reserva terracota para ofertas). El mensaje "Elige una talla" va debajo en `--fs-sm` `--neutral-100`, con `aria-live`.

### Selector de color (swatches)
- Círculo `--radius-circle`, ≥28px (target táctil envuelto en hit-area ≥44px), color real de la prenda como fondo, hairline `--border-default` para colores claros.
- **seleccionado:** anillo dorado exterior (`box-shadow: 0 0 0 2px var(--surface-2), 0 0 0 4px var(--gold)`).
- **hover:** halo `--gold-tint-16`. **agotado:** atenuado + diagonal. **focus:** anillo dorado global.

### Stepper de cantidad
- Tres celdas: `−` / valor / `+`. Botones `--surface-3`, `--radius-sm` (extremos) o circular, `--shadow-wood`, ≥44×44. Valor en `.nums` tabular `--neutral-50`, centrado.
- `−` deshabilitado en mínimo (1); `+` deshabilitado en stock máx (`opacity` + `cursor`). Entrada manual validada (numérica). Foco dorado.

### Chip de filtro
- Píldora `--radius-pill`, `--surface-3`, texto `--neutral-200`, hairline `--border-default`, ≥44 de alto en táctil.
- **hover:** `--surface-4` + `--neutral-50`. **activo:** fondo `--surface-4`, texto `--neutral-50`, **borde `--gold`** + opcional `--gold-tint-08` de wash. **activo con "×":** botón de quitar a la derecha (icono SVG, hit-area propia). **focus:** anillo dorado.

### Control de rango de precio
- Dos inputs `--surface-3` o slider doble. Pista `--neutral-700`; tramo activo `--gold` (acento de marca, fino); pulgares circulares `--surface-4` con borde `--gold`. Valores en MXN con `.nums`. Foco dorado en los pulgares.

### Select de orden
- Nativo estilizado: `--surface-3`, texto `--neutral-100`, hairline `--border-default`, `--radius-sm`, flecha SVG cálida. `:focus` dorado. Conserva el `<select>` real (accesible).

### Line item de carrito
- Fila sobre `--surface-2`, hairline inferior `--border-default`, padding `--space-4`. Miniatura `--radius-sm` (relación 3:4). Nombre sans `--neutral-100`; atributos (talla/color) `--fs-sm` `--neutral-300`; precio unitario `.precio` `--neutral-200`; subtotal `.precio` `--neutral-50`. Stepper (arriba) + botón eliminar (icono basura, `--neutral-400` → hover `--neutral-100`).
- **eliminando:** transición de salida (fade + collapse) = hook motion. **no disponible:** aviso inline `--neutral-200` + botón eliminar; no rompe el total.

### Resumen de compra
- Panel `--surface-2` + `.texture-wood`, `--radius-lg`, `--shadow-card`, sticky en desktop (`top` bajo el header, `--z-sticky`). Filas label/valor (`--neutral-300` / `--neutral-100`, `.nums`).
- **Total** destacado: serif `--fs-lg` `--neutral-50`. **Descuento de cupón:** fila en `--sale` con `--sale-tint-12` de fondo (es ahorro = territorio de oferta, uso legítimo del terracota). Botón "Finalizar compra" = botón primario.

### Campo de cupón
- Input `--surface-3` + botón "Aplicar" (secundario). **válido/aplicado:** chip de éxito en `--neutral` (no verde nuevo) + mensaje. **inválido:** mensaje inline `--fs-sm`, hairline `--border-strong`, texto `--neutral-100` ("Ese cupón no es válido"). El terracota NO se usa para el error (es solo ahorro).

### Input + validación (newsletter, email)
- `--surface-3`, hairline `--border-default`, `--radius-sm`, padding cómodo, `font-size: 16px` (ya forzado en base). Placeholder `--neutral-400`.
- **foco:** anillo dorado. **inválido:** hairline `--border-strong` + mensaje inline `--neutral-100`. **éxito:** mensaje inline `--neutral-100` ("Listo, te escribiremos pronto"). `aria-live` para mensajes.

### Acordeón / tabs (detalle)
- Usa `<details>/<summary>` (funciona sin JS). `summary`: sans `--neutral-100`, hairline inferior, ícono chevron SVG que rota (hook). Contenido `--neutral-200`, `--lh-relaxed`. Foco dorado en el `summary`.

### Galería (detalle)
- Imagen principal `--radius-md`, `--surface-1` de fondo mientras carga. Miniaturas en fila (`.no-scrollbar` si overflow), `--radius-sm`. **thumb activo:** borde `--gold`. **hover/focus:** borde `--border-strong` + anillo dorado. Placeholder de marca si rota.

### Empty state (carrito vacío / filtro sin resultados)
- Bloque centrado sobre `--surface-1` + `.texture-wood`, `--radius-lg`, padding generoso. Ícono/monograma Black Clothes en `--neutral-600` (apagado), título serif `--fs-display-3` `--neutral-100`, texto `--neutral-300`, CTA = botón primario. En filtro vacío, **mantén visibles los chips activos** arriba.

### Toast / mini-confirmación ("Añadido a la bolsa")
- `position: fixed`, `--z-toast`, `--surface-3` + `.texture-wood`, `--radius-md`, `--shadow-card`, hairline `--border-default`. Texto `--neutral-50` + acciones "Ver bolsa" / "Seguir comprando" (botón de texto). Auto-oculta ~3–4s. Entrada slide+fade; en `prefers-reduced-motion` solo fade (hook motion).

### Breadcrumb
- Sans `--fs-sm`. Segmentos enlazados `--neutral-300` (hover `--neutral-50` subrayado); separador "/" en `--neutral-600`; segmento actual `--neutral-100` no enlazado, `aria-current="page"`.

### Placeholder de imagen (universal)
- Caja con `--surface-2` + `.texture-wood`, centrado el **monograma Black Clothes** en serif `--neutral-600` (o un SVG de marca), `--radius` igual al del medio que reemplaza. El `alt` conserva el nombre del producto. Reúsalo en card, galería, line item y miniaturas.

---

## 6. Hero sobre video (composición)

```
section.hero (min-height: 100dvh, position: relative, overflow: hidden)
 ├─ video (autoplay muted loop playsinline, poster=…, object-fit: cover, absolute, inset:0)
 │     · si no carga / save-data / reduced-motion → queda el poster
 ├─ div.velo  (absolute, inset:0, background: var(--hero-veil), z sobre el video)
 └─ div.hero-contenido  (.contenedor, relative, z sobre el velo)
        · eyebrow opcional (--gold)
        · h1 serif --fs-display-hero  (.titulo-display, color --neutral-50 o --gold-light)
        · subtítulo sans --fs-md --neutral-200
        · CTA primario "Ver la colección"
        · scroll-cue sutil (hook motion)
```

Reglas:
- El **velo** (`--hero-veil`) es obligatorio: sin él, el texto cae sobre el video crudo (prohibido). El velo es más opaco abajo (88% hacia `--surface-0`) para fundir el hero con la primera sección.
- El texto y el CTA **nunca dependen del video**: con solo el `poster` deben leerse igual.
- Respeta `min-height: 100dvh` y `env(safe-area-inset-*)` en notch.
- En `prefers-reduced-motion` o `save-data`: **no** autoreproducir; mostrar `poster`.

---

## 7. Responsive (recordatorio para componer)

Mobile-first. Breakpoints de referencia (en comentario en `tokens.css` §16):
- **Grid de catálogo:** 2 col (≤480) → 3 (769–1024) → 4 (≥1025). `gap: var(--space-4)`.
- **Detalle:** 1 col (móvil) → 2 col con panel de compra **sticky** (≥1025); galería 55–60% / panel 40–45%.
- **Carrito:** apilado (móvil) → lista ~65% + resumen sticky ~35% (desktop). CTA "Finalizar compra" puede quedar sticky al fondo en móvil (`--z-sticky`, respetando safe-area).
- **Touch targets ≥44px** en todo control (ya hay `--touch-min`).
- Tipografía y espaciado fluidos ya resueltos con `clamp` en los tokens.

---

## 8. Checklist de uso correcto (para QA y para ti, ui-engineer)

- [ ] Ningún texto/control sobre el océano (todo en `.contenedor` + superficie madera).
- [ ] Dorado solo en: logo, títulos de hero/hitos, badge oferta, selección (borde), foco.
- [ ] Terracota (`--sale`) solo en precio rebajado y ahorro/descuento.
- [ ] Precios siempre con `.precio`/`.nums` (tabular).
- [ ] Foco dorado visible en todo interactivo; nunca `outline: none` huérfano.
- [ ] Cards no mueven layout al hover (solo sombra + zoom interno).
- [ ] Hero con velo sólido; texto legible solo con poster.
- [ ] Headings sin saltos de nivel; tamaño con utilidades, no con headings incorrectos.
- [ ] `prefers-reduced-motion`: ya cubierto globalmente; tus animaciones también deben respetarlo.

---

## 9. Handoff

**→ `ui-engineer`** — Tienes `css/tokens.css` (todas las variables) y `css/base.css` (reset, océano fijo, foco dorado, utilidades de marca) listos y validados. Construye las 4 páginas y escribe `css/components.css` + `css/pages.css` **consumiendo los tokens** y siguiendo el tratamiento por componente de la §5 y la composición del hero de la §6. No introduzcas hex sueltos ni colores fuera de la paleta: si necesitas un tono, sale de la escala existente. Deja **hooks de clase** para el `motion-engineer` (p. ej. `.is-scrolled` en el header, contenedores `overflow:hidden` para el zoom de imagen, el toast posicionado). Cuando termines, pasa a `motion-engineer` (animaciones) y luego a `qa-auditor` (a11y/contraste/responsive).
