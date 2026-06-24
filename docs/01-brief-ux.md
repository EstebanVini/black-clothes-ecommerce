# 01 · Brief UX — YOYO · Tienda de ropa (demo)

> **Autor:** ux-architect · **Fase:** 1 · **Estado:** listo para handoff
> **Stack objetivo:** HTML + CSS + JS puro, multi-archivo, sin build, sin frameworks.
> **Idioma:** español (México) · **Moneda:** MXN (`$1,290 MXN`) · **Sin backend** (carrito en `localStorage`).
>
> Este documento es la fuente de verdad de UX. Lo consumen **visual-designer**, **ux-writer** y **ui-engineer**. No contiene código; sí decisiones accionables y restricciones duras.

---

## 0. Premisas heredadas (no negociables)

Tomadas del sistema visual de `catan-assistant` (verificadas en su `index.css` / `tailwind.config.js`). El visual-designer las traduce a `tokens.css`; aquí solo fijan el marco de UX.

- **Fondo océano global:** capa `fixed` en `body` (degradado radial azul profundo `#07243a → #0c3553 → #176087` + olas SVG con deriva de 52 s). **Regla dura: ningún texto ni control se apoya sobre el océano.** Todo contenido vive en **superficies de madera sólidas** (`surface-0..4`, de `#14100c` a `#3a2c1e`). El hero con video es la única excepción visual: el video va sobre el océano, pero el texto del hero vive sobre un velo/overlay sólido, no sobre el video crudo.
- **Dorado reservado:** `#ecc35f / #d9a93e / #a87b22` solo para marca, títulos display, insignias, ofertas y foco. **Nunca** como color de relleno de botones grandes ni de áreas extensas.
- **Neutros cálidos:** arena→nogal (`#f8f1e3 … #191310`). Todo el texto y los controles adoptan estos tonos. Cero grises fríos.
- **Tipografía:** display **serif** (Iowan/Palatino/Georgia, stack del sistema) para títulos, marca y precios destacados; **sans del sistema** para cuerpo, labels y UI. `font-feature-settings: 'ss01','cv11'`.
- **Foco:** anillo dorado `rgba(236,195,95,.9)`, visible sobre madera y océano. Siempre presente, nunca `outline: none` sin reemplazo.
- **Movimiento:** solo `transform`/`opacity`, 150–400 ms, respeta `prefers-reduced-motion`. (Detalle lo define motion-engineer; aquí solo se marcan los *hooks*.)
- **Layout:** contenido centrado, ancho máx. ~1400 px, mobile-first. Hero `min-height: 100dvh`.

---

## 1. Arquitectura de información y navegación

### 1.1 Mapa del sitio

```
Home (index.html)
 ├─ Catálogo (tienda.html)          ── filtros / orden / grid
 │   └─ Detalle (producto.html?id=) ── galería / variantes / añadir
 │        └─ vuelve a Catálogo o entra a Carrito
 └─ Carrito (carrito.html)          ── líneas / resumen / checkout simulado
```

Cuatro páginas, jerarquía plana. El **producto** es el único nodo dinámico (lee `?id=`). No hay login, cuenta ni búsqueda con backend (una búsqueda *client-side* es opcional, ver §3.2).

### 1.2 Header / nav (componente global, sticky)

Mismo header en las 4 páginas. Estructura de izquierda a derecha:

```
[ ☰ menú móvil ]   [ YOYO (logo serif dorado → Home) ]   [ Tienda  Colecciones  Lookbook  Contacto ]   [ 🔍? ]  [ 🛒 carrito · (n) ]
```

