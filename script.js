'use strict';

const countriesContainer = document.querySelector('.countries');
const form = document.querySelector('.form');
const formInput = document.querySelector('.form__input');
const formButton = document.querySelector('.form__button');
formInput.focus();

///////////////////////////////////////

// Render country
const renderCountry = function (pais, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${pais.flag}" />
    <div class="country__data">
        <h3 class="country__name">${pais.nativeName}</h3>
        <h4 class="country__region">${pais.region}</h4>
        <p class="country__row"><span>👫</span>${
          pais.population > 1000000
            ? (+pais.population / 1000000).toFixed(1) + 'M'
            : +pais.population / 1000 + 'K'
        } personas</p>
        <p class="country__row"><span>🗣️</span>${
          pais.languages[0].nativeName
        }</p>
        <p class="country__row"><span>💰</span>${pais.currencies[0].code}</p>
    </div>
  </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

// fetch api - promises

// render clean
const renderClean = function () {
  countriesContainer.innerHTML = '';
};

// Obtener pais Vecino
const obtenerDatosPaisVecino = function (paisVecino) {
  fetch(`https://restcountries.eu/rest/v2/alpha/${paisVecino}`)
    .then(res => res.json())
    .then(data => renderCountry(data, 'neighbour'));
};

// Obtener pais
const obtenerDatosPais = function (pais) {
  fetch(`https://restcountries.eu/rest/v2/name/${pais}`)
    .then(res => {
      //   console.log(res);
      if (!res.ok)
        throw new Error(
          `No se reconoce el nombre de ese país error:${res.status}`
        );
      return res.json();
    })
    .then(data => {
      // Render data
      //   console.log(data[0]);
      renderCountry(data[0]);

      // Mostrar sus paises vecinos
      const vecinos = data[0].borders;
      //   console.log(vecinos);

      if (!vecinos) return; // Si no obtiene un resultado - clausure protection

      // Si arroja algun resultado mostrar los paises vecinos
      vecinos.forEach(vecino => obtenerDatosPaisVecino(vecino));
    })
    .catch(err => console.error(`${err}`));
};

// Eventos
formButton.addEventListener('click', function (e) {
  e.preventDefault();

  // Guardar dato en una variable
  const pais = formInput.value;

  if (pais === '') {
    renderClean();
    formInput.focus();
  }

  renderClean();
  obtenerDatosPais(pais);
});
