'use strict';
/*------------------------------------------------------------------------------
Full description at: https://github.com/HackYourFuture/Homework/blob/main/3-UsingAPIs/Week2/README.md#exercise-2-gotta-catch-em-all

Complete the four functions provided in the starter `index.js` file:

`fetchData`: In the `fetchData` function, make use of `fetch` and its Promise 
  syntax in order to get the data from the public API. Errors (HTTP or network 
  errors) should be logged to the console.

`fetchAndPopulatePokemons`: Use `fetchData()` to load the pokemon data from the 
  public API and populate the `<select>` element in the DOM.
  
`fetchImage`: Use `fetchData()` to fetch the selected image and update the 
  `<img>` element in the DOM.

`main`: The `main` function orchestrates the other functions. The `main` 
  function should be executed when the window has finished loading.

Use async/await and try/catch to handle promises.

Try and avoid using global variables. As much as possible, try and use function 
parameters and return values to pass data back and forth.
------------------------------------------------------------------------------*/
const USER_INTERFACE_ID = 'user-interface';
const IMG_API_ID = 'image-api';
const UI_MESSAGE_ID = 'ui-message';
const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const SELECT_ELEMENT_ID = 'select-pokes';

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (response.status !== 200)
      return Promise.reject(new Error('Invalid response'));
    const data = await response.json();
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

let isUIPopulated = false;

function fetchAndPopulatePokemons() {
  const [ui, selectElement] = isUIPopulated
    ? [
        document.getElementById(USER_INTERFACE_ID),
        document.getElementById(SELECT_ELEMENT_ID),
      ]
    : [createUIElements(), createElement('select', SELECT_ELEMENT_ID)];

  fetchData(API_URL)
    .then((data) => {
      for (let i = 0; i < data.results.length; ++i) {
        const option = document.createElement('option');
        option.textContent = data.results[i].name;
        option.value = data.results[i].url;
        selectElement.appendChild(option);
      }
    })
    .catch((error) => {
      return Promise.reject(error);
    });
  ui.appendChild(selectElement);
  document.body.appendChild(ui);

  selectElement.addEventListener('change', fetchImage);
}

function fetchImage() {
  const img = document.getElementById(IMG_API_ID);
  const optionValue = this.selectedOptions[0].value;

  fetch(optionValue)
    .then((response) => {
      if (response.status !== 200)
        return Promise.reject('No response for pokemon img');
      return response.json();
    })
    .then((data) => {
      img.src = data.sprites.front_default;
    })
    .catch((error) => {
      console.log(error);
    });
}

function createElement(tag, id = '', content = '') {
  const element = document.createElement(tag);
  element.textContent = content;
  element.id = id;
  return element;
}

function createUIElements() {
  const ui = document.getElementById(USER_INTERFACE_ID);
  const msg = createElement('h2', UI_MESSAGE_ID);

  ui.append(msg, createElement('img', IMG_API_ID));
  isUIPopulated = true;
  return ui;
}

function main() {
  const ui = document.createElement('div');
  ui.id = USER_INTERFACE_ID;
  const btn = createElement('button', null, 'Get Pokemons');
  btn.type = 'button';

  ui.appendChild(btn);
  document.body.appendChild(ui);

  btn.addEventListener('click', fetchAndPopulatePokemons);
}

window.addEventListener('load', main);
