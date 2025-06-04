let bd;
let cajadatos;

document.addEventListener("DOMContentLoaded", function () {
  cajadatos = document.getElementById("cajadatos");
  const botonGrabar = document.getElementById("grabar");
  const botonBuscar = document.getElementById("buscar");

  botonGrabar.addEventListener("click", agregarPelicula);
  botonBuscar.addEventListener("click", buscarPorFecha);

  // Abrir o crear base de datos
  const solicitud = indexedDB.open("basededatos", 1);
  solicitud.addEventListener("error", mostrarError);
  solicitud.addEventListener("success", comenzar);
  solicitud.addEventListener("upgradeneeded", crearBD);
});

function mostrarError(evento) {
  console.error("Error al abrir la base de datos:", evento);
}

function comenzar(evento) {
  bd = evento.target.result;
  mostrar();
}

function crearBD(evento) {
  bd = evento.target.result;
  const almacen = bd.createObjectStore("peliculas", { keyPath: "id" });
  almacen.createIndex("BuscarFecha", "fecha", { unique: false });
}

function agregarPelicula() {
  const clave = document.getElementById("clave").value;
  const texto = document.getElementById("texto").value;
  const fecha = document.getElementById("fecha").value;

  if (!clave || !texto || !fecha) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const transaccion = bd.transaction(["peliculas"], "readwrite");
  const almacen = transaccion.objectStore("peliculas");

  const pelicula = {
    id: clave,
    nombre: texto,
    fecha: parseInt(fecha)
  };

  const solicitud = almacen.add(pelicula);
  solicitud.addEventListener("success", mostrar);
}

function mostrar() {
  cajadatos.innerHTML = "";
  const transaccion = bd.transaction(["peliculas"]);
  const almacen = transaccion.objectStore("peliculas");
  const cursor = almacen.openCursor();

  cursor.addEventListener("success", function (evento) {
    const cursorResultado = evento.target.result;
    if (cursorResultado) {
      const div = document.createElement("div");
      div.textContent = ID: ${cursorResultado.value.id} | Título: ${cursorResultado.value.nombre} | Año: ${cursorResultado.value.fecha};
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.onclick = () => eliminarPelicula(cursorResultado.value.id);
      div.appendChild(btnEliminar);
      cajadatos.appendChild(div);
      cursorResultado.continue();
    } else {
      if (!cajadatos.children.length) {
        cajadatos.innerHTML = "<p>No hay películas registradas.</p>";
      }
    }
  });
}

function buscarPorFecha() {
  const anio = parseInt(document.getElementById("anioBusqueda").value);
  if (isNaN(anio)) {
    alert("Introduce un año válido.");
    return;
  }

  cajadatos.innerHTML = "";

  const transaccion = bd.transaction(["peliculas"]);
  const almacen = transaccion.objectStore("peliculas");
  const indice = almacen.index("BuscarFecha");
  const rango = IDBKeyRange.only(anio);

  const cursor = indice.openCursor(rango);
  cursor.addEventListener("success", function (evento) {
    const cursorResultado = evento.target.result;
    if (cursorResultado) {
      const div = document.createElement("div");
      div.textContent = ID: ${cursorResultado.value.id} | Título: ${cursorResultado.value.nombre} | Año: ${cursorResultado.value.fecha};
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.onclick = () => eliminarPelicula(cursorResultado.value.id);
      div.appendChild(btnEliminar);
      cajadatos.appendChild(div);
      cursorResultado.continue();
    } else {
      if (!cajadatos.children.length) {
        cajadatos.innerHTML = "<p>No se encontraron películas para ese año.</p>";
      }
    }
  });
}

function eliminarPelicula(id) {
  const transaccion = bd.transaction(["peliculas"], "readwrite");
  const almacen = transaccion.objectStore("peliculas");
  const solicitud = almacen.delete(id);
  solicitud.addEventListener("success", mostrar);
}
