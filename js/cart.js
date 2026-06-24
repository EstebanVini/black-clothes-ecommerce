/* =============================================================================
   YOYO · cart.js
   Estado de la bolsa (carrito) en localStorage. Script CLÁSICO (no módulo).
   Toda la API pública se expone en window.YOYO_CART.
   -----------------------------------------------------------------------------
   · Persistencia: localStorage bajo la clave "yoyo_bolsa".
   · Robustez: si localStorage no está disponible (modo privado estricto),
     degrada a una bolsa EN MEMORIA durante la sesión. Nunca lanza excepción
     que rompa la página.
   · Una "línea" es una variante única: producto + talla + color.
   · Depende de window.YOYO_DATA (data.js) para precios y reglas de envío.
   ============================================================================= */

(function (global) {
  "use strict";

  var STORAGE_KEY = "yoyo_bolsa";
  var ENVIO_COSTO = 99; // costo de envío por debajo del umbral (MXN)

  /* --- Disponibilidad de localStorage (probada, no asumida) --------------- */
  var almacenamientoDisponible = (function () {
    try {
      var prueba = "__yoyo_test__";
      global.localStorage.setItem(prueba, "1");
      global.localStorage.removeItem(prueba);
      return true;
    } catch (e) {
      return false;
    }
  })();

  // Respaldo en memoria cuando no hay localStorage.
  var memoria = null;

  /* --- Lectura / escritura cruda ----------------------------------------- */
  function leerCrudo() {
    if (!almacenamientoDisponible) {
      return memoria ? memoria.slice() : [];
    }
    try {
      var bruto = global.localStorage.getItem(STORAGE_KEY);
      if (!bruto) {
        return [];
      }
      var datos = JSON.parse(bruto);
      return Array.isArray(datos) ? datos : [];
    } catch (e) {
      return [];
    }
  }

  function escribirCrudo(lineas) {
    if (!almacenamientoDisponible) {
      memoria = lineas.slice();
      notificar();
      return;
    }
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(lineas));
    } catch (e) {
      // Si falla (cuota, etc.), caemos a memoria para no romper la sesión.
      memoria = lineas.slice();
    }
    notificar();
  }

  /* --- Suscriptores (la UI escucha cambios para repintar badge/totales) --- */
  var suscriptores = [];

  function suscribir(fn) {
    if (typeof fn === "function") {
      suscriptores.push(fn);
    }
  }

  function notificar() {
    for (var i = 0; i < suscriptores.length; i++) {
      try {
        suscriptores[i]();
      } catch (e) {
        /* un suscriptor con error no debe frenar a los demás */
      }
    }
  }

  /* --- Acceso al catálogo ------------------------------------------------- */
  function catalogo() {
    return (global.YOYO_DATA && global.YOYO_DATA.productos) || [];
  }

  function buscarProducto(idProducto) {
    var lista = catalogo();
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === idProducto) {
        return lista[i];
      }
    }
    return null;
  }

  function umbralEnvioGratis() {
    return (global.YOYO_DATA && global.YOYO_DATA.marca && global.YOYO_DATA.marca.envioGratisDesde) || 1499;
  }

  /* --- Identidad de línea (producto + talla + color) ---------------------- */
  function claveLinea(idProducto, talla, color) {
    return [idProducto, talla || "", color || ""].join("||");
  }

  function indiceDeLinea(lineas, idProducto, talla, color) {
    var clave = claveLinea(idProducto, talla, color);
    for (var i = 0; i < lineas.length; i++) {
      if (claveLinea(lineas[i].idProducto, lineas[i].talla, lineas[i].color) === clave) {
        return i;
      }
    }
    return -1;
  }

  /* =============================================================================
     API PÚBLICA
     ========================================================================== */

  /**
   * Añade una variante a la bolsa. Si ya existe (mismo producto/talla/color),
   * incrementa la cantidad. Devuelve la línea resultante o null si el producto
   * no existe en el catálogo.
   */
  function agregar(idProducto, talla, color, cantidad) {
    var producto = buscarProducto(idProducto);
    if (!producto) {
      return null;
    }
    var cant = parseInt(cantidad, 10);
    if (!(cant > 0)) {
      cant = 1;
    }

    var lineas = leerCrudo();
    var idx = indiceDeLinea(lineas, idProducto, talla, color);

    if (idx >= 0) {
      lineas[idx].cantidad += cant;
    } else {
      lineas.push({
        idProducto: idProducto,
        talla: talla || "",
        color: color || "",
        cantidad: cant
      });
      idx = lineas.length - 1;
    }

    escribirCrudo(lineas);
    return lineas[idx];
  }

  /**
   * Fija la cantidad exacta de una línea. Mínimo 1 (no baja de 1 vía stepper).
   * Para eliminar usa eliminar().
   */
  function actualizar(idProducto, talla, color, nuevaCantidad) {
    var lineas = leerCrudo();
    var idx = indiceDeLinea(lineas, idProducto, talla, color);
    if (idx < 0) {
      return false;
    }
    var cant = parseInt(nuevaCantidad, 10);
    if (!(cant > 0)) {
      cant = 1;
    }
    lineas[idx].cantidad = cant;
    escribirCrudo(lineas);
    return true;
  }

  /** Elimina por completo una línea de la bolsa. */
  function eliminar(idProducto, talla, color) {
    var lineas = leerCrudo();
    var idx = indiceDeLinea(lineas, idProducto, talla, color);
    if (idx < 0) {
      return false;
    }
    lineas.splice(idx, 1);
    escribirCrudo(lineas);
    return true;
  }

  /** Vacía la bolsa por completo. */
  function vaciar() {
    escribirCrudo([]);
  }

  /**
   * Devuelve las líneas "hidratadas": cada línea cruda + datos del producto
   * (nombre, precio, imagen, color válido…). Marca noDisponible=true si el
   * producto ya no existe en el catálogo, sin romper el total.
   */
  function obtenerLineas() {
    var crudas = leerCrudo();
    var resultado = [];
    for (var i = 0; i < crudas.length; i++) {
      var linea = crudas[i];
      var producto = buscarProducto(linea.idProducto);

      if (!producto) {
        resultado.push({
          idProducto: linea.idProducto,
          talla: linea.talla,
          color: linea.color,
          cantidad: linea.cantidad,
          noDisponible: true,
          nombre: "Prenda no disponible",
          precioUnitario: 0,
          subtotal: 0,
          imagen: "",
          categoria: ""
        });
        continue;
      }

      var precioUnitario = producto.precio;
      resultado.push({
        idProducto: producto.id,
        talla: linea.talla,
        color: linea.color,
        cantidad: linea.cantidad,
        noDisponible: false,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precioUnitario: precioUnitario,
        precioAnterior: producto.precioAnterior || null,
        enOferta: !!producto.enOferta,
        subtotal: precioUnitario * linea.cantidad,
        imagen: (producto.imagenes && producto.imagenes[0]) || ""
      });
    }
    return resultado;
  }

  /** Cuenta total de unidades en la bolsa (suma de cantidades). */
  function contarItems() {
    var crudas = leerCrudo();
    var total = 0;
    for (var i = 0; i < crudas.length; i++) {
      total += crudas[i].cantidad || 0;
    }
    return total;
  }

  /** Número de líneas distintas (variantes). */
  function contarLineas() {
    return leerCrudo().length;
  }

  /**
   * Evalúa un cupón contra YOYO_DATA.cupones SIN aplicarlo a la bolsa.
   * Devuelve { valido, codigo, etiqueta, descuento, motivo }.
   * El descuento se calcula sobre el subtotal recibido.
   */
  function evaluarCupon(codigo, subtotal) {
    var cupones = (global.YOYO_DATA && global.YOYO_DATA.cupones) || {};
    var limpio = (codigo || "").trim().toUpperCase();

    if (!limpio) {
      return { valido: false, codigo: "", etiqueta: "", descuento: 0, motivo: "vacio" };
    }

    var cupon = cupones[limpio];
    if (!cupon) {
      return { valido: false, codigo: limpio, etiqueta: "", descuento: 0, motivo: "invalido" };
    }

    var descuento = 0;
    if (cupon.tipo === "porcentaje") {
      descuento = Math.round((subtotal * cupon.valor) / 100);
    } else if (cupon.tipo === "fijo") {
      descuento = cupon.valor;
    }
    // El descuento nunca supera el subtotal.
    if (descuento > subtotal) {
      descuento = subtotal;
    }

    return {
      valido: true,
      codigo: limpio,
      etiqueta: cupon.etiqueta || "",
      descuento: descuento,
      motivo: "ok"
    };
  }

  /**
   * Calcula todos los totales de la bolsa.
   * @param {string} [codigoCupon] cupón a aplicar (opcional).
   * @returns { subtotal, envio, envioGratis, descuento, cupon, total,
   *            faltaParaEnvioGratis, cuponValido }
   */
  function calcularTotales(codigoCupon) {
    var lineas = obtenerLineas();
    var subtotal = 0;
    for (var i = 0; i < lineas.length; i++) {
      subtotal += lineas[i].subtotal || 0;
    }

    var evalCupon = evaluarCupon(codigoCupon, subtotal);
    var descuento = evalCupon.valido ? evalCupon.descuento : 0;

    var umbral = umbralEnvioGratis();
    var hayLineas = subtotal > 0;
    var envioGratis = subtotal >= umbral;
    var envio = hayLineas && !envioGratis ? ENVIO_COSTO : 0;

    var faltaParaEnvioGratis = hayLineas && !envioGratis ? Math.max(0, umbral - subtotal) : 0;

    var total = subtotal - descuento + envio;
    if (total < 0) {
      total = 0;
    }

    return {
      subtotal: subtotal,
      envio: envio,
      envioGratis: envioGratis,
      descuento: descuento,
      cupon: evalCupon.valido ? evalCupon.codigo : "",
      cuponEtiqueta: evalCupon.valido ? evalCupon.etiqueta : "",
      cuponValido: evalCupon.valido,
      total: total,
      faltaParaEnvioGratis: faltaParaEnvioGratis,
      umbralEnvioGratis: umbral,
      costoEnvio: ENVIO_COSTO
    };
  }

  /* --- Exposición --------------------------------------------------------- */
  global.YOYO_CART = {
    agregar: agregar,
    actualizar: actualizar,
    eliminar: eliminar,
    vaciar: vaciar,
    obtenerLineas: obtenerLineas,
    contarItems: contarItems,
    contarLineas: contarLineas,
    evaluarCupon: evaluarCupon,
    calcularTotales: calcularTotales,
    suscribir: suscribir,
    almacenamientoDisponible: almacenamientoDisponible,
    STORAGE_KEY: STORAGE_KEY
  };
})(window);
