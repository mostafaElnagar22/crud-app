let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let count = document.getElementById("count");
let category = document.getElementById("category");
let create = document.getElementById("create");
let total = document.getElementsByClassName("total")[0];
let tableBody = document.getElementsByTagName("tbody")[0];
let clearAll = document.getElementById("clear-all");
let searchBtn = document.getElementById("search");
let titleSearch = document.getElementById("searchTitle");
let categorySearch = document.getElementById("searchCategory");
let priceSearch = document.getElementById("searchPrice");
let updateIndex;
function calcTotal() {
  if (price.value != "") {
    total.innerHTML = +price.value + +ads.value + +taxes.value - discount.value;
    total.style.backgroundColor = "green";
  } else {
    total.innerHTML = "";
    total.style.backgroundColor = "";
  }
}
price.onkeyup = calcTotal;
taxes.onkeyup = calcTotal;
ads.onkeyup = calcTotal;
discount.onkeyup = calcTotal;
// end calc total

let allData;
// check localStorage content
if (localStorage.product == null) {
  allData = [];
} else {
  allData = JSON.parse(localStorage.product);
}

//   end check

create.onclick = () => {
  takeProductData();

  readPro();
};

readPro();

// take product data and store in localStorage
function takeProductData() {
  if (
    title.value == "" ||
    category.value == "" ||
    price.value == "" ||
    +price.value < 1 ||
    +taxes.value < 0 ||
    +ads.value < 0 ||
    +discount.value < 0 ||
    +count.value > 100
  )
    return false;
  const pro = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value || 0,
    ads: ads.value || 0,
    discount: discount.value || 0,
    total: total.innerHTML,
    category: category.value.toLowerCase(),
    count: count.value,
  };
  //count
  if (create.innerHTML == "Create") {
    if (+pro.count == 0) pro.count = 1;
    for (let i = 0; i < +pro.count; i++) {
      allData.push(pro);
    }
  } else {
    allData[updateIndex] = pro;
    create.innerHTML = "Create";
    count.style.display = "block";
  }

  localStorage.setItem("product", JSON.stringify(allData));
  emptyField();
}
// end

// empty field after create
function emptyField() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  category.value = "";
  count.value = "";
  total.style.backgroundColor = "";
}
// end emptyField
// read data from storage
function readPro() {
  console.log(allData.length);
  let tableContent = "";
  for (let i = 0; i < allData.length; i++) {
    let productRow = `
      <tr>
      <td>${i + 1}</td>
      <td>${allData[i].title}</td>
      <td>${allData[i].price}</td>
      <td>${allData[i].taxes}</td>
      <td>${allData[i].ads}</td>
      <td>${allData[i].discount}</td>
      <td class="tot">${allData[i].total}</td>
      <td>${allData[i].category}</td>
      <td id="update" onclick="update(${i})">update</td>
      <td id="delete" onclick="Delete(${i})">delete</td>
      </tr>
`;
    tableContent += productRow;
  }

  tableBody.innerHTML = tableContent;
  clearAll.innerHTML = `DELETE ALL (${allData.length})`;
  if (allData.length > 0) {
    clearAll.style.display = "block";
  } else {
    clearAll.style.display = "none";
  }
}

//end read data from storage

// delete button
function Delete(id) {
  allData.splice(id, 1);
  localStorage.product = JSON.stringify(allData);
  readPro();
}

// end delete button
// clearAll

clearAll.onclick = clear;
function clear() {
  allData = [];
  localStorage.removeItem("product");
  localStorage.clear();

  readPro();
}
//update
function update(id) {
  title.value = allData[id].title;
  price.value = allData[id].price;
  ads.value = allData[id].ads;
  discount.value = allData[id].discount;
  taxes.value = allData[id].taxes;
  category.value = allData[id].category;
  count.style.display = "none";
  calcTotal();
  create.innerHTML = "UPDATE";
  updateIndex = id;
  scroll({
    top: 0,
  });
}
titleSearch.onclick = searchMode;
categorySearch.onclick = searchMode;
priceSearch.onclick = () => {
  searchBtn.placeholder = "Enter Max Total Price";
  searchBtn.focus();
};
searchBtn.onkeyup = search;
// search mode function
function searchMode() {
  searchBtn.placeholder = this.innerHTML;
  searchBtn.focus();
}
// search function
function search() {
  let mode = "title";
  if (searchBtn.placeholder == "Search By Category") {
    mode = "category";
  } else if (searchBtn.placeholder == "Enter Max Total Price") {
    mode = "price";
  } else {
    mode = "title";
  }
  let tableContent = "";
  for (let i = 0; i < allData.length; i++) {
    if (mode == "title" || mode == "category") {
      if (allData[i][mode].includes(this.value.toLowerCase())) {
        let productRow = `
      <tr>
      <td>${i + 1}</td>
      <td>${allData[i].title}</td>
      <td>${allData[i].price}</td>
      <td>${allData[i].taxes}</td>
      <td>${allData[i].ads}</td>
      <td>${allData[i].discount}</td>
      <td class="tot">${allData[i].total}</td>
      <td>${allData[i].category}</td>
      <td id="update" onclick="update(${i})">update</td>
      <td id="delete" onclick="Delete(${i})">delete</td>
      </tr>
  `;
        tableContent += productRow;

        tableBody.innerHTML = tableContent;
      }
    }
    if (mode == "price") {
      if (+allData[i].total <= +this.value) {
        let productRow = `
          <tr>
          <td>${i + 1}</td>
          <td>${allData[i].title}</td>
          <td>${allData[i].price}</td>
          <td>${allData[i].taxes}</td>
          <td>${allData[i].ads}</td>
          <td>${allData[i].discount}</td>
          <td class="tot">${allData[i].total}</td>
          <td>${allData[i].category}</td>
          <td id="update" onclick="update(${i})">update</td>
          <td id="delete" onclick="Delete(${i})">delete</td>
          </tr>
      `;
        tableContent += productRow;

        tableBody.innerHTML = tableContent;
      }
    }
  }
  if (tableContent == "") {
    tableBody.innerHTML = "No Results";
    tableBody.classList.add("search-result");
  } else {
    tableBody.classList.remove("search-result");
  }
}

//
// emptySearch
searchBtn.onblur = emptySearch;
function emptySearch() {
  searchBtn.value = "";
  tableBody.classList.remove("search-result");

  readPro();
}
