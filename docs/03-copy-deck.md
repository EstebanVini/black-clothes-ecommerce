# 03 · Copy Deck — YOYO · Tienda de ropa (demo)

> **Autor:** ux-writer · **Fase:** 2 · **Estado:** listo para handoff a ui-engineer
> **Idioma:** español (México) · **Moneda:** MXN · **Sin emojis en ninguna superficie.**
>
> Este documento es la fuente de verdad del copy. El ui-engineer copia los textos de aquí **literalmente**.
> Donde haya `{variable}`, es un valor dinámico que inyecta el JS (cantidad, precio, nombre, etc.).
> Los datos de producto (nombres, descripciones, materiales, cuidados) viven en `js/data.js`, no aquí.

---

## 1. Voz, tono y glosario

### 1.1 Personalidad de marca

YOYO es **moda con alma artesanal**: premium y editorial, pero cercana. Hablamos como una amiga que sabe de ropa y te quiere ver bien, no como un corporativo ni como un algoritmo. Cálida, nunca fría.

- **Segunda persona, tuteo:** "tu bolsa", "elige tu talla", "te escribiremos pronto".
- **Voz activa:** "No pudimos aplicar el cupón", nunca "El cupón no pudo ser aplicado".
- **Claridad antes que ingenio:** primero se entiende, luego se disfruta.
- **Sin culpar al usuario:** los errores los redactamos como algo que resolvemos juntos.
- **Calidez sensorial:** evocamos textura, peso y temperatura, sin caer en cursilería.
- **Sin signos de apertura olvidados:** siempre `¿` y `¡` cuando corresponde.
- **Sin emojis.** El tono cálido lo da la palabra, no el ícono.

### 1.2 Glosario (términos únicos — usar siempre estos, nunca sus sinónimos)

| Concepto | Término oficial YOYO | No usar |
|---|---|---|
| Contenedor de compra | **bolsa** ("tu bolsa", "ir a la bolsa") | carrito, canasta |
| Acción de meter a la bolsa | **añadir** ("Añadir a la bolsa") | agregar, meter |
| Acción de sacar de la bolsa | **eliminar** | quitar, borrar |
| Medida de prenda | **talla** | tamaño |
| Categoría de inventario | **prenda(s)** (contador, vacíos) | artículo, ítem, producto (en UI visible) |
| Tono de la prenda | **color** | tono, variante |
| Reducción de precio | **oferta** ("En oferta", "Oferta") | descuento (salvo en el cupón), rebaja |
| Código promocional | **cupón** | código, vale, promo |
| Completar la compra | **finalizar compra** | pagar, checkout (visible), comprar |
| Lista de prendas nuevas | **novedades** | nuevos, recién llegados |
| Selección curada | **colección** | catálogo (visible en UI de cliente), línea |
| Boletín por correo | **newsletter** (en código) / "novedades por correo" (en UI) | suscripción, lista |

> Nota: "catálogo" sí se usa en documentación interna y nombres de archivo (`tienda.html`), pero en el texto visible para la clienta decimos **"Tienda"** o **"colección"**.

---

## 2. Header / Navegación (global, en las 4 páginas)

### 2.1 Marca y nav primaria

| Elemento | Texto |
|---|---|
| Logo (texto serif) | `YOYO` |
| Nav · ítem 1 | `Tienda` |
| Nav · ítem 2 | `Colecciones` |
| Nav · ítem 3 | `Lookbook` |
| Nav · ítem 4 | `Contacto` |

### 2.2 Aria-labels y textos de apoyo

| Elemento | aria-label / texto |
|---|---|
| Enlace del logo | `YOYO · Ir al inicio` |
| Botón menú móvil (abrir) | `Abrir menú` |
| Botón menú móvil (cerrar) | `Cerrar menú` |
| Enlace al carrito (ícono bolsa) | `Tu bolsa, {n} prendas` |
| Badge contador (sin prendas) | *(oculto, no muestra "0")* |
| Badge contador (cap) | `9+` |
| Botón de búsqueda (opcional) | `Buscar prendas` |
| Placeholder de búsqueda (opcional) | `Busca por nombre o categoría` |

---

## 3. Home (`index.html`)

### 3.1 Hero

