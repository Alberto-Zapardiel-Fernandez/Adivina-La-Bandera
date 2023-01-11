const URL = './db.json';
const countries = [];

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
  const countriesLevelOne = countries.filter((country) => country.level === 1),
    countriesLevelTwo = countries.filter((country) => country.level === 2),
    countriesLevelThree = countries.filter((country) => country.level === 3);
  console.log(countriesLevelTwo);
}
