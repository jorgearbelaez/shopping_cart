// variables

const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");

//let porque este valor variara de acuerdo a lo que hay en el carrito
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
  // para agregar un curso.
  listaCursos.addEventListener("click", agregarCurso);

  //elimina cursos del carrito
  carrito.addEventListener("click", eliminarCurso);

  //cuando el documento esta listo cargue los items en el local storage
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoHtml();
  });
  //vaciar el carrito
  vaciarCarritoBtn.addEventListener("click", () => {
    // reseteamos el arreglo porque si solo limpiamos el html, la proxima que agreguemos
    // un curso se agregaran los que estan en el carrito, recuerda una cosa es el
    //articuloCarrito que contiene los objetos con la informacion del curso, y otra
    // es el carrito que muestra en el html lo que esta en articulos carrito.
    articulosCarrito = [];
    limpiarHTML(); // eliminamos todo el html
  });
}

// funciones
function agregarCurso(e) {
  // para prevenir que al dar click se reinicie y se vaya al header
  e.preventDefault();
  // para que solo se agrege el curso al dar click sobre el boton agregar carrito
  if (e.target.classList.contains("agregar-carrito")) {
    //seleccionar al padre de href y al padre de estos que seria la clase info card
    const cursoSeleccionado = e.target.parentElement.parentElement;
    //esa informacion la almacenamos en una constante y la pasamos de argumento para
    //la siguiente funcion que llamaremos.
    leerDatosCurso(cursoSeleccionado);
  }
}
//elimina un curso del carrito
function eliminarCurso(e) {
  //nos aseguramos que no haya bubling y que funciones solo cuando se de clik
  // en el boton 'X'
  if (e.target.classList.contains("borrar-curso")) {
    //obtenemos el id del curso que queremos eliminar por medio del get attribute
    //ya que el id del curso lo tenemos en este enlance
    const cursoId = e.target.getAttribute("data-id");
    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);
    // como filter es un metodo que me crea un nuevo arreglo con el elemento que por lo general quiero filtrar (===)
    // y realmente lo que queremos es generar un nuevo arreglo para actualizar los elemento en el
    // carrito entonces hacemos que se traiga todos menos ese (!==), con esto el nuevo arreglo
    //contendra todos los elementos que se quedaran en carrito y mandamos a llamar nuevamente
    //la funcion para crear nuestro HTML en el carrito.
    carritoHtml();
  }
}

// extraer la informacion del curso para agregarla al carrito
function leerDatosCurso(curso) {
  // console.log(curso);

  // creamos un objeto con el contenido que recoletamos del curso
  const infoCurso = {
    //como tenemos seleccionado el div del curso entonces para seleccionar el elemnto
    // dentro del se usa curso y no document.querySelector.
    imagen: curso.querySelector("img").src, //extrae imagen
    titulo: curso.querySelector("h4").textContent, //extrae el contenido de h4
    precio: curso.querySelector(".precio span").textContent, //extrae el contenido del span que es el precio
    id: curso.querySelector("a").getAttribute("data-id"), // me extrae el id del curso
    cantidad: 1,
  };

  // revisa si un elemento ya existe en el carrito
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
  if (existe) {
    //actualizamos carrito
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso; // retorna el objeto actualizado
      } else {
        return curso; // retorna los objetos que no estan duplicados
      }
    });
    articulosCarrito = [...cursos];
  } else {
    //agregamos al carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  console.log(articulosCarrito);
  //llamamos a la siguiente funcion que insertara los curso en el html
  carritoHtml();
}

function carritoHtml() {
  // limpiar el HTML para que no se vayan encimando los curso previos
  //esto llamara una funcion que me limpiara el html del contenedor carrito
  // y estara listo para agragar el nuevo curso.
  limpiarHTML();

  //hay que iterar sobre el arreglo para crear el html que se insertara sobre el carrito(HTML)
  articulosCarrito.forEach((curso) => {
    const { imagen, titulo, precio, cantidad, id } = curso; // destructuring
    const row = document.createElement("tr"); //creamos la fila (row)
    //le insertamos el contenido a ese elemento(constante) que creamos
    row.innerHTML = `
    <td>
      <img src="${imagen}" width= 100px>
    </td> 
    <td>
      ${titulo} 
    </td> 
    <td>
      ${precio} 
    </td> 
    <td>
      ${cantidad} 
    </td> 
    <td>
      <a href="#" class="borrar-curso" data-id="${id}"> X </a> 
    </td> 
    `;

    //agrega el html del carrito en el table body

    contenedorCarrito.appendChild(row);
  });
  sincronizarStorage(); // agregar al storage
}
function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

function limpiarHTML() {
  // //forma lenta de limpiar html
  // contenedorCarrito.innerHTML = "";

  // para limpiar html se recomienda mejor usar un while

  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
  // mientras haya un hijo en contenedor carrito eliminalo por el primer hijo
}
