document.addEventListener("DOMContentLoaded", () => {
    cargarCompras();
});

const API_URL = "http://localhost:3000/compras";

function cargarCompras() {
    fetch(API_URL)
        .then(response => response.json())
        .then(compras => {
            compras.sort((a, b) => (a.estado === "comprado") - (b.estado === "comprado"));
            mostrarCompras(compras);
        })
        .catch(error => console.error("Error cargando compras:", error));
}

function mostrarCompras(compras) {
    const lista = document.getElementById("listaCompras");
    lista.innerHTML = "";

    compras.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "lista-item");
        
        if (item.estado === "comprado") {
            li.classList.add("fondo-comprado", "comprado");
        } else {
            li.classList.add("bg-dark", "text-white");
        }

        li.innerHTML = `
            <span>${item.nombre}
                <span class="edit-icon" onclick="editarCompra('${item.id}')">
                    <span class="material-symbols-outlined">edit</span>
                </span>
            </span>
            <div>
                <button class="btn btn-success btn-sm me-2" onclick="marcarComoComprado('${item.id}', '${item.estado}')">
                    <span class="material-symbols-outlined">check</span>
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarCompra('${item.id}')">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
        
        lista.appendChild(li);
    });
}

function editarCompra(id) {
    const nuevoNombre = prompt("Nombre del artículo:");
    if (nuevoNombre) {
        fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nuevoNombre })
        })
        .then(() => cargarCompras())
        .catch(error => console.error("Error al editar:", error));
    }
}

function marcarComoComprado(id, estadoActual) {
    const nuevoEstado = estadoActual === "comprado" ? "pendiente" : "comprado";

    fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado })
    })
    .then(() => cargarCompras())
    .catch(error => console.error("Error al actualizar:", error));
}

function agregarCompra() {
    const nombreInput = document.getElementById("itemNombre");
    const nombre = nombreInput.value.trim();

    if (nombre === "") return;

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, estado: "pendiente" })
    })
    .then(response => response.json())
    .then(() => {
        nombreInput.value = "";
        cargarCompras();
    })
    .catch(error => console.error("Error al agregar:", error));
}


function eliminarCompra(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => cargarCompras())
        .catch(error => console.error("Error al eliminar:", error));
}
