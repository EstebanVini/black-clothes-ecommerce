/* =============================================================================
   Black Clothes · motion.js
   Sistema de movimiento del lado del cliente. Script CLÁSICO (no módulo).
   Se carga DESPUÉS de main.js: el contenido y los grids ya están pintados.
   -----------------------------------------------------------------------------
   Responsabilidades:
     1. Scroll reveals (fade + slide-up) con stagger por [data-reveal-grupo],
        vía IntersectionObserver. One-shot: el observer se desconecta al revelar.
     2. Pulso del badge de la bolsa cuando el conteo SUBE (suscrito a BLACKCLOTHES_CART).
     3. Fundido sutil del grid del catálogo al refiltrar (suaviza el re-render).

   CONTRATO de accesibilidad / no-JS (innegociable):
     · El contenido [data-reveal] es VISIBLE por defecto (lo garantiza motion.css).
     · Este script SÓLO oculta el estado inicial si:
         - NO hay prefers-reduced-motion: reduce, y
         - existe IntersectionObserver.
       En ese caso marca <html> con `.motion-reveal-activo` y cada elemento con
       `.reveal-init`; al entrar al viewport añade `.is-revelado`.
     · Si hay reduced-motion o no hay soporte: NO oculta nada. Punto.
   ============================================================================= */

