let productList = [],
  basketList = [];

const toggleModal = () => {
  const basketCloseIcon = document.querySelector(".basket_section");
  basketCloseIcon.classList.toggle("active");
};

const getProducts = () => {
  fetch("./json/products.json")
    .then(res => res.json())
    .then(products => (productList = products));
};

getProducts();

const createProductItemsHtml = () => {
  const productListEl = document.querySelector(".product_list");
  let productListHtml = "";
  productList.forEach((product, index) => {
    productListHtml += `
    <div class="col-sm-4 ${index % 2 == 0 ? "even" : "odd"}">
    <div class="box_main_2">
       <h2 class="speed_text_1"><h4 class="price_text" style="float: left; text-align: left;">
       Fiyat <span style=" color: #325662">₺</span> <span style=" color: #325662">${
         product.price
       }</span></h4></h2>
       <div class="no_zoomout frame"><a href="product_1.html"><img src="${
         product.imgSource
       }" class="shop_page_images"></a></div>
       <div class="padding_15">
          <h2 class="product_name_text">${product.name}</h2>
          <div class="add_bt_1" onclick="addItemToBasket(${
            product.id
          })">SEPETE EKLE</div>
       </div>
    </div>
 </div>`;
  });

  productListEl.innerHTML = productListHtml;
};

const listBasketItems = () => {
  const basketListEl = document.querySelector(".basket_list");
  const basketCountEl = document.querySelector(".basket_count");
  basketCountEl.innerHTML = basketList.length > 0 ? basketList.length : null;
  const totalPriceEl = document.querySelector(".total_price");

  let basketListHtml = "";
  let totalPrice = 0;

  basketList.forEach(item => {
    totalPrice += item.product.price;
    basketListHtml += `<li class="basket_item">
    <img src="${item.product.imgSource}" width="100" height="100" alt="">
    <div class="basket_item_info">
       <h4 class="product_name">${item.product.name}</h4>
       <span class="product_price">${item.product.price} ₺</span> <br>
       <span class="product_remove" onclick="removeItemToBasket(${item.product.id})">Sil</span>
    </div>
    <div class="product_count">
       <span class="decrease">-</span>
       <span>${item.quantity}</span>
       <span class="increase">+</span>
    </div>
 </li>`;
  });

  basketListEl.innerHTML = basketListHtml
    ? basketListHtml
    : `<li class="basket_item">Sepetinizde ürün bulunmuyor</li>`;
  totalPriceEl.innerHTML =
    totalPrice > 0 ? "Sepet Tutarı: " + totalPrice.toFixed(2) + " ₺" : null;
};

const addItemToBasket = productId => {
  let foundProduct = productList.find(product => product.id == productId);
  if (foundProduct) {
    const basketAlreadyIndex = basketList.findIndex(
      basket => basket.product.id == productId
    );
    if (basketAlreadyIndex == -1) {
      let addedItem = { quantity: 1, product: foundProduct };
      basketList.push(addedItem);
    } else {
      basketList[basketAlreadyIndex].quantity += 1;
    }
    listBasketItems();
  }
};

const removeItemToBasket = productId => {
  const foundIndex = basketList.findIndex(
    basket => basket.product.id == productId
  );
  if (foundIndex != -1) {
    basketList.splice(foundIndex, 1);
  }
  listBasketItems();
};

setTimeout(() => {
  createProductItemsHtml();
}, 100);
