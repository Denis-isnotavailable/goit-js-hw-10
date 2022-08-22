import debounce from "lodash.debounce";
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries'
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryCardEl = document.querySelector('.country-info');
const countryListEl = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(showCountries, DEBOUNCE_DELAY));

function showCountries(e) {
    let countryName = e.target.value.trim();

    countryListEl.innerHTML = '';
    countryCardEl.innerHTML = '';

    if (countryName === '') {        
        return Notiflix.Notify.warning('Please enter country name.');
    }
    
    fetchCountries(countryName)
        .then(data => {        
        if (data.length === 1) {            
           return countryCardEl.insertAdjacentHTML('beforeend', countryMarkup(data));
        } else if (data.length > 10) {
           return Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
        }
        
        return countryListEl.insertAdjacentHTML('beforeend', countriesMarkup(data));
        })
        .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
    });    
}



function countryMarkup(data) {
    let lang = Object.values(data[0].languages).map(language => language).join(', ');    
    return `<div class="country">
                        <img src="${data[0].flags.svg}" alt="flag of ${data[0].name.official} width="60" height="30"">        
                        <h1 class="country__name">${data[0].name.official}</h1>             
                    </div>
                    <p class="country__capital"><b>Capital: </b>${data[0].capital}</p>
                    <p class="country__population"><b>Population: </b>${data[0].population}</p>
                    <p class="country__languages"><b>Languages: </b>${lang}</p>`;    
}

function countriesMarkup(data) {
    return data.map(country => {
        return `<li class="country">
                        <img src="${country.flags.svg}" alt="flag of ${country.name.official}" width=" 60" height="30">
                        <p class="country__name">${country.name.official}</p>
                    </li>`;
    }).join('');
}


