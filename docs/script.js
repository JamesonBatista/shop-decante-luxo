// Função para fechar todos os detalhes exibidos
function fecharTodosDetalhes() {
  const produtos = document.querySelectorAll(".produto.expanded");
  produtos.forEach((produto) => {
    produto.classList.remove("expanded");
  });

  const detalhes = document.querySelectorAll(".detalhes-produto.show");
  detalhes.forEach((det) => {
    det.classList.remove("show");
  });
}

function mostrarDetalhes(produtoId) {
  fecharTodosDetalhes(); // Fecha outros detalhes antes

  const produto = document.getElementById(produtoId);
  const detalhes = document.getElementById("detalhes-" + produtoId);

  produto.classList.add("expanded"); // Adiciona classe para estilo "luxo"
  detalhes.classList.add("show"); // Exibe detalhes via classe para animação suave
}

function fecharDetalhes(produtoId) {
  const produto = document.getElementById(produtoId);
  const detalhes = document.getElementById("detalhes-" + produtoId);

  produto.classList.remove("expanded");
  detalhes.classList.remove("show");
}

function adicionarCarrinho(produto, preco) {
  // Recupera itens do localStorage ou inicia array vazio
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  carrinho.push({ produto, preco });
  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  atualizarContadorCarrinho();
}

// Atualiza o contador do carrinho com animação suave
function atualizarContadorCarrinho() {
  const cartCount = document.getElementById("cart-count");
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  let totalItens = carrinho.length;

  cartCount.textContent = totalItens;

  // Animação de destaque para chamar atenção
  cartCount.classList.add("bump");
  setTimeout(() => {
    cartCount.classList.remove("bump");
  }, 300);
}

// Chamando atualização ao carregar página para manter estado
window.addEventListener("load", atualizarContadorCarrinho);

const hamburgerBtn = document.getElementById("hamburger-btn");
const menuList = document.getElementById("menu-list");

hamburgerBtn.addEventListener("click", () => {
  const expanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
  hamburgerBtn.setAttribute("aria-expanded", String(!expanded));
  if (menuList.hasAttribute("hidden")) {
    menuList.removeAttribute("hidden");
  } else {
    menuList.setAttribute("hidden", "");
  }
});

// Fechar menu ao clicar fora (opcional)
document.addEventListener("click", (e) => {
  if (!hamburgerBtn.contains(e.target) && !menuList.contains(e.target)) {
    menuList.setAttribute("hidden", "");
    hamburgerBtn.setAttribute("aria-expanded", "false");
  }
});

const main = document.querySelector('main.container');
const h1 = document.getElementById('frase');

main.addEventListener('scroll', () => {
  const fadeStart = 0;
  const fadeEnd = 150;

  let opacity = 1;

  if (main.scrollTop > fadeStart) {
    opacity = 1 - (main.scrollTop - fadeStart) / (fadeEnd - fadeStart);
    if (opacity < 0) opacity = 0;
  }

  h1.style.opacity = opacity;
});