- **Logo YOYO:** texto serif display, color dorado, enlaza a Home. Único uso de dorado tipográfico permanente en el chrome.
- **Nav primaria (desktop):** `Tienda` (→ tienda.html), `Colecciones` (ancla/filtro de catálogo), `Lookbook` (ancla en Home), `Contacto` (ancla footer). Solo `Tienda` es página real; las demás son anclas/filtros — mantenerlo honesto para una demo creíble.
- **Carrito:** ícono SVG + **badge contador** con el número de unidades. El badge se oculta cuando el total es 0 (no muestra "0"). Es el único elemento del nav que cambia de estado en runtime.
- **Estado activo:** el ítem de la sección actual se marca (subrayado dorado fino o peso tipográfico), para orientación.
- **Comportamiento sticky:** el header queda fijo arriba; al hacer scroll hacia abajo se compacta levemente (reduce padding vertical, gana sombra/elevación de madera). *Hook* para motion-engineer; nunca debe tapar contenido ni saltar.
- **Móvil:** nav primaria colapsa en menú (`☰`) que abre un panel lateral o desplegable sobre superficie de madera sólida. Logo centrado o a la izquierda; carrito siempre visible a la derecha (es la acción más valiosa).

### 1.3 Footer (componente global)

Sobre `surface-1`. Cuatro zonas:

1. **Marca + claim** (logo serif + una línea de posicionamiento — la escribe ux-writer).
2. **Navegación:** Tienda, Colecciones, Lookbook, Sobre YOYO.
3. **Ayuda/legal (demo):** Envíos, Devoluciones, Términos, Privacidad (enlaces inertes o a anclas; honestos para demo).
4. **Newsletter mini** (opcional duplicado del bloque de Home) + redes (íconos SVG) + nota "© 2026 YOYO · Demo".

### 1.4 Breadcrumbs

- **Catálogo:** no requiere (es nodo raíz de compra). Mostrar título "Tienda" + contador de resultados hace de orientación.
- **Detalle:** **sí** lleva breadcrumb: `Tienda / [Categoría] / [Nombre del producto]`. La categoría enlaza de vuelta al catálogo filtrado. Ayuda a recuperar contexto cuando se llega por enlace directo (`?id=`).
- **Carrito:** no requiere; un enlace "Seguir comprando" → Tienda cumple la función de retorno.

---

## 2. Flujos de usuario clave

### 2.1 Flujo principal: descubrir → comprar (camino feliz)

```
Home (hero/colecciones/novedades)
  → clic en colección o producto destacado
  → Catálogo (o directo a Detalle)
  → Detalle del producto (?id=)
     · ver galería
     · elegir COLOR
     · elegir TALLA            ← obligatorio antes de añadir
     · ajustar CANTIDAD
     · "Añadir al carrito"     → feedback inmediato (badge +n, mini-confirmación)
  → seguir comprando  ó  ir al Carrito
  → Carrito
     · revisar/editar líneas (cantidad, eliminar)
     · aplicar cupón (opcional)
     · "Finalizar compra"
  → Checkout SIMULADO (confirmación in-page: pedido recibido, carrito se vacía)
```

**Reglas del flujo:**
- "Añadir al carrito" está **deshabilitado** hasta que talla (y color, si el producto tiene varios) estén seleccionados. Si el usuario intenta añadir sin talla, se resalta el selector de talla con un mensaje inline ("Elige una talla"), no un alert.
- Tras añadir: feedback no bloqueante (badge del nav incrementa con micro-pulso + un toast/mini-confirmación "Añadido a tu bolsa" con enlaces "Ver bolsa" / "Seguir comprando"). El usuario **nunca** es expulsado de la página de producto automáticamente.
- El carrito persiste en `localStorage`; el badge se rehidrata en cada carga de página (incluido el primer paint, sin parpadeo de "0").
- **Checkout simulado:** botón "Finalizar compra" → pantalla/estado de confirmación dentro de `carrito.html` (o un bloque que reemplaza el contenido): "¡Gracias por tu compra!", número de pedido ficticio, resumen, y CTA "Volver a la tienda". Vacía el carrito en `localStorage`. Sin formularios de pago reales (es demo) — máximo un paso simulado de datos de envío *fake*, opcional.

### 2.2 Flujo de filtrado en catálogo

```
Catálogo carga → grid completo + "N resultados"
  → usuario ajusta filtros (categoría, talla, rango de precio) y/o orden
  → grid se re-renderiza client-side (sin recarga)
  → contador de resultados se actualiza
  → si 0 resultados → estado vacío de filtro (ver §5)
  → "Limpiar filtros" restablece todo
```

