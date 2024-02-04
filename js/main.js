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

//Shopping sayfası ürünlerin listelenmesi
const createProductItemsHtml = () => {
  const productListEl = document.querySelector(".product_list");
  let productListHtml = "";
  productList.forEach((product, index) => {
    productListHtml += `
      <div class="col-sm-4 ${index % 2 == 0 ? "even" : "odd"}">
      <div class="box_main_2">
         <h2 class="speed_text_1"><h4 class="price_text"><span>${
           product.price
         }</span><span> TL</span></h4></h2>
         <div class="no_zoomout frame"><a href="product.html?id=${
           product.id
         }"><img src="${product.imgSource}" class="shop_page_images"></a></div>
         <div class="padding_15">
            <h2 class="product_name_text">${product.name}</h2>
            <div class="add_bt_1 noSelect" onclick="addItemToBasket(${
              product.id
            })">SEPETE EKLE</div>
         </div>
      </div>
   </div>`;
  });

  productListEl.innerHTML = productListHtml;
};

//Sepetteki ürünleri listeleme
const listBasketItems = () => {
  const basketListEl = document.querySelector(".basket_list");
  const basketCountEl = document.querySelector(".basket_count");
  basketCountEl.innerHTML = basketList.length > 0 ? basketList.length : null;
  const totalPriceEl = document.querySelector(".total_price");

  let basketListHtml = "";
  let totalPrice = 0;

  basketList.forEach(item => {
    totalPrice += item.product.price * item.quantity;
    basketListHtml += `<li class="basket_item">
    <img src="${item.product.imgSource}" width="100" height="100" alt="">
    <div class="basket_item_info">
       <h4 class="product_name">${item.product.name}</h4>
       <span class="product_price">${item.product.price} TL</span> <br>
       <span class="product_remove" onclick="removeItemToBasket(${item.product.id})"><i class="bi bi-trash3"></i> Sil</span>
    </div>
    <div class="product_count noSelect">
       <span class="decrease" onclick="decreaseItem(${item.product.id})">-</span>
       <span>${item.quantity}</span>
       <span class="increase" onclick="increaseItem(${item.product.id})">+</span>
    </div>
 </li>`;
  });

  basketListEl.innerHTML = basketListHtml
    ? basketListHtml
    : `<li class="basket_empty_string">Sepetinizde ürün bulunmuyor<br><img src="images/empty_basket_icon.png"></li>`;
  totalPriceEl.innerHTML =
    totalPrice > 0 ? "Sepet Tutarı: " + totalPrice.toFixed(2) + " TL" : null;
};

//Sepete ürün ekleme
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
      if (
        basketList[basketAlreadyIndex].quantity <
        basketList[basketAlreadyIndex].product.stock
      ) {
        basketList[basketAlreadyIndex].quantity += 1;
      } else {
        return;
      }
    }
    listBasketItems();
    /**SEPETE ÜRÜN EKLENDİ TOAST MESAJI BURAYA GELECEK */
  }
};

//Sepetten ürün silme
const removeItemToBasket = productId => {
  const foundIndex = basketList.findIndex(
    basket => basket.product.id == productId
  );
  if (foundIndex != -1) {
    basketList.splice(foundIndex, 1);
  }
  listBasketItems();
};

//Sepetteki ürün sayısını artırma
const decreaseItem = productId => {
  const foundIndex = basketList.findIndex(
    basket => basket.product.id == productId
  );
  if (foundIndex != -1) {
    if (basketList[foundIndex].quantity != 1)
      basketList[foundIndex].quantity -= 1;
    else {
      removeItemToBasket(productId);
    }
  }
  listBasketItems();
};

//Sepetteki ürün sayısını azaltma
const increaseItem = productId => {
  const foundIndex = basketList.findIndex(
    basket => basket.product.id == productId
  );
  if (foundIndex != -1) {
    if (
      basketList[foundIndex].quantity < basketList[foundIndex].product.stock
    ) {
      basketList[foundIndex].quantity += 1;
    } else {
      /*YETERLİ STOK YOK MESAJI BURAYA GELECEK */
    }
  }
  listBasketItems();
};

//Tek bir product sayfasına, seçilen ürünün bilgilerinin getirilmesi
window.onload = function () {
  // ürün bilgilerini json dosyasından al
  fetch("./json/products.json")
    .then(response => response.json())
    .then(data => {
      // url'deki ürün id'sini al
      const urlparams = new URLSearchParams(window.location.search);
      const productid = urlparams.get("id");

      // bu id'ye sahip ürünü bul
      const product = data.find(item => item.id == productid);
      // ürün adını sayfa başlığında göster
      document.title = product.name;
      if (product) {
        // ürün detaylarını göster
        document.querySelector(".main_image img").src = product.imgSource;
        document.querySelector(".right h3").textContent = product.name;
        document.querySelector(
          ".price_text"
        ).innerHTML = `${product.price}<span> TL</span>`;
        document.querySelector(".right p").innerHTML = `
          <ul>
            <li>Ağırlık: ${product.weight} g</li>
            <li>Kontrol Mesafesi: ${product.controlDistance} km</li>
            <li>Uçuş Süresi: ${product.flightTime} dk</li>
            <li>Rüzgar Direnci: ${product.windResistance}</li>
            <li>${product.video}</li>
            <li>${product.features}</li>
            <li>Maksimum Hız: ${product.maxSpeed} km/s</li>
          </ul>`;

        // images dizisindeki tüm fotoğrafları göster
        product.images.forEach((image, index) => {
          const imgElement = document.createElement("img");
          imgElement.src = image;
          imgElement.alt = `Product Image ${index + 1}`;
          imgElement.onclick = function () {
            img(image); // img fonksiyonunu çağır
          };
          document.querySelector(".option").appendChild(imgElement);
        });
      }
    });
};

// img fonksiyonu
function img(src) {
  document.querySelector(".main_image img").src = src;
}

setTimeout(() => {
  createProductItemsHtml();
}, 100);
