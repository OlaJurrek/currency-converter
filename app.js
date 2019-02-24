const results = document.querySelector(".results");

function getRates() {
  fetch("http://api.nbp.pl/api/exchangerates/tables/A")
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

getRates();

function addResult(value) {
  const li = document.createElement("li");
  li.innerHTML = value;
  results.appendChild(li);
}