**Reglas:**
- Filtros son **acumulativos** (AND entre categorías de filtro: categoría Y talla Y precio). Dentro de un mismo grupo con múltiples valores (p. ej. dos categorías), es OR.
- El **orden** (relevancia/novedad, precio ascendente, precio descendente, nombre A–Z) es independiente de los filtros y se conserva al filtrar.
- El estado de filtros debe reflejarse visiblemente (chips activos) y ser fácil de quitar uno a uno.
- *Nice-to-have:* sincronizar filtros con la query string para que sean compartibles; no es requisito duro de la demo.
- En **móvil**, los filtros viven en un panel/drawer que se abre con un botón "Filtrar"; el orden puede quedar como `select` siempre visible.

### 2.3 Flujo de entrada directa a Detalle

Llegada por `producto.html?id=XX` (enlace compartido, novedades de Home):
- `id` válido → render normal + breadcrumb con categoría real.
- `id` ausente o inválido → estado de error de producto (ver §5): mensaje cálido + CTA "Volver a la tienda" + sugeridos. **Nunca** página en blanco ni JS roto visible.

---

## 3. Especificación por página

Cada página: header global → contenido → footer global. Orden de secciones de arriba hacia abajo.

### 3.1 `index.html` — Home

| # | Sección | Jerarquía / propósito | Componentes | Comportamiento |
|---|---|---|---|---|
| 1 | **Hero** | Máxima. `min-height:100dvh`. Video de fondo en loop (mudo, `autoplay`, `playsinline`), velo oscuro para legibilidad. Título serif display + subtítulo + CTA primario "Ver la colección". | Botón primario, (badge de temporada opcional) | Video con `poster` (frame fijo) como fallback; si el video no carga, queda el poster + overlay. Scroll-cue sutil. |
| 2 | **Colecciones destacadas** | Alta. 2–4 colecciones (p. ej. "Esenciales", "Tejidos", "Otoño"). Cada una es una tarjeta editorial grande con imagen + nombre serif + enlace al catálogo filtrado. | Card de colección (variante grande de product card), botón secundario | Hover: zoom suave de imagen (hook motion). |
| 3 | **Novedades** | Media-alta. Encabezado de sección + carrusel o grid de 4–8 product cards reales (`badge=novedad`). "Ver todo" → catálogo. | Product card, badge novedad, botón secundario | Cards enlazan a `producto.html?id=`. Scroll-reveal con stagger (hook). |
| 4 | **Tira editorial / Lookbook** | Media. Banda full-bleed con 2–3 imágenes de estilo de vida + cita/manifiesto de marca (serif). Refuerza el "alma artesanal". | Bloque editorial (imagen + texto), enlaces | Parallax sutil opcional (hook, respeta reduced-motion). |
| 5 | **Newsletter** | Media. Captura de email sobre superficie de madera, con incentivo (copy de ux-writer). | Input + botón primario, mensajes de validación | Validación client-side; éxito = mensaje inline "Listo, te escribiremos pronto" (sin backend). |
| 6 | **Footer** | Baja. Global. | Footer | — |

### 3.2 `tienda.html` — Catálogo

| # | Sección | Jerarquía / propósito | Componentes | Comportamiento |
|---|---|---|---|---|
| 1 | **Encabezado de catálogo** | Alta. Título serif "Tienda" + subtítulo breve + **contador de resultados** ("16 prendas"). | Título de sección | Contador se actualiza al filtrar. |
| 2 | **Barra de controles** | Alta funcional. Izq: botón "Filtrar" (móvil) / filtros inline (desktop). Der: `select` de **orden**. Debajo: **chips de filtros activos** + "Limpiar todo". | Chip de filtro, select de orden, botón texto | Sticky opcional bajo el header. |
| 3 | **Panel de filtros** | Media. Categoría (lista/checkbox), Talla (chips XS–XL), Rango de precio (dos inputs o slider doble). | Chip de filtro, checkbox cálido, control de rango | Desktop: columna lateral fija. Móvil: drawer. Aplica en vivo (o con botón "Aplicar" en móvil). |
| 4 | **Grid de productos** | Máxima. Grilla responsiva de product cards. | Product card, badge oferta/novedad/agotado | 4 col desktop → 3 → 2 móvil. Lazy-load de imágenes. Hover/reveal hooks. |
| 5 | **Estado vacío de filtros** | Condicional. Reemplaza el grid cuando 0 resultados. | Empty state, botón "Limpiar filtros" | Ver §5. |
| 6 | **Footer** | Baja. Global. | Footer | — |