| Elemento | Texto |
|---|---|
| Eyebrow (línea superior) | `Nueva temporada` |
| Título (serif display) | `Lo que te pones, te acompaña` |
| Subtítulo | `Prendas hechas con alma artesanal para vestir tus días, no solo tu calendario. Tejidos nobles, cortes que duran y un toque que se siente.` |
| CTA primario | `Ver la colección` |
| Scroll-cue (aria-label) | `Desliza para ver más` |

### 3.2 Colecciones destacadas

| Elemento | Texto |
|---|---|
| Eyebrow de sección | `Colecciones` |
| Título de sección | `Encuentra tu temporada` |
| Subtítulo | `Tres formas de empezar. Elige por dónde te late.` |
| Colección 1 · título | `Esenciales` |
| Colección 1 · texto | `Las prendas que se ponen solas cada mañana.` |
| Colección 1 · CTA | `Ver esenciales` |
| Colección 2 · título | `Tejidos` |
| Colección 2 · texto | `Punto noble y abrigos que abrazan el frío.` |
| Colección 2 · CTA | `Ver tejidos` |
| Colección 3 · título | `De noche` |
| Colección 3 · texto | `Vestidos y tacones para las ocasiones que se recuerdan.` |
| Colección 3 · CTA | `Ver de noche` |

> Cada CTA enlaza al catálogo filtrado (`tienda.html` con su filtro de categoría correspondiente).

### 3.3 Novedades

| Elemento | Texto |
|---|---|
| Eyebrow de sección | `Recién tejido` |
| Título de sección | `Novedades` |
| Subtítulo | `Lo último que llegó al taller. Aún huele a nuevo.` |
| CTA "ver todo" | `Ver todas las novedades` |

### 3.4 Tira editorial / Lookbook

| Elemento | Texto |
|---|---|
| Eyebrow | `Lookbook` |
| Cita / manifiesto (serif) | `No hacemos ropa para una temporada. La hacemos para tu vida.` |
| Texto de campaña | `Cada pieza nace de manos que conocen su oficio: cortes pensados, costuras firmes y materiales que envejecen bien. Esto es YOYO.` |
| CTA | `Conoce el taller` |

### 3.5 Newsletter

| Elemento | Texto |
|---|---|
| Eyebrow | `Quédate cerca` |
| Título | `Sé la primera en saberlo` |
| Texto | `Novedades, colecciones y acceso anticipado a las ofertas. Sin saturar tu correo, lo prometemos.` |
| Label del input (accesible) | `Tu correo electrónico` |
| Placeholder del input | `nombre@correo.com` |
| CTA | `Quiero las novedades` |
| Nota de privacidad | `Cuidamos tu correo. Cancela cuando quieras, en un clic.` |
| Mensaje de éxito (inline) | `Listo, te escribiremos pronto.` |
| Error · correo vacío | `Escribe tu correo para suscribirte.` |
| Error · correo inválido | `Revisa tu correo: parece que falta algo, como el “@”.` |

### 3.6 Footer (global)

| Zona | Elemento | Texto |
|---|---|---|
| Marca | Logo | `YOYO` |
| Marca | Claim | `Moda con alma artesanal. Hecha para acompañarte.` |
| Col. Tienda | Título | `Tienda` |
| Col. Tienda | Enlaces | `Novedades` · `Colecciones` · `Ofertas` · `Lookbook` |
| Col. Ayuda | Título | `Ayuda` |
| Col. Ayuda | Enlaces | `Envíos` · `Devoluciones` · `Guía de tallas` · `Contacto` |
| Col. Nosotros | Título | `YOYO` |
| Col. Nosotros | Enlaces | `Sobre YOYO` · `El taller` · `Términos` · `Privacidad` |
| Newsletter mini | Título | `Novedades por correo` |
| Newsletter mini | Placeholder | `nombre@correo.com` |
| Newsletter mini | CTA | `Suscribirme` |
| Redes | aria-label Instagram | `YOYO en Instagram` |
| Redes | aria-label Pinterest | `YOYO en Pinterest` |
| Redes | aria-label TikTok | `YOYO en TikTok` |
| Pie | Copyright | `© 2026 YOYO · Demo sin fines comerciales` |
| Pie | Nota | `Hecho con alma en México.` |

---

## 4. Catálogo (`tienda.html`)

### 4.1 Encabezado

| Elemento | Texto |
|---|---|
| Eyebrow | `Colección completa` |
| Título (serif) | `Tienda` |
| Subtítulo | `Todo lo que tejemos, en un solo lugar. Filtra hasta encontrar lo tuyo.` |
| Contador · plural | `{n} prendas` |
| Contador · singular | `1 prenda` |
| Contador · cero | `Sin prendas` |