(function (global) {
  "use strict";

  var doc = global.document;
  var root = doc.documentElement;

  /* --- Capacidades del entorno ------------------------------------------- */
  var prefiereReducir =
    !!(global.matchMedia &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches);

  var soportaObserver = typeof global.IntersectionObserver === "function";

  // Los reveals con desplazamiento sólo se activan si hay observer y NO se
  // pidió movimiento reducido. En cualquier otro caso, el contenido permanece
  // visible tal cual (estado seguro de motion.css).
  var revealsActivos = soportaObserver && !prefiereReducir;

  /* =============================================================================
     1 · SCROLL REVEALS con STAGGER
     ========================================================================== */

  // Conjunto de elementos ya registrados, para no re-procesarlos (los grids del
  // catálogo se repintan; evitamos doble registro o re-ocultar lo ya revelado).
  var registrados = (typeof global.WeakSet === "function") ? new global.WeakSet() : null;

  function yaRegistrado(el) {
    if (registrados) {
      return registrados.has(el);
    }
    // Fallback sin WeakSet: marca por atributo.
    return el.getAttribute("data-reveal-listo") === "1";
  }

  function marcarRegistrado(el) {
    if (registrados) {
      registrados.add(el);
    } else {
      el.setAttribute("data-reveal-listo", "1");
    }
  }

  var observador = null;

  function crearObservador() {
    return new global.IntersectionObserver(
      function (entradas, obs) {
        for (var i = 0; i < entradas.length; i++) {
          var entrada = entradas[i];
          if (entrada.isIntersecting) {
            var el = entrada.target;
            el.classList.add("is-revelado");
            // One-shot: deja de observar este elemento en cuanto se revela.
            obs.unobserve(el);
          }
        }
      },
      {
        // Revela un poco antes de tocar el borde inferior, para que el contenido
        // no "salte" justo al entrar. rootMargin negativo abajo = anticipación.
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.01
      }
    );
  }

  /**
   * Registra un elemento revelable: lo oculta (estado inicial) y lo observa.
   * @param {Element} el  elemento con [data-reveal]
   * @param {number} delayMs  retraso de stagger (0 si no aplica)
   */
  function registrarReveal(el, delayMs) {
    if (yaRegistrado(el)) {
      return;
    }
    marcarRegistrado(el);

    // Estado inicial oculto (la clase en <html> habilita las reglas de motion.css).
    el.classList.add("reveal-init");
    if (delayMs > 0) {
      el.style.setProperty("--reveal-delay", delayMs + "ms");
    }

    observador.observe(el);
  }

  // Retraso base entre hermanos de un grupo (ms). Acotado para que un grid de
  // muchas cards no acumule un stagger eterno.
  var STAGGER_PASO = 70;
  var STAGGER_MAX = 8; // tope de elementos con retraso creciente

  /**
   * Procesa los grupos [data-reveal-grupo]: sus hijos directos con [data-reveal]
   * reciben un retraso incremental. El resto de [data-reveal] sueltos no llevan
   * retraso. Idempotente: se puede llamar varias veces (grids repintados).
   */
  function escanear(raiz) {
    if (!revealsActivos || !observador) {
      return;
    }
    var ambito = raiz || doc;

    // 1) Grupos con stagger.
    var grupos = ambito.querySelectorAll("[data-reveal-grupo]");
    Array.prototype.forEach.call(grupos, function (grupo) {
      var hijos = grupo.querySelectorAll(":scope > [data-reveal]");
      Array.prototype.forEach.call(hijos, function (hijo, indice) {
        var paso = Math.min(indice, STAGGER_MAX);
        registrarReveal(hijo, paso * STAGGER_PASO);
      });
    });

    // 2) Reveals sueltos (no hijos directos de un grupo). Sin retraso.
    var sueltos = ambito.querySelectorAll("[data-reveal]");
    Array.prototype.forEach.call(sueltos, function (el) {
      // Si su padre es un grupo, ya lo procesamos arriba.
      var padre = el.parentElement;
      if (padre && padre.hasAttribute("data-reveal-grupo")) {
        return;
      }
      registrarReveal(el, 0);
    });
  }

  /**
   * Observa los contenedores de grid (poblados/repintados por main.js) para
   * registrar las cards [data-reveal] que se inyecten después. Así el stagger
   * funciona también para contenido renderizado por JS y tras refiltrar.
   */
  function vigilarGridsDinamicos() {
    if (!revealsActivos || typeof global.MutationObserver !== "function") {
      return;
    }
    var contenedores = doc.querySelectorAll("[data-reveal-grupo]");
    if (!contenedores.length) {
      return;
    }
    var mo = new global.MutationObserver(function (mutaciones) {
      var hayNuevos = false;
      for (var i = 0; i < mutaciones.length; i++) {
        if (mutaciones[i].addedNodes && mutaciones[i].addedNodes.length) {
          hayNuevos = true;
          break;
        }
      }
      if (hayNuevos) {
        // Reescanear sólo los grupos (barato e idempotente).
        Array.prototype.forEach.call(contenedores, function (c) {
          escanear(c.parentElement || doc);
        });
      }
    });
    Array.prototype.forEach.call(contenedores, function (c) {
      mo.observe(c, { childList: true });
    });
  }

  function initReveals() {
    if (!revealsActivos) {
      // Sin activar: el contenido queda visible (estado seguro de motion.css).
      return;
    }
    // Habilita las reglas de estado-inicial en motion.css.
    root.classList.add("motion-reveal-activo");
    observador = crearObservador();

    // Escaneo inicial (contenido estático ya presente).
    escanear(doc);

    // Segundo escaneo en el siguiente frame: captura grids que main.js pobló en
    // este mismo turno (orden de scripts) por si acaso el primero fue temprano.
    global.requestAnimationFrame(function () {
      escanear(doc);
    });

    // Vigilancia de inyecciones posteriores (render por JS, refiltrado).
    vigilarGridsDinamicos();
  }

  /* =============================================================================
     2 · PULSO DEL BADGE DE LA BOLSA al incrementar
     -----------------------------------------------------------------------------
     No hay un evento "añadido" dedicado, pero BLACKCLOTHES_CART notifica a sus
     suscriptores en cada cambio y BLACKCLOTHES_UI repinta el badge. Nos suscribimos y,
     comparando contra el último conteo conocido, pulsamos SÓLO cuando sube.
     ========================================================================== */
  function initPulsoBadge() {
    var CART = global.BLACKCLOTHES_CART;
    if (!CART || typeof CART.suscribir !== "function") {
      return;
    }

    var ultimoConteo = typeof CART.contarItems === "function" ? CART.contarItems() : 0;

    function pulsar(badge) {
      if (!badge || badge.hidden) {
        return;
      }
      // Reinicia la animación si ya estaba corriendo (varios add seguidos).
      badge.classList.remove("bolsa-badge--pulso");
      // Forzar reflow para reiniciar el keyframe de forma fiable.
      /* eslint-disable-next-line no-unused-expressions */
      void badge.offsetWidth;
      badge.classList.add("bolsa-badge--pulso");
    }

    function alAnimar(e) {
      if (e.animationName === "bc-badge-pulso") {
        e.currentTarget.classList.remove("bolsa-badge--pulso");
      }
    }

    CART.suscribir(function () {
      var actual = typeof CART.contarItems === "function" ? CART.contarItems() : 0;
      var subio = actual > ultimoConteo;
      ultimoConteo = actual;
      if (!subio || prefiereReducir) {
        return;
      }
      // El badge pudo repintarse en este mismo tick (ui.js está suscrito también).
      // Esperamos un frame para asegurar que ya no está [hidden] y tiene el valor.
      global.requestAnimationFrame(function () {
        var badges = doc.querySelectorAll("[data-bolsa-badge]");
        Array.prototype.forEach.call(badges, function (badge) {
          // Conecta el limpiador de clase una sola vez por badge.
          if (badge.getAttribute("data-pulso-listo") !== "1") {
            badge.setAttribute("data-pulso-listo", "1");
            badge.addEventListener("animationend", alAnimar);
          }
          pulsar(badge);
        });
      });
    });
  }

  /* =============================================================================
     3 · FUNDIDO DEL GRID AL REFILTRAR (catálogo)
     -----------------------------------------------------------------------------
     main.js repinta [data-grid] vía innerHTML al cambiar filtros/orden. No emite
     evento, así que detectamos el repintado con un MutationObserver sobre el
     grid y aplicamos un fundido cortísimo (clase .grid-refiltrando) que motion.css
     anima sólo con opacity. Repetible (no es one-shot como los reveals).
     ========================================================================== */
  function initFundidoGrid() {
    if (prefiereReducir || typeof global.MutationObserver !== "function") {
      return;
    }
    var grid = doc.querySelector("[data-grid]");
    if (!grid) {
      return;
    }

    var temporizador = null;
    var aplicando = false;

    var mo = new global.MutationObserver(function () {
      if (aplicando) {
        // El cambio lo provocó nuestra propia limpieza de clase: ignorar.
        return;
      }
      // Fundido entrante: el grid ya tiene el contenido nuevo; lo llevamos de
      // opacity 0 → 1 quitando la clase en el siguiente frame.
      aplicando = true;
      grid.classList.add("grid-refiltrando");
      global.requestAnimationFrame(function () {
        global.requestAnimationFrame(function () {
          grid.classList.remove("grid-refiltrando");
          aplicando = false;
        });
      });

      if (temporizador) {
        global.clearTimeout(temporizador);
      }
      // Red de seguridad: garantiza que la clase no quede pegada.
      temporizador = global.setTimeout(function () {
        grid.classList.remove("grid-refiltrando");
        aplicando = false;
      }, 400);
    });

    mo.observe(grid, { childList: true });
  }

  /* =============================================================================
     ARRANQUE
     ========================================================================== */
  function init() {
    initReveals();
    initPulsoBadge();
    initFundidoGrid();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
