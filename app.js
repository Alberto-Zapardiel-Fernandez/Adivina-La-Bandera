const URL = './db.json';
const countries = [];
const $btnSelectLevel = document.getElementById('btnSelectLevel'),
  $title = document.getElementById('level-selected'),
  $imgFlag = document.getElementById('imgFlag');

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
  startGame(1);
}

$btnSelectLevel.addEventListener('click', () => {
  /* Seleccionamos el valor y si es distinto de un texto que ponga nivel ajustamos el nivel */
  const levelSelected = document.getElementById('levelSelected').value;
  levelSelected !== 'nivel' ? startGame(parseInt(levelSelected)) : startGame(1);
});

/* Función para iniciar el juego */

const startGame = (level) => {
  /* Creamos el juego con el nivel 1 */
  if (level === 1) {
    writeLevel(level);
    console.log('Nivel: ' + level);
    console.log(countriesLevelOne);
    /* Poner así la bandera que corresponda */
    $imgFlag.src = countriesLevelOne[11].src;
    /* Al finalizar iniciamos el juego con nivel 2*/
    //level++;
  }
  /* Creamos el juego con el nivel 2 */
  if (level === 2) {
    writeLevel(level);
    console.log('Nivel: ' + level);
    console.log(countriesLevelTwo);
    /* Al finalizar iniciamos el juego con nivel 3*/
    //level++;
  }
  /* Creamos el juego con el nivel 3 */
  if (level === 3) {
    writeLevel(level);
    console.log('Nivel: ' + level);
    console.log(countriesLevelThree);

    /* Obtener nombres aleatorios del mismo array segun el lenght y con esa posicion */

    /* Acabamos poniendo fin del juego y los aciertos y fallos*/
    //level++;
    writeLevel(4);
  }
};

const writeLevel = (level) =>
  level === 4
    ? ($title.textContent = 'Fin del juego. ¿Reiniciar? ⬆️')
    : ($title.textContent = `Nivel seleccionado: ${level}`);
