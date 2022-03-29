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
const DOM_IMG_ID = 'image-api';
const UI_MESSAGE_ID = 'ui-message';
const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const SELECT_ELEMENT_ID = 'select-pokes';

async function fetchData(url) {
  try {
    const response = await fetch(url);
    //Get data from response if it's ok.
    if (response.ok) {
      const data = await response.json();
      return Promise.resolve(data);
    }
    console.log('Failed response status: ', response.status);
  } catch (error) {
    console.log(error.message);
  }
}

//Boolean to check if img and select elements are already created on the DOM
let isUIPopulated = false;

//This is called with "get pokemons" button click
async function fetchAndPopulatePokemons() {
  //Get elements id if they're already created, else: create them.
  const [ui, selectElement] = isUIPopulated
    ? [
        document.getElementById(USER_INTERFACE_ID),
        document.getElementById(SELECT_ELEMENT_ID),
      ]
    : [createUIElements(), createElement('select', SELECT_ELEMENT_ID)];

  //Fetch data and create an option element for each pokemon then add it to select.
  fetchData(API_URL).then((data) => {
    for (const pokemon of data.results) {
      const optionElm = createElement('option', '', pokemon.name, pokemon.url);
      selectElement.appendChild(optionElm);
    }
  });
  ui.appendChild(selectElement);
  //Append ui to body here to condition it on click
  document.body.appendChild(ui);

  selectElement.addEventListener('change', fetchImage);
}

//Called when select element is changed.
function fetchImage() {
  //Image element is already created in another method.
  const img = document.getElementById(DOM_IMG_ID);
  const optionElement = this.selectedOptions[0];

  //Every option element has an img URL as value.
  fetchData(optionElement.value).then((data) => {
    img.src = data.sprites.front_default;
  });
}

//Function that creates element with some general properties
function createElement(tag, id = '', content = '', value = null) {
  const element = document.createElement(tag);
  element.textContent = content;
  element.id = id;
  if (value) element.value = value;
  return element;
}

//Function to initialize our UI.
function createUIElements() {
  const ui = document.getElementById(USER_INTERFACE_ID);
  const msg = createElement('h2', UI_MESSAGE_ID);
  const img = createElement('img', DOM_IMG_ID);

  ui.append(msg, img);
  isUIPopulated = true;
  return ui;
}

function main() {
  const ui = createElement('div', USER_INTERFACE_ID);
  const btn = createElement('button', null, 'Get Pokemons');
  btn.type = 'button';

  ui.appendChild(btn);
  document.body.appendChild(ui);

  btn.addEventListener('click', fetchAndPopulatePokemons);
}

window.addEventListener('load', main);
