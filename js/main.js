let productList = [];

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
          <div class="add_bt_1"><a href="#">SEPETE EKLE</a></div>
       </div>
    </div>
 </div>`;
  });

  productListEl.innerHTML = productListHtml;
};

setTimeout(() => {
  createProductItemsHtml();
}, 100);
