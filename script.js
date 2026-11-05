/* ==========================================================
   Taller 9 - Aplicación del Clima
   Universidad de Caldas - Programación Web Creativa II
   ========================================================== */

"use strict";

/* ----------------------------------------------------------
   1. DATOS: estados del clima y base de datos de ciudades
   ---------------------------------------------------------- */

// Objeto que relaciona cada estado del clima con su texto y su ícono Unicode
const ESTADOS = {
  soleado:  { texto: "Soleado",              icono: "☀️" },
  parcial:  { texto: "Parcialmente nublado", icono: "⛅" },
  nublado:  { texto: "Nublado",              icono: "☁️" },
  lluvia:   { texto: "Lluvia",               icono: "🌧️" },
  tormenta: { texto: "Tormenta eléctrica",   icono: "⛈️" },
  nieve:    { texto: "Nevadas",              icono: "❄️" },
  niebla:   { texto: "Niebla",               icono: "🌫️" }
};

// Array de objetos: cada ciudad tiene datos meteorológicos simulados
const ciudades = [
  {
    nombre: "Manizales", pais: "Colombia", clave: "parcial",
    temperatura: 17, sensacion: 16, humedad: 82, viento: 12
  },
  {
    nombre: "Bogotá", pais: "Colombia", clave: "nublado",
    temperatura: 14, sensacion: 12, humedad: 75, viento: 15
  },
  {
    nombre: "Medellín", pais: "Colombia", clave: "parcial",
    temperatura: 24, sensacion: 25, humedad: 68, viento: 9
  },
  {
    nombre: "Cali", pais: "Colombia", clave: "soleado",
    temperatura: 28, sensacion: 30, humedad: 65, viento: 11
  },
  {
    nombre: "Cartagena", pais: "Colombia", clave: "soleado",
    temperatura: 31, sensacion: 36, humedad: 78, viento: 20
  },
  {
    nombre: "Barranquilla", pais: "Colombia", clave: "soleado",
    temperatura: 32, sensacion: 37, humedad: 74, viento: 22
  },
  {
    nombre: "Bucaramanga", pais: "Colombia", clave: "parcial",
    temperatura: 26, sensacion: 27, humedad: 60, viento: 10
  },
  {
    nombre: "Pereira", pais: "Colombia", clave: "lluvia",
    temperatura: 22, sensacion: 22, humedad: 77, viento: 8
  },
  {
    nombre: "Santa Marta", pais: "Colombia", clave: "soleado",
    temperatura: 30, sensacion: 34, humedad: 76, viento: 18
  },
  {
    nombre: "Madrid", pais: "España", clave: "nublado",
    temperatura: 12, sensacion: 10, humedad: 58, viento: 14
  },
  {
    nombre: "Ciudad de México", pais: "México", clave: "parcial",
    temperatura: 19, sensacion: 18, humedad: 52, viento: 10
  },
  {
    nombre: "Buenos Aires", pais: "Argentina", clave: "lluvia",
    temperatura: 16, sensacion: 15, humedad: 70, viento: 19
  },
  {
    nombre: "Londres", pais: "Reino Unido", clave: "lluvia",
    temperatura: 9, sensacion: 6, humedad: 85, viento: 24
  },
  {
    nombre: "Nueva York", pais: "Estados Unidos", clave: "nublado",
    temperatura: 7, sensacion: 3, humedad: 55, viento: 27
  },
  {
    nombre: "Miami", pais: "Estados Unidos", clave: "tormenta",
    temperatura: 29, sensacion: 34, humedad: 85, viento: 21
  },
  {
    nombre: "San Francisco", pais: "Estados Unidos", clave: "niebla",
    temperatura: 13, sensacion: 12, humedad: 90, viento: 11
  },
  {
    nombre: "Tokio", pais: "Japón", clave: "soleado",
    temperatura: 15, sensacion: 14, humedad: 62, viento: 13
  },
  {
    nombre: "Reikiavik", pais: "Islandia", clave: "nieve",
    temperatura: -2, sensacion: -8, humedad: 80, viento: 35
  }
];

