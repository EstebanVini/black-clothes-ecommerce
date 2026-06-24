/* =============================================================================
   YOYO · data.js
   Catálogo de productos y datos de marca. Script CLÁSICO (no módulo).
   Todo se expone en el objeto global window.YOYO_DATA.
   Autor: ux-writer · Español de México · Moneda MXN.
   ============================================================================= */

window.YOYO_DATA = {

  /* --- Marca -------------------------------------------------------------- */
  marca: {
    nombre: "YOYO",
    tagline: "Moda con alma artesanal",
    envioGratisDesde: 1499,
    moneda: "MXN"
  },

  /* --- Cupones demo ------------------------------------------------------- */
  cupones: {
    "YOYO10": { tipo: "porcentaje", valor: 10, etiqueta: "−10%" },
    "HOLA200": { tipo: "fijo", valor: 200, etiqueta: "−$200" }
  },

  /* --- Categorías (las 7) ------------------------------------------------- */
  categorias: [
    {
      slug: "abrigos",
      nombre: "Abrigos",
      descripcion: "Capas que abrazan. Lana, paño y siluetas que cruzan estaciones sin perder temple."
    },
    {
      slug: "vestidos",
      nombre: "Vestidos",
      descripcion: "De la oficina a la noche en un solo gesto. Caídas que se mueven contigo."
    },
    {
      slug: "sueteres",
      nombre: "Suéteres",
      descripcion: "Punto noble y abrazos de fibra. El refugio suave de los días fríos."
    },
    {
      slug: "camisas",
      nombre: "Camisas",
      descripcion: "El lienzo de tu día. Algodón, popelina y costuras que duran años."
    },
    {
      slug: "pantalones",
      nombre: "Pantalones",
      descripcion: "Tiro pensado, caída precisa. La base que sostiene cualquier conjunto."
    },
    {
      slug: "accesorios",
      nombre: "Accesorios",
      descripcion: "El detalle que cambia todo. Piel curtida a mano y herrajes con carácter."
    },
    {
      slug: "calzado",
      nombre: "Calzado",
      descripcion: "Donde empieza tu postura. Piel, tacón y comodidad sin concesiones."
    }
  ],

  /* --- Productos (18) ----------------------------------------------------- */
  productos: [

    /* === ABRIGOS (3) ===================================================== */
    {
      id: "abrigo-ascua-lana",
      nombre: "Abrigo Ascua de lana",
      categoria: "abrigos",
      precio: 3490,
      precioAnterior: 4200,
      enOferta: true,
      esNovedad: false,
      destacadoHome: true,
      colores: [
        { nombre: "Rojo brasa", hex: "#a83232" },
        { nombre: "Camel", hex: "#b08d57" }
      ],
      tallas: ["XS", "S", "M", "L", "XL"],
      agotadas: ["XS"],
      descripcion: "Un abrigo que se enciende al caminar. La lana cardada guarda el calor sin pesar, y la solapa amplia enmarca el cuello con aire de calle europea. Es la prenda que convierte un martes gris en una declaración.",
      materiales: "80% lana virgen, 20% poliamida. Forro 100% viscosa.",
      cuidados: "Limpieza en seco profesional. No usar secadora. Plancha tibia con paño.",
      imagenes: [
        "https://images.pexels.com/photos/30451277/pexels-photo-30451277.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/18275129/pexels-photo-18275129.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },
    {
      id: "abrigo-niebla-pano",
      nombre: "Abrigo Niebla de paño",
      categoria: "abrigos",
      precio: 3890,
      precioAnterior: null,
      enOferta: false,
      esNovedad: true,
      destacadoHome: true,
      colores: [
        { nombre: "Hueso", hex: "#e8e1d4" },
        { nombre: "Grafito", hex: "#3b3a38" }
      ],
      tallas: ["XS", "S", "M", "L", "XL"],
      agotadas: [],
      descripcion: "Largo, recto y sereno como una mañana de invierno. El paño compacto cae a plomo y el cuello alto te protege del viento sin sofocar. Un abrigo para llegar a todas partes con la espalda erguida.",
      materiales: "70% lana, 25% poliéster, 5% cachemira. Forro 100% viscosa.",
      cuidados: "Limpieza en seco. No retorcer. Guardar colgado en funda transpirable.",
      imagenes: [
        "https://images.pexels.com/photos/14495270/pexels-photo-14495270.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/15835238/pexels-photo-15835238.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },
    {
      id: "abrigo-bruma-urbano",
      nombre: "Abrigo Bruma urbano",
      categoria: "abrigos",
      precio: 2790,
      precioAnterior: null,
      enOferta: false,
      esNovedad: false,
      destacadoHome: false,
      colores: [
        { nombre: "Camel", hex: "#b08d57" },
        { nombre: "Negro", hex: "#1a1a1a" }
      ],
      tallas: ["XS", "S", "M", "L", "XL"],
      agotadas: ["XL"],
      descripcion: "Pensado para la ciudad y sus prisas. Corte ligeramente entallado, hombro limpio y un peso medio que funciona de octubre a marzo. Lo abrochas, sales y todo cuadra.",
      materiales: "65% lana, 30% poliéster, 5% otras fibras.",
      cuidados: "Limpieza en seco. Cepillar la superficie con cepillo suave tras cada uso.",
      imagenes: [
        "https://images.pexels.com/photos/12551545/pexels-photo-12551545.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/10955935/pexels-photo-10955935.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },

    /* === VESTIDOS (3) ==================================================== */
    {
      id: "vestido-velada-midi",
      nombre: "Vestido Velada midi",
      categoria: "vestidos",
      precio: 2390,
      precioAnterior: null,
      enOferta: false,
      esNovedad: true,
      destacadoHome: true,
      colores: [
        { nombre: "Negro", hex: "#161616" },
        { nombre: "Vino", hex: "#5e2233" }
      ],
      tallas: ["XS", "S", "M", "L", "XL"],
      agotadas: ["S"],
      descripcion: "El vestido que resuelve la noche sin pensarlo. Largo midi que cae justo bajo la rodilla, cintura marcada y un drapeado discreto que favorece sin apretar. Ponte unos tacones y ya estás lista.",
      materiales: "95% poliéster reciclado, 5% elastano.",
      cuidados: "Lavar a máquina en frío, ciclo delicado. No usar blanqueador. Plancha a baja temperatura.",
      imagenes: [
        "https://images.pexels.com/photos/21706028/pexels-photo-21706028.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/7123307/pexels-photo-7123307.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },
    {
      id: "vestido-galeria-noche",
      nombre: "Vestido Galería de noche",
      categoria: "vestidos",
      precio: 3190,
      precioAnterior: null,
      enOferta: false,
      esNovedad: false,
      destacadoHome: false,
      colores: [
        { nombre: "Negro", hex: "#141414" }
      ],
      tallas: ["XS", "S", "M", "L"],
      agotadas: [],
      descripcion: "Para las ocasiones que se recuerdan. Tejido con cuerpo que sostiene la silueta, escote limpio y una caída que parece esculpida. Es elegancia que no necesita levantar la voz.",
      materiales: "88% triacetato, 12% poliéster.",
      cuidados: "Limpieza en seco recomendada. Guardar colgado para preservar la caída.",
      imagenes: [
        "https://images.pexels.com/photos/26998033/pexels-photo-26998033.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/26998033/pexels-photo-26998033.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },
    {
      id: "vestido-amapola-rojo",
      nombre: "Vestido Amapola rojo",
      categoria: "vestidos",
      precio: 1990,
      precioAnterior: 2600,
      enOferta: true,
      esNovedad: false,
      destacadoHome: true,
      colores: [
        { nombre: "Rojo amapola", hex: "#b32430" },
        { nombre: "Negro", hex: "#171717" }
      ],
      tallas: ["XS", "S", "M", "L", "XL"],
      agotadas: ["M"],
      descripcion: "Un rojo que entra antes que tú a cualquier lugar. Manga francesa, falda con movimiento y un largo que invita a sentarte en una terraza al sol. Cómodo de día, contundente de noche.",
      materiales: "100% viscosa de origen responsable.",
      cuidados: "Lavar a mano en agua fría o ciclo delicado. Secar a la sombra. No retorcer.",
      imagenes: [
        "https://images.pexels.com/photos/14814788/pexels-photo-14814788.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/14814788/pexels-photo-14814788.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },

    /* === SUÉTERES (3) ==================================================== */
    {
      id: "sueter-bruma-blanco",
      nombre: "Suéter Bruma blanco",
      categoria: "sueteres",
      precio: 1490,
      precioAnterior: null,
      enOferta: false,
      esNovedad: true,
      destacadoHome: true,
      colores: [
        { nombre: "Blanco lana", hex: "#f1ece2" },
        { nombre: "Negro", hex: "#1c1c1c" }
      ],
      tallas: ["XS", "S", "M", "L", "XL"],
      agotadas: [],
      descripcion: "El abrazo que te pones por la mañana. Punto medio, suave al tacto y un blanco que combina con todo lo que ya tienes. Para días de café largo y planes sin reloj.",
      materiales: "50% lana merino, 50% acrílico.",
      cuidados: "Lavar a mano en frío. Secar en plano para conservar la forma. No colgar mojado.",
      imagenes: [
        "https://images.pexels.com/photos/20025517/pexels-photo-20025517.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/3941172/pexels-photo-3941172.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },
    {
      id: "sueter-musgo-canale",
      nombre: "Suéter Musgo de canalé",
      categoria: "sueteres",
      precio: 1690,
      precioAnterior: null,
      enOferta: false,
      esNovedad: false,
      destacadoHome: false,
      colores: [
        { nombre: "Verde musgo", hex: "#5b6b4a" },
        { nombre: "Camel", hex: "#b08d57" }
      ],
      tallas: ["XS", "S", "M", "L", "XL"],
      agotadas: ["XS", "XL"],
      descripcion: "Canalé denso de los que se sienten al ponérselos. El verde musgo aporta tierra y calma, el cuello alto sube cuando baja la temperatura. Un básico con personalidad propia.",
      materiales: "70% algodón, 30% lana.",
      cuidados: "Lavar a máquina en frío, ciclo lana. Secar en plano. Plancha a baja temperatura del revés.",
      imagenes: [
        "https://images.pexels.com/photos/1125328/pexels-photo-1125328.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/5491145/pexels-photo-5491145.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },
    {
      id: "sueter-rubor-punto",
      nombre: "Suéter Rubor de punto",
      categoria: "sueteres",
      precio: 1390,
      precioAnterior: 1800,
      enOferta: true,
      esNovedad: false,
      destacadoHome: false,
      colores: [
        { nombre: "Rosa rubor", hex: "#e0b7b3" },
        { nombre: "Hueso", hex: "#e8e1d4" }
      ],
      tallas: ["XS", "S", "M", "L"],
      agotadas: ["L"],
      descripcion: "Un rosa empolvado que aclara cualquier conjunto. Punto fino y ligero, ideal para capas bajo un abrigo o suelto en tardes templadas. Dulce sin ser empalagoso.",
      materiales: "60% algodón, 40% acrílico.",
      cuidados: "Lavar a mano o ciclo delicado en frío. Secar en plano a la sombra.",
      imagenes: [
        "https://images.pexels.com/photos/885580/pexels-photo-885580.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/885580/pexels-photo-885580.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },

    /* === CAMISAS (3) ===================================================== */
    {
      id: "camisa-alba-popelina",
      nombre: "Camisa Alba de popelina",
      categoria: "camisas",
      precio: 1290,
      precioAnterior: null,
      enOferta: false,
      esNovedad: false,
      destacadoHome: true,
      colores: [
        { nombre: "Blanco", hex: "#f6f3ec" },
        { nombre: "Azul cielo", hex: "#bcd0e0" }
      ],
      tallas: ["XS", "S", "M", "L", "XL"],
      agotadas: [],
      descripcion: "La camisa blanca que toda fonda de ropa necesita. Popelina de algodón fresca, cuello firme y un corte limpio que entra en la oficina y sale a cenar. Sencilla de las que nunca fallan.",
      materiales: "100% algodón popelina.",
      cuidados: "Lavar a máquina en frío. Planchar húmeda para un acabado nítido. No usar blanqueador.",
      imagenes: [
        "https://images.pexels.com/photos/2784879/pexels-photo-2784879.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/9956796/pexels-photo-9956796.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },
    {
      id: "camisa-medianoche-hombro",
      nombre: "Blusa Medianoche al hombro",
      categoria: "camisas",
      precio: 1190,
      precioAnterior: null,
      enOferta: false,
      esNovedad: true,
      destacadoHome: false,
      colores: [
        { nombre: "Negro", hex: "#161616" }
      ],
      tallas: ["XS", "S", "M", "L"],
      agotadas: ["XS"],
      descripcion: "Hombros al aire y actitud de sobra. El escote bardot dibuja la clavícula y el negro mate hace el resto. Para esas noches en que quieres que la blusa hable por ti.",
      materiales: "96% poliéster, 4% elastano.",
      cuidados: "Lavar a mano en frío. Secar a la sombra. Plancha tibia del revés.",
      imagenes: [
        "https://images.pexels.com/photos/160414/pexels-photo-160414.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/11802389/pexels-photo-11802389.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },
    {
      id: "camisa-arena-casual",
      nombre: "Camisa Arena casual",
      categoria: "camisas",
      precio: 1090,
      precioAnterior: 1500,
      enOferta: true,
      esNovedad: false,
      destacadoHome: false,
      colores: [
        { nombre: "Blanco", hex: "#f6f3ec" },
        { nombre: "Arena", hex: "#d8c7a8" }
      ],
      tallas: ["XS", "S", "M", "L", "XL"],
      agotadas: [],
      descripcion: "Relajada de las que se viven en fin de semana. Algodón con cuerpo, corte holgado para meter dentro o llevar suelta sobre unos jeans. Comodidad sin renunciar a verse bien.",
      materiales: "100% algodón.",
      cuidados: "Lavar a máquina en frío. Secadora en temperatura baja. Plancha media.",
      imagenes: [
        "https://images.pexels.com/photos/27786098/pexels-photo-27786098.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/27786098/pexels-photo-27786098.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },

    /* === PANTALONES (2) ================================================== */
    {
      id: "pantalon-asfalto-recto",
      nombre: "Pantalón Asfalto recto",
      categoria: "pantalones",
      precio: 1490,
      precioAnterior: null,
      enOferta: false,
      esNovedad: false,
      destacadoHome: false,
      colores: [
        { nombre: "Negro", hex: "#1a1a1a" },
        { nombre: "Gris piedra", hex: "#6e6a64" }
      ],
      tallas: ["XS", "S", "M", "L", "XL"],
      agotadas: ["S"],
      descripcion: "El pantalón que se pone solo cada mañana. Tiro medio, pierna recta y un negro profundo que estiliza sin esfuerzo. Va con tenis, con tacón y con todo lo que se te ocurra.",
      materiales: "63% poliéster, 33% viscosa, 4% elastano.",
      cuidados: "Lavar a máquina en frío, ciclo sintéticos. Plancha media. No usar blanqueador.",
      imagenes: [
        "https://images.pexels.com/photos/16969473/pexels-photo-16969473.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/14408067/pexels-photo-14408067.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },
    {
      id: "pantalon-terraza-fluido",
      nombre: "Pantalón Terraza fluido",
      categoria: "pantalones",
      precio: 1690,
      precioAnterior: null,
      enOferta: false,
      esNovedad: true,
      destacadoHome: false,
      colores: [
        { nombre: "Beige", hex: "#cdbb9e" },
        { nombre: "Verde oliva", hex: "#6b6a45" }
      ],
      tallas: ["XS", "S", "M", "L", "XL"],
      agotadas: [],
      descripcion: "Pierna amplia que respira en cuanto sube el calor. Cae con fluidez desde la cintura y se mueve contigo a cada paso. Ese pantalón fresco que termina siendo tu favorito del verano.",
      materiales: "55% lino, 45% viscosa.",
      cuidados: "Lavar a mano o ciclo delicado en frío. Plancha a alta temperatura húmeda. El lino arruga: es parte de su encanto.",
      imagenes: [
        "https://images.pexels.com/photos/9502220/pexels-photo-9502220.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/9502220/pexels-photo-9502220.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },

    /* === ACCESORIOS (2) ================================================== */
    {
      id: "bolso-nogal-piel",
      nombre: "Bolso Nogal de piel",
      categoria: "accesorios",
      precio: 2890,
      precioAnterior: null,
      enOferta: false,
      esNovedad: false,
      destacadoHome: true,
      colores: [
        { nombre: "Coñac", hex: "#8a5a2b" },
        { nombre: "Negro", hex: "#1a1a1a" }
      ],
      tallas: ["Única"],
      agotadas: [],
      descripcion: "Piel curtida a mano que se vuelve más bonita con los años. Estructura firme para llevar lo esencial con orden, asa cómoda al hombro y herrajes que envejecen con gracia. Una compra que dura una década.",
      materiales: "100% piel vacuna curtida al vegetal. Forro de algodón.",
      cuidados: "Nutrir la piel cada temporada con crema neutra. Evitar humedad prolongada. Guardar relleno en su bolsa de tela.",
      imagenes: [
        "https://images.pexels.com/photos/932401/pexels-photo-932401.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/3777932/pexels-photo-3777932.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },
    {
      id: "bolso-ambar-estructurado",
      nombre: "Bolso Ámbar estructurado",
      categoria: "accesorios",
      precio: 3490,
      precioAnterior: 3800,
      enOferta: true,
      esNovedad: false,
      destacadoHome: false,
      colores: [
        { nombre: "Ámbar", hex: "#a76d33" },
        { nombre: "Camel", hex: "#b08d57" }
      ],
      tallas: ["Única"],
      agotadas: [],
      descripcion: "Un bolso de los que se notan sin gritar. Líneas arquitectónicas, asa de piel trenzada y un ámbar cálido que ilumina cualquier conjunto neutro. El detalle que convierte un look correcto en uno memorable.",
      materiales: "Piel sintética premium con textura grano. Herrajes dorados mate.",
      cuidados: "Limpiar con paño húmedo y secar de inmediato. Evitar superficies abrasivas. Guardar en su funda.",
      imagenes: [
        "https://images.pexels.com/photos/5591912/pexels-photo-5591912.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/14629530/pexels-photo-14629530.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },

    /* === CALZADO (2) ===================================================== */
    {
      id: "tacon-granate-piel",
      nombre: "Tacón Granate de piel",
      categoria: "calzado",
      precio: 2290,
      precioAnterior: null,
      enOferta: false,
      esNovedad: true,
      destacadoHome: false,
      colores: [
        { nombre: "Granate", hex: "#6e2433" },
        { nombre: "Negro", hex: "#1a1a1a" }
      ],
      tallas: ["23", "24", "25", "26", "27"],
      agotadas: ["23"],
      descripcion: "El tacón que estiliza sin castigar. Piel suave que se amolda al pie, altura media de las que aguantan toda la cena y un granate elegante que viste cualquier pierna. Comodidad con sello de boutique.",
      materiales: "Exterior 100% piel. Plantilla acolchada. Suela antiderrapante.",
      cuidados: "Limpiar con paño seco. Aplicar protector de piel antes del primer uso. Guardar con horma.",
      imagenes: [
        "https://images.pexels.com/photos/27100521/pexels-photo-27100521.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/27204296/pexels-photo-27204296.jpeg?auto=compress&cs=tinysrgb&w=1000"
      ]
    },
    {
      id: "tacon-arena-texturizado",
      nombre: "Tacón Arena texturizado",
      categoria: "calzado",
      precio: 1890,
      precioAnterior: 2400,
      enOferta: true,
      esNovedad: false,
      destacadoHome: false,
      colores: [
        { nombre: "Arena", hex: "#cdb79a" },
        { nombre: "Dorado", hex: "#c9a85f" }
      ],
      tallas: ["23", "24", "25", "26", "27", "28"],
      agotadas: ["28"],
      descripcion: "Un nude que alarga la pierna y combina con todo el armario. Piel texturizada que atrapa la luz, punta fina y un tacón estable para caminar de verdad. El comodín que resuelve bodas, oficina y noche.",
      materiales: "Exterior de piel texturizada. Forro de piel. Suela de cuero con tope de goma.",
      cuidados: "Cepillar tras cada uso. Evitar lluvia. Reparar tapas del tacón a tiempo para alargar su vida.",
      imagenes: [
        "https://images.pexels.com/photos/134064/pexels-photo-134064.jpeg?auto=compress&cs=tinysrgb&w=1000",
        "https://images.pexels.com/photos/2669/high-heels-shoes-luxury-rich.jpg?auto=compress&cs=tinysrgb&w=1000"
      ]
    }

  ]
};