### 4.2 Barra de controles y filtros

| Elemento | Texto |
|---|---|
| Botón abrir filtros (móvil) | `Filtrar` |
| Botón cerrar filtros (móvil) | `Cerrar` |
| Botón aplicar (móvil) | `Ver {n} prendas` |
| Título del panel de filtros | `Filtros` |
| Label grupo categoría | `Categoría` |
| Label grupo talla | `Talla` |
| Label grupo precio | `Precio` |
| Precio · input mínimo (aria) | `Precio mínimo` |
| Precio · input máximo (aria) | `Precio máximo` |
| Precio · separador visible | `a` |
| Botón limpiar todo | `Limpiar filtros` |
| Encabezado de chips activos (aria) | `Filtros activos` |
| Chip activo · quitar (aria) | `Quitar filtro {valor}` |

### 4.3 Orden

| Elemento | Texto |
|---|---|
| Label del select (accesible) | `Ordenar por` |
| Opción 1 (default) | `Relevancia` |
| Opción 2 | `Novedades primero` |
| Opción 3 | `Precio: menor a mayor` |
| Opción 4 | `Precio: mayor a menor` |
| Opción 5 | `Nombre: A a Z` |

### 4.4 Badges de product card

| Badge | Texto |
|---|---|
| Novedad | `Nuevo` |
| Oferta | `Oferta` |
| Oferta con porcentaje (opcional) | `−{pct}%` |
| Agotado | `Agotado` |

### 4.5 Product card (apoyos accesibles)

| Elemento | Texto |
|---|---|
| Enlace de la card (aria) | `Ver {nombre}, {precio}` |
| Acción revelada en hover (opcional) | `Ver prenda` |
| Precio anterior (aria) | `Antes {precioAnterior}` |
| Precio actual (aria) | `Ahora {precio}` |

### 4.6 Estado vacío de filtros (sin resultados)

| Elemento | Texto |
|---|---|
| Título | `No encontramos prendas con esos filtros` |
| Texto | `Prueba con menos filtros o amplía el rango de precio. Tu prenda ideal puede estar a un ajuste de distancia.` |
| CTA primario | `Limpiar filtros` |

---

## 5. Detalle de producto (`producto.html?id=`)

### 5.1 Breadcrumb

`Tienda` / `{Categoría}` / `{Nombre del producto}`

| Elemento | Texto |
|---|---|
| Breadcrumb · raíz | `Tienda` |
| Breadcrumb (aria-label nav) | `Ruta de navegación` |

### 5.2 Panel de compra

| Elemento | Texto |
|---|---|
| Precio actual (aria) | `Precio {precio}` |
| Precio anterior (aria) | `Precio anterior {precioAnterior}` |
| Ahorro (opcional) | `Ahorras {monto}` |
| Label selector de color | `Color` |
| Color seleccionado (texto) | `Color: {nombreColor}` |
| Swatch de color (aria) | `Color {nombreColor}` |
| Label selector de talla | `Talla` |
| Enlace guía de tallas | `Guía de tallas` |
| Talla agotada (aria / tooltip) | `Talla {talla}, sin stock` |
| Label stepper de cantidad | `Cantidad` |
| Stepper · restar (aria) | `Quitar una unidad` |
| Stepper · sumar (aria) | `Agregar una unidad` |
| Disponibilidad · en stock | `Disponible` |
| Disponibilidad · pocas unidades | `Quedan pocas` |
| Disponibilidad · agotado | `Agotado por ahora` |

### 5.3 CTA y mensajes de añadir

| Elemento | Texto |
|---|---|
| CTA principal (default) | `Añadir a la bolsa` |
| CTA · estado cargando (opcional) | `Añadiendo…` |
| CTA · producto agotado (deshabilitado) | `Agotado` |
| CTA secundario si agotado | `Avísame cuando vuelva` |
| Error inline · falta talla | `Elige una talla para continuar` |
| Error inline · falta color | `Elige un color para continuar` |
| Confirmación inline (junto al botón) | `Añadido a tu bolsa` |
| Aviso · talla agotada seleccionada | `Esa talla está agotada. Prueba con otra.` |

### 5.4 "Avísame" (captura simulada si está agotado)

