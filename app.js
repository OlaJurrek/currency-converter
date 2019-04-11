// Main UI Variables
// Dropdown lists
const dropdownLists = document.querySelectorAll(".dropdown-list");
const fromCurrencyList = document.querySelector(".from-currency-list");
const toCurrencyList = document.querySelector(".to-currency-list");
const fromCurrency = document.getElementById("from-this-currency");
const toCurrency = document.getElementById("to-this-currency");
//Results
const convertedAmount = document.querySelector(".converted-amount");
const details = document.querySelector(".details");
const conversionResult = document.querySelector(".conversion-result");

// Convert currency
const calculateBtn = document.getElementById("calculate-btn");
calculateBtn.addEventListener("click", convertCurrency);

function convertCurrency(e) {
  fetch("https://api.nbp.pl/api/exchangerates/tables/A")
    .then(resp => resp.json())
    .then(resp => {
      const data = gatherData(resp);
      calculate(data);
    });
  e.preventDefault();
}

function gatherData(resp) {
  const data = {
    rates: resp[0].rates,
    date: resp[0].effectiveDate,
    fromCurrencyCode: fromCurrency.querySelector(".currency-code").textContent,
    toCurrencyCode: toCurrency.querySelector(".currency-code").textContent,
    amount: document.getElementById("amount").value
  };
  return ({ rates, date, fromCurrencyCode, toCurrencyCode, amount } = data);
}

function calculate(data) {
  if (fromCurrencyCode === "PLN") {
    fromZloty(data);
  } else if (toCurrencyCode === "PLN") {
    toZloty(data);
  } else {
    otherCurrencies(data);
  }
}

function fromZloty(data) {
  data.rate = getCurrencyRate(rates, toCurrencyCode);
  data.result = amount * data.rate;
  displayResult(data);
}

function toZloty(data) {
  data.rate = getCurrencyRate(rates, fromCurrencyCode);
  data.result = amount / data.rate;
  displayResult(data);
}

function otherCurrencies(data) {
  const fromRate = getCurrencyRate(rates, fromCurrencyCode);
  const toRate = getCurrencyRate(rates, toCurrencyCode);
  const rate = fromRate / toRate;
  data.result = amount * rate;
  displayResult(data);
}

function getCurrencyRate(rates, code) {
  const currencyData = rates.find(rate => rate.code === code);
  return currencyData.mid;
}

function displayResult(data) {
  convertedAmount.innerHTML = `${amount} ${fromCurrencyCode} =`;
  conversionResult.innerHTML = `${data.result.toFixed(2)} ${toCurrencyCode}`;
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

// Hide dropdown list and clear filter input
function hideDropdownList(dropdownList) {
  dropdownList.classList.remove("show");
  clearFilter(dropdownList);
}

// Clear filter
function clearFilter(dropdownList) {
  const filterInput = dropdownList.querySelector(".filter");
  filterInput.value = "";
  filterInput.placeholder = "wpisz walutę";
  const currencies = dropdownList.querySelectorAll(".currency-wrapper");
  currencies.forEach(currency => (currency.style.display = "grid"));
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

// Hide dropdown list if outside click
// (It looks just awful, but it works)
document.body.addEventListener("click", hideIfOutsideClick);

function hideIfOutsideClick(e) {
  dropdownLists.forEach(function(list) {
    if (list.classList.contains("show")) {
      if (
        !e.target.parentElement.classList.contains("currency-box") &&
        !e.target.parentElement.parentElement.classList.contains(
          "currency-box"
        ) &&
        !e.target.parentElement.parentElement.parentElement.classList.contains(
          "currency-box"
        )
      ) {
        hideDropdownList(list);
      }
    }
  });
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

// Swap currencies using arrow icons
const arrows = document.querySelector(".arrows");

arrows.addEventListener("click", swapCurrencies);

function swapCurrencies() {
  const fromCurrencyClone = fromCurrency.children[0].cloneNode(true);
  const toCurrencyClone = toCurrency.children[0].cloneNode(true);

  fromCurrency.replaceChild(toCurrencyClone, fromCurrency.children[0]);
  toCurrency.replaceChild(fromCurrencyClone, toCurrency.children[0]);
}