> *Búsqueda:* el ícono 🔍 del header es **opcional** en la demo. Si se incluye, es un filtro client-side por nombre/categoría sobre `data.js`, integrado con los chips. Si no, se omite del header sin dejar hueco.

### 3.3 `producto.html` — Detalle (lee `?id=`)

| # | Sección | Jerarquía / propósito | Componentes | Comportamiento |
|---|---|---|---|---|
| 0 | **Breadcrumb** | Baja-orientación. `Tienda / Categoría / Producto`. | Breadcrumb | Categoría enlaza a catálogo filtrado. |
| 1 | **Galería** (col. izq desktop) | Máxima visual. Imagen principal grande + miniaturas (4–6). | Galería (principal + thumbs), badge oferta/agotado sobre imagen | Clic en thumb cambia principal. Zoom/hover hook. Lazy-load salvo la principal. |
| 2 | **Panel de compra** (col. der desktop) | Máxima funcional. Nombre serif, **precio** (con precio tachado si hay oferta), selector de color, selector de talla (+ "Guía de tallas" enlace), stepper de cantidad, **botón "Añadir al carrito"**, disponibilidad. | Selector de color, selector de talla, stepper, botón primario, badge oferta | Añadir deshabilitado sin talla/color. Feedback al añadir (§2.1). Agotado → botón cambia a "Avísame" o "Agotado" deshabilitado. |
| 3 | **Detalles del producto** | Media. Tabs o acordeón: **Descripción** editorial / **Materiales y cuidado** / **Envíos y devoluciones**. | Acordeón/tabs | Acordeón funciona sin JS (detalle/summary) como fallback. |
| 4 | **Productos sugeridos** | Media. "También te puede gustar": 3–4 product cards de la misma categoría (excluye el actual). | Product card | Enlazan a otros `?id=`. |
| 5 | **Footer** | Baja. Global. | Footer | — |

**Layout responsive del detalle:** desktop = dos columnas (galería 55–60% / panel de compra 40–45%, panel *sticky* al hacer scroll). Móvil = una columna: galería arriba → panel de compra → detalles → sugeridos. En móvil, considerar un CTA "Añadir al carrito" *sticky* al fondo cuando el botón principal sale del viewport.

### 3.4 `carrito.html` — Carrito (la bolsa)

| # | Sección | Jerarquía / propósito | Componentes | Comportamiento |
|---|---|---|---|---|
| 1 | **Encabezado** | Alta. Título serif "Tu bolsa" + recuento ("3 prendas"). | Título de sección | — |
| 2 | **Lista de líneas** (col. izq) | Máxima. Una line item por variante (producto+talla+color). Miniatura, nombre, atributos, precio unitario, stepper de cantidad, subtotal, eliminar. | Line item de carrito, stepper, botón eliminar (icono) | Cambiar cantidad o eliminar recalcula totales y badge al instante. Persiste en localStorage. |
| 3 | **Resumen de compra** (col. der, sticky) | Máxima funcional. Subtotal, envío (estimado/"Gratis"), descuento (si cupón), **Total** destacado, **campo de cupón**, botón **"Finalizar compra"**, nota de seguridad/demo. | Resumen, input cupón + botón aplicar, botón primario | Cupón válido → muestra descuento + mensaje; inválido → error inline. |
| 4 | **Estado vacío** | Condicional. Reemplaza 2+3 cuando el carrito está vacío. | Empty state + botón primario "Ir a la tienda" | Ver §5. |
| 5 | **Confirmación post-checkout** | Condicional. Reemplaza el contenido tras "Finalizar compra". | Bloque de éxito, número de pedido, botón "Volver a la tienda" | Vacía el carrito. |
| 6 | **Footer** | Baja. Global. | Footer | — |

**Layout:** desktop = lista (≈65%) + resumen sticky (≈35%). Móvil = lista apilada → resumen → CTA; el botón "Finalizar compra" puede quedar sticky al fondo.

