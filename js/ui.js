/* =============================================================================
   YOYO · ui.js
   Helpers de render compartidos. Script CLÁSICO (no módulo).
   Toda la API pública se expone en window.YOYO_UI.
   -----------------------------------------------------------------------------
   Incluye:
     · Iconos SVG inline (bolsa, búsqueda, flecha, check, menú, cerrar, estrella…)
     · Formato de moneda MXN
     · Placeholder de imagen de marca (onerror) — una imagen rota no rompe layout
     · Toast con aria-live ("Añadido a la bolsa")
     · Badge de conteo de la bolsa en el header
     · Render de cards / grid de producto
     · Filtros y orden del catálogo
     · Galería y selectores del detalle
     · Render de la bolsa (carrito)
   Depende de window.YOYO_DATA (data.js) y window.YOYO_CART (cart.js).
   ============================================================================= */

(function (global) {
  "use strict";

  var doc = global.document;

  /* =============================================================================
     1 · ICONOS SVG (sin emojis). Devuelven strings de markup inline.
     `aria-hidden="true" focusable="false"` salvo que el icono sea el único
     contenido accesible (ahí el contenedor lleva aria-label).
     ========================================================================== */
  var ICONOS = {
    bolsa:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 8h12l-1 11a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 19L6 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    busqueda:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>',
    flecha:
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
    menu:
      '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>',
    cerrar:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>',
    estrella:
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false"><path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9 6.7 19.7l1-5.8L3.5 9.7l5.9-.9L12 3Z"/></svg>',
    basura:
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 7h16"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M6 7l1 12a2 2 0 0 0 2 1.8h6A2 2 0 0 0 17 19l1-12"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>',
    mas:
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
    menos:
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M5 12h14"/></svg>',
    chevron:
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg>',
    quitar:
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>',
    instagram:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>',
    pinterest:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9.5 20.5c-.4-1.6-.1-3.4.3-5 .4-1.7 1.3-5.3 1.3-5.3a3 3 0 1 1 2.8 1.2c-.7 2.8 1.4 4 3.1 2.7 1.9-1.6 1.9-5.6-.6-7.3-2.7-1.9-7-1-8.3 2.2-.5 1.2-.3 2.6.4 3.5"/></svg>',
    tiktok:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 4c.4 2.3 2 3.9 4.5 4.2"/></svg>',
    monograma:
      '<svg viewBox="0 0 120 120" width="64" height="64" fill="none" aria-hidden="true" focusable="false"><text x="60" y="74" text-anchor="middle" font-family="Iowan Old Style, Palatino, Georgia, serif" font-size="46" font-weight="700" fill="currentColor" letter-spacing="2">YO</text></svg>'
  };

  function icono(nombre) {
    return ICONOS[nombre] || "";
  }

  /* =============================================================================
     2 · FORMATO DE MONEDA MXN
     · símbolo antes, miles con coma, sin decimales para enteros.
     · `conMoneda=true` añade " MXN" (resumen, total).
     · descuentos con signo menos real "−".
     ========================================================================== */
  function formatearMiles(n) {
    var entero = Math.round(Math.abs(n));
    return entero.toLocaleString("es-MX");
  }

  function formatearPrecio(n, conMoneda) {
    var signo = n < 0 ? "−" : "";
    var texto = signo + "$" + formatearMiles(n);
    return conMoneda ? texto + " MXN" : texto;
  }

  function formatearDescuento(n, conMoneda) {
    // Siempre con signo menos real.
    return "−$" + formatearMiles(n) + (conMoneda ? " MXN" : "");
  }

  function porcentajeOferta(precio, precioAnterior) {
    if (!precioAnterior || precioAnterior <= precio) {
      return 0;
    }
    return Math.round(((precioAnterior - precio) / precioAnterior) * 100);
  }

  /* Singular/plural del contador de prendas. */
  function textoPrendas(n) {
    if (n === 0) {
      return "Sin prendas";
    }
    if (n === 1) {
      return "1 prenda";
    }
    return n + " prendas";
  }

  /* =============================================================================
     3 · UTILIDADES DOM
     ========================================================================== */
  function escaparHtml(str) {
    if (str === null || str === undefined) {
      return "";
    }
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escaparAttr(str) {
    return escaparHtml(str);
  }

  function $(sel, raiz) {
    return (raiz || doc).querySelector(sel);
  }

  function $all(sel, raiz) {
    return Array.prototype.slice.call((raiz || doc).querySelectorAll(sel));
  }

  /* =============================================================================
     4 · IMÁGENES CON FALLBACK
     Cada <img> de producto lleva un onerror que sustituye por el placeholder de
     marca, marcando el wrapper para que el CSS pinte la veta + monograma.
     Marcamos `data-fallback` para evitar bucles si el placeholder también falla.
     ========================================================================== */
  function manejarImagenRota(img) {
    if (img.getAttribute("data-roto") === "1") {
      return;
    }
    img.setAttribute("data-roto", "1");
    img.style.visibility = "hidden";
    var wrap = img.closest("[data-img-wrap]");
    if (wrap) {
      wrap.classList.add("img-rota");
    }
  }

  // Delegación global: cualquier img de producto que falle activa el placeholder.
  function instalarFallbackImagenes() {
    doc.addEventListener(
      "error",
      function (e) {
        var t = e.target;
        if (t && t.tagName === "IMG" && t.hasAttribute("data-producto-img")) {
          manejarImagenRota(t);
        }
      },
      true // captura: los eventos error no burbujean
    );
  }

  /**
   * Genera el markup de una imagen de producto envuelta para el placeholder.
   * @param {object} opts { src, alt, ratio, lazy, sizesClass, extraImgClass }
   */
  function imagenProducto(opts) {
    var src = opts.src || "";
    var alt = opts.alt || "";
    var lazy = opts.lazy !== false;
    var wrapClase = opts.wrapClase || "media-prenda";
    var imgClase = opts.imgClase || "cover";

    var loadingAttr = lazy ? ' loading="lazy" decoding="async"' : ' decoding="async"';
    var dims = opts.width && opts.height ? ' width="' + opts.width + '" height="' + opts.height + '"' : "";

    var placeholder =
      '<span class="img-placeholder" aria-hidden="true">' + icono("monograma") + "</span>";

    return (
      '<span class="' + wrapClase + '" data-img-wrap>' +
      placeholder +
      '<img class="' + imgClase + '" data-producto-img src="' + escaparAttr(src) + '" alt="' + escaparAttr(alt) + '"' + dims + loadingAttr + ">" +
      "</span>"
    );
  }

  /* =============================================================================
     5 · BADGE DE LA BOLSA EN EL HEADER
     Rehidrata el contador en cada carga (sin parpadeo de "0"): 0 → oculto,
     99+ → "9+". Actualiza también el aria-label del enlace.
     ========================================================================== */
  function pintarConteoBolsa() {
    var total = global.YOYO_CART ? global.YOYO_CART.contarItems() : 0;
    var badges = $all("[data-bolsa-badge]");
    var enlaces = $all("[data-bolsa-enlace]");

    badges.forEach(function (badge) {
      if (total <= 0) {
        badge.hidden = true;
        badge.textContent = "";
      } else {
        badge.hidden = false;
        badge.textContent = total > 9 ? "9+" : String(total);
      }
    });

    enlaces.forEach(function (enlace) {
      enlace.setAttribute("aria-label", "Tu bolsa, " + textoPrendas(total));
    });
  }

  /* =============================================================================
     6 · TOAST con aria-live
     Contenedor #yoyo-toasts (posicionado por CSS). Auto-oculta ~3.8s.
     ========================================================================== */
  var TOAST_DURACION = 3800;

  function contenedorToasts() {
    var cont = doc.getElementById("yoyo-toasts");
    if (!cont) {
      cont = doc.createElement("div");
      cont.id = "yoyo-toasts";
      cont.className = "toasts";
      cont.setAttribute("role", "status");
      cont.setAttribute("aria-live", "polite");
      cont.setAttribute("aria-atomic", "false");
      doc.body.appendChild(cont);
    }
    return cont;
  }

  /**
   * Muestra un toast.
   * @param {object} opts { mensaje, acciones: [{texto, href, onClick}] }
   */
  function mostrarToast(opts) {
    var cont = contenedorToasts();
    var toast = doc.createElement("div");
    toast.className = "toast";

    var html =
      '<span class="toast__icono" aria-hidden="true">' + icono("check") + "</span>" +
      '<div class="toast__cuerpo">' +
      '<p class="toast__mensaje">' + escaparHtml(opts.mensaje || "") + "</p>";

    if (opts.acciones && opts.acciones.length) {
      html += '<div class="toast__acciones">';
      for (var i = 0; i < opts.acciones.length; i++) {
        var ac = opts.acciones[i];
        if (ac.href) {
          html +=
            '<a class="boton-texto" href="' + escaparAttr(ac.href) + '">' + escaparHtml(ac.texto) + "</a>";
        } else {
          html +=
            '<button type="button" class="boton-texto" data-toast-accion="' + i + '">' +
            escaparHtml(ac.texto) +
            "</button>";
        }
      }
      html += "</div>";
    }
    html += "</div>";
    html +=
      '<button type="button" class="toast__cerrar" aria-label="Cerrar aviso" data-toast-cerrar>' +
      icono("quitar") +
      "</button>";

    toast.innerHTML = html;

    // Conectar acciones de tipo botón.
    if (opts.acciones) {
      $all("[data-toast-accion]", toast).forEach(function (btn) {
        var idx = parseInt(btn.getAttribute("data-toast-accion"), 10);
        var ac = opts.acciones[idx];
        btn.addEventListener("click", function () {
          if (ac && typeof ac.onClick === "function") {
            ac.onClick();
          }
          quitarToast(toast);
        });
      });
    }

    $(".toast__cerrar", toast).addEventListener("click", function () {
      quitarToast(toast);
    });

    cont.appendChild(toast);
    // Hook para motion (entrada). Forzamos reflow para que la transición corra.
    /* eslint-disable-next-line no-unused-expressions */
    toast.offsetHeight;
    toast.classList.add("is-visible");

    var temporizador = global.setTimeout(function () {
      quitarToast(toast);
    }, TOAST_DURACION);

    toast.addEventListener("mouseenter", function () {
      global.clearTimeout(temporizador);
    });

    return toast;
  }

  function quitarToast(toast) {
    if (!toast || toast.getAttribute("data-saliendo") === "1") {
      return;
    }
    toast.setAttribute("data-saliendo", "1");
    toast.classList.remove("is-visible");
    toast.classList.add("is-saliendo");
    global.setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 350);
  }

  /* =============================================================================
     7 · CARD DE PRODUCTO (catálogo, novedades, sugeridos)
     ========================================================================== */
  function nombreCategoria(slug) {
    var cats = (global.YOYO_DATA && global.YOYO_DATA.categorias) || [];
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].slug === slug) {
        return cats[i].nombre;
      }
    }
    return slug;
  }

  function estaAgotadoGlobal(producto) {
    var tallas = producto.tallas || [];
    var agotadas = producto.agotadas || [];
    return tallas.length > 0 && agotadas.length >= tallas.length;
  }

  function tarjetaProducto(producto) {
    var agotado = estaAgotadoGlobal(producto);
    var enOferta = !!producto.enOferta && producto.precioAnterior;
    var pct = enOferta ? porcentajeOferta(producto.precio, producto.precioAnterior) : 0;
    var href = "producto.html?id=" + encodeURIComponent(producto.id);

    var badges = "";
    if (agotado) {
      badges += '<span class="badge badge--agotado">Agotado</span>';
    } else if (enOferta) {
      badges +=
        '<span class="badge badge--oferta">Oferta' +
        (pct ? ' <span class="badge__pct">−' + pct + "%</span>" : "") +
        "</span>";
    } else if (producto.esNovedad) {
      badges += '<span class="badge badge--novedad">Nuevo</span>';
    }

    var ariaPrecio = enOferta
      ? "Antes " + formatearPrecio(producto.precioAnterior) + ", ahora " + formatearPrecio(producto.precio)
      : "Precio " + formatearPrecio(producto.precio);

    var precioHtml;
    if (enOferta) {
      precioHtml =
        '<p class="tarjeta-producto__precios">' +
        '<span class="precio precio--anterior" aria-hidden="true">' + formatearPrecio(producto.precioAnterior) + "</span> " +
        '<span class="precio precio--oferta">' + formatearPrecio(producto.precio) + "</span>" +
        "</p>";
    } else {
      precioHtml = '<p class="tarjeta-producto__precios"><span class="precio">' + formatearPrecio(producto.precio) + "</span></p>";
    }

    var img = imagenProducto({
      src: (producto.imagenes && producto.imagenes[0]) || "",
      alt: producto.nombre,
      lazy: true,
      wrapClase: "tarjeta-producto__media",
      width: 600,
      height: 800
    });

    return (
      '<article class="tarjeta-producto' + (agotado ? " es-agotado" : "") + '" data-reveal>' +
      '<a class="tarjeta-producto__enlace" href="' + href + '" aria-label="Ver ' + escaparAttr(producto.nombre) + ", " + formatearPrecio(producto.precio) + '">' +
      '<span class="tarjeta-producto__imagen">' +
      img +
      (badges ? '<span class="tarjeta-producto__badges">' + badges + "</span>" : "") +
      '<span class="tarjeta-producto__hover" aria-hidden="true">Ver prenda</span>' +
      "</span>" +
      '<span class="tarjeta-producto__info">' +
      '<span class="tarjeta-producto__categoria">' + escaparHtml(nombreCategoria(producto.categoria)) + "</span>" +
      '<span class="tarjeta-producto__nombre">' + escaparHtml(producto.nombre) + "</span>" +
      '<span class="sr-only">' + ariaPrecio + "</span>" +
      precioHtml +
      "</span>" +
      "</a>" +
      "</article>"
    );
  }

  function renderGrid(contenedor, productos) {
    if (!contenedor) {
      return;
    }
    if (!productos || productos.length === 0) {
      contenedor.innerHTML = "";
      return;
    }
    var html = "";
    for (var i = 0; i < productos.length; i++) {
      html += tarjetaProducto(productos[i]);
    }
    contenedor.innerHTML = html;
  }

  /* =============================================================================
     8 · CATÁLOGO — filtros y orden (lógica pura, sin DOM)
     ========================================================================== */
  /**
   * Filtra y ordena productos.
   * @param {Array} productos catálogo completo
   * @param {object} filtros { categorias:[], tallas:[], precioMin, precioMax }
   * @param {string} orden  'relevancia' | 'novedad' | 'precio-asc' | 'precio-desc' | 'nombre'
   */
  function filtrarYOrdenar(productos, filtros, orden) {
    filtros = filtros || {};
    var cats = filtros.categorias || [];
    var tallas = filtros.tallas || [];
    var min = typeof filtros.precioMin === "number" ? filtros.precioMin : null;
    var max = typeof filtros.precioMax === "number" ? filtros.precioMax : null;

    var lista = productos.filter(function (p) {
      // Categoría (OR dentro del grupo).
      if (cats.length && cats.indexOf(p.categoria) === -1) {
        return false;
      }
      // Talla: el producto debe ofrecer al menos una de las tallas pedidas
      // y NO estar agotada esa talla (OR dentro del grupo).
      if (tallas.length) {
        var coincideTalla = false;
        for (var i = 0; i < tallas.length; i++) {
          var t = tallas[i];
          if ((p.tallas || []).indexOf(t) !== -1 && (p.agotadas || []).indexOf(t) === -1) {
            coincideTalla = true;
            break;
          }
        }
        if (!coincideTalla) {
          return false;
        }
      }
      // Precio (rango inclusivo).
      if (min !== null && p.precio < min) {
        return false;
      }
      if (max !== null && p.precio > max) {
        return false;
      }
      return true;
    });

    var orig = productos.slice();
    function indiceOriginal(p) {
      return orig.indexOf(p);
    }

    lista.sort(function (a, b) {
      switch (orden) {
        case "precio-asc":
          return a.precio - b.precio;
        case "precio-desc":
          return b.precio - a.precio;
        case "nombre":
          return a.nombre.localeCompare(b.nombre, "es");
        case "novedad":
          if (!!b.esNovedad === !!a.esNovedad) {
            return indiceOriginal(a) - indiceOriginal(b);
          }
          return (b.esNovedad ? 1 : 0) - (a.esNovedad ? 1 : 0);
        case "relevancia":
        default:
          // Relevancia: destacados primero, luego novedades, luego orden de catálogo.
          var ra = (a.destacadoHome ? 2 : 0) + (a.esNovedad ? 1 : 0);
          var rb = (b.destacadoHome ? 2 : 0) + (b.esNovedad ? 1 : 0);
          if (rb !== ra) {
            return rb - ra;
          }
          return indiceOriginal(a) - indiceOriginal(b);
      }
    });

    return lista;
  }

  /* =============================================================================
     9 · DETALLE — galería y selectores
     ========================================================================== */
  function renderGaleria(producto) {
    var principal = $("[data-galeria-principal]");
    var thumbs = $("[data-galeria-thumbs]");
    if (!principal) {
      return;
    }
    var imagenes = (producto.imagenes && producto.imagenes.length ? producto.imagenes : [""]).slice();

    principal.innerHTML = imagenProducto({
      src: imagenes[0],
      alt: producto.nombre,
      lazy: false,
      wrapClase: "galeria__media",
      width: 900,
      height: 1200
    });

    if (thumbs) {
      var html = "";
      for (var i = 0; i < imagenes.length; i++) {
        html +=
          '<button type="button" class="galeria__thumb' + (i === 0 ? " es-activa" : "") + '" ' +
          'data-galeria-thumb="' + i + '" aria-label="Ver imagen ' + (i + 1) + " de " + escaparAttr(producto.nombre) + '"' +
          (i === 0 ? ' aria-current="true"' : "") + ">" +
          imagenProducto({
            src: imagenes[i],
            alt: "",
            lazy: true,
            wrapClase: "galeria__thumb-media",
            width: 150,
            height: 200
          }) +
          "</button>";
      }
      thumbs.innerHTML = html;

      $all("[data-galeria-thumb]", thumbs).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var idx = parseInt(btn.getAttribute("data-galeria-thumb"), 10);
          principal.innerHTML = imagenProducto({
            src: imagenes[idx],
            alt: producto.nombre,
            lazy: false,
            wrapClase: "galeria__media",
            width: 900,
            height: 1200
          });
          $all("[data-galeria-thumb]", thumbs).forEach(function (b) {
            b.classList.remove("es-activa");
            b.removeAttribute("aria-current");
          });
          btn.classList.add("es-activa");
          btn.setAttribute("aria-current", "true");
        });
      });
    }
  }

  /* =============================================================================
     10 · BOLSA (carrito) — render de líneas y resumen lo maneja main.js, pero
     aquí van helpers de markup de línea reutilizables.
     ========================================================================== */
  function lineaBolsa(linea) {
    var atributos = [];
    if (linea.talla) {
      atributos.push("Talla " + linea.talla);
    }
    if (linea.color) {
      atributos.push(linea.color);
    }
    var textoAtributos = atributos.join(" · ");

    var img = imagenProducto({
      src: linea.imagen,
      alt: linea.noDisponible ? "Imagen no disponible" : linea.nombre,
      lazy: true,
      wrapClase: "linea-bolsa__media",
      width: 150,
      height: 200
    });

    var claveDatos =
      ' data-id="' + escaparAttr(linea.idProducto) + '"' +
      ' data-talla="' + escaparAttr(linea.talla) + '"' +
      ' data-color="' + escaparAttr(linea.color) + '"';

    var enlaceNombre = linea.noDisponible
      ? '<span class="linea-bolsa__nombre">' + escaparHtml(linea.nombre) + "</span>"
      : '<a class="linea-bolsa__nombre" href="producto.html?id=' + encodeURIComponent(linea.idProducto) + '">' + escaparHtml(linea.nombre) + "</a>";

    var bloquePrecio = linea.noDisponible
      ? '<p class="linea-bolsa__aviso">Ya no disponible</p>'
      : '<p class="linea-bolsa__unitario"><span class="sr-only">Precio por unidad </span><span class="precio">' + formatearPrecio(linea.precioUnitario) + "</span></p>";

    var controles = linea.noDisponible
      ? ""
      : '<div class="stepper" data-stepper>' +
        '<button type="button" class="stepper__boton" data-stepper-menos aria-label="Quitar una unidad de ' + escaparAttr(linea.nombre) + '"' + (linea.cantidad <= 1 ? " disabled" : "") + ">" + icono("menos") + "</button>" +
        '<span class="stepper__valor nums" data-stepper-valor aria-live="polite">' + linea.cantidad + "</span>" +
        '<button type="button" class="stepper__boton" data-stepper-mas aria-label="Agregar una unidad de ' + escaparAttr(linea.nombre) + '">' + icono("mas") + "</button>" +
        "</div>";

    var subtotalHtml = linea.noDisponible
      ? ""
      : '<p class="linea-bolsa__subtotal"><span class="sr-only">Subtotal de línea </span><span class="precio">' + formatearPrecio(linea.subtotal) + "</span></p>";

    return (
      '<li class="linea-bolsa' + (linea.noDisponible ? " es-no-disponible" : "") + '" data-linea' + claveDatos + ">" +
      '<div class="linea-bolsa__imagen">' + img + "</div>" +
      '<div class="linea-bolsa__detalle">' +
      enlaceNombre +
      (textoAtributos ? '<p class="linea-bolsa__atributos">' + escaparHtml(textoAtributos) + "</p>" : "") +
      bloquePrecio +
      "</div>" +
      '<div class="linea-bolsa__acciones">' +
      controles +
      subtotalHtml +
      '<button type="button" class="linea-bolsa__eliminar" data-eliminar aria-label="Eliminar ' + escaparAttr(linea.nombre) + ' de la bolsa">' + icono("basura") + "</button>" +
      "</div>" +
      "</li>"
    );
  }

  /* =============================================================================
     11 · HEADER — listener de scroll para .is-scrolled (hook de motion).
     El motion-engineer estiliza la transición; aquí solo añadimos/quitamos clase.
     ========================================================================== */
  function instalarHeaderScroll() {
    var header = $("[data-header]");
    if (!header) {
      return;
    }
    var tic = false;
    function actualizar() {
      tic = false;
      if (global.scrollY > 24) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }
    global.addEventListener(
      "scroll",
      function () {
        if (!tic) {
          tic = true;
          global.requestAnimationFrame(actualizar);
        }
      },
      { passive: true }
    );
    actualizar();
  }

  /* =============================================================================
     12 · MENÚ MÓVIL (drawer) — apertura/cierre accesible.
     ========================================================================== */
  function instalarMenuMovil() {
    var abrir = $("[data-menu-abrir]");
    var cerrar = $("[data-menu-cerrar]");
    var panel = $("[data-menu-panel]");
    var velo = $("[data-menu-velo]");
    if (!abrir || !panel) {
      return;
    }

    function abrirMenu() {
      panel.classList.add("is-abierto");
      if (velo) {
        velo.classList.add("is-visible");
      }
      abrir.setAttribute("aria-expanded", "true");
      doc.body.classList.add("menu-abierto");
      var primerEnlace = $("a, button", panel);
      if (primerEnlace) {
        primerEnlace.focus();
      }
    }
    function cerrarMenu() {
      panel.classList.remove("is-abierto");
      if (velo) {
        velo.classList.remove("is-visible");
      }
      abrir.setAttribute("aria-expanded", "false");
      doc.body.classList.remove("menu-abierto");
      abrir.focus();
    }

    abrir.addEventListener("click", abrirMenu);
    if (cerrar) {
      cerrar.addEventListener("click", cerrarMenu);
    }
    if (velo) {
      velo.addEventListener("click", cerrarMenu);
    }
    doc.addEventListener("keydown", function (e) {
      if (!panel.classList.contains("is-abierto")) {
        return;
      }
      if (e.key === "Escape") {
        cerrarMenu();
        return;
      }
      // Focus trap: mientras el drawer está abierto, Tab/Shift+Tab ciclan dentro
      // del panel (no se escapan al contenido de fondo). WCAG 2.4.3.
      if (e.key === "Tab") {
        var foco = $all('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', panel).filter(function (el) {
          return el.offsetParent !== null || el === doc.activeElement;
        });
        if (!foco.length) {
          return;
        }
        var primero = foco[0];
        var ultimo = foco[foco.length - 1];
        if (e.shiftKey && doc.activeElement === primero) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && doc.activeElement === ultimo) {
          e.preventDefault();
          primero.focus();
        }
      }
    });
    // Cerrar al pulsar un enlace de navegación.
    $all("a", panel).forEach(function (a) {
      a.addEventListener("click", cerrarMenu);
    });
  }

  /* =============================================================================
     13 · Exposición
     ========================================================================== */
  global.YOYO_UI = {
    icono: icono,
    formatearPrecio: formatearPrecio,
    formatearDescuento: formatearDescuento,
    formatearMiles: formatearMiles,
    porcentajeOferta: porcentajeOferta,
    textoPrendas: textoPrendas,
    escaparHtml: escaparHtml,
    escaparAttr: escaparAttr,
    $: $,
    $all: $all,
    imagenProducto: imagenProducto,
    instalarFallbackImagenes: instalarFallbackImagenes,
    pintarConteoBolsa: pintarConteoBolsa,
    mostrarToast: mostrarToast,
    tarjetaProducto: tarjetaProducto,
    renderGrid: renderGrid,
    nombreCategoria: nombreCategoria,
    estaAgotadoGlobal: estaAgotadoGlobal,
    filtrarYOrdenar: filtrarYOrdenar,
    renderGaleria: renderGaleria,
    lineaBolsa: lineaBolsa,
    instalarHeaderScroll: instalarHeaderScroll,
    instalarMenuMovil: instalarMenuMovil
  };
})(window);
