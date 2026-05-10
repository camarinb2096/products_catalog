const state = {
  config: null,
  variant: null,
  photo: "",
  size: "",
  quantity: 1,
};

const els = {
  brandName: document.querySelector("#brandName"),
  productName: document.querySelector("#productName"),
  bannerSection: document.querySelector("#bannerSection"),
  promoBanner: document.querySelector("#promoBanner"),
  promoBannerImage: document.querySelector("#promoBannerImage"),
  productReference: document.querySelector("#productReference"),
  productTitle: document.querySelector("#productTitle"),
  productPrice: document.querySelector("#productPrice"),
  productDescription: document.querySelector("#productDescription"),
  mainPhoto: document.querySelector("#mainPhoto"),
  variantStock: document.querySelector("#variantStock"),
  thumbRow: document.querySelector("#thumbRow"),
  colorSwatches: document.querySelector("#colorSwatches"),
  selectedColorLabel: document.querySelector("#selectedColorLabel"),
  sizeOptions: document.querySelector("#sizeOptions"),
  selectedSizeLabel: document.querySelector("#selectedSizeLabel"),
  decreaseQty: document.querySelector("#decreaseQty"),
  increaseQty: document.querySelector("#increaseQty"),
  quantityValue: document.querySelector("#quantityValue"),
  contactButton: document.querySelector("#contactButton"),
  selectionMessage: document.querySelector("#selectionMessage"),
  detailList: document.querySelector("#detailList"),
  sizeGuide: document.querySelector("#sizeGuide"),
};

function formatter() {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: state.config?.currency || "COP",
    maximumFractionDigits: 0,
  });
}

function formatPrice(value) {
  return formatter().format(value || 0);
}

function fallbackImage(label) {
  const initials = label
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1125">
      <rect width="900" height="1125" fill="#eeeeea"/>
      <path d="M324 315h252l92 90-70 92-52-42v355H354V455l-52 42-70-92 92-90z" fill="#d8d3c8" stroke="#1f1f1d" stroke-width="10"/>
      <text x="50%" y="49%" text-anchor="middle" font-family="Arial, sans-serif" font-size="94" font-weight="700" fill="#1f1f1d">${initials}</text>
      <text x="50%" y="61%" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#77736a">Agrega la foto en /products</text>
    </svg>
  `)}`;
}

function fallbackBanner(label) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 420">
      <rect width="1600" height="420" fill="#1f3a34"/>
      <text x="72" y="174" font-family="Arial, sans-serif" font-size="56" font-weight="700" fill="#ffffff">${label}</text>
      <text x="72" y="244" font-family="Arial, sans-serif" font-size="30" fill="#dce8dd">Configura banner.image en products.json o usa una URL CDN</text>
      <rect x="1230" y="74" width="250" height="270" rx="18" fill="#b7ff5a"/>
    </svg>
  `)}`;
}

function setImage(img, src, label) {
  img.src = src;
  img.alt = label;
  img.onerror = () => {
    img.onerror = null;
    img.src = fallbackImage(label);
  };
}

function setBannerImage(img, src, label) {
  img.src = src;
  img.alt = label;
  img.onerror = () => {
    img.onerror = null;
    img.src = fallbackBanner(label);
  };
}

async function loadConfig() {
  const response = await fetch("./products.json", { cache: "no-store" });
  if (!response.ok) throw new Error("No se pudo cargar products.json");
  state.config = await response.json();
  state.variant = state.config.product.variants[0];
  state.photo = state.variant.photos[0];
}