// Ciudades que aparecerán como botones de sugerencia
const CIUDADES_SUGERIDAS = [
  "Manizales", "Bogotá", "Cartagena", "Londres", "Reikiavik", "Miami"
];

/* ----------------------------------------------------------
   2. REFERENCIAS AL DOM
   ---------------------------------------------------------- */
const campoCiudad = document.getElementById("campoCiudad");
const botonConsultar = document.getElementById("botonConsultar");
const listaCiudades = document.getElementById("listaCiudades");
const mensajeError = document.getElementById("mensajeError");
const contenedorSugerencias = document.getElementById("contenedorSugerencias");
const mensajeInicial = document.getElementById("mensajeInicial");
const resultado = document.getElementById("resultado");
const tarjetaPrincipal = document.getElementById("tarjetaPrincipal");
const nombreCiudad = document.getElementById("nombreCiudad");
const nombrePais = document.getElementById("nombrePais");
const fechaActual = document.getElementById("fechaActual");
const estadoClima = document.getElementById("estadoClima");
const iconoClima = document.getElementById("iconoClima");
const temperatura = document.getElementById("temperatura");
const sensacion = document.getElementById("sensacion");
const humedad = document.getElementById("humedad");
const barraHumedad = document.getElementById("barraHumedad");
const viento = document.getElementById("viento");
const listaPronostico = document.getElementById("listaPronostico");

/* ----------------------------------------------------------
   3. FUNCIONES DE APOYO
   ---------------------------------------------------------- */

// Convierte un texto a minúsculas y le quita las tildes (para comparar sin errores)
function normalizarTexto(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Valida el campo de búsqueda. Devuelve un mensaje de error o "" si todo está bien
function validarCampo(valor) {
  const texto = valor.trim();

  if (texto === "") {
    return "Escribe el nombre de una ciudad para consultar el clima.";
  }
  if (texto.length < 2) {
    return "El nombre de la ciudad debe tener al menos 2 caracteres.";
  }
  if (!/^[\p{L}\s.'-]+$/u.test(texto)) {
    return "Usa únicamente letras. No se permiten números ni símbolos.";
  }
  return "";
}

// Busca una ciudad: primero por nombre exacto y luego por coincidencia al inicio
function buscarCiudad(nombre) {
  const buscado = normalizarTexto(nombre);

  const exacta = ciudades.find(function (ciudad) {
    return normalizarTexto(ciudad.nombre) === buscado;
  });

  if (exacta) {
    return exacta;
  }

  return ciudades.find(function (ciudad) {
    return normalizarTexto(ciudad.nombre).startsWith(buscado);
  });
}

// Devuelve la fecha actual en español con la primera letra en mayúscula
function obtenerFechaActual() {
  const fecha = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
}

/* ----------------------------------------------------------
   4. MENSAJES DE ERROR
   ---------------------------------------------------------- */

// Muestra un mensaje de error debajo del buscador
function mostrarError(mensaje) {
  mensajeError.textContent = mensaje;
  mensajeError.hidden = false;
  campoCiudad.classList.add("buscador__campo--error");
}

// Oculta el mensaje de error
function ocultarError() {
  mensajeError.hidden = true;
  mensajeError.textContent = "";
  campoCiudad.classList.remove("buscador__campo--error");
}

/* ----------------------------------------------------------
   5. PRESENTACIÓN DE RESULTADOS (manipulación del DOM)
   ---------------------------------------------------------- */

// Crea las tarjetas del pronóstico simulado de cinco días
function pintarPronostico(ciudad) {
  const secuencia = [
    "soleado", "parcial", "nublado", "lluvia", "parcial", "soleado", "nublado"
  ];
  const variaciones = [2, 1, -1, 0, 3];

  listaPronostico.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);

    const clave = secuencia[(i + ciudad.nombre.length) % secuencia.length];
    const maxima = ciudad.temperatura + 3 + variaciones[i - 1];
    const minima = ciudad.temperatura - 4 + variaciones[i - 1];

    const dia = document.createElement("article");
    dia.className = "dia";
    const nombreDia = fecha.toLocaleDateString("es-CO", { weekday: "short" });

    dia.innerHTML =
      '<p class="dia__nombre">' + nombreDia + "</p>" +
      '<p class="dia__icono">' + ESTADOS[clave].icono + "</p>" +
      '<p class="dia__maxima">' + maxima + "°C</p>" +
      '<p class="dia__minima">' + minima + "°C</p>";

    listaPronostico.appendChild(dia);
  }
}

