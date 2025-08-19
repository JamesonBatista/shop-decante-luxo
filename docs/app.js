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

    // Cria um id/slug para identificar o produto
    const productId =
      perfume.id || perfume.name.replace(/\s+/g, "-").toLowerCase();
    card.setAttribute("data-product-id", productId);

    // Verifica se a categoria é 'combos' e monta o innerHTML conforme solicitado
    if (categoria === "combos") {
      card.innerHTML = `
      <img src="${perfume.image}" alt="${perfume.name}">
      <div class="card-content">
        <div class="volume-buttons">
          <button class="btn-volume" data-volume="2ml">2ml</button>
          <button class="btn-volume" data-volume="5ml">5ml</button>
          <button class="btn-volume" data-volume="10ml">10ml</button>
        </div>
        <p class="spray-info" style="margin-top: 0.4rem; font-size: 0.70rem; color: #ccc;">
          50 borrifadas
        </p>
        <p class="spray-info" style="margin-top: 0.4rem; font-size: 0.70rem; color: #ccc;">
          ${perfume.description || ""}
        </p>
        <button class="btn-add">R$ <span class="price-value">${
          perfume.value.value5ml
        }</span></button>
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
        <p class="spray-info" style="margin-top: 0.4rem; font-size: 0.70rem; color: #ccc;">
          50 borrifadas
        </p>
        <button class="btn-add">R$ <span class="price-value">${perfume.value.value5ml}</span></button>
      </div>
    `;
    }

    const btns = card.querySelectorAll(".btn-volume");
    const priceValue = card.querySelector(".price-value");
    const sprayInfo = card.querySelector(".spray-info");
    const addBtn = card.querySelector(".btn-add");

    // Volume padrão
    let selectedVolume = "5ml";

    // Marca botão ativo correspondente ao volume padrão
    btns.forEach((btn) => {
      if (btn.getAttribute("data-volume") === selectedVolume) {
        btn.classList.add("active");
      }
    });

    // Atualiza o texto de borrifadas conforme volume selecionado
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

    // Evento dos botões de volume
    btns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedVolume = btn.getAttribute("data-volume");

        // Atualiza o preço
        if (selectedVolume === "2ml")
          priceValue.textContent = perfume.value.value2ml;
        else if (selectedVolume === "5ml")
          priceValue.textContent = perfume.value.value5ml;
        else if (selectedVolume === "10ml")
          priceValue.textContent = perfume.value.value10ml;

        // Atualiza o texto das borrifadas
        updateSprayInfo(selectedVolume);
      });
    });

    // Botão adicionar ao carrinho (impede propagação para não abrir detalhes)
    addBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      addToCart(perfume, selectedVolume);
    });

    // Clique no card redireciona para página de detalhes, exceto nos botões
    card.addEventListener("click", (event) => {
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
