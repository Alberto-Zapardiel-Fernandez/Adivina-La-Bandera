const URL = './db.json',
  TOTAL_OPTIONS = 3,
  TIMER = 8000;
const countries = [];
const $btnSelectLevel = document.getElementById('btnSelectLevel'),
  $title = document.getElementById('level-selected'),
  $imgFlag = document.getElementById('imgFlag'),
  $select = document.getElementById('answer'),
  $aciertos = document.getElementById('aciertos'),
  $fallos = document.getElementById('fallos'),
  $timerText = document.getElementById('timer'),
  $fragment = document.createDocumentFragment();
$fragment.innerHTML = '';

let timer = setInterval(() => {}, 10);
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

/* Listeners */
$btnSelectLevel.addEventListener('click', () => {
  /* Seleccionamos el valor y si es distinto de un texto que ponga nivel ajustamos el nivel */
  const levelSelected = document.getElementById('levelSelected').value;
  $timerText.textContent = 'EMPEZAMOS!!!';
  startGame(parseInt(levelSelected));
});
/* Al cambiar el valor  del select comprobamos que los valores son los mismos */
$select.addEventListener('change', () => {
  /* Damos acierto o fallo según sean las respuestas */
  if ($select.value === $imgFlag.alt) {
    aciertos++;
    $aciertos.textContent = `Aciertos: ${aciertos}`;
  } else {
    fallos++;
    $fallos.textContent = `Fallos: ${fallos}`;
  }
  $select.disabled = true;
});

/* Función para iniciar el juego */

const startGame = (level) => {
  /* Creamos el juego con el nivel 1 */
  if (level === 1) {
    timerRemaing();
    /* Escribimos el nivel en el DOM */
    writeLevel(level);
    let counter = 0;
    const time = setInterval(() => {
      /* Con el siguiente if cortamos el juego y pasaría al siguiente nivel */
      if (counter === countriesLevelOne.length) {
        ({ level, counter } = countinueToNextLevel(
          level,
          counter,
          time,
          timer
        ));
      } else {
        /*Si no hemos llegado al final creamos 3 options con valores distintos */
        let positions = setAleatoryPosition(counter, countriesLevelOne.length);
        /* Los pintamos en el DOM junto con las banderas correspodientes */
        paintDom(positions, counter, countriesLevelOne);
      }
      counter++;
      $select.disabled = false;
    }, TIMER);
  }
  /* Creamos el juego con el nivel 2 */
  if (level === 2) {
    timerRemaing();
    /* Escribimos el nivel en el DOM */
    writeLevel(level);
    let counter = 0;
    const time = setInterval(() => {
      /* Con el siguiente if cortamos el juego y pasaría al siguiente nivel */
      if (counter === countriesLevelTwo.length) {
        ({ level, counter } = countinueToNextLevel(
          level,
          counter,
          time,
          timer
        ));
      } else {
        /*Si no hemos llegado al final creamos 3 options con valores distintos */
        let positions = setAleatoryPosition(counter, countriesLevelTwo.length);
        /* Los pintamos en el DOM junto con las banderas correspodientes */
        paintDom(positions, counter, countriesLevelTwo);
      }
      counter++;
      $select.disabled = false;
    }, TIMER);
  }
  /* Creamos el juego con el nivel 3 */
  if (level === 3) {
    timerRemaing();
    /* Escribimos el nivel en el DOM */
    writeLevel(level);
    let counter = 0;
    const time = setInterval(() => {
      /* Con el siguiente if cortamos el juego y terminaría el juego */
      if (counter === countriesLevelThree.length) {
        clearInterval(time);
        clearInterval(timer);
        level++;
        counter = 0;
        alert(
          `Fin del juego! \nResultado\n${aciertos} aciertos\n${fallos} fallos`
        );
        aciertos = 0;
        fallos = 0;
      } else {
        /* Creamos 3 options con valores distintos y los pintamos*/
        let positions = setAleatoryPosition(
          counter,
          countriesLevelThree.length
        );
        paintDom(positions, counter, countriesLevelThree);
      }
      counter++;
      $select.disabled = false;
    }, TIMER);
  }
};

/* Función para contar el tiempo restante */
function timerRemaing() {
  let timerCounter = TIMER / 1000 - 1;
  timer = setInterval(() => {
    timerCounter !== 1
      ? ($timerText.textContent = `Quedan ${timerCounter} segundos`)
      : ($timerText.textContent = `Queda ${timerCounter} segundo`);
    timerCounter--;
    if (timerCounter < 0) {
      timerCounter = TIMER / 1000 - 1;
    }
  }, 1000);
}

/* Función para preguntar por el siguiente nivel */
function countinueToNextLevel(level, counter, time, timer) {
  level++;
  counter = 0;
  /* Preguntamos si seguimos */
  let response = confirm(
    `¿Seguimos al nivel ${level}?\nLlevas\n${aciertos} aciertos\n${fallos} fallos`
  );
  response
    ? startGame(level)
    : alert(
        `Para seguir jugando eligue un nivel y comienza de nuevo\nResultado\n${aciertos} aciertos\n${fallos} fallos`
      );
  aciertos = 0;
  fallos = 0;
  clearInterval(timer);
  clearInterval(time);
  return { level, counter };
}

/* Función que pinta los options y la imagen en el fragment, y este en el DOM */
function paintDom(positions, counter, countriesLevel) {
  $fragment.innerHTML += `<option>Selecciona un país</option>`;
  for (let i = 0; i < TOTAL_OPTIONS; i++) {
    $fragment.innerHTML += `<option id="${positions[i]} value="${
      countriesLevel[positions[i]].nombre
    }"> ${countriesLevel[positions[i]].nombre}</option>`;
  }
  $imgFlag.src = countriesLevel[counter].src;
  $imgFlag.alt = countriesLevel[counter].nombre;
  $select.innerHTML = $fragment.innerHTML;
  $fragment.innerHTML = '';
}
/* Función para generar las posiciones aleatorias de los paises */
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

/* Función para mostrar el nivel o fin del juego */
const writeLevel = (level) =>
  level === 4
    ? ($title.textContent = 'Fin del juego. ¿Reiniciar? ⬆️')
    : ($title.textContent = `Nivel seleccionado: ${level}`);
