// app.js

document.addEventListener("DOMContentLoaded", () => {
  // Elementos DOM
  const container = document.getElementById("perfumes-container");
  const cartIcon = document.getElementById("cart-icon");
  const cartCountEl = document.getElementById("cart-count");
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const menuList = document.getElementById("menu-list");

  // Carrinho interno: array de { perfume, volume, quantity }
  let cart = [];
  const categoriaMain = container.getAttribute("data-categoria");
  // Função para criar um card de perfume
  function createCard(perfume) {
    const card = document.createElement("div");
    card.classList.add("card");

    const productId =
      perfume.id || perfume.name.replace(/\s+/g, "-").toLowerCase();
    card.setAttribute("data-product-id", productId);

    if (categoria === "combos") {
      card.innerHTML = `
      <img src="${perfume.image}" alt="${perfume.name}">
      <div class="card-content">
        <div class="volume-buttons">
          <button class="btn-volume" data-volume="2ml">2ml</button>
          <button class="btn-volume" data-volume="5ml">5ml</button>
          <button class="btn-volume" data-volume="10ml">10ml</button>
        </div>
        <p class="spray-info" style="margin-top: 0.4rem; font-size: 1rem; color: #ccc;" hidden>
          500 borrifadas
        </p>
        <p class="spray-info" style="margin-top: 0.4rem; font-size: 0.70rem; color: #ccc;">
          ${perfume.description || ""}
        </p>
        <div class="price-container" style="margin-top: 1rem; text-align: center; font-family: 'Montserrat', sans-serif; color: #f0e6c8;">
          <div class="price-main" style="font-weight: 700; font-size: 1.2rem;">
            R$ ${perfume.value.value5ml.toFixed(2).replace(".", ",")}
          </div>
          <div class="price-pix" style="font-size: 0.85rem; color: #bfa05a; margin-top: 4px;">
            R$ ${(perfume.value.value5ml * 0.95)
              .toFixed(2)
              .replace(
                ".",
                ","
              )} com <span style="font-weight: 700;">Pix </span>
          </div>
        </div>
        <button class="btn-add" style="margin-top: 1rem; text-transform: uppercase; font-weight: 700;">
          Adicionar
        </button>
      </div>
    `;
    } else {
      card.innerHTML = `
      <img src="${perfume.image}" alt="${perfume.name}">
      <div class="card-content">
        <div class="volume-buttons">
          <button class="btn-volume" data-volume="2ml">2ml</button>
          <button class="btn-volume" data-volume="5ml">5ml</button>
          <button class="btn-volume" data-volume="10ml">10ml</button>
        </div>
        <p class="spray-info" style="margin-top: 0.4rem; font-size: 1rem; color: #ccc;">
          50 borrifadas
        </p>
        <div class="price-container" style="margin-top: 1rem; text-align: center; font-family: 'Montserrat', sans-serif; color: #f0e6c8;">
          <div class="price-main" style="font-weight: 700; font-size: 1.2rem;">
            R$ ${perfume.value.value5ml.toFixed(2).replace(".", ",")}
          </div>
          <div class="price-pix" style="font-size: 0.85rem; color: #bfa05a; margin-top: 4px;">
            R$ ${(perfume.value.value5ml * 0.95)
              .toFixed(2)
              .replace(
                ".",
                ","
              )} com <span style="font-weight: 700;">Pix </span>
          </div>
        </div>
        <button class="btn-add" style="margin-top: 1rem; text-transform: uppercase; font-weight: 700;">
          Adicionar
        </button>
      </div>
    `;
    }

    const btns = card.querySelectorAll(".btn-volume");
    const priceMain = card.querySelector(".price-main");
    const pricePix = card.querySelector(".price-pix");
    const sprayInfo = card.querySelector(".spray-info");
    const addBtn = card.querySelector(".btn-add");

    let selectedVolume = "5ml";

    // Marca botão ativo inicial
    btns.forEach((btn) => {
      if (btn.getAttribute("data-volume") === selectedVolume) {
        btn.classList.add("active");
      }
    });

    function updateSprayInfo(volume) {
      switch (volume) {
        case "2ml":
          sprayInfo.textContent = "20 borrifadas";
          break;
        case "5ml":
          sprayInfo.textContent = "50 borrifadas";
          break;
        case "10ml":
          sprayInfo.textContent = "100 borrifadas";
          break;
        default:
          sprayInfo.textContent = "";
      }
    }
    updateSprayInfo(selectedVolume);

    btns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedVolume = btn.getAttribute("data-volume");

        let precoAtual;
        if (selectedVolume === "2ml") precoAtual = perfume.value.value2ml;
        else if (selectedVolume === "5ml") precoAtual = perfume.value.value5ml;
        else if (selectedVolume === "10ml")
          precoAtual = perfume.value.value10ml;

        // Atualiza os preços
        priceMain.textContent = `R$ ${precoAtual.toFixed(2).replace(".", ",")}`;
        pricePix.textContent = `R$ ${(precoAtual * 0.95)
          .toFixed(2)
          .replace(".", ",")} com Pix`;

        updateSprayInfo(selectedVolume);
      });
    });

    addBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      addToCart(perfume, selectedVolume);
    });

    card.addEventListener("click", () => {
      window.location.href = `detalhes/index.html?product=${encodeURIComponent(
        productId
      )}`;
    });

    return card;
  }

  // Adiciona item no carrinho (incrementa se já existe)
  function addToCart(perfume, volume) {
    const itemIndex = cart.findIndex(
      (item) => item.perfume.name === perfume.name && item.volume === volume
    );
    if (itemIndex > -1) {
      cart[itemIndex].quantity++;
    } else {
      cart.push({ perfume, volume, quantity: 1 });
    }
    updateCartCount();
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Atualiza contador do ícone do carrinho
  function updateCartCount() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (totalItems > 0) {
      cartCountEl.style.display = "flex";
      cartCountEl.textContent = totalItems;
    } else {
      cartCountEl.style.display = "none";
    }
  }

  // Carrega perfumes do data.json conforme categoria e mensagem
  function loadPerfumes(categoria, message) {
    fetch("data.json")
      .then((response) => {
        if (!response.ok)
          throw new Error(`Erro ao carregar data.json: ${response.statusText}`);
        return response.json();
      })
      .then((data) => {
        const produtos = data[categoria];
        if (!produtos || produtos.length === 0) {
          container.innerHTML = `<p style="color: #f00; text-align: center;">${message}</p>`;
          return;
        }
        container.innerHTML = "";
        produtos.forEach((produto) => {
          const card = createCard(produto);
          container.appendChild(card);
        });
      })
      .catch((error) => {
        container.innerHTML = `<p style="color: #f00; text-align: center;">${error.message}</p>`;
      });
  }

  // Toggle menu hambúrguer
  hamburgerBtn.addEventListener("click", () => {
    const expanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
    hamburgerBtn.setAttribute("aria-expanded", String(!expanded));
    if (menuList.hasAttribute("hidden")) {
      menuList.removeAttribute("hidden");
    } else {
      menuList.setAttribute("hidden", "");
    }
  });

  // Fecha menu ao clicar fora
  document.addEventListener("click", (e) => {
    if (!hamburgerBtn.contains(e.target) && !menuList.contains(e.target)) {
      menuList.setAttribute("hidden", "");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Navega para página pedido ao clicar no ícone do carrinho
  cartIcon.addEventListener("click", () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "pedido.html";
  });

  // Carregar carrinho salvo no localStorage se existir
  function loadCartFromStorage() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch {
        cart = [];
      }
    }
  }

  // Inicialização
  loadCartFromStorage();

  // Obtém categoria e mensagem do front
  const categoria = container?.getAttribute("data-categoria") || "perfumes";
  const message =
    container?.getAttribute("data-message") ||
    "Produto ainda não cadastrado, aguarde...";

  loadPerfumes(categoria, message);
  updateCartCount();
});
