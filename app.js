const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

//eventos
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito')) //guardo los objetos del carrito en el localStorage
        pintarCarrito()
    }
})

cards.addEventListener('click', e =>{
    addCarrito(e)
})

items.addEventListener('click', e=>{
    btnAccion(e)
})

const fetchData = async () =>{   //leer archivo .json
    try {
         const res = await fetch('api.json')
         const data = await res.json()
         pintarCards(data)
    } catch (error){
         console.log(error)
    }
}

const pintarCards = data => {   //cargo los productos
         data.forEach(producto => {
            templateCard.querySelector('h5').textContent = producto.title
            templateCard.querySelector('p').textContent = producto.precio
            templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
            templateCard.querySelector('.btn-dark').dataset.id = producto.id
            const clone = templateCard.cloneNode(true)
            fragment.appendChild(clone)
         }); 
cards.appendChild(fragment)
}

const addCarrito = e => {  
    if(e.target.classList.contains('btn-dark')){
         setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {    //en el carrito incluyo todo el objeto
     const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
     }

   if(carrito.hasOwnProperty(producto.id)){
    producto.cantidad = carrito[producto.id].cantidad + 1
   }  

   carrito[producto.id] = {...producto}
   
   pintarCarrito()
}

const pintarCarrito = () => { //resultado de la compra
   items.innerHTML = ''  
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
})
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito)) //actualizo localStorage
}

const pintarFooter = () => { 
    footer.innerHTML = ''
    if(Object.keys(carrito).length  === 0){   // en caso de no tener objetos volvera al inicio
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - Hace tu pedido!</th>
        `
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)   //cantidad total 
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)  //precio total

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
}

//modificar cantidad carrito
const btnAccion = e =>{
    //aumentar cantidad
    if(e.target.classList.contains('btn-info')){
          
          const producto = carrito[e.target.dataset.id]
          producto.cantidad++  //incremento
          carrito[e.target.dataset.id] = {...producto}
          pintarCarrito()  ///actualizo el carrito
    }

    if(e.target.classList.contains('btn-danger')){
          const producto = carrito[e.target.dataset.id]
          producto.cantidad-- //reduzco
          if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
          }
          pintarCarrito()  ///actualizo el carrito
    }

    e.stopPropagation()
}