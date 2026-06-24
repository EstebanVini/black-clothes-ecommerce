/* =============================================================================
   YOYO · main.js
   Inicialización por página. Script CLÁSICO (no módulo).
   Detecta la página por el atributo data-pagina del <body> y conecta eventos.
   Depende de: data.js, cart.js, ui.js (cargados antes).
   ============================================================================= */

(function (global) {
  "use strict";

  var doc = global.document;
  var UI = global.YOYO_UI;
  var CART = global.YOYO_CART;
  var DATA = global.YOYO_DATA;

  var $ = UI.$;
  var $all = UI.$all;

  /* =============================================================================
     COMÚN A TODAS LAS PÁGINAS
     ========================================================================== */
  function initComun() {
    UI.instalarFallbackImagenes();
    UI.instalarHeaderScroll();
    UI.instalarMenuMovil();
    UI.pintarConteoBolsa();

    // Rehidratar el badge ante cambios de la bolsa (otras pestañas / acciones).
    CART.suscribir(UI.pintarConteoBolsa);
    global.addEventListener("storage", function (e) {
      if (e.key === CART.STORAGE_KEY) {
        UI.pintarConteoBolsa();
      }
    });

    // Aviso si localStorage no está disponible (una sola vez por carga).
    if (!CART.almacenamientoDisponible) {
      // Aviso discreto, no bloqueante.
      global.setTimeout(function () {
        UI.mostrarToast({
          mensaje:
            "No pudimos guardar tu bolsa en este navegador. Funcionará durante esta visita, pero se vaciará al cerrar."
        });
      }, 600);
    }
  }

  /* =============================================================================
     NEWSLETTER (Home + footer) — validación client-side, éxito inline.
     ========================================================================== */
  function validarCorreo(valor) {
    var v = (valor || "").trim();
    if (!v) {
      return "vacio";
    }
    // Validación simple y honesta (no exhaustiva): algo@algo.algo
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(v) ? "ok" : "invalido";
  }

  function initNewsletters() {
    $all("[data-newsletter]").forEach(function (form) {
      var input = $("input[type=email], input[type=text]", form);
      var mensaje = $("[data-newsletter-mensaje]", form);
      var boton = $("button[type=submit], button:not([type])", form);

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var estado = validarCorreo(input ? input.value : "");

        if (estado === "vacio") {
          mostrarMensajeForm(mensaje, "Escribe tu correo para suscribirte.", "error");
          if (input) {
            input.setAttribute("aria-invalid", "true");
            input.focus();
          }
          return;
        }
        if (estado === "invalido") {
          mostrarMensajeForm(mensaje, "Revisa tu correo: parece que falta algo, como el “@”.", "error");
          if (input) {
            input.setAttribute("aria-invalid", "true");
            input.focus();
          }
          return;
        }

        // Éxito (sin backend).
        if (input) {
          input.removeAttribute("aria-invalid");
          input.value = "";
        }
        mostrarMensajeForm(mensaje, "Listo, te escribiremos pronto.", "exito");
        if (boton) {
          boton.disabled = true;
          global.setTimeout(function () {
            boton.disabled = false;
          }, 2500);
        }
      });
    });
  }

  function mostrarMensajeForm(el, texto, tipo) {
    if (!el) {
      return;
    }
    el.textContent = texto;
    el.className = "form-mensaje form-mensaje--" + tipo;
    el.hidden = false;
  }

  /* =============================================================================
     PÁGINA: HOME (index.html)
     ========================================================================== */
  function initHome() {
    // Hero: respetar reduced-motion / save-data (no autoreproducir).
    var video = $("[data-hero-video]");
    if (video) {
      var reduce = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var saveData = global.navigator && global.navigator.connection && global.navigator.connection.saveData;
      if (reduce || saveData) {
        try {
          video.removeAttribute("autoplay");
          video.pause();
        } catch (e) {
          /* el poster cubre */
        }
      } else {
        var intento = video.play();
        if (intento && typeof intento.catch === "function") {
          intento.catch(function () {
            /* autoplay bloqueado: el poster cubre, nada que hacer */
          });
        }
      }
    }

    // Novedades: productos esNovedad o destacadoHome.
    var contenedorNovedades = $("[data-novedades]");
    if (contenedorNovedades) {
      var novedades = DATA.productos.filter(function (p) {
        return p.esNovedad || p.destacadoHome;
      });
      // Ordenar: novedades reales primero, máx 8.
      novedades.sort(function (a, b) {
        return (b.esNovedad ? 1 : 0) - (a.esNovedad ? 1 : 0);
      });
      UI.renderGrid(contenedorNovedades, novedades.slice(0, 8));
    }
  }

  /* =============================================================================
     PÁGINA: CATÁLOGO (tienda.html)
     ========================================================================== */
  function initCatalogo() {
    var grid = $("[data-grid]");
    var vacio = $("[data-grid-vacio]");
    var contador = $("[data-contador]");
    var selectOrden = $("[data-orden]");
    var chipsActivos = $("[data-chips-activos]");
    var formFiltros = $("[data-filtros]");
    var btnLimpiar = $all("[data-limpiar]");
    var precioMinInput = $("[data-precio-min]");
    var precioMaxInput = $("[data-precio-max]");

    if (!grid) {
      return;
    }

    var estado = {
      categorias: [],
      tallas: [],
      precioMin: null,
      precioMax: null,
      orden: "relevancia"
    };

    // Lectura inicial de ?categoria= en la URL.
    var params = new global.URLSearchParams(global.location.search);
    var catUrl = params.get("categoria");
    if (catUrl) {
      // Puede venir como lista separada por comas.
      catUrl.split(",").forEach(function (c) {
        c = c.trim();
        if (c && estado.categorias.indexOf(c) === -1) {
          estado.categorias.push(c);
        }
      });
    }

    // Marcar los checkboxes/chips de categoría que vengan en la URL.
    function sincronizarControlesDesdeEstado() {
      $all("[data-filtro-categoria]").forEach(function (input) {
        input.checked = estado.categorias.indexOf(input.value) !== -1;
      });
      $all("[data-filtro-talla]").forEach(function (input) {
        input.checked = estado.tallas.indexOf(input.value) !== -1;
      });
    }

    function leerFiltrosDesdeControles() {
      estado.categorias = $all("[data-filtro-categoria]")
        .filter(function (i) {
          return i.checked;
        })
        .map(function (i) {
          return i.value;
        });
      estado.tallas = $all("[data-filtro-talla]")
        .filter(function (i) {
          return i.checked;
        })
        .map(function (i) {
          return i.value;
        });

      var min = precioMinInput && precioMinInput.value !== "" ? parseInt(precioMinInput.value, 10) : null;
      var max = precioMaxInput && precioMaxInput.value !== "" ? parseInt(precioMaxInput.value, 10) : null;
      estado.precioMin = isNaN(min) ? null : min;
      estado.precioMax = isNaN(max) ? null : max;
    }

    function etiquetaChip(tipo, valor) {
      if (tipo === "categoria") {
        return UI.nombreCategoria(valor);
      }
      if (tipo === "talla") {
        return "Talla " + valor;
      }
      if (tipo === "precio") {
        return valor;
      }
      return valor;
    }

    function pintarChips() {
      if (!chipsActivos) {
        return;
      }
      var partes = [];
      estado.categorias.forEach(function (c) {
        partes.push({ tipo: "categoria", valor: c, texto: etiquetaChip("categoria", c) });
      });
      estado.tallas.forEach(function (t) {
        partes.push({ tipo: "talla", valor: t, texto: etiquetaChip("talla", t) });
      });
      if (estado.precioMin !== null || estado.precioMax !== null) {
        var min = estado.precioMin !== null ? UI.formatearPrecio(estado.precioMin) : "$0";
        var max = estado.precioMax !== null ? UI.formatearPrecio(estado.precioMax) : "Máx";
        partes.push({ tipo: "precio", valor: "precio", texto: min + " a " + max });
      }

      if (partes.length === 0) {
        chipsActivos.innerHTML = "";
        chipsActivos.hidden = true;
        return;
      }

      chipsActivos.hidden = false;
      var html = '<span class="chips-activos__titulo">Filtros activos</span>';
      partes.forEach(function (p) {
        html +=
          '<button type="button" class="chip-filtro chip-filtro--activo" ' +
          'data-quitar-chip data-tipo="' + UI.escaparAttr(p.tipo) + '" data-valor="' + UI.escaparAttr(p.valor) + '" ' +
          'aria-label="Quitar filtro ' + UI.escaparAttr(p.texto) + '">' +
          "<span>" + UI.escaparHtml(p.texto) + "</span>" +
          '<span class="chip-filtro__quitar" aria-hidden="true">' + UI.icono("quitar") + "</span>" +
          "</button>";
      });
      html += '<button type="button" class="boton-texto" data-limpiar>Limpiar filtros</button>';
      chipsActivos.innerHTML = html;

      $all("[data-quitar-chip]", chipsActivos).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var tipo = btn.getAttribute("data-tipo");
          var valor = btn.getAttribute("data-valor");
          if (tipo === "categoria") {
            estado.categorias = estado.categorias.filter(function (c) {
              return c !== valor;
            });
          } else if (tipo === "talla") {
            estado.tallas = estado.tallas.filter(function (t) {
              return t !== valor;
            });
          } else if (tipo === "precio") {
            estado.precioMin = null;
            estado.precioMax = null;
            if (precioMinInput) precioMinInput.value = "";
            if (precioMaxInput) precioMaxInput.value = "";
          }
          sincronizarControlesDesdeEstado();
          render();
        });
      });

      // El "Limpiar filtros" recién pintado.
      $all("[data-limpiar]", chipsActivos).forEach(function (b) {
        b.addEventListener("click", limpiarTodo);
      });
    }

    function actualizarContador(n) {
      if (contador) {
        contador.textContent = UI.textoPrendas(n);
      }
      // Botón "Ver N prendas" del drawer móvil.
      var btnAplicar = $("[data-aplicar-filtros]");
      if (btnAplicar) {
        btnAplicar.textContent = "Ver " + UI.textoPrendas(n);
      }
    }

    function render() {
      var resultado = UI.filtrarYOrdenar(DATA.productos, estado, estado.orden);
      actualizarContador(resultado.length);
      pintarChips();

      if (resultado.length === 0) {
        grid.innerHTML = "";
        grid.hidden = true;
        if (vacio) {
          vacio.hidden = false;
        }
      } else {
        grid.hidden = false;
        if (vacio) {
          vacio.hidden = true;
        }
        UI.renderGrid(grid, resultado);
      }
    }

    function limpiarTodo() {
      estado.categorias = [];
      estado.tallas = [];
      estado.precioMin = null;
      estado.precioMax = null;
      if (precioMinInput) precioMinInput.value = "";
      if (precioMaxInput) precioMaxInput.value = "";
      if (selectOrden) {
        selectOrden.value = "relevancia";
        estado.orden = "relevancia";
      }
      sincronizarControlesDesdeEstado();
      render();
    }

    // Conectar controles de filtro (cambio en vivo).
    $all("[data-filtro-categoria], [data-filtro-talla]").forEach(function (input) {
      input.addEventListener("change", function () {
        leerFiltrosDesdeControles();
        render();
      });
    });
    [precioMinInput, precioMaxInput].forEach(function (input) {
      if (input) {
        input.addEventListener("change", function () {
          leerFiltrosDesdeControles();
          render();
        });
      }
    });

    if (selectOrden) {
      selectOrden.addEventListener("change", function () {
        estado.orden = selectOrden.value;
        render();
      });
    }

    btnLimpiar.forEach(function (b) {
      b.addEventListener("click", limpiarTodo);
    });

    if (formFiltros) {
      formFiltros.addEventListener("submit", function (e) {
        e.preventDefault();
        leerFiltrosDesdeControles();
        render();
      });
    }

    // Drawer móvil de filtros.
    initDrawerFiltros();

    sincronizarControlesDesdeEstado();
    render();
  }

  function initDrawerFiltros() {
    var abrir = $("[data-filtros-abrir]");
    var cerrar = $all("[data-filtros-cerrar]");
    var panel = $("[data-filtros-panel]");
    var aplicar = $("[data-aplicar-filtros]");
    if (!abrir || !panel) {
      return;
    }

    function abrirPanel() {
      panel.classList.add("is-abierto");
      abrir.setAttribute("aria-expanded", "true");
      doc.body.classList.add("filtros-abierto");
    }
    function cerrarPanel() {
      panel.classList.remove("is-abierto");
      abrir.setAttribute("aria-expanded", "false");
      doc.body.classList.remove("filtros-abierto");
    }

    abrir.addEventListener("click", abrirPanel);
    cerrar.forEach(function (c) {
      c.addEventListener("click", cerrarPanel);
    });
    if (aplicar) {
      aplicar.addEventListener("click", cerrarPanel);
    }
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-abierto")) {
        cerrarPanel();
      }
    });
  }

  /* =============================================================================
     PÁGINA: DETALLE (producto.html?id=)
     ========================================================================== */
  function obtenerProductoPorId(id) {
    if (!id) {
      return null;
    }
    for (var i = 0; i < DATA.productos.length; i++) {
      if (DATA.productos[i].id === id) {
        return DATA.productos[i];
      }
    }
    return null;
  }

  function initDetalle() {
    var params = new global.URLSearchParams(global.location.search);
    var id = params.get("id");
    var producto = obtenerProductoPorId(id);

    var contError = $("[data-detalle-error]");
    var contProducto = $("[data-detalle-producto]");

    if (!producto) {
      // Estado de error: mostrar bloque de error + sugeridos.
      if (contProducto) {
        contProducto.hidden = true;
      }
      if (contError) {
        contError.hidden = false;
      }
      // Ocultar el CTA sticky móvil (no hay nada que añadir).
      var ctaSticky = $(".cta-sticky");
      if (ctaSticky) {
        ctaSticky.style.display = "none";
      }
      document.title = "Prenda no encontrada · YOYO";
      renderSugeridos(null, "[data-error-sugeridos]");
      return;
    }

    if (contError) {
      contError.hidden = true;
    }
    if (contProducto) {
      contProducto.hidden = false;
    }

    document.title = producto.nombre + " · YOYO";
    renderDetalle(producto);
    renderSugeridos(producto, "[data-sugeridos]");
  }

  function renderDetalle(producto) {
    var agotadoGlobal = UI.estaAgotadoGlobal(producto);
    var enOferta = !!producto.enOferta && producto.precioAnterior;
    var pct = enOferta ? UI.porcentajeOferta(producto.precio, producto.precioAnterior) : 0;

    // Breadcrumb.
    var bcCat = $("[data-bc-categoria]");
    var bcNombre = $("[data-bc-nombre]");
    if (bcCat) {
      bcCat.textContent = UI.nombreCategoria(producto.categoria);
      bcCat.setAttribute("href", "tienda.html?categoria=" + encodeURIComponent(producto.categoria));
    }
    if (bcNombre) {
      bcNombre.textContent = producto.nombre;
    }

    // Galería.
    UI.renderGaleria(producto);

    // Nombre y categoría.
    var elNombre = $("[data-nombre]");
    if (elNombre) {
      elNombre.textContent = producto.nombre;
    }
    var elCat = $("[data-categoria]");
    if (elCat) {
      elCat.textContent = UI.nombreCategoria(producto.categoria);
    }

    // Precio.
    var elPrecio = $("[data-precio]");
    if (elPrecio) {
      if (enOferta) {
        elPrecio.innerHTML =
          '<span class="precio precio--anterior" aria-label="Precio anterior ' + UI.formatearPrecio(producto.precioAnterior) + '">' + UI.formatearPrecio(producto.precioAnterior) + "</span> " +
          '<span class="precio precio--grande precio--oferta" aria-label="Precio ' + UI.formatearPrecio(producto.precio) + '">' + UI.formatearPrecio(producto.precio) + "</span> " +
          '<span class="badge badge--oferta">Oferta' + (pct ? " <span class=\"badge__pct\">−" + pct + "%</span>" : "") + "</span>";
      } else {
        elPrecio.innerHTML =
          '<span class="precio precio--grande" aria-label="Precio ' + UI.formatearPrecio(producto.precio) + '">' + UI.formatearPrecio(producto.precio) + "</span>";
      }
    }

    // Disponibilidad.
    var elDisp = $("[data-disponibilidad]");
    if (elDisp) {
      if (agotadoGlobal) {
        elDisp.textContent = "Agotado por ahora";
        elDisp.className = "disponibilidad disponibilidad--agotado";
      } else if ((producto.agotadas || []).length > 0) {
        elDisp.textContent = "Quedan pocas";
        elDisp.className = "disponibilidad disponibilidad--pocas";
      } else {
        elDisp.textContent = "Disponible";
        elDisp.className = "disponibilidad disponibilidad--ok";
      }
    }

    // Estado de selección.
    var seleccion = { color: null, talla: null };

    // Colores.
    var contColores = $("[data-colores]");
    var etiquetaColor = $("[data-color-sel]");
    if (contColores) {
      var colores = producto.colores || [];
      var htmlColores = "";
      for (var c = 0; c < colores.length; c++) {
        var col = colores[c];
        htmlColores +=
          '<button type="button" class="swatch" role="radio" aria-checked="false" ' +
          'data-color="' + UI.escaparAttr(col.nombre) + '" ' +
          'style="--swatch-color: ' + UI.escaparAttr(col.hex) + '" ' +
          'aria-label="Color ' + UI.escaparAttr(col.nombre) + '">' +
          '<span class="swatch__circulo" style="background:' + UI.escaparAttr(col.hex) + '"></span>' +
          "</button>";
      }
      contColores.innerHTML = htmlColores;

      // Preseleccionar el primer color disponible.
      var swatches = $all("[data-color]", contColores);
      if (swatches.length) {
        seleccionarColor(swatches[0]);
      }

      swatches.forEach(function (sw) {
        sw.addEventListener("click", function () {
          seleccionarColor(sw);
        });
        sw.addEventListener("keydown", function (e) {
          manejarFlechasRadio(e, swatches, sw, seleccionarColor);
        });
      });
    }

    function seleccionarColor(sw) {
      $all("[data-color]", contColores).forEach(function (s) {
        s.classList.remove("es-seleccionado");
        s.setAttribute("aria-checked", "false");
        s.tabIndex = -1;
      });
      sw.classList.add("es-seleccionado");
      sw.setAttribute("aria-checked", "true");
      sw.tabIndex = 0;
      seleccion.color = sw.getAttribute("data-color");
      if (etiquetaColor) {
        etiquetaColor.textContent = seleccion.color;
      }
    }

    // Tallas.
    var contTallas = $("[data-tallas]");
    var errorTalla = $("[data-error-talla]");
    if (contTallas) {
      var tallas = producto.tallas || [];
      var agotadas = producto.agotadas || [];
      var htmlTallas = "";
      for (var t = 0; t < tallas.length; t++) {
        var talla = tallas[t];
        var ago = agotadas.indexOf(talla) !== -1;
        htmlTallas +=
          '<button type="button" class="selector-talla' + (ago ? " es-agotada" : "") + '" role="radio" ' +
          'aria-checked="false" data-talla="' + UI.escaparAttr(talla) + '"' +
          (ago ? ' aria-disabled="true" tabindex="-1"' : "") +
          (ago ? ' aria-label="Talla ' + UI.escaparAttr(talla) + ', sin stock"' : ' aria-label="Talla ' + UI.escaparAttr(talla) + '"') +
          ">" +
          "<span>" + UI.escaparHtml(talla) + "</span>" +
          "</button>";
      }
      contTallas.innerHTML = htmlTallas;

      var botonesTalla = $all("[data-talla]", contTallas);
      var disponibles = botonesTalla.filter(function (b) {
        return b.getAttribute("aria-disabled") !== "true";
      });
      // Hacer enfocable el primer disponible.
      if (disponibles.length) {
        disponibles[0].tabIndex = 0;
      }

      botonesTalla.forEach(function (btn) {
        if (btn.getAttribute("aria-disabled") === "true") {
          btn.addEventListener("click", function (e) {
            e.preventDefault();
          });
          return;
        }
        btn.addEventListener("click", function () {
          seleccionarTalla(btn);
        });
        btn.addEventListener("keydown", function (e) {
          manejarFlechasRadio(e, disponibles, btn, seleccionarTalla);
        });
      });

      function seleccionarTalla(btn) {
        botonesTalla.forEach(function (b) {
          b.classList.remove("es-seleccionada");
          b.setAttribute("aria-checked", "false");
          if (b.getAttribute("aria-disabled") !== "true") {
            b.tabIndex = -1;
          }
        });
        btn.classList.add("es-seleccionada");
        btn.setAttribute("aria-checked", "true");
        btn.tabIndex = 0;
        seleccion.talla = btn.getAttribute("data-talla");
        // Limpiar el error si lo había.
        if (errorTalla) {
          errorTalla.hidden = true;
        }
        if (contTallas) {
          contTallas.classList.remove("es-error");
        }
      }
    }

    // Stepper de cantidad (mínimo 1).
    var cantidad = 1;
    var valorStepper = $("[data-cantidad-valor]");
    var btnMenos = $("[data-cantidad-menos]");
    var btnMas = $("[data-cantidad-mas]");

    function pintarCantidad() {
      if (valorStepper) {
        valorStepper.textContent = cantidad;
      }
      if (btnMenos) {
        btnMenos.disabled = cantidad <= 1;
      }
    }
    if (btnMenos) {
      btnMenos.addEventListener("click", function () {
        if (cantidad > 1) {
          cantidad--;
          pintarCantidad();
        }
      });
    }
    if (btnMas) {
      btnMas.addEventListener("click", function () {
        cantidad++;
        pintarCantidad();
      });
    }
    pintarCantidad();

    // Botón añadir.
    var btnAnadir = $("[data-anadir]");
    var confirmacion = $("[data-confirmacion]");

    if (agotadoGlobal && btnAnadir) {
      btnAnadir.disabled = true;
      btnAnadir.textContent = "Agotado";
    }

    if (btnAnadir && !agotadoGlobal) {
      btnAnadir.addEventListener("click", function () {
        // Validar talla obligatoria (si la prenda tiene más de una talla real).
        var tallasReales = producto.tallas || [];
        var requiereTalla = tallasReales.length > 1 || (tallasReales.length === 1 && tallasReales[0] !== "Única");

        if (requiereTalla && !seleccion.talla) {
          if (errorTalla) {
            errorTalla.textContent = "Elige una talla para continuar";
            errorTalla.hidden = false;
          }
          if (contTallas) {
            contTallas.classList.add("es-error");
            var primero = $("[data-talla]:not([aria-disabled='true'])", contTallas);
            if (primero) {
              primero.focus();
            }
          }
          return;
        }

        // Color (si tiene varios, debe elegirse; preseleccionamos el primero,
        // así que normalmente ya hay uno).
        var requiereColor = (producto.colores || []).length > 1;
        if (requiereColor && !seleccion.color) {
          var errorColor = $("[data-error-color]");
          if (errorColor) {
            errorColor.textContent = "Elige un color para continuar";
            errorColor.hidden = false;
          }
          return;
        }

        // Si la talla seleccionada está agotada (no debería poderse elegir, pero
        // por seguridad).
        if (seleccion.talla && (producto.agotadas || []).indexOf(seleccion.talla) !== -1) {
          if (errorTalla) {
            errorTalla.textContent = "Esa talla está agotada. Prueba con otra.";
            errorTalla.hidden = false;
          }
          return;
        }

        var tallaFinal = seleccion.talla || (tallasReales[0] || "");
        var colorFinal = seleccion.color || ((producto.colores && producto.colores[0] && producto.colores[0].nombre) || "");

        CART.agregar(producto.id, tallaFinal, colorFinal, cantidad);

        // Confirmación inline + toast.
        if (confirmacion) {
          confirmacion.textContent = "Añadido a tu bolsa";
          confirmacion.hidden = false;
          global.setTimeout(function () {
            confirmacion.hidden = true;
          }, 4000);
        }
        UI.mostrarToast({
          mensaje: "Añadiste " + producto.nombre + " a tu bolsa",
          acciones: [
            { texto: "Ver bolsa", href: "carrito.html" },
            { texto: "Seguir comprando", onClick: function () {} }
          ]
        });
      });
    }

    // CTA sticky móvil (si existe): clona la acción de añadir.
    var stickyCTA = $("[data-anadir-sticky]");
    if (stickyCTA && btnAnadir) {
      if (agotadoGlobal) {
        stickyCTA.disabled = true;
        stickyCTA.textContent = "Agotado";
      } else {
        stickyCTA.addEventListener("click", function () {
          btnAnadir.click();
        });
      }
    }

    // Texto del acordeón (descripción, materiales, cuidados).
    var elDescripcion = $("[data-descripcion]");
    if (elDescripcion) {
      elDescripcion.textContent = producto.descripcion;
    }
    var elMateriales = $("[data-materiales]");
    if (elMateriales) {
      elMateriales.innerHTML =
        "<strong>Materiales:</strong> " + UI.escaparHtml(producto.materiales) +
        '<br><span class="cuidados"><strong>Cuidados:</strong> ' + UI.escaparHtml(producto.cuidados) + "</span>";
    }
  }

  // Navegación con flechas en grupos tipo radio.
  function manejarFlechasRadio(e, items, actual, seleccionar) {
    var idx = items.indexOf(actual);
    var nuevo = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nuevo = (idx + 1) % items.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nuevo = (idx - 1 + items.length) % items.length;
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      seleccionar(actual);
      return;
    } else {
      return;
    }
    if (items[nuevo]) {
      items[nuevo].focus();
      seleccionar(items[nuevo]);
    }
  }

  function renderSugeridos(producto, selector) {
    var cont = $(selector);
    if (!cont) {
      return;
    }
    var sugeridos;
    if (producto) {
      sugeridos = DATA.productos.filter(function (p) {
        return p.categoria === producto.categoria && p.id !== producto.id;
      });
      // Completar con destacados de otras categorías si faltan.
      if (sugeridos.length < 4) {
        DATA.productos.forEach(function (p) {
          if (p.id !== producto.id && sugeridos.indexOf(p) === -1 && sugeridos.length < 4) {
            sugeridos.push(p);
          }
        });
      }
    } else {
      sugeridos = DATA.productos.filter(function (p) {
        return p.destacadoHome || p.esNovedad;
      });
    }
    UI.renderGrid(cont, sugeridos.slice(0, 4));
  }

  /* =============================================================================
     PÁGINA: BOLSA (carrito.html)
     ========================================================================== */
  function initBolsa() {
    var contLineas = $("[data-bolsa-lineas]");
    var contVacio = $("[data-bolsa-vacia]");
    var contConfirmacion = $("[data-bolsa-confirmacion]");
    var contCuerpo = $("[data-bolsa-cuerpo]");
    var recuento = $("[data-bolsa-recuento]");

    if (!contLineas) {
      return;
    }

    // Estado del cupón aplicado.
    var cuponAplicado = "";

    function totalesActuales() {
      return CART.calcularTotales(cuponAplicado);
    }

    function pintarBolsa() {
      var lineas = CART.obtenerLineas();

      if (lineas.length === 0) {
        // Estado vacío.
        if (contCuerpo) {
          contCuerpo.hidden = true;
        }
        if (contVacio) {
          contVacio.hidden = false;
        }
        if (recuento) {
          recuento.textContent = UI.textoPrendas(0);
        }
        return;
      }

      if (contVacio) {
        contVacio.hidden = true;
      }
      if (contCuerpo) {
        contCuerpo.hidden = false;
      }

      // Recuento por unidades.
      if (recuento) {
        recuento.textContent = UI.textoPrendas(CART.contarItems());
      }

      // Líneas.
      var html = "";
      for (var i = 0; i < lineas.length; i++) {
        html += UI.lineaBolsa(lineas[i]);
      }
      contLineas.innerHTML = html;
      conectarLineas();

      pintarResumen();
    }

    function conectarLineas() {
      $all("[data-linea]", contLineas).forEach(function (li) {
        var id = li.getAttribute("data-id");
        var talla = li.getAttribute("data-talla");
        var color = li.getAttribute("data-color");

        var menos = $("[data-stepper-menos]", li);
        var mas = $("[data-stepper-mas]", li);
        var eliminar = $("[data-eliminar]", li);
        var valor = $("[data-stepper-valor]", li);

        if (menos) {
          menos.addEventListener("click", function () {
            var actual = parseInt(valor.textContent, 10);
            if (actual > 1) {
              CART.actualizar(id, talla, color, actual - 1);
              pintarBolsa();
            }
          });
        }
        if (mas) {
          mas.addEventListener("click", function () {
            var actual = parseInt(valor.textContent, 10);
            CART.actualizar(id, talla, color, actual + 1);
            pintarBolsa();
          });
        }
        if (eliminar) {
          eliminar.addEventListener("click", function () {
            var nombre = "";
            var enlace = $(".linea-bolsa__nombre", li);
            if (enlace) {
              nombre = enlace.textContent;
            }
            CART.eliminar(id, talla, color);
            UI.mostrarToast({ mensaje: "Eliminaste " + nombre + " de tu bolsa" });
            pintarBolsa();
          });
        }
      });
    }

    function pintarResumen() {
      var t = totalesActuales();

      var elSubtotal = $("[data-resumen-subtotal]");
      if (elSubtotal) {
        elSubtotal.textContent = UI.formatearPrecio(t.subtotal);
      }

      var elEnvio = $("[data-resumen-envio]");
      if (elEnvio) {
        elEnvio.textContent = t.envioGratis ? "Gratis" : UI.formatearPrecio(t.envio);
        elEnvio.classList.toggle("es-gratis", t.envioGratis);
      }

      // Fila de descuento.
      var filaDescuento = $("[data-fila-descuento]");
      var elDescuento = $("[data-resumen-descuento]");
      var elDescuentoEtiqueta = $("[data-resumen-descuento-etiqueta]");
      if (filaDescuento) {
        if (t.descuento > 0) {
          filaDescuento.hidden = false;
          if (elDescuento) {
            elDescuento.textContent = UI.formatearDescuento(t.descuento);
          }
          if (elDescuentoEtiqueta) {
            elDescuentoEtiqueta.textContent = "Descuento (" + t.cupon + ")";
          }
        } else {
          filaDescuento.hidden = true;
        }
      }

      var elTotal = $("[data-resumen-total]");
      if (elTotal) {
        elTotal.textContent = UI.formatearPrecio(t.total, true);
      }

      // Barra de progreso de envío gratis.
      var notaEnvio = $("[data-envio-progreso]");
      if (notaEnvio) {
        if (t.subtotal <= 0) {
          notaEnvio.hidden = true;
        } else if (t.envioGratis) {
          notaEnvio.hidden = false;
          notaEnvio.innerHTML =
            '<span class="envio-progreso__texto">¡Listo! Tu envío es gratis.</span>' +
            '<span class="envio-progreso__barra"><span class="envio-progreso__relleno" style="width:100%"></span></span>';
        } else {
          notaEnvio.hidden = false;
          var pctBarra = Math.min(100, Math.round((t.subtotal / t.umbralEnvioGratis) * 100));
          notaEnvio.innerHTML =
            '<span class="envio-progreso__texto">Te faltan ' + UI.formatearPrecio(t.faltaParaEnvioGratis) + " para el envío gratis.</span>" +
            '<span class="envio-progreso__barra"><span class="envio-progreso__relleno" style="width:' + pctBarra + '%"></span></span>';
        }
      }
    }

    // Cupón.
    var formCupon = $("[data-form-cupon]");
    var inputCupon = $("[data-cupon-input]");
    var mensajeCupon = $("[data-cupon-mensaje]");
    var btnQuitarCupon = $("[data-cupon-quitar]");

    function mostrarMensajeCupon(texto, tipo) {
      if (!mensajeCupon) {
        return;
      }
      mensajeCupon.textContent = texto;
      mensajeCupon.className = "cupon-mensaje cupon-mensaje--" + tipo;
      mensajeCupon.hidden = false;
    }

    if (formCupon) {
      formCupon.addEventListener("submit", function (e) {
        e.preventDefault();
        var codigo = inputCupon ? inputCupon.value.trim() : "";
        if (!codigo) {
          mostrarMensajeCupon("Escribe un cupón para aplicarlo.", "error");
          return;
        }
        var subtotal = CART.calcularTotales("").subtotal;
        var evalC = CART.evaluarCupon(codigo, subtotal);

        if (!evalC.valido) {
          mostrarMensajeCupon("Ese cupón no es válido. Revisa que esté bien escrito.", "error");
          return;
        }
        if (cuponAplicado && cuponAplicado === evalC.codigo) {
          mostrarMensajeCupon("Ya aplicaste ese cupón.", "error");
          return;
        }

        cuponAplicado = evalC.codigo;
        mostrarMensajeCupon(
          "Cupón " + evalC.codigo + " aplicado: ahorras " + UI.formatearPrecio(evalC.descuento) + ".",
          "exito"
        );
        if (btnQuitarCupon) {
          btnQuitarCupon.hidden = false;
        }
        if (inputCupon) {
          inputCupon.value = evalC.codigo;
        }
        UI.mostrarToast({ mensaje: "Cupón aplicado: ahorras " + UI.formatearPrecio(evalC.descuento) });
        pintarResumen();
      });
    }

    if (btnQuitarCupon) {
      btnQuitarCupon.addEventListener("click", function () {
        cuponAplicado = "";
        if (inputCupon) {
          inputCupon.value = "";
        }
        if (mensajeCupon) {
          mensajeCupon.hidden = true;
        }
        btnQuitarCupon.hidden = true;
        UI.mostrarToast({ mensaje: "Quitamos el cupón" });
        pintarResumen();
      });
    }

    // Checkout simulado.
    var btnFinalizar = $("[data-finalizar]");
    if (btnFinalizar) {
      btnFinalizar.addEventListener("click", function () {
        var t = totalesActuales();
        var items = CART.contarItems();
        if (items <= 0) {
          return;
        }

        btnFinalizar.disabled = true;
        btnFinalizar.textContent = "Procesando…";

        global.setTimeout(function () {
          // Número de pedido ficticio.
          var num = "";
          for (var i = 0; i < 6; i++) {
            num += Math.floor(Math.random() * 10);
          }
          var totalTexto = UI.formatearPrecio(t.total, true);

          // Pintar confirmación.
          var elNumero = $("[data-pedido-numero]");
          var elResumen = $("[data-pedido-resumen]");
          if (elNumero) {
            elNumero.textContent = "YOYO-" + num;
          }
          if (elResumen) {
            elResumen.textContent = UI.textoPrendas(items) + " · Total " + totalTexto;
          }

          // Vaciar la bolsa.
          CART.vaciar();
          cuponAplicado = "";

          // Mostrar confirmación, ocultar el resto.
          if (contCuerpo) {
            contCuerpo.hidden = true;
          }
          if (contVacio) {
            contVacio.hidden = true;
          }
          if (contConfirmacion) {
            contConfirmacion.hidden = false;
            contConfirmacion.scrollIntoView({ behavior: "smooth", block: "start" });
            var foco = $("h2, [tabindex]", contConfirmacion);
            if (foco) {
              foco.setAttribute("tabindex", "-1");
              foco.focus();
            }
          }
        }, 900);
      });
    }

    pintarBolsa();
  }

  /* =============================================================================
     DESPACHADOR POR PÁGINA
     ========================================================================== */
  function init() {
    initComun();
    initNewsletters();

    var pagina = doc.body.getAttribute("data-pagina");

    switch (pagina) {
      case "home":
        initHome();
        break;
      case "catalogo":
        initCatalogo();
        break;
      case "detalle":
        initDetalle();
        break;
      case "bolsa":
        initBolsa();
        break;
      default:
        break;
    }
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
