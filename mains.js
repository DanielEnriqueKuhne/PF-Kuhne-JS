fetch ("./info.json")
    .then(respuesta => respuesta.json())
    .then(productos => {
        let carrito = []
        let carritoRecuperado = localStorage.getItem("carrito")
        if (carritoRecuperado) {
            carrito = JSON.parse(carritoRecuperado)}
        renderizarProductos(productos, carrito)
//renderizacion de productos del carrito mediante funcion renderizarProductos
renderizarProductos(productos, carrito)
//filtro por productos segun lo deseado por el usuario mediante funcion filtroProductos
let buscador = document.getElementById("buscador")
let botonBuscar = document.getElementById("buscar")
botonBuscar.addEventListener("click", () => filtroProductos(productos))
//ocultar carrito mediante funcion ocultarCarrito
let botonVerCarrito = document.getElementById("ocultarCarrito")
botonVerCarrito.addEventListener("click", ocultarCarrito)
//recuperar carrito con JSON
renderizarCarrito(carrito)
//finalizar compra
let botonFinalizarCompra = document.getElementById("finalizarCompra")
botonFinalizarCompra.addEventListener("click", finalizarCompra)
//FUNCIONES
//funcion para renderizar productos del carrito
function renderizarProductos(productos, carrito) {
    let contenedor = document.getElementById("contenedorProductos")
    contenedor.innerHTML = ""
    productos.forEach(producto => {
    let tarjeta = document.createElement("div")
    tarjeta.className = "tarjeta"
    tarjeta.innerHTML = `
    <h3>${producto.nombre}</h3>
    <img class=imagenProducto src=${producto.rutaImagen} />
    <p>$${producto.precio}</p>
    <button id=${producto.id}>Agregar al carrito</button>
    `
    contenedor.appendChild(tarjeta)
    let botonAgregarAlCarrito = document.getElementById(producto.id)
    botonAgregarAlCarrito.addEventListener("click", (e) => agregarProductoAlCarrito(productos, carrito, e))
})
}
//funcion para filtrar los productos segun su nombre
function filtroProductos(productos) {
    let productosFiltrados = productos.filter(producto => producto.nombre.includes(buscador.value))
    renderizarProductos(productosFiltrados)
}
//funcion para agragar un producto al carrito
function agregarProductoAlCarrito(productos, carrito, e) {
    let productoBuscado = productos.find(producto => producto.id === Number(e.target.id))
    let productoEnCarrito = carrito.find(producto => producto.id === productoBuscado.id)

if (productoBuscado.stock > 0) {
    if (productoEnCarrito) {
    productoEnCarrito.unidades++
    productoEnCarrito.subtotal = productoEnCarrito.unidades * productoEnCarrito.precioUnitario
    } else {
    carrito.push({
        id: productoBuscado.id,
        nombre: productoBuscado.nombre,
        precioUnitario: productoBuscado.precio,
        unidades: 1,
        subtotal: productoBuscado.precio
    })
    }
    productoBuscado.stock--
    localStorage.setItem("carrito", JSON.stringify(carrito))
    Toastify ({
        text: "Producto agregado al carrito!",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
} else {
    Swal.fire({
        icon: 'error',
        title: 'Producto sin stock',})
}
renderizarCarrito(carrito)
}
//funcion para renderizar el carrito
function renderizarCarrito(productosEnCarrito){
    if (productosEnCarrito.length > 0) {
        let divCarrito = document.getElementById("carrito")
        divCarrito.innerHTML = ""
        productosEnCarrito.forEach(producto => {
        let tarjetaEnCarrito = document.createElement("div")
        tarjetaEnCarrito.className = "tarjetaEnCarrito"
        tarjetaEnCarrito.innerHTML = `
        <h3>${producto.nombre}</h3>
        <img class=imagenProducto src=${producto.rutaImagen} />
        <p>Precio unitario: $${producto.precioUnitario}</p>
        <p>Unidades: ${producto.unidades}</p>
            <p>Subtotal: $${producto.subtotal}</p>
            `
            divCarrito.appendChild(tarjetaEnCarrito)
        })
    }
}
//funcion ocultar carrito
function ocultarCarrito() {
    let carrito = document.getElementById("carrito")
    let contenedorProductos = document.getElementById("contenedorProductos")
    carrito.classList.toggle("oculta")
    contenedorProductos.classList.toggle("oculta")
}
//funcion para finalizar la compra
function finalizarCompra() {
    let carrito = document.getElementById("carrito")
    carrito.innerHTML = ""
    localStorage.removeItem("carrito")   
    Swal.fire(
        'COMPRA FINALIZADA',
        'Que lo disfrute!',
        'success'
    )
}
})