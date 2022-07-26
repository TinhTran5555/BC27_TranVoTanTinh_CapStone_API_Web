main();


let buyProducts = [];
getBuyProducts();
function getBuyProducts() {
 buyProducts = JSON.parse(localStorage.getItem("buyProduct")) || [];
  console.log(buyProducts)
  for (let i = 0; i < buyProducts.length; i++) {
    let buyProduct = buyProducts[i];
    buyProducts[i] = new BuyProducts(
      buyProduct.id,
      buyProduct.name ,
      buyProduct.price,
      buyProduct.screen,
      buyProduct.backCamera,
      buyProduct.frontCamera,
      buyProduct.img,
      buyProduct.desc,
      buyProduct.type,
      buyProduct.quantity,
    );
  }
  displayCard(buyProducts);
}
const productsData = [];

function main() {
  apiGetProducts().then(function (result) {
    const products = result.data;
    console.log(products)
    for (let i = 0; i < products.length; i++) {
      let product = products[i];
      products[i] = new Products(
        product.id,
        product.name,
        product.price,
        product.screen,
        product.backCamera,
        product.frontCamera,
        product.img,
        product.desc,
        product.type
      );
      productsData.push(products[i]);
    }
    display(products);
    showNumProduct(buyProducts)
  });
}

function display(products) {
  let html = "";
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    html += `
    <div class="card bg-light text-dark me-2 "  data-id="${product.id}" style="width: 18rem;">
    <img class="card-img-top mt-4 px-2" src="${product.img}" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${product.name}</h5>
      <h6>${product.price}$</h6>
      <p class="card-text d-none" style="height:50px">${product.desc}</p>
      <a href="#" class="btn btn-warning d-none text-center" data-type="add" add-id="${product.id}">Add</a>
      
    </div>
  </div>
        
        `;
  }

  document.getElementById("tbody-list").innerHTML = html;
}

document.getElementById("showProducts").addEventListener("click", (event) => {
  const type = event.target.getAttribute("data-type");

  const productsFilterSamsung = [];
  const productsFilterIphone = [];

  if (type === "Samsung") {
    for (let i = 0; i < productsData.length; i++) {
      if (productsData[i].type === "Samsung") {
        productsFilterSamsung.push(productsData[i]);
      }
    }

    display(productsFilterSamsung);
  } else if (type === "Iphone") {
    for (let i = 0; i < productsData.length; i++) {
      if (productsData[i].type === "Iphone") {
        productsFilterIphone.push(productsData[i]);
      }
    }
    display(productsFilterIphone);
  } else if (type === "All") {
    display(productsData);
  }
});

// HIỆN SẢN PHẨM TRONG GIỎ
document.getElementById("tbody-list").addEventListener("click", showProducts);

function showProducts(event) {
 
  const type = event.target.getAttribute("data-type");

  const id = event.target.getAttribute("add-id");

  if (type === "add") {
    // xác định xem sản phẩm đã có trong giỏ hay chưa
    // nó có giỏ hàng sẽ chạy J chưa có sẽ chạy I
    for (let j = 0; j < buyProducts.length; j++) {
      if (buyProducts[j].id === id) {
        buyProducts[j].quantity++;
        displayCard(buyProducts);
        showNumProduct(buyProducts)
        localStorage.setItem("buyProduct", JSON.stringify(buyProducts));
        return;
      }
    }

    for (let i = 0; i < productsData.length; i++) {
      if (productsData[i].id === id) {
        let buyProduct = productsData[i];
        buyProduct = new BuyProducts(
          buyProduct.id,
          buyProduct.name,
          buyProduct.price,
          buyProduct.screen,
          buyProduct.backCamera,
          buyProduct.frontCamera,
          buyProduct.img,
          buyProduct.desc,
          buyProduct.type,
          1
        );

        buyProducts.push(buyProduct);
        displayCard(buyProducts);
      }
    }
    showNumProduct(buyProducts)
    localStorage.setItem("buyProduct", JSON.stringify(buyProducts));
  }
}

