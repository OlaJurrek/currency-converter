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

const fromCurrencyList = document.querySelector(".from-currency-list");
const fromCurrencyBox = document.querySelector(".from-box");

const toCurrencyList = document.querySelector(".to-currency-list");
const toCurrencyBox = document.querySelector(".to-box");

fromCurrencyList.addEventListener("click", selectFromCurrency);
toCurrencyList.addEventListener("click", selectToCurrency);

function selectToCurrency(e) {
  const currency = getCurrencyData(e);
  toCurrencyBox.replaceChild(currency, toCurrencyBox.children[1]);
}

function selectFromCurrency(e) {
  const currency = getCurrencyData(e);
  fromCurrencyBox.replaceChild(currency, fromCurrencyBox.children[1]);
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
