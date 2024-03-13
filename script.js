//prendo var e gli assegno l'elemento del relativo ID
var nave = document.getElementById("naveI");
var spazio = document.getElementById("spazioI");
var temposparo = 0;


//assegno una costante al bottone in quanto non cambierà nel tempo
const BottoneMovimento = document.getElementById("bottoneMovimentoI");

//cliccare il pulsante farà avviare la funzione MuoviAlieni
BottoneMovimento.addEventListener("click", function () {
  MuoviAlieni();
});

//matrice utilizzata per indicare le coordinate degli alieni con x , y
var PosizioneAlieni = [
  [100, 25], [200, 25], [300, 25],
  [400, 25], [500, 25], [600, 25],
  [200, 75], [300, 75], [400, 75], [500, 75]
];

//per ogni coordinata inserita all'interno della matrice PosizioneAleini viene aggiunto un div alieno
PosizioneAlieni.forEach((position) => {
  const alieno = document.createElement("div");
  //classlist serve per aggiugnere alieno alle classi nel css di tipo nemico
  alieno.classList.add("nemiciLista");
  alieno.style.top = position[1] + "px"; // imposta la posizione verticale
  alieno.style.left = position[0] + "px"; // imposta la posizione orizzontale
  //viene aggiunto l'alieno appena creato nello spazio tramite appendchild
  spazio.appendChild(alieno);
});

//movimenti a seconda del tasto utilizzato nella tastiera

//e prende un valore specifico a seconda del tasto che viene premuto per poi farne il controllo
window.addEventListener("keydown", (e) => {
  var sinistra = parseInt(window.getComputedStyle(nave).getPropertyValue("left"));
  //se il tasto premuto è la freccia sinistra e la nave non è già al bordo allora questa si sposterà verso sinistra di 10px
  if (e.key == "ArrowLeft" && sinistra > 0) {
    nave.style.left = sinistra - 10 + "px";
  }
  //stessa cosa ma con la destra
  else if (e.key == "ArrowRight" && sinistra <= 770) {
    nave.style.left = sinistra + 10 + "px";
  }

  //controllo se il tasto schiacciato è la freccia in su o spazio
  if (e.key == "ArrowUp" || e.keyCode == 32) {
    //controlla se il tempo dello scorso sparo è maggiore di mezzo secondo
    if (Date.now() - temposparo > 500) {
      //viene creato un nuovo proiettile e aggiunto alla relative classe
      var proiettile = document.createElement("div");
      proiettile.classList.add("proiettile");
      //il proiettile viene aggiunto allo spazio
      spazio.appendChild(proiettile);
      //viene aggiornato il tempo di sparo 
      temposparo = Date.now();

      var MovimentoProiettile = setInterval(() => {
        //definisci nemiciLista come l'insieme dei nemici presi dalla matrice
        var nemici = document.getElementsByClassName("nemiciLista");

        //ciclo per il numero dei nemici
        for (var i = 0; i < nemici.length; i++) {
          //si prende il primo nemico dalla lista
          var nemico = nemici[i];
          //controlla se il nemico esiste in quanto una volta colpito viene eliminato
          if (nemico != undefined) {
            //boundingClientRect serve per prendere un quadrato/rettangolo delle dimensioni dell'oggetto specifico
            var dimensioneNemico = nemico.getBoundingClientRect();
            var dimensioneProiettile = proiettile.getBoundingClientRect();


            //controllo per vedere se il proiettile è compreso tra le dimensioni del nemico
            if (
              dimensioneProiettile.left < dimensioneNemico.right && dimensioneProiettile.right > dimensioneNemico.left &&
              dimensioneProiettile.top < dimensioneNemico.bottom && dimensioneProiettile.bottom > dimensioneNemico.bottom
            ) {
              //viene elimanto quello specific nemico
              nemico.parentElement.removeChild(nemico);
              //Prendop la stringa dei punti, la trasformo in intero e poi ci sommo 1 ad indicare di aver fatto un punto in più
              document.getElementById("puntiI").innerHTML = parseInt(document.getElementById("puntiI").innerHTML) + 1;
              //il proiettile viene eliminato
              proiettile.parentElement.removeChild(proiettile);

              //condizione di vittoria in caso tutti i nemici venissero uccisi controllando il numero dalle dimensioni della matrice
              if (parseInt(document.getElementById("puntiI").innerHTML) >= PosizioneAlieni.length) {
                document.body.style.backgroundImage = "url(backgroundW.gif)";
                document.getElementById("titolo").innerHTML = "COMMUNISM FOREVER!";
                document.getElementById("finale").innerHTML = "Complimenti eroe! Sei riuscito a salvare la Cina ed il Comunismo!";
                var overlay = document.getElementById("overlay");
                overlay.style.backgroundImage = "url(victory.gif)";
                var audio = document.getElementById("audio-vittoria");
                audio.play();
                document.getElementById("canzone").pause();
                document.getElementById("canzone").currentTime = 0;

                overlay.style.display = "block";
              }
            }
          }
        }
        //prendo le coordinate della parte inferiore del proiettile
        var CoordinateProiettile = parseInt(
          window.getComputedStyle(proiettile).getPropertyValue("bottom")
        );

        //Se le coordinate superano le dimensioni dello spazio di gioco allora il proiettile scompare
        if (CoordinateProiettile >= 500) {
          clearInterval(MovimentoProiettile);
        }

        //calcolo per fare in modo che il proiettile esca dalla navicella
        proiettile.style.left = sinistra + (nave.offsetWidth / 2) - 5 + "px";


        //movimento che compie il proiettile verticalmente
        proiettile.style.bottom = CoordinateProiettile + 1.7 + "px";
      });
    }
  }
}
);


