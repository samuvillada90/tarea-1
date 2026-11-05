const form = document.getElementById("formTarea");
const input = document.getElementById("inputTarea");
const lista = document.getElementById("listaTareas");
const mensajeVacio = document.getElementById("mensajeVacio");
const CLAVE = "tareas"; // nombre con el que se guarda en localStorage
 
// Recupera las tareas guardadas; si no hay datos válidos, devuelve []
function cargarTareas() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || []; }
  catch { return []; }
}
let tareas = cargarTareas();
 
// Guarda en localStorage y vuelve a dibujar la lista
function actualizar() {
  localStorage.setItem(CLAVE, JSON.stringify(tareas));
  mostrarTareas();
}
 
function mostrarTareas() {
  lista.innerHTML = "";
  mensajeVacio.hidden = tareas.length > 0; // visible solo si no hay tareas
 
  tareas.forEach((tarea) => {
    const item = document.createElement("li");
    item.className = tarea.completada ? "completada" : "";
 
    const casilla = document.createElement("input");
    casilla.type = "checkbox";
    casilla.checked = tarea.completada;
    casilla.onchange = () => { tarea.completada = !tarea.completada; actualizar(); };
 
    const texto = document.createElement("span");
    texto.textContent = tarea.texto; // textContent evita insertar HTML
 
    const borrar = document.createElement("button");
    borrar.className = "eliminar";
    borrar.textContent = "Eliminar";
    borrar.onclick = () => {
      tareas = tareas.filter((t) => t.id !== tarea.id);
      actualizar();
    };
 
    item.append(casilla, texto, borrar);
    lista.appendChild(item);
  });
}
 
form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const texto = input.value.trim();
  if (texto === "") return;
  tareas.push({ id: Date.now(), texto, completada: false });
  actualizar();
  form.reset();
  input.focus();
});
 
mostrarTareas(); // muestra las tareas al cargar la página
