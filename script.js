/************** Variables globales **************/
let pos_pregunta = 0;
let preguntas = [];
let resultados = [];

//funcionalidad-botones/home
//Evento botón start
const startButton = document.getElementById("start-button");
if (startButton) {
    startButton.addEventListener("click", (event) => {
        window.location.href = "../pages/question.html";
    })
}

//boton de siguiente en html/question
const buttonNext = document.getElementById("next");
if (buttonNext) {
    buttonNext.addEventListener("click", (event) => {
        window.location.href = "../pages/results.html";
    })
}

 /************** Botón jugar otra vez *************/
const playAgain = document.getElementById('playAgain');
if (playAgain) {
    playAgain.addEventListener('click', function () {
        window.location.href = './question.html';
    })
}

/***************** Render primera pregunta ***************/
const firstquest = document.getElementById('opciones-rta');
if (firstquest) {
getData().then(datos => {
  preguntas = datos;
  renderPregunta(pos_pregunta, firstquest); // pos 0
})
}

/***************** obtencion de datos ***************/
async function getData() {
    try{
   //   const res = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
        const res = await fetch('../datos.json');

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error("Recurso no encontrado (404)");
            } else if (res.status === 500) {
                throw new Error("Error en el servidor (500)");
            } else {
                throw new Error(`Error HTTP: ${res.status}`);
            }
        }
      const data = await res.json();
      let datosFinal = manipuDatos(data.results);
      return datosFinal;
      
    }catch (error) {
    if (error.message.includes("404")) {
      console.error("Error: No se encontró el recurso solicitado.");
    } else if (error.message.includes("500")) {
      console.error("Error: Problemas con el servidor.");
    } else {
      console.error("Hubo un problema:", error.message);
    }
}
}

/******************* Manipulacion de datos  ****************/
function manipuDatos (dataset) {
  
  let mappedData = dataset.map(preguntas => {
    const pregunta = preguntas.question;
    const respuesta = [preguntas.incorrect_answers[0], preguntas.incorrect_answers[1], preguntas.incorrect_answers[2]];
    let num = Math.floor(Math.random() * (respuesta.length + 1));
    respuesta.splice(num, 0, preguntas.correct_answer)
    
    return {pregunta, respuesta, correcta:preguntas.correct_answer};
  }) 
  return mappedData;
} 

/****************** Render Preguntas *******************/
function renderPregunta(i, container) {
  console.log(preguntas);
  
  container.innerHTML += `
  <h2>${preguntas[i].pregunta}</h2>
  <button class='option'>${preguntas[i].respuesta[0]}</button>
  <button class='option'>${preguntas[i].respuesta[1]}</button>
  <button class='option'>${preguntas[i].respuesta[2]}</button>
  <button class='option'>${preguntas[i].respuesta[3]}</button>
  `
  //score += 1
}  

/****************** Grafica ***********************/
//funcion grafica
function paintGraph(data = []) {
    if (!data || data.length === 0) {
        document.querySelector(".result").innerHTML = "<p>No hay datos disponibles aún.</p>";
        return;
    }

    let date = [];
    let score = [];

    for (let items of data) {
        date.push(items.date.toLocaleString("es-ES"));
        score.push(items.score);
    }

    let data2 = {
        labels: date,
        series: [score],
    };

    let asisY = {
        onlyInteger: true

    }

    var options = {
        fullWidth: true,
        chartPadding: {
            right: 40
        }
    };

    new Chartist.Line(".result", data2, asisY, options);

}

paintGraph();
  
//Contador 1 al 10 de preguntas, no se si esta bien :p

let totalPreguntas = 10;
let preguntaActual = 1;
let respuestasCorrectas = 0;

function responder(esCorrecta) {
  if (esCorrecta) {
    respuestasCorrectas++;
  }

  if (preguntaActual < totalPreguntas) {
    preguntaActual++;
    actualizarContador();
  } else {
    // Guardar puntaje en local, supuestamente 
    localStorage.setItem("puntajeFinal", `${respuestasCorrectas}/${totalPreguntas}`);
    window.location.href = "resultado.html"; //redirige a resultados.html
  }
}

function actualizarContador() {
  document.getElementById("question-counter").textContent =
    `Pregunta ${preguntaActual} de ${totalPreguntas}`;
;
}
actualizarContador();// Iniciar
