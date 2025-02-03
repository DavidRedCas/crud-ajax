document.addEventListener("DOMContentLoaded", cargarCompras);

async function cargarCompras() {
    const respuesta = await fetch("http://localhost:3000/compras");
    const compras = await respuesta.json();
    
    const lista = document.getElementById("listaCompras");
    lista.innerHTML = "";

    compras.forEach(compra => {
        const item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `
            <span class="${compra.estado === 'comprado' ? 'comprado' : ''}">${compra.nombre}</span>
            <div>
                <button class="btn btn-success btn-sm" onclick="marcarComprado(${compra.id}, '${compra.estado}')"><span class="material-symbols-outlined">check</span></button>
                <button class="btn btn-danger btn-sm" onclick="eliminarCompra(${compra.id})"><span class="material-symbols-outlined">delete</span></button>
            </div>
        `;
        lista.appendChild(item);
    });
}

async function agregarCompra() {
    const nombre = document.getElementById("itemNombre").value;
    if (!nombre.trim()) return alert("Ingrese un nombre válido");

    const respuesta = await fetch("http://localhost:3000/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, estado: "pendiente" })
    });

    document.getElementById("itemNombre").value = "";
    cargarCompras();
}

async function marcarComprado(id, estadoActual) {
    const nuevoEstado = estadoActual === "pendiente" ? "comprado" : "pendiente";

    await fetch(`http://localhost:3000/compras/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado })
    });

    cargarCompras();
}

async function eliminarCompra(id) {
    await fetch(`http://localhost:3000/compras/${id}`, { method: "DELETE" });
    cargarCompras();
}