| Elemento | Texto |
|---|---|
| Título del bloque | `Te avisamos cuando vuelva` |
| Placeholder | `nombre@correo.com` |
| CTA | `Avísame` |
| Éxito (inline) | `Listo, te escribiremos en cuanto regrese.` |

### 5.5 Acordeón de detalles

| Acordeón | Título | Contenido |
|---|---|---|
| 1 | `Descripción` | *(de `data.js` · campo `descripcion`)* |
| 2 | `Materiales y cuidado` | *(de `data.js` · `materiales` + `cuidados`)* |
| 3 | `Envíos y devoluciones` | Texto fijo, ver 5.6 |

### 5.6 Texto fijo de "Envíos y devoluciones"

```
Enviamos a todo México en 3 a 5 días hábiles. El envío es gratis en pedidos
desde $1,499 MXN; debajo de ese monto, cuesta $99 MXN. ¿No era lo que esperabas?
Tienes 30 días para devolverlo sin costo, siempre que conserve sus etiquetas.
```

> Nota demo: textos informativos, sin proceso de devolución real.

### 5.7 Productos sugeridos

| Elemento | Texto |
|---|---|
| Título de sección | `También te puede gustar` |
| Subtítulo (opcional) | `Más de la misma colección.` |

### 5.8 Estado de error (`?id=` inválido o ausente)

| Elemento | Texto |
|---|---|
| Título | `No encontramos esa prenda` |
| Texto | `Quizá ya no está disponible o el enlace cambió. No te preocupes, tenemos mucho más por mostrarte.` |
| CTA primario | `Volver a la tienda` |
| Encabezado de sugeridos | `Mientras tanto, échales un ojo` |

---

## 6. Carrito / Bolsa (`carrito.html`)

### 6.1 Encabezado

| Elemento | Texto |
|---|---|
| Eyebrow | `Tu selección` |
| Título (serif) | `Tu bolsa` |
| Recuento · plural | `{n} prendas` |
| Recuento · singular | `1 prenda` |

### 6.2 Encabezados de la lista de líneas

| Elemento | Texto |
|---|---|
| Enlace seguir comprando | `Seguir comprando` |
| Atributos de línea (formato) | `Talla {talla} · {color}` |
| Precio unitario (aria) | `Precio por unidad {precio}` |
| Subtotal de línea (aria) | `Subtotal de línea {monto}` |
| Stepper · restar (aria) | `Quitar una unidad de {nombre}` |
| Stepper · sumar (aria) | `Agregar una unidad de {nombre}` |
| Botón eliminar (aria) | `Eliminar {nombre} de la bolsa` |
| Aviso · línea no disponible | `Ya no disponible` |
| Acción junto al aviso | `Eliminar` |

### 6.3 Resumen de compra

| Elemento | Texto |
|---|---|
| Título del resumen | `Resumen` |
| Fila subtotal | `Subtotal` |
| Fila envío · con costo | `Envío` |
| Valor envío · gratis | `Gratis` |
| Fila descuento (con cupón) | `Descuento ({cupon})` |
| Valor descuento | `−{monto}` |
| Fila total | `Total` |
| Nota bajo el total | `Impuestos incluidos. Envío calculado al finalizar.` |
| Nota demo de seguridad | `Compra simulada. Es una demo: no se cobra nada ni se piden datos reales.` |

### 6.4 Nota de envío gratis (barra de progreso)

| Estado | Texto |
|---|---|
| Falta para envío gratis | `Te faltan {monto} para el envío gratis.` |
| Envío gratis alcanzado | `¡Listo! Tu envío es gratis.` |

### 6.5 Campo de cupón

| Elemento | Texto |
|---|---|
| Label (accesible) | `Cupón de descuento` |
| Placeholder | `Escribe tu cupón` |
| Botón aplicar | `Aplicar` |
| Estado · válido aplicado | `Cupón {cupon} aplicado: ahorras {monto}.` |
| Acción quitar cupón | `Quitar` |
| Estado · inválido | `Ese cupón no es válido. Revisa que esté bien escrito.` |
| Estado · ya aplicado | `Ya aplicaste ese cupón.` |
| Estado · campo vacío al aplicar | `Escribe un cupón para aplicarlo.` |
| Pista demo (opcional, sutil) | `¿Tienes un cupón? Prueba YOYO10.` |

> **Cupones demo válidos:** `YOYO10` (−10% del subtotal) · `HOLA200` (−$200 MXN). Documentados en `data.js`.

### 6.6 CTA de checkout