---

## 4. Inventario de componentes reutilizables

Para cada uno, el ui-engineer debe implementar **todos** los estados listados. El visual-designer define el tratamiento; aquí va el contrato de comportamiento y estados.

| Componente | Uso | Estados a implementar |
|---|---|---|
| **Header / nav sticky** | Global | default · scrolled (compacto+sombra) · ítem activo · móvil colapsado/abierto |
| **Badge contador de carrito** | Header | 0 (oculto) · 1–9 · 99+ (cap "9+" o "99+") · micro-pulso al incrementar |
| **Footer** | Global | único (sin estados) |
| **Botón primario** | CTAs principales (añadir, finalizar, ver colección) | default · hover · focus (anillo dorado) · active · disabled · loading/"añadiendo…" (opcional) |
| **Botón secundario** | Acciones de apoyo ("Ver todo", "Seguir comprando") | default · hover · focus · active · disabled |
| **Botón de texto / link** | "Limpiar filtros", "Guía de tallas", breadcrumb | default · hover (subrayado) · focus · visited (si aplica) |
| **Product card** | Catálogo, novedades, sugeridos | default · hover (elevación + zoom imagen) · focus (teclado) · con badge (oferta/novedad/agotado) · agotado (atenuada, sin hover de compra) · imagen rota (placeholder) |
| **Card de colección** | Home (variante grande) | default · hover · focus |
| **Badge** | Sobre cards e imágenes | `novedad` (neutro cálido/madera) · `oferta` (**dorado**, único caso de dorado de relleno permitido, pequeño) · `agotado` (apagado/nogal) |
| **Selector de talla** | Detalle (y filtro en catálogo) | no seleccionado · hover · seleccionado · **agotado para esa talla** (tachado/deshabilitado) · focus · grupo con error ("Elige una talla") |
| **Selector de color** | Detalle | swatches; no seleccionado · seleccionado (anillo) · hover · focus · agotado |
| **Stepper de cantidad** | Detalle y carrito | valor 1..N · botón − deshabilitado en mínimo · botón + deshabilitado en stock máx · focus · entrada manual validada |
| **Chip de filtro** | Catálogo | inactivo · hover · activo (relleno/borde) · activo con "×" para quitar · focus |
| **Control de rango de precio** | Catálogo | valores por defecto · arrastrando · focus teclado · refleja MXN |
| **Select de orden** | Catálogo | nativo, estilizado; default · open · focus |
| **Line item de carrito** | Carrito | default · editando cantidad · eliminando (transición de salida) · agotado/no disponible (aviso inline) · imagen rota |
| **Resumen de compra** | Carrito | sin cupón · con cupón aplicado · cargando recálculo |
| **Campo de cupón** | Carrito | vacío · válido (aplicado) · inválido (error inline) · ya aplicado |
| **Input + validación** | Newsletter, cupón, email | vacío · foco · válido · inválido (mensaje inline) · éxito |
| **Acordeón / tabs** | Detalle | colapsado · expandido · focus; fallback `details/summary` sin JS |
| **Galería** | Detalle | imagen principal · thumb activo · thumb hover/focus · imagen rota (placeholder) |
| **Empty state** | Carrito vacío, filtro sin resultados | ilustración/ícono + texto + CTA |
| **Toast / mini-confirmación** | "Añadido a la bolsa" | aparece · auto-oculta (≈3–4 s) · con acción · reduced-motion (sin slide, solo fade) |
| **Breadcrumb** | Detalle | enlaces + segmento actual no enlazado |
| **Placeholder de imagen** | Cualquier `<img>` que falle | fondo madera + ícono/monograma YOYO + `alt` legible |

---

## 5. Estados y casos extremos por superficie