function displayCard(buyProducts) {
  let html = "";
  let htmlTotal = "";
  let totalPrice = 0;
  for (let i = 0; i < buyProducts.length; i++) {
    totalPrice += buyProducts[i].calTotal();
    html += `
    <div class="d-flex justify-content-between align-items-center mt-2">
    <div>
      <img
        class="w-100"
        src="${buyProducts[i].img}"
        alt="${buyProducts[i].name}"
      />
    </div>
    <div>${buyProducts[i].name}</div>
    <div>${buyProducts[i].price}</div>

    <div>
      <button class="border-0 bg-white">
        <i class="fas fa-minus" data-id="${
          buyProducts[i].id
        }" data-type="minus"></i>
      </button>
      <span>${buyProducts[i].quantity}</span>
      <button class="border-0 bg-white">
        <i class="fas fa-plus"   data-id="${
          buyProducts[i].id
        }" data-type="plus" ></i>
      </button>
    </div>

    <div>$ ${buyProducts[i].calTotal()}</div>
    <div>
      <button class="border-0 bg-white" >
        <i class="fas fa-trash-alt fs-4" data-id="${
          buyProducts[i].id
        }" data-type="delete"></i>
      </button>
    </div>
  </div>
        
        `;
  }
  htmlTotal += `
  
  <div>Tỗng tiền: $ ${totalPrice}</div>
  <div>
  <button class="btn btn-danger" data-type="pay">Thanh Toán</button>
  </div>
  `;
  document.getElementById("totalId").innerHTML = htmlTotal;
  document.getElementById("modalId").innerHTML = html;
}

document.getElementById("modalId").addEventListener("click", handleProduct);

function handleProduct(event) {
  const type = event.target.getAttribute("data-type");
  const id = event.target.getAttribute("data-id");

  if (type === "delete") {
    deleteProduct(id, buyProducts);
    displayCard(buyProducts);
  }
  if (type === "plus") {
    console.log(buyProducts)
    plusQuantity(id, buyProducts);
    displayCard(buyProducts);
  }
  if (type === "minus") {
    minusQuantity(id, buyProducts);
    displayCard(buyProducts);
  }
  showNumProduct(buyProducts)
  localStorage.setItem("buyProduct", JSON.stringify(buyProducts));
}

function deleteProduct(productId, buyProducts) {
  for (let i = 0; i < buyProducts.length; i++) {
    if (buyProducts[i].id === productId) {
      buyProducts.splice(i, 1);
      console.log(buyProducts);
    }
  }
}
// tăng sản phẩm lên +1
function plusQuantity(productId, buyProducts) {
  for (let i = 0; i < buyProducts.length; i++) {
    if (buyProducts[i].id === productId) {
      buyProducts[i].quantity++;
    }
  }
}

function minusQuantity(productId, buyProducts) {
  for (let i = 0; i < buyProducts.length; i++) {
    if (buyProducts[i].id === productId) {
      buyProducts[i].quantity--;
    }
    if(buyProducts[i].quantity<1){
      buyProducts.splice(i, 1);
      console.log(buyProducts);
    }
  }
}

document.getElementById("totalId").addEventListener("click", handlePay);

function handlePay(event) {
  const type = event.target.getAttribute("data-type");
  console.log(buyProducts);
  if (type === "pay") {
    buyProducts = [];
   
    
  }

  showNumProduct(buyProducts)
    displayCard(buyProducts);

  localStorage.setItem("buyProduct", JSON.stringify(buyProducts));
}



function showNumProduct(buyProducts){
  if(!buyProducts.length){
    document.getElementById("numProduct").innerHTML =`<i class="fa-solid fa-cart-shopping"></i>`
    return
  }
console.log(buyProducts)
  let numProduct = 0;
  for(let i=0; i< buyProducts.length;i++){
   numProduct ++
   
  }
  document.getElementById("numProduct").innerHTML =`
   <i class="fa-solid fa-cart-shopping"></i>
   <div class="count">${numProduct}</div>
   `
}