| Elemento | Texto |
|---|---|
| CTA principal | `Finalizar compra` |
| CTA · estado cargando (opcional) | `Procesando…` |

### 6.7 Estado vacío de la bolsa

| Elemento | Texto |
|---|---|
| Título | `Tu bolsa está vacía` |
| Texto | `Todavía no has añadido nada. Date una vuelta: seguro algo te llama.` |
| CTA primario | `Ir a la tienda` |

### 6.8 Confirmación post-checkout (compra simulada)

| Elemento | Texto |
|---|---|
| Eyebrow | `Pedido confirmado` |
| Título | `¡Gracias por tu compra!` |
| Texto | `Recibimos tu pedido y ya lo estamos preparando con cuidado. Te enviamos los detalles a tu correo.` |
| Etiqueta número de pedido | `Número de pedido` |
| Valor número de pedido (formato) | `YOYO-{6 dígitos}` |
| Resumen breve | `{n} prendas · Total {monto}` |
| Nota demo | `Esto es una demo: no se realizó ningún cargo.` |
| CTA primario | `Volver a la tienda` |

---

## 7. Microcopy global · toasts · errores

### 7.1 Toast "Añadido a la bolsa"

| Elemento | Texto |
|---|---|
| Mensaje (formato) | `Añadiste {nombre} a tu bolsa` |
| Acción 1 | `Ver bolsa` |
| Acción 2 | `Seguir comprando` |
| aria-live (región) | *(announce del mismo texto del mensaje)* |

### 7.2 Otros toasts

| Evento | Texto |
|---|---|
| Eliminado de la bolsa | `Eliminaste {nombre} de tu bolsa` |
| Acción deshacer (opcional) | `Deshacer` |
| Cantidad actualizada | `Actualizamos la cantidad` |
| Cupón aplicado | `Cupón aplicado: ahorras {monto}` |
| Cupón quitado | `Quitamos el cupón` |

### 7.3 Errores generales (formato problema + solución, sin culpar)

| Situación | Texto |
|---|---|
| localStorage no disponible | `No pudimos guardar tu bolsa en este navegador. Funcionará durante esta visita, pero se vaciará al cerrar.` |
| Imagen de producto rota (alt) | `Imagen de {nombre} no disponible` |
| Fallo genérico al añadir | `Algo salió mal al añadir tu prenda. Inténtalo de nuevo.` |
| Sin conexión (si aplica) | `Parece que no hay conexión. Revisa tu internet e inténtalo otra vez.` |
| Cantidad máxima alcanzada | `Por ahora no podemos añadir más unidades de esta talla.` |

### 7.4 `<noscript>` (las 4 páginas)

```
Activa JavaScript para ver el catálogo completo y usar tu bolsa.
Mientras tanto, puedes navegar por las secciones del menú.
```

---

## 8. Reglas de formato de números (para el ui-engineer)

- **Moneda:** símbolo antes, separador de miles con coma, sin decimales cuando es entero: `$2,890 MXN`. En contextos compactos (cards), `$2,890` sin "MXN" es aceptable; en el resumen y el total, incluir `MXN`.
- **Descuentos:** siempre con signo menos real `−` (no guion `-`): `−$200`, `−10%`.
- **Porcentaje de oferta:** `−{pct}%` redondeado al entero más cercano.
- **Singular/plural:** respetar las variantes de contador de §4.1 y §6.1 (`1 prenda` / `{n} prendas`).
- **Tipografía de comillas:** usar comillas tipográficas `“ ”` en texto editorial visible (ej. el `“@”` del error de correo).

---

## 9. Handoff

Copy deck completo y alineado con `docs/01-brief-ux.md` (todas las superficies, estados y casos extremos del §5 del brief tienen su string). El catálogo vive en `js/data.js` (18 productos, 7 categorías, validado).

**→ `ui-engineer`:** ya tienes `js/data.js` (datos) y este `docs/03-copy-deck.md` (copy de UI). Junto con `css/tokens.css` + `css/base.css` del visual-designer, puedes arrancar la implementación de las 4 páginas. Copia los textos de aquí literalmente y respeta el glosario (§1.2): es **bolsa**, **añadir**, **talla**, **eliminar**, **finalizar compra**. Sin emojis en ninguna superficie.

Cuando el ui-engineer termine un componente o página, sugiero pasar el resultado al **qa-auditor** para una revisión final de calidad, accesibilidad y responsive.
