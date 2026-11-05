const $ = id => document.getElementById(id);
const lienzo = $("lienzo"), ctx = lienzo.getContext("2d");
const ANCHO = lienzo.width, ALTO = lienzo.height, SUELO = ALTO - 60;
const GRAVEDAD = 0.6, SALTO = -13, VELOCIDAD = 5, PASO = 1000 / 60;
const teclas = {};
let jugador, monstruo, manzanas, puntos, jugando, anterior = performance.now(), acumulado = 0;

// ---------- Estado y lógica ----------
function crearManzanas() {
  const nivel = () => SUELO - [38, 88, 128][Math.floor(Math.random() * 3)];
  manzanas = Array.from({ length: 6 }, () => ({ x: 160 + Math.random() * 600, y: nivel(), w: 24, h: 26 }));
}
function iniciar() {
  jugador = { x: 80, y: SUELO - 50, w: 34, h: 50, vy: 0, enSuelo: true, dir: 1 };
  monstruo = { x: ANCHO - 100, y: SUELO - 44, w: 44, h: 44, vel: 1.8 };
  puntos = 0; jugando = true;
  crearManzanas();
  $("puntos").textContent = 0; $("final").classList.add("oculto");
}
const choca = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
function actualizar() {
  const j = jugador, m = monstruo;
  if (teclas.ArrowLeft || teclas.KeyA) { j.x -= VELOCIDAD; j.dir = -1; }
  if (teclas.ArrowRight || teclas.KeyD) { j.x += VELOCIDAD; j.dir = 1; }
  j.x = Math.max(0, Math.min(ANCHO - j.w, j.x));
  if ((teclas.Space || teclas.ArrowUp) && j.enSuelo) { j.vy = SALTO; j.enSuelo = false; }
  j.vy += GRAVEDAD; j.y += j.vy;                  // la gravedad tira del personaje hacia abajo
  if (j.y >= SUELO - j.h) { j.y = SUELO - j.h; j.vy = 0; j.enSuelo = true; }
  const dx = j.x - m.x;                           // el monstruo persigue al personaje
  if (Math.abs(dx) > m.vel) m.x += Math.sign(dx) * m.vel;
  manzanas = manzanas.filter(a => {               // recoger manzanas
    const tocada = choca(j, a);
    if (tocada) $("puntos").textContent = ++puntos;
    return !tocada;
  });
  if (manzanas.length === 0) { crearManzanas(); m.vel = Math.min(m.vel + 0.3, 4); }
  if (choca(j, m)) {                              // el monstruo atrapa al personaje
    jugando = false; $("puntosFinal").textContent = puntos;
    $("final").classList.remove("oculto");
  }
}

// ---------- Dibujo ----------
const rect = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
const circulo = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
function dibujarJugador() {
  const { x, y, dir } = jugador;
  rect(x + 4, y + 22, 26, 20, "#1e88e5");                                        // cuerpo
  rect(x + 6, y + 42, 9, 8, "#37474f"); rect(x + 19, y + 42, 9, 8, "#37474f");   // piernas
  circulo(x + 17, y + 12, 12, "#ffcc80"); rect(x + 5, y, 24, 6, "#d32f2f");      // cabeza y gorra
  circulo(x + 12 + dir * 2, y + 13, 2, "#000"); circulo(x + 22 + dir * 2, y + 13, 2, "#000");
}
function dibujarMonstruo() {
  const x = monstruo.x, y = monstruo.y - Math.abs(Math.sin(Date.now() / 120)) * 6;
  rect(x + 6, y - 4, 8, 12, "#4a148c"); rect(x + 30, y - 4, 8, 12, "#4a148c");   // cuernos
  circulo(x + 22, y + 22, 22, "#7b1fa2");                                        // cuerpo
  [14, 30].forEach(dx => { circulo(x + dx, y + 18, 6, "#fff"); circulo(x + dx, y + 19, 2.5, "#000"); });
  rect(x + 10, y + 30, 24, 8, "#311b92");                                        // boca
  rect(x + 13, y + 30, 5, 4, "#fff"); rect(x + 26, y + 30, 5, 4, "#fff");        // dientes
}
function dibujar() {
  ctx.clearRect(0, 0, ANCHO, ALTO);
  rect(0, SUELO, ANCHO, ALTO - SUELO, "#6d4c41"); rect(0, SUELO, ANCHO, 14, "#43a047");   // suelo
  manzanas.forEach(a => {
    circulo(a.x + 12, a.y + 14, 11, "#e53935");
    rect(a.x + 11, a.y, 3, 6, "#6d4c41"); circulo(a.x + 18, a.y + 4, 4, "#66bb6a");
  });
  dibujarJugador();
  dibujarMonstruo();
}

// ---------- Bucle principal y controles ----------
function bucle(ahora) {
  acumulado += Math.min(ahora - anterior, 100); anterior = ahora;
  for (; acumulado >= PASO; acumulado -= PASO) if (jugando) actualizar();
  dibujar();
  requestAnimationFrame(bucle);
}
document.addEventListener("keydown", e => {
  teclas[e.code] = true;
  if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();
});
document.addEventListener("keyup", e => { teclas[e.code] = false; });
$("reiniciar").addEventListener("click", iniciar);
iniciar();
requestAnimationFrame(bucle);