let direzione = 1; // 1 per destra, -1 per sinistra
let discesaAlieni = false;

function MuoviAlieni() {
  var alieno = document.getElementsByClassName("nemiciLista");
  for (var i = 0; i < alieno.length; i++) {

    //si sposta di 10px o di -10px orizzontalmente a seconda che la direzione sia positiva o negativa
    alieno[i].style.left = parseInt(alieno[i].style.left) + 10 * direzione + "px";

    //controllo se gli alieni hanno toccato il bordo
    if (parseInt(alieno[i].style.left) > 750 || parseInt(alieno[i].style.left) < 0) {
      //controllo nel caso gli alieni non stessero scendendo
      if (!discesaAlieni) {
        for (var j = 0; j < alieno.length; j++) {
          //tutti gli alieni vengono fatti ciclare e spostati di 50px verso il basso
          alieno[j].style.top = parseInt(alieno[j].style.top) + 50 + "px";

          //controllo se gli alieni hanno toccato il bordo inferiore e quindi la condizione di sconfitta
          if (parseInt(alieno[j].style.top) >= 400) {
            document.body.style.backgroundImage = "url(background.gif)";
            document.getElementById("titolo").innerHTML = "你辜负了习近平和中国";
            document.getElementById("finale").innerHTML = "Hai fallito. La tua data di esecuzione è stata programmata per domani.";
            var overlay = document.getElementById("overlay");
            var audio = document.getElementById("audio-sconfitta");
            audio.play();
            document.getElementById("canzone").pause();
            document.getElementById("canzone").currentTime = 0;

            overlay.style.display = "block";
            var nave = document.querySelector("#naveI");
            nave.style.bottom = "-100px";
          }
        }
        //se gli alieni non stavano scendendo scenderanno ora
        discesaAlieni = true;
      }
      //la direzione viene invertita
      direzione = -direzione;
    }
  }

  if (discesaAlieni) {
    discesaAlieni = false;
  }
}

//funzione per riavviare il gioco
function restartGame() {
  location.reload();
}


//funzione per interrompere / saltare la riproduzione dell'introduzione
function stopVideo() {
  const myvideo = document.getElementById("intro-video");
  myvideo.pause();
  myvideo.style.display = "none";

  const canzone = document.getElementById("canzone");
  canzone.play();
  var bottoneM = document.querySelector("#bottoneMovimentoI");
  bottoneM.style.top = "400px";

  var punteggio = document.querySelector("#puntiI");
  punteggio.style.top = "100px";

  var riavvia = document.querySelector("#bottoneRicominciaI");

  riavvia.style.top = "550px";
  riavvia.style.right = "200px";

  var bottoneStop = document.getElementById("stop-button");
  bottoneStop.style.top = "-100px";

  document.getElementById("finale").innerHTML = "";

}