### Catálogo
- **Filtro sin resultados:** grid reemplazado por empty state: ícono/ilustración cálida + "No encontramos prendas con esos filtros" + **"Limpiar filtros"** (botón primario). Mantener visibles los chips activos para que el usuario entienda *por qué* está vacío.
- **Primer uso / sin filtros:** grid completo de los ~16 productos, contador "16 prendas", ningún chip activo, orden por defecto = novedad/relevancia.
- **Producto agotado en grid:** card con badge "Agotado", imagen levemente atenuada, sin CTA de compra rápida; sigue enlazando a su detalle (se puede ver, no añadir).
- **Hover (card):** elevación de superficie + zoom suave de imagen + revelado opcional de acción ("Ver prenda"). No mover el layout.
- **Foco teclado:** card completa enfocable y activable con Enter; anillo dorado claro; orden de tabulación lógico (controles → grid).
- **Imagen rota:** placeholder de marca (madera + monograma), `alt` con el nombre del producto.

### Detalle
- **`?id=` inválido/ausente:** estado de error cálido: "No encontramos esa prenda" + "Volver a la tienda" (primario) + sugeridos. Sin pantalla en blanco.
- **Producto agotado (global):** botón principal → "Agotado" deshabilitado (o "Avísame" con captura de email simulada); el resto del panel sigue visible e informativo.
- **Talla específica agotada:** ese chip de talla se muestra tachado/deshabilitado y no seleccionable; tooltip/inline "Sin stock".
- **Intento de añadir sin talla/color:** sin alert; se resalta el grupo faltante + mensaje inline ("Elige una talla"). El foco se mueve al grupo.
- **Oferta:** precio actual + precio anterior tachado + badge "Oferta" dorado pequeño; porcentaje opcional ("−20%").
- **Stock bajo:** aviso suave "Quedan pocas" (si el dato existe en `data.js`), sin presión agresiva.
- **Foco/teclado:** selectores de talla/color como grupos de radio accesibles (flechas + Enter); stepper operable por teclado; galería navegable.
- **Imagen rota:** placeholder en principal y/o thumbs sin romper la cuadrícula.

### Carrito
- **Carrito vacío (primer uso o tras checkout):** empty state: "Tu bolsa está vacía" + frase de marca + **"Ir a la tienda"** (primario). Oculta resumen y cupón.
- **Eliminar última línea:** transición a estado vacío (sin recarga).
- **Cantidad a 0 vía stepper:** el mínimo es 1; bajar de 1 ofrece eliminar (o el − queda deshabilitado en 1 y se elimina con el botón de basura — definir una sola convención: **mínimo 1, eliminar es acción aparte**).
- **Cupón inválido:** error inline bajo el campo ("Ese cupón no es válido"), sin perder el carrito. Cupón demo válido documentado por ux-writer (p. ej. `YOYO10`).
- **Producto que dejó de existir / sin stock al recargar:** marcar la línea con aviso "Ya no disponible" y permitir eliminarla; no romper el total.
- **Checkout simulado:** confirmación in-page + vaciado de carrito + badge a 0.
- **localStorage no disponible (modo privado estricto):** degradar a carrito de sesión en memoria; nunca lanzar excepción que rompa la página.

### Home
- **Video del hero no carga / datos móviles:** `poster` estático cubre; en `prefers-reduced-motion` o `save-data`, no autoreproducir — mostrar poster. El texto y CTA nunca dependen del video.
- **Newsletter:** email inválido → error inline; envío → éxito inline (sin backend). Doble envío deshabilita el botón brevemente.

### Global / transversal
- **JS deshabilitado:** las 4 páginas deben **renderizar y ser navegables** con HTML/CSS solo. El contenido del catálogo y del detalle debe existir en el HTML servido o degradar con gracia (si el render es JS-driven desde `data.js`, incluir un `<noscript>` honesto: "Activa JavaScript para ver el catálogo y usar la bolsa"). Enlaces de nav y footer siempre funcionan. Acordeón del detalle usa `details/summary` (funciona sin JS).
- **Foco visible siempre:** anillo dorado en todo elemento interactivo; nada de `outline:none` huérfano.
- **Reduced-motion:** toda animación se reduce a fade corto o se elimina (olas estáticas, sin parallax, toast sin slide).
- **Hover en táctil:** ningún contenido o acción crítica solo accesible por hover; en táctil las acciones son tap directo.
- **Errores de red de imágenes:** placeholder de marca universal (§4).

---

## 6. Criterios de éxito UX · accesibilidad · responsive

