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

// UI Variables
const fromCurrencyList = document.querySelector(".from-currency-list");
const fromCurrencyBox = document.querySelector(".from-box");

const toCurrencyList = document.querySelector(".to-currency-list");
const toCurrencyBox = document.querySelector(".to-box");

// Select currency from dropdown list
fromCurrencyList.addEventListener("click", selectFromCurrency);
toCurrencyList.addEventListener("click", selectToCurrency);

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
const fromCurrencyFilterInput = document.getElementById("from-currency-filter");
const toCurrencyFilterInput = document.getElementById("to-currency-filter");

// Get all from currencies despite the first one
const fromCurrencies = fromCurrencyList.querySelectorAll(".currency-wrapper");
// fromCurrencies = Array.from(fromCurrencies).slice(1);

fromCurrencyFilterInput.addEventListener("keyup", fromCurrencyFilter);

function fromCurrencyFilter(e) {
  for (currency of fromCurrencies) {
    const searchedCurrency = e.target.value.toLowerCase();
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
    // console.log(e.target.value, name, code);
  }
}

// toCurrencyFilter.addEventListener("keyup", currencyFilter);

// function currencyFilter(e) {
//   const dropdownList = e.target.parentElement.parentElement;
//   // const currencies = Array.from(dropdownList.children).slice(2);
//   // console.log(currencies);
//   for (currency of dropdownList.children) {
//     if (currency.className.includes("currency-wrapper")) {
//       const name = currency.querySelector(".currency-name");
//       const code = currency.querySelector(".currency-code");
//       if (
//         name.textContent.indexOf(e.target.value) !== -1 ||
//         code.textContent.indexOf(e.target.value) !== -1
//       ) {
//         currency.style.display = "grid";
//         // console.log(code.textContent);
//         // console.log(name.textContent);
//         console.log(e.target.value);
//       } else {
//         // currency.style.display = "none";
//       }
//     }
//   }
// }
