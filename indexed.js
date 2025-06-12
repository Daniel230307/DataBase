document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("dinoForm");
  const resultado = document.getElementById("resultado");

  mostrarRegistros();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const favorito = document.getElementById("favorito").value;
    const tipo = document.querySelector('input[name="tipo"]:checked')?.value;
    const acepta = document.querySelector('input[name="acepta"]').checked;

    if (!nombre || !correo || !favorito || !tipo || !acepta) {
      resultado.textContent = "⚠️ Por favor completa todos los campos correctamente.";
      resultado.style.color = "red";
      return;
    }

    const nuevoRegistro = {
      id: Date.now(),
      nombre,
      correo,
      tipo,
      favorito
    };

    let registros = JSON.parse(localStorage.getItem("registrosDino")) || [];
    registros.push(nuevoRegistro);
    localStorage.setItem("registrosDino", JSON.stringify(registros));

    resultado.textContent = "✅ Registro guardado correctamente.";
    resultado.style.color = "green";

    form.reset();
    mostrarRegistros();
  });

  function mostrarRegistros() {
    const registros = JSON.parse(localStorage.getItem("registrosDino")) || [];

    const contenedor = document.createElement("div");
    contenedor.innerHTML = "<h3>Registros Guardados:</h3>";

    if (registros.length === 0) {
      contenedor.innerHTML += "<p>No hay registros aún.</p>";
    } else {
      const lista = document.createElement("ul");
      registros.forEach((reg) => {
        const item = document.createElement("li");
        item.innerHTML = `
          <strong>${reg.nombre}</strong> - ${reg.favorito} (${reg.tipo}) <br>
          <button onclick="editarRegistro(${reg.id})">✏️ Editar</button>
          <button onclick="eliminarRegistro(${reg.id})">🗑️ Eliminar</button>
        `;
        lista.appendChild(item);
      });
      contenedor.appendChild(lista);
    }

    const previo = document.getElementById("datosGuardados");
    if (previo) previo.remove();

    contenedor.id = "datosGuardados";
    resultado.parentNode.insertBefore(contenedor, resultado.nextSibling);
  }

  window.eliminarRegistro = function (id) {
    let registros = JSON.parse(localStorage.getItem("registrosDino")) || [];
    registros = registros.filter(reg => reg.id !== id);
    localStorage.setItem("registrosDino", JSON.stringify(registros));
    mostrarRegistros();
  };

  window.editarRegistro = function (id) {
    let registros = JSON.parse(localStorage.getItem("registrosDino")) || [];
    const reg = registros.find(r => r.id === id);

    if (reg) {
      document.getElementById("nombre").value = reg.nombre;
      document.getElementById("correo").value = reg.correo;
      document.getElementById("favorito").value = reg.favorito;
      document.querySelector(`input[name="tipo"][value="${reg.tipo}"]`).checked = true;

      // Ocultar checkbox para evitar errores al editar
      document.querySelector('input[name="acepta"]').checked = true;

      // Cambiar botón de submit a "Guardar cambios"
      const botonGuardar = document.createElement("button");
      botonGuardar.textContent = "💾 Guardar cambios";
      botonGuardar.type = "button";
      botonGuardar.id = "btnGuardarCambios";
      form.appendChild(botonGuardar);

      botonGuardar.addEventListener("click", () => guardarEdicion(id));
    }
  };

  function guardarEdicion(id) {
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const favorito = document.getElementById("favorito").value;
    const tipo = document.querySelector('input[name="tipo"]:checked')?.value;

    let registros = JSON.parse(localStorage.getItem("registrosDino")) || [];
    const index = registros.findIndex(r => r.id === id);
    if (index !== -1) {
      registros[index] = { ...registros[index], nombre, correo, favorito, tipo };
      localStorage.setItem("registrosDino", JSON.stringify(registros));
      resultado.textContent = "✅ Registro actualizado correctamente.";
      resultado.style.color = "green";
      form.reset();
      document.getElementById("btnGuardarCambios").remove();
      mostrarRegistros();
    }
  }

  document.getElementById("btnMostrar").addEventListener("click", function () {
    const mensajes = [
      "Los dinosaurios dominaban la Tierra.",
      "El T-Rex tenía dientes de hasta 30 cm.",
      "El Velociraptor tenía plumas."
    ];
    const index = Math.floor(Math.random() * mensajes.length);
    document.getElementById("mensajeJS").textContent = mensajes[index];
  });
});