// Muestra en pantalla toda la información de la ciudad encontrada
function mostrarClima(ciudad) {
  const estado = ESTADOS[ciudad.clave];

  nombreCiudad.textContent = ciudad.nombre;
  nombrePais.textContent = ciudad.pais;
  fechaActual.textContent = obtenerFechaActual();
  estadoClima.textContent = estado.texto;
  iconoClima.textContent = estado.icono;
  temperatura.textContent = ciudad.temperatura;
  sensacion.textContent = ciudad.sensacion;
  humedad.textContent = ciudad.humedad;
  viento.textContent = ciudad.viento;

  // El atributo data-clima cambia el color de la tarjeta desde CSS
  tarjetaPrincipal.dataset.clima = ciudad.clave;

  // La barra de humedad se llena según el porcentaje
  barraHumedad.style.width = ciudad.humedad + "%";

  pintarPronostico(ciudad);

  // Se oculta el mensaje inicial y se muestra el resultado con una animación
  mensajeInicial.hidden = true;
  resultado.hidden = false;
  resultado.classList.remove("resultado--animar");
  void resultado.offsetWidth; // Reinicia la animación CSS
  resultado.classList.add("resultado--animar");
}

/* ----------------------------------------------------------
   6. FUNCIÓN PRINCIPAL DE CONSULTA
   ---------------------------------------------------------- */
function consultarClima() {
  const valor = campoCiudad.value;
  const errorValidacion = validarCampo(valor);

  // 1) Validar el campo
  if (errorValidacion !== "") {
    resultado.hidden = true;
    mensajeInicial.hidden = false;
    mostrarError(errorValidacion);
    return;
  }

  // 2) Buscar la ciudad en el array
  const ciudad = buscarCiudad(valor);

  // 3) Si no existe, informar al usuario
  if (!ciudad) {
    const ejemplos = ciudades.slice(0, 4).map(function (c) {
      return c.nombre;
    }).join(", ");

    resultado.hidden = true;
    mensajeInicial.hidden = false;
    mostrarError(
      'No encontramos la ciudad "' + valor.trim() + '". Prueba con: ' + ejemplos + "..."
    );
    return;
  }

  // 4) Si existe, mostrar el clima
  ocultarError();
  campoCiudad.value = ciudad.nombre;
  mostrarClima(ciudad);
}

/* ----------------------------------------------------------
   7. PREPARACIÓN DE LA INTERFAZ
   ---------------------------------------------------------- */

// Llena la lista de autocompletado del campo de texto
function cargarListaCiudades() {
  ciudades.forEach(function (ciudad) {
    const opcion = document.createElement("option");
    opcion.value = ciudad.nombre;
    listaCiudades.appendChild(opcion);
  });
}

// Crea los botones de ciudades sugeridas
function crearSugerencias() {
  CIUDADES_SUGERIDAS.forEach(function (nombre) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "sugerencia";
    boton.textContent = nombre;

    // Evento click: coloca el nombre en el campo y consulta
    boton.addEventListener("click", function () {
      campoCiudad.value = nombre;
      consultarClima();
    });

    contenedorSugerencias.appendChild(boton);
  });
}

/* ----------------------------------------------------------
   8. EVENTOS
   ---------------------------------------------------------- */

// Evento click del botón principal
botonConsultar.addEventListener("click", consultarClima);

// Eventos de teclado: Enter consulta y Escape limpia el campo
campoCiudad.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    consultarClima();
  }
  if (evento.key === "Escape") {
    campoCiudad.value = "";
    ocultarError();
  }
});

// Al escribir, se borra el mensaje de error anterior
campoCiudad.addEventListener("input", ocultarError);

/* ----------------------------------------------------------
   9. INICIO DE LA APLICACIÓN
   ---------------------------------------------------------- */
cargarListaCiudades();
crearSugerencias();
campoCiudad.focus();
