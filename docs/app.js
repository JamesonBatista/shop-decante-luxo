// app.js

document.addEventListener("DOMContentLoaded", () => {
  // Elementos DOM
  const container = document.getElementById("perfumes-container");
  const cartIcon = document.getElementById("cart-icon");
  const cartCountEl = document.getElementById("cart-count");
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const menuList = document.getElementById("menu-list");

  // Array que armazena os itens do carrinho
  let cart = [];

  // Função para criar um card de perfume
  function createCard(perfume) {
    const card = document.createElement("div");
    card.classList.add("card");

    const productId =
      perfume.id || perfume.name.replace(/\s+/g, "-").toLowerCase();
    card.setAttribute("data-product-id", productId);

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

    const btns = card.querySelectorAll(".btn-volume");
    const priceValue = card.querySelector(".price-value");
    const addBtn = card.querySelector(".btn-add");

    let selectedVolume = "2ml";

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedVolume = btn.getAttribute("data-volume");

        if (selectedVolume === "2ml")
          priceValue.textContent = perfume.value.value2ml;
        else if (selectedVolume === "5ml")
          priceValue.textContent = perfume.value.value5ml;
        else if (selectedVolume === "10ml")
          priceValue.textContent = perfume.value.value10ml;
      });
    });

    addBtn.addEventListener("click", () => {
      addToCart(perfume, selectedVolume);
    });
	      // Clique no card redireciona para página de detalhes (exceto nos botões)
      card.addEventListener('click', () => {
        window.location.href = `detalhes/index.html?product=${encodeURIComponent(productId)}`;
      });


    return card;
  }

  // Função para adicionar item ao carrinho
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

  // Atualiza contador do carrinho no ícone
  function updateCartCount() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (totalItems > 0) {
      cartCountEl.style.display = "flex";
      cartCountEl.textContent = totalItems;
    } else {
      cartCountEl.style.display = "none";
    }
  }

  // Função para carregar produtos do data.json por categoria
  function loadPerfumes(categoria) {
    fetch("data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao carregar data.json: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        const produtos = data[categoria];
        if (!produtos || produtos.length === 0) {
          container.innerHTML = `<p style="color: #f00; text-align: center; position: fixed;">${message}</p>`;
          return;
        }
        container.innerHTML = ""; // limpa container antes de inserir
        produtos.forEach((produto) => {
          const card = createCard(produto);
          container.appendChild(card);
        });
      })
      .catch((error) => {
        container.innerHTML = `<p style="color: #f00; text-align: center;">Erro ao carregar produtos: ${error.message}</p>`;
      });
  }

  // Toggle menu hamburger
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


  // Navega para página pedido ao clicar no carrinho
  cartIcon.addEventListener("click", () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "pedido.html";
  });

  // Carregar carrinho salvo no localStorage
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

  // Obtém categoria da front-end via atributo data-categoria no container, default "perfumes"
  const categoria = container?.getAttribute("data-categoria") || "perfumes";
  const message =
    container?.getAttribute("message") ||
    "Produto ainda não cadastrado, aguarde...";

  loadPerfumes(categoria, message);

  updateCartCount();
});
