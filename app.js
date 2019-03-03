const results = document.querySelector(".results");

function getRates() {
  fetch("http://api.nbp.pl/api/exchangerates/tables/B")
    .then(resp => resp.json())
    .then(resp => {
      console.log(resp);
      console.log(resp[0].no);
      addResult(resp[0].effectiveDate);

      resp[0].rates.forEach(function(rate) {
        addResult(rate.code);
      });

      //   addResult(resp.url);
      //   addResult(resp.body);
      //   addResult(resp.type);
      //   addResult(resp.status);
      //   addResult(resp.statusText);
      //   addResult(resp.headers.get("Content-Type"));
      //   addResult(resp.headers.get("Date"));
    });
}

// fetch("https://jsonplaceholder.typicode.com/users")
//.then(resp => {
//  console.log(resp);
//})

// getRates();

function addResult(value) {
  const li = document.createElement("li");
  li.innerHTML = value;
  results.appendChild(li);
}

// Main UI Variables
const fromCurrencyList = document.querySelector(".from-currency-list");
const fromCurrencyBox = document.querySelector(".from-box");

const toCurrencyList = document.querySelector(".to-currency-list");
const toCurrencyBox = document.querySelector(".to-box");

const fromCurrency = fromCurrencyBox.querySelector(".currency-wrapper");
const toCurrency = toCurrencyBox.querySelector(".currency-wrapper");

// Show dropdownlist

fromCurrency.addEventListener("click", toggleDropdownList);
toCurrency.addEventListener("click", toggleDropdownList);

function toggleDropdownList(e) {
  const dropdownList = e.currentTarget.nextElementSibling;
  if (dropdownList.classList.contains("show")) {
    dropdownList.classList.remove("show");
  } else {
    dropdownList.classList.add("show");
  }
}

// Select currency from dropdown list
fromCurrencyList.addEventListener("click", selectFromCurrency);
toCurrencyList.addEventListener("click", selectToCurrency);

// Is it possible to make one function instead of two very similar?
function selectToCurrency(e) {
  const currency = getCurrencyData(e);
  if (currency) {
    toCurrencyBox.replaceChild(currency, toCurrencyBox.children[1]);
  }
}

function selectFromCurrency(e) {
  const currency = getCurrencyData(e);
  if (currency) {
    fromCurrencyBox.replaceChild(currency, fromCurrencyBox.children[1]);
  }
}

function getCurrencyData(e) {
  let currency;
  if (e.target.className.includes("currency-wrapper")) {
    currency = e.target;
  } else if (e.target.parentElement.className.includes("currency-wrapper")) {
    currency = e.target.parentElement;
  } else {
    return;
  }
  return currency.cloneNode(true);
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
