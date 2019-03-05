// Main application data variables
const officialCurrency = "PLN";
const officialRatesSource = "http://api.nbp.pl/api/exchangerates/tables/A";

// Main UI Variables

const amountBox = document.getElementById("amount");

const fromCurrencyList = document.querySelector(".from-currency-list");
const fromCurrencyBox = document.querySelector(".from-box");

const toCurrencyList = document.querySelector(".to-currency-list");
const toCurrencyBox = document.querySelector(".to-box");

const fromCurrency = document.getElementById("from-this-currency");
const toCurrency = document.getElementById("to-this-currency");

const convertedAmount = document.querySelector(".converted-amount");
const details = document.querySelector(".details");
const conversionResult = document.querySelector(".conversion-result");

// Convert currency
const calculateBtn = document.getElementById("calculate-btn");

calculateBtn.addEventListener("click", convertCurrency);

function convertCurrency(e) {
  // what is scope of fetch? If it could 'see' only global variables??

  // const amount = document.getElementById("amount").value;
  // const fromCurrencyCode = document.querySelector(".from-box .currency-code")
  //   .textContent;
  // const toCurrencyCode = document.querySelector(".to-box .currency-code")
  //   .textContent;

  getRates();

  e.preventDefault();
}

function getRates() {
  fetch("http://api.nbp.pl/api/exchangerates/tables/A")
    .then(resp => resp.json())
    .then(resp => {
      const rates = resp[0].rates;
      const date = resp[0].effectiveDate;
      const fromCurrencyCode = fromCurrency.querySelector(".currency-code")
        .textContent;

      const toCurrencyCode = toCurrency.querySelector(".currency-code")
        .textContent;
      let amount = document.getElementById("amount").value;

      // if (typeof amount === "number") {

      if (fromCurrencyCode === "PLN") {
        const toRate = getCurrencyRate(rates, toCurrencyCode);
        const result = convertZlotyTo(amount, toRate);
        displayResult(amount, result, fromCurrencyCode, toCurrencyCode, date);
        // console.log(result);
      } else if (toCurrencyCode === "PLN") {
        const fromRate = getCurrencyRate(rates, fromCurrencyCode);
        const result = convertToZloty(amount, fromRate);
        // console.log(result);
        displayResult(amount, result, fromCurrencyCode, toCurrencyCode, date);
      } else {
        const fromRate = getCurrencyRate(rates, fromCurrencyCode);
        const toRate = getCurrencyRate(rates, toCurrencyCode);
        const rate = fromRate / toRate;
        let result = amount * rate;
        result = result.toFixed(2);
        displayResult(amount, result, fromCurrencyCode, toCurrencyCode, date);
      }
      // } else {
      // displayError();
      // }
    });
}

function convertZlotyTo(amount, rate) {
  const result = amount / rate;
  return result.toFixed(2);
}

function convertToZloty(amount, rate) {
  const result = amount * rate;
  return result.toFixed(2);
}

function convertForeignCurrencies(fromCode, toCode) {}

function getCurrencyRate(rates, code) {
  const currencyData = rates.find(rate => rate.code === code);
  return currencyData.mid;
}

// Parameters could be pass as an array??
function displayResult(amount, result, fromCode, toCode, date) {
  convertedAmount.innerHTML = `${amount} ${fromCode} =`;
  conversionResult.innerHTML = `${result} ${toCode}`;
  details.innerHTML = `Kalkulator przeliczył waluty według średniego kursu NBP z dnia ${date}`;
}

// to improve!!! is off now
function displayError() {
  convertedAmount.textContent = "Podana kwota musi być liczbą.";
  amount.style.boxShadow = "0 0 4px 1px red";
}

// Show dropdown list
fromCurrency.addEventListener("click", showDropdownList);
toCurrency.addEventListener("click", showDropdownList);

function showDropdownList(e) {
  const dropdownList = e.currentTarget.nextElementSibling;
  if (!dropdownList.classList.contains("show")) {
    dropdownList.classList.add("show");
  } else {
    hideDropdownList(dropdownList);
  }
}

// Hide dropdown list
function hideDropdownList(dropdownList) {
  dropdownList.classList.remove("show");
}

// Select currency from a dropdown list and hide the list when it's done
fromCurrencyList.addEventListener("click", selectCurrency);
toCurrencyList.addEventListener("click", selectCurrency);

function selectCurrency(e) {
  const selectedCurrencySlot = e.currentTarget.previousElementSibling;
  const currencyList = e.currentTarget;

  let selectedCurrency;
  if (e.target.className.includes("currency-wrapper")) {
    selectedCurrency = e.target;
  } else if (e.target.parentElement.className.includes("currency-wrapper")) {
    selectedCurrency = e.target.parentElement;
  } else {
    return;
  }

  const currency = selectedCurrency.cloneNode(true);
  selectedCurrencySlot.replaceChild(currency, selectedCurrencySlot.children[0]);
  hideDropdownList(currencyList);
}

// Currency filter
const fromCurrencyFilter = document.getElementById("from-currency-filter");
const toCurrencyFilter = document.getElementById("to-currency-filter");

fromCurrencyFilter.addEventListener("keyup", currencyFilter);
toCurrencyFilter.addEventListener("keyup", currencyFilter);

function currencyFilter(e) {
  const searchedCurrency = e.target.value.toLowerCase();
  // Get only divs with currencies data below the search field
  let currencies = e.target.parentElement.parentElement;
  currencies = currencies.querySelectorAll(".currency-wrapper");
  // Filter currencies divs
  for (currency of currencies) {
    const name = currency
      .querySelector(".currency-name")
      .textContent.toLowerCase();
    const code = currency
      .querySelector(".currency-code")
      .textContent.toLowerCase();
    if (name.includes(searchedCurrency) || code.includes(searchedCurrency)) {
      currency.style.display = "grid";
    } else {
      currency.style.display = "none";
    }
  }
}

// Swap currencies using arrow icon
const arrows = document.querySelector(".arrows");

arrows.addEventListener("click", swapCurrencies);

function swapCurrencies() {
  const fromCurrencyClone = fromCurrency.children[0].cloneNode(true);
  const toCurrencyClone = toCurrency.children[0].cloneNode(true);

  fromCurrency.replaceChild(toCurrencyClone, fromCurrency.children[0]);
  toCurrency.replaceChild(fromCurrencyClone, toCurrency.children[0]);
}