function renderProductBasics() {
  const { brand, product, site } = state.config;
  els.brandName.textContent = site?.eyebrow || brand;
  els.productName.textContent = site?.title || product.name;
  els.productReference.textContent = `Referencia ${product.reference}`;
  els.productTitle.textContent = product.name;
  els.productPrice.textContent = formatPrice(product.price);
  els.productDescription.textContent = product.description;

  els.detailList.replaceChildren(
    ...product.details.map((detail) => {
      const item = document.createElement("li");
      item.textContent = detail;
      return item;
    })
  );

  els.sizeGuide.replaceChildren(
    ...product.sizeGuide.map((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${row.size}</td><td>${row.chest}</td><td>${row.length}</td>`;
      return tr;
    })
  );
}

function renderBanner() {
  const banner = state.config.banner;
  if (!banner?.enabled) return;

  const label = banner.alt || `${state.config.brand} banner`;
  els.bannerSection.hidden = false;
  if (banner.href) {
    els.promoBanner.href = banner.href;
    els.promoBanner.target = "_blank";
    els.promoBanner.rel = "noopener noreferrer";
  } else {
    els.promoBanner.removeAttribute("href");
    els.promoBanner.removeAttribute("target");
    els.promoBanner.removeAttribute("rel");
  }
  els.promoBanner.setAttribute("aria-label", label);
  setBannerImage(els.promoBannerImage, banner.image, label);
}

function renderGallery() {
  const label = `${state.config.product.name} ${state.variant.color}`;
  setImage(els.mainPhoto, state.photo, label);
  els.variantStock.textContent = state.variant.stockLabel || "Disponible";
  els.thumbRow.replaceChildren(
    ...state.variant.photos.map((photo) => {
      const button = document.createElement("button");
      const image = document.createElement("img");
      button.type = "button";
      button.className = photo === state.photo ? "thumb active" : "thumb";
      button.setAttribute("aria-label", `Ver foto ${state.variant.color}`);
      setImage(image, photo, label);
      button.append(image);
      button.addEventListener("click", () => {
        state.photo = photo;
        renderGallery();
      });
      return button;
    })
  );
}

function renderSwatches() {
  els.selectedColorLabel.textContent = state.variant.color;
  els.colorSwatches.replaceChildren(
    ...state.config.product.variants.map((variant) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = variant.slug === state.variant.slug ? "swatch active" : "swatch";
      button.style.setProperty("--swatch", variant.hex);
      button.innerHTML = `<span></span><strong>${variant.color}</strong>`;
      button.addEventListener("click", () => {
        state.variant = variant;
        state.photo = variant.photos[0];
        if (!variant.availableSizes.includes(state.size)) state.size = "";
        renderVariant();
      });
      return button;
    })
  );
}

function renderSizes() {
  const allSizes = state.config.product.sizes;
  els.selectedSizeLabel.textContent = state.size || "Selecciona una";
  els.sizeOptions.replaceChildren(
    ...allSizes.map((size) => {
      const available = state.variant.availableSizes.includes(size);
      const button = document.createElement("button");
      button.type = "button";
      button.className = size === state.size ? "size active" : "size";
      button.textContent = size;
      button.disabled = !available;
      button.addEventListener("click", () => {
        state.size = size;
        renderSizes();
        renderSelectionMessage();
        updateContactLink();
      });
      return button;
    })
  );
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function buildWhatsAppMessage() {
  const product = state.config.product;
  const sizeLine = state.size ? `Talla: ${state.size}` : "Talla: por confirmar";

  return [
    `Hola, quiero informacion sobre este hoodie:`,
    `Referencia: ${product.reference}`,
    `Producto: ${product.name}`,
    `Color: ${state.variant.color}`,
    sizeLine,
    `Cantidad: ${state.quantity}`,
    `Precio unitario: ${formatPrice(product.price)}`,
  ].join("\n");
}

function updateContactLink() {
  const phone = normalizePhone(state.config.whatsapp);
  const message = encodeURIComponent(buildWhatsAppMessage());
  const baseUrl = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  els.contactButton.href = `${baseUrl}?text=${message}`;
}

function renderSelectionMessage() {
  if (!state.size) {
    els.selectionMessage.textContent = "Elige una talla para preparar tu mensaje de WhatsApp.";
    return;
  }

  if (!normalizePhone(state.config.whatsapp)) {
    els.selectionMessage.textContent = `${state.variant.color} / ${state.size}. Agrega tu numero en products.json para abrir un chat directo.`;
    return;
  }

  els.selectionMessage.textContent = `${state.variant.color} / ${state.size} listo para consultar por WhatsApp.`;
}

function renderVariant() {
  renderGallery();
  renderSwatches();
  renderSizes();
  renderSelectionMessage();
  updateContactLink();
}

function renderQuantity() {
  els.quantityValue.textContent = state.quantity;
  els.decreaseQty.disabled = state.quantity <= 1;
  updateContactLink();
}

function bindEvents() {
  els.decreaseQty.addEventListener("click", () => {
    state.quantity = Math.max(1, state.quantity - 1);
    renderQuantity();
  });

  els.increaseQty.addEventListener("click", () => {
    state.quantity += 1;
    renderQuantity();
  });

  els.contactButton.addEventListener("click", () => {
    updateContactLink();
  });
}

async function init() {
  try {
    await loadConfig();
    renderProductBasics();
    renderBanner();
    renderVariant();
    renderQuantity();
    bindEvents();
  } catch (error) {
    document.body.innerHTML = `<main class="load-error"><h1>No se pudo cargar la tienda</h1><p>${error.message}</p></main>`;
  }
}

init();
