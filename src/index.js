import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('input#search-box'),
  listCountries: document.querySelector('.country-list'),
  infoCountry: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(searchPage, DEBOUNCE_DELAY));
function searchPage() {
    const countryEl = refs.input.value.trim();
    if (countryEl === '') {
      return (
        (refs.listCountries.innerHTML = ''), 
        (refs.infoCountry.innerHTML = '')
      );
    }

    function createMarkupForList(countries) {
        const markup = countries.map(
            ({ name, flags }) =>
              `<li 
              class='country-element'>
              <img src="${flags.svg}" 
              alt="${flags.alt}" 
              width=30px height=30px>
              <h2>${name.common}<h2>
              </li>`
          )
          .join('');
        return markup;
      }
      
      function createMarkupForCountryCard(countries) {
        const markup = countries.map(
            ({ capital, population, languages }) => 
      
        `<ul>
        <li><p><b>Capital: </b>${capital}<p></li>
        <li><p><b>Population: </b>${population}<p></li>
        <li><p><b>Languages: </b>${Object.values(languages).join(', ')}<p></li>
        </ul>`
          )
          .join('');
        return markup;
      }   
      fetchCountries(countryEl)
      .then(countries => {
        refs.listCountries.innerHTML = '';
        refs.infoCountry.innerHTML = '';
        if (countries.length === 1) {
          refs.listCountries.insertAdjacentHTML(
            'beforeend',
            createMarkupForList(countries)
          );
          refs.infoCountry.insertAdjacentHTML(
            'beforeend',
            createMarkupForCountryCard(countries)
          );
        } else if (countries.length >= 10) {
          onTooManyCountries();
        } else {
          refs.listCountries.insertAdjacentHTML(
            'beforeend',
            createMarkupForList(countries)
          );
        }
      })
      .catch(onWrongName);
  }

function onTooManyCountries() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function onWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}