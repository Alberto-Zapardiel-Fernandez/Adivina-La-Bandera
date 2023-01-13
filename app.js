const URL = './db.json',
  TOTAL_OPTIONS = 3,
  TIMER = 1000;
const countries = [];
const $btnSelectLevel = document.getElementById('btnSelectLevel'),
  $title = document.getElementById('level-selected'),
  $imgFlag = document.getElementById('imgFlag'),
  $select = document.getElementById('answer'),
  $fragment = document.createDocumentFragment();
$fragment.innerHTML = '';

let countriesLevelOne, countriesLevelTwo, countriesLevelThree;

let level = 1,
  aciertos = 0,
  fallos = 0;

/* Hacemos la petición en local de los paises */
const res = fetch(URL);
res.then((response) =>
  response.json().then((data) => {
    /* Recorremos la respuesta y añadimos cada país a un array para guardar todos */
    data.paises.forEach((country) => {
      countries.push(country);
    });
    saveCountries(countries);
  })
);

function saveCountries(countries) {
  (countriesLevelOne = countries.filter((country) => country.level === 1)),
    (countriesLevelTwo = countries.filter((country) => country.level === 2)),
    (countriesLevelThree = countries.filter((country) => country.level === 3));
}

$btnSelectLevel.addEventListener('click', () => {
  /* Seleccionamos el valor y si es distinto de un texto que ponga nivel ajustamos el nivel */
  const levelSelected = document.getElementById('levelSelected').value;
  startGame(parseInt(levelSelected));
});

/* Función para iniciar el juego */

//TODO: HAcer un contador de tiempo restante

const startGame = (level) => {
  /* Creamos el juego con el nivel 1 */
  if (level === 1) {
    /* Escribimos el nivel en el DOM */
    writeLevel(level);
    let counter = 0;
    const time = setInterval(() => {
      /* Con el siguiente if cortamos el juego y pasaría al siguiente nivel */
      if (counter === countriesLevelOne.length) {
        ({ level, counter } = countinueToNextLevel(level, counter, time));
      } else {
        /*Si no hemos llegado al final creamos 3 options con valores distintos */
        let positions = setAleatoryPosition(counter, countriesLevelOne.length);
        /* Los pintamos en el DOM junto con las banderas correspodientes */
        paintDom(positions, counter, countriesLevelOne);
      }
      counter++;
    }, TIMER);
  }
  /* Creamos el juego con el nivel 2 */
  if (level === 2) {
    /* Escribimos el nivel en el DOM */
    writeLevel(level);
    let counter = 0;
    const time = setInterval(() => {
      /* Con el siguiente if cortamos el juego y pasaría al siguiente nivel */
      if (counter === countriesLevelTwo.length) {
        ({ level, counter } = countinueToNextLevel(level, counter, time));
      } else {
        /*Si no hemos llegado al final creamos 3 options con valores distintos */
        let positions = setAleatoryPosition(counter, countriesLevelTwo.length);
        /* Los pintamos en el DOM junto con las banderas correspodientes */
        paintDom(positions, counter, countriesLevelTwo);
      }
      counter++;
    }, TIMER);
  }
  /* Creamos el juego con el nivel 3 */
  if (level === 3) {
    /* Escribimos el nivel en el DOM */
    writeLevel(level);
    let counter = 0;
    const time = setInterval(() => {
      /* Con el siguiente if cortamos el juego y terminaría el juego */
      if (counter === countriesLevelThree.length) {
        clearInterval(time);
        level++;
        counter = 0;
        alert('Fin del juego');
      } else {
        /* Creamos 3 options con valores distintos y los pintamos*/
        let positions = setAleatoryPosition(
          counter,
          countriesLevelThree.length
        );
        paintDom(positions, counter, countriesLevelThree);
      }
      counter++;
    }, TIMER);
  }
};

function countinueToNextLevel(level, counter, time) {
  level++;
  counter = 0;
  /* Preguntamos si seguimos */
  let response = confirm(`¿Seguimos al nivel ${level}?`);
  response
    ? startGame(level)
    : alert('Para seguir jugando eligue un nivel y comienza de nuevo');
  clearInterval(time);
  return { level, counter };
}

//TODO: hay que hacer la funcionalidad de los options para responder y al responder deshabilitarlos o algo así
function paintDom(positions, counter, countriesLevel) {
  for (let i = 0; i < TOTAL_OPTIONS; i++) {
    $fragment.innerHTML += `<option value="${
      countriesLevel[positions[i]].nombre
    }"> ${countriesLevel[positions[i]].nombre}</option>`;
  }
  $imgFlag.src = countriesLevel[counter].src;
  $select.innerHTML = $fragment.innerHTML;
  $fragment.innerHTML = '';
}

function setAleatoryPosition(position, countriesArrayLength) {
  /* Iniciamos el array con la posicion que mandamos */
  const arrayPositions = [position];
  do {
    /* Creamos una posición aleatoria en referencia a la longuitud del array de paises */
    let random = Math.floor(Math.random() * countriesArrayLength);
    /* Si el array no incluye esta posición le hacemos push */
    if (!arrayPositions.includes(random)) arrayPositions.push(random);
    /* Hasta que el array tenga las 3 posiciones y esté completo */
  } while (arrayPositions.length !== TOTAL_OPTIONS);
  /* Lo desordenamos y lo devolvemos */
  const mixedPositions = arrayPositions.sort(() => Math.random() - 0.5);
  return mixedPositions;
}

const writeLevel = (level) =>
  level === 4
    ? ($title.textContent = 'Fin del juego. ¿Reiniciar? ⬆️')
    : ($title.textContent = `Nivel seleccionado: ${level}`);