### 6.1 Criterios de éxito (medibles para la demo)
1. Un visitante llega a Home y, sin instrucciones, descubre y abre un producto en **≤2 clics**.
2. Desde un producto, **seleccionar talla + añadir + llegar a la bolsa** se hace sin callejones ni alerts intrusivos.
3. Filtrar el catálogo (categoría + precio) actualiza grid y contador **sin recarga** y comunica claramente si no hay resultados.
4. Editar y vaciar la bolsa, aplicar cupón y "comprar" funciona end-to-end con persistencia tras recargar.
5. La experiencia se lee como **tienda real premium**, no demo: cero placeholders genéricos visibles, cero estados rotos, copy con voz de marca.
6. Todo lo anterior se cumple en móvil pequeño (360 px) igual que en desktop.

### 6.2 Accesibilidad (objetivo WCAG 2.1 AA)
- HTML semántico: `header/nav/main/section/article/footer`, headings jerárquicos sin saltos.
- Todo control es operable por teclado; orden de tabulación lógico; foco dorado siempre visible.
- Selectores de talla/color = grupos tipo radio con `aria` y navegación por flechas; stepper con labels.
- `alt` significativo en todas las imágenes de producto (nombre/atributo); imágenes decorativas con `alt=""`.
- Contraste AA: el texto vive sobre superficies de madera (no sobre océano ni video); validar dorado solo en tamaños/usos donde cumpla (títulos grandes, badges, no texto pequeño de cuerpo).
- Cambios de estado anunciados (badge del carrito, resultados de filtro, toast) con `aria-live` discreto.
- Respeta `prefers-reduced-motion`.

### 6.3 Responsive (mobile-first)
- **Breakpoints sugeridos:** base ≤480 (móvil) · 481–768 (móvil grande/tablet) · 769–1024 (tablet/landscape) · ≥1025 (desktop) · contenedor máx **~1400 px** centrado.
- **Grid de catálogo:** 2 col (móvil) → 3 (tablet) → 4 (desktop). Sin overflow horizontal nunca.
- **Detalle:** 1 col (móvil) → 2 col con panel sticky (≥1025).
- **Carrito:** apilado (móvil) → lista + resumen sticky (desktop).
- **Touch targets ≥44×44 px** en todo control táctil (steppers, chips, eliminar, thumbs).
- **Hero:** `min-height:100dvh`; respetar `env(safe-area-inset-*)` en dispositivos con notch.
- Tipografía y espaciado fluidos (escala con `clamp`); inputs ≥16 px en móvil para evitar zoom iOS.

---

## 7. Handoff

Este brief queda listo para la **Fase 2 (paralela)**:

- **→ `visual-designer`** — Traduce las premisas de §0 y el inventario de componentes (§4) a `css/tokens.css` + `css/base.css` y al documento `docs/02-sistema-visual.md`. Decisiones que dependen de ti: paleta exacta YOYO (manteniendo océano/madera/dorado/neutros cálidos de catán), escala tipográfica serif+sans, sombras de elevación de superficies, tratamiento visual de cada estado listado (hover, focus dorado, badge de oferta dorado, agotado atenuado), composición del hero con velo sobre video, y placeholder de imagen de marca. **Restricción dura:** dorado reservado; cero texto sobre océano/video crudo.

- **→ `ux-writer`** — Define voz/tono de YOYO y escribe `js/data.js` (~16 productos: nombre, categoría, precio MXN, colores, tallas con stock por talla, descripción editorial, materiales/cuidado, badges, imágenes) + `docs/03-copy-deck.md` con TODO el copy de UI referenciado aquí: nav y footer, hero (título/subtítulo/CTA), labels de filtros y orden, textos de los **empty states** (carrito vacío, filtro sin resultados), errores inline (talla faltante, cupón inválido, email inválido, `?id=` inválido), CTAs ("Añadir al carrito", "Finalizar compra", "Seguir comprando", "Ir a la tienda"), toast "Añadido a la bolsa", newsletter, confirmación de checkout y cupón demo válido. Usa esta especificación como índice de strings a producir.

> Ambos consumen este documento en paralelo. La implementación (`ui-engineer`) arranca cuando tokens + copy + data estén listos.
