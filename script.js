const banner = document.querySelector(".banner");
const leftArrow = document.querySelector(".left");
const rightArrow = document.querySelector(".right");
const dots = document.querySelectorAll(".dots span");
const menuLinks = document.querySelectorAll(".menu a");

const images = [
  "Img/Background/Background_1.jpg",
  "Img/Background/Background_2.jpg",
  "Img/Background/Background_3.jpg",
  "Img/Background/Background_4.jpg",
  "Img/Background/Background_5.jpg",
];

let currentIndex = 0;

function updateBanner() {
  if (!banner || dots.length === 0) {
    return;
  }

  banner.style.background = `url('${images[currentIndex]}') center/cover no-repeat`;

  dots.forEach((dot) => dot.classList.remove("active"));
  dots[currentIndex].classList.add("active");
}

function nextSlide() {
  currentIndex++;
  if (currentIndex >= images.length) {
    currentIndex = 0;
  }
  updateBanner();
}

function prevSlide() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = images.length - 1;
  }
  updateBanner();
}

if (rightArrow && leftArrow && banner && dots.length > 0) {
  rightArrow.addEventListener("click", nextSlide);
  leftArrow.addEventListener("click", prevSlide);
  setInterval(nextSlide, 4000);
  updateBanner();
}

if (menuLinks.length > 0) {
  const normalizeRoute = (value) => {
    const cleanValue = (value || "").split("?")[0].split("#")[0].trim();
    if (!cleanValue) {
      return "index";
    }

    const lastPart = cleanValue.split("/").pop() || "index";
    const normalized = lastPart.replace(/\.html$/i, "").toLowerCase();

    return normalized || "index";
  };

  const currentRoute = normalizeRoute(window.location.pathname);

  menuLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const targetRoute = normalizeRoute(href);

    if (targetRoute === currentRoute) {
      link.classList.add("active");
    }
  });
}

const contactForm = document.querySelector(".contact-form");
const phoneField = document.querySelector("#telefone");
const loginForm = document.querySelector("#login-form");
const loginFeedback = document.querySelector("#login-feedback");
const registerForm = document.querySelector("#register-form");
const registerPhoneField = document.querySelector("#register-phone");
const registerFeedback = document.querySelector("#register-feedback");
const passwordToggleButtons = document.querySelectorAll(
  ".password-toggle[data-target]",
);
const actionAccount = document.querySelector(".action-account");
const actionAccountText = actionAccount ? actionAccount.querySelector("span") : null;
const defaultAccountHtml = actionAccountText ? actionAccountText.innerHTML : "";
const productsGrid = document.querySelector("#produtos-grid");
const productsStatus = document.querySelector("#produtos-status");
const filtroCategoria = document.querySelector("#filtro-categoria");
const filtroMarca = document.querySelector("#filtro-marca");
const ordenarPor = document.querySelector("#ordenar-por");
const limparFiltrosButton = document.querySelector("#limpar-filtros");
const productSearchInput = document.querySelector("#productSearch");
const filtroTamanhoCheckboxes = document.querySelectorAll(".filtro-tamanho");
const filtroPrecoMin = document.querySelector("#preco-min");
const filtroPrecoMax = document.querySelector("#preco-max");
const breadcrumbCategoria = document.querySelector("#breadcrumb-categoria");
const breadcrumbCategoriaSeparator = document.querySelector("#breadcrumb-categoria-separator");
const productCategoryLinks = document.querySelectorAll(".products-dropdown a");
const mainProductsMenuLink = document.querySelector('.menu-item-has-dropdown > a[href*="produtos"]');
const catalogHeading = document.querySelector("#catalog-heading");

const productsState = {
  todos: [],
  termoBusca: "",
  categoria: "",
  marca: "",
  ordenacao: "nome-az",
  tamanhos: [],
  precoMin: "",
  precoMax: "",
};

const apiBaseUrl = "http://localhost:3000";

const categoriaAliases = {
  "extensao-cilios": ["extensaocilios", "extensaodecilios", "cilios"],
  perfumes: ["perfumes", "perfume", "fragrancia", "fragrancias"],
  sobrancelha: ["sobrancelha", "sobrancelhas", "brow", "brows"],
  maquiagens: ["maquiagem", "maquiagens", "make", "makeup"],
  hidratantes: ["hidratante", "hidratantes", "hidratacao"],
  cabelos: ["cabelo", "cabelos", "hair"],
  skincare: ["skincare", "skincares", "cuidadodapele", "cuidadopele", "skin", "care"],
};

function obterPayloadToken(token) {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function formatarNomeUsuario(valor) {
  const texto = (valor || "").trim();
  if (!texto) {
    return "";
  }

  return texto
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

function obterNomeUsuarioLogado() {
  const nomeSalvo = formatarNomeUsuario(localStorage.getItem("userName"));
  if (nomeSalvo) {
    return nomeSalvo;
  }

  const token = localStorage.getItem("token");
  const payload = obterPayloadToken(token);
  const emailToken = (payload && payload.email ? payload.email : "").trim();
  if (!emailToken) {
    return "";
  }

  const nomePorEmail = emailToken.split("@")[0] || "";
  return formatarNomeUsuario(nomePorEmail);
}

function atualizarAreaConta() {
  if (!actionAccount || !actionAccountText) {
    return;
  }

  const token = localStorage.getItem("token");
  const dropdownExistente = actionAccount.querySelector(".account-dropdown");

  if (!token) {
    actionAccount.classList.remove("logged-in");
    actionAccountText.classList.remove("account-user-name");
    actionAccountText.innerHTML = defaultAccountHtml;
    if (dropdownExistente) {
      dropdownExistente.remove();
    }
    return;
  }

  const nomeUsuario = formatarNomeUsuario(obterNomeUsuarioLogado()) || "Minha Conta";
  localStorage.setItem("userName", nomeUsuario);

  actionAccount.classList.add("logged-in");
  actionAccountText.classList.add("account-user-name");
  actionAccountText.textContent = nomeUsuario;

  const dropdown = dropdownExistente || document.createElement("div");
  dropdown.className = "account-dropdown";

  let logoutButton = dropdown.querySelector(".account-logout");
  if (!logoutButton) {
    logoutButton = document.createElement("button");
    logoutButton.type = "button";
    logoutButton.className = "account-logout";
    logoutButton.textContent = "Deslogar";
    dropdown.appendChild(logoutButton);
  }

  logoutButton.onclick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    atualizarAreaConta();
    window.location.href = "index.html";
  };

  if (!dropdownExistente) {
    actionAccount.appendChild(dropdown);
  }
}

atualizarAreaConta();

function sanitizePhoneDigits(value) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function isValidPhoneDigits(value) {
  return /^\d{11}$/.test(value);
}

if (phoneField) {
  phoneField.addEventListener("input", () => {
    phoneField.value = sanitizePhoneDigits(phoneField.value);
    phoneField.setCustomValidity("");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameField = document.querySelector("#nome");
    const emailField = document.querySelector("#email");
    const messageField = document.querySelector("#mensagem");

    const name = nameField ? nameField.value.trim() : "";
    const email = emailField ? emailField.value.trim() : "";
    const phone = phoneField ? sanitizePhoneDigits(phoneField.value) : "";
    const message = messageField ? messageField.value.trim() : "";

    if (phoneField && !isValidPhoneDigits(phone)) {
      phoneField.setCustomValidity("Informe um telefone com 11 dígitos.");
      phoneField.reportValidity();
      return;
    }

    if (phoneField) {
      phoneField.setCustomValidity("");
    }

    const recipientEmail = "marinavanoniap@gmail.com";
    const emailSubject = `Contato pelo site - ${name || "Sem nome"}`;
    const emailBody = [
      "Olá, vim pelo site da Shop Beauty.",
      "",
      `Nome: ${name || "Não informado"}`,
      `E-mail: ${email || "Não informado"}`,
      `Telefone: ${phone || "Não informado"}`,
      `Mensagem: ${message || "Não informada"}`,
    ].join("\n");

    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;
  });
}

if (registerPhoneField) {
  registerPhoneField.addEventListener("input", () => {
    registerPhoneField.value = sanitizePhoneDigits(registerPhoneField.value);
    registerPhoneField.setCustomValidity("");
  });
}

if (passwordToggleButtons.length > 0) {
  passwordToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const targetInput = targetId
        ? document.querySelector(`#${targetId}`)
        : null;
      const icon = button.querySelector("i");

      if (!targetInput) {
        return;
      }

      const isHidden = targetInput.type === "password";
      targetInput.type = isHidden ? "text" : "password";

      if (icon) {
        icon.classList.toggle("fa-eye", isHidden);
        icon.classList.toggle("fa-eye-slash", !isHidden);
      }
    });
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailField = document.querySelector("#login-email");
    const passwordField = document.querySelector("#login-password");
    const submitButton = loginForm.querySelector(".login-submit");

    const email = emailField ? emailField.value.trim() : "";
    const senha = passwordField ? passwordField.value : "";

    if (!email || !senha) {
      if (loginFeedback) {
        loginFeedback.textContent = "Preencha e-mail e senha para continuar.";
        loginFeedback.className = "login-feedback error";
      }
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    if (loginFeedback) {
      loginFeedback.textContent = "Validando login...";
      loginFeedback.className = "login-feedback";
    }

    const endpoint =
      loginForm.getAttribute("data-login-endpoint") ||
      "http://localhost:3000/loginClientes";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload.erro || payload.mensagem || "Falha ao autenticar.",
        );
      }

      if (loginFeedback) {
        loginFeedback.textContent =
          payload.mensagem || "Login realizado com sucesso.";
        loginFeedback.className = "login-feedback success";
      }

      localStorage.setItem('token', payload.token)
      if (payload.nome) {
        localStorage.setItem("userName", formatarNomeUsuario(payload.nome));
      } else if (payload.email) {
        localStorage.setItem("userName", formatarNomeUsuario(payload.email.split("@")[0] || "Minha Conta"));
      }
      atualizarAreaConta();
      window.location.href = "index.html";

    } catch (error) {
      if (loginFeedback) {
        loginFeedback.textContent =
          error instanceof Error
            ? error.message
            : "Não foi possível concluir o login agora.";
        loginFeedback.className = "login-feedback error";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameField = document.querySelector("#register-name");
    const emailField = document.querySelector("#register-email");
    const phoneFieldRegister = document.querySelector("#register-phone");
    const passwordField = document.querySelector("#register-password");
    const confirmPasswordField = document.querySelector(
      "#register-password-confirm",
    );
    const submitButton = registerForm.querySelector(".register-submit");

    const nome = nameField ? nameField.value.trim() : "";
    const email = emailField ? emailField.value.trim() : "";
    const telefone = phoneFieldRegister
      ? sanitizePhoneDigits(phoneFieldRegister.value)
      : "";
    const senha = passwordField ? passwordField.value : "";
    const confirmaSenha = confirmPasswordField
      ? confirmPasswordField.value
      : "";

    if (!nome || !email || !telefone || !senha || !confirmaSenha) {
      if (registerFeedback) {
        registerFeedback.textContent =
          "Preencha todos os campos para continuar.";
        registerFeedback.className = "login-feedback error";
      }
      return;
    }

    if (!isValidPhoneDigits(telefone)) {
      if (registerPhoneField) {
        registerPhoneField.setCustomValidity(
          "Informe um telefone com 11 dígitos.",
        );
        registerPhoneField.reportValidity();
      }

      if (registerFeedback) {
        registerFeedback.textContent = "Telefone deve ter exatamente 11 dígitos.";
        registerFeedback.className = "login-feedback error";
      }
      return;
    }

    if (registerPhoneField) {
      registerPhoneField.setCustomValidity("");
    }

    if (senha !== confirmaSenha) {
      if (registerFeedback) {
        registerFeedback.textContent = "As senhas precisam ser iguais.";
        registerFeedback.className = "login-feedback error";
      }
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    if (registerFeedback) {
      registerFeedback.textContent = "Criando sua conta...";
      registerFeedback.className = "login-feedback";
    }

    const endpoint =
      registerForm.getAttribute("data-register-endpoint") ||
      "http://localhost:3000/cadastroClientes";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          senha,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload.erro || payload.mensagem || "Falha ao criar conta.",
        );
      }

      if (registerFeedback) {
        registerFeedback.textContent =
          payload.mensagem || "Conta criada com sucesso.";
        registerFeedback.className = "login-feedback success";
      }

    } catch (error) {
      if (registerFeedback) {
        registerFeedback.textContent =
          error instanceof Error
            ? error.message
            : "Não foi possível concluir o cadastro agora.";
        registerFeedback.className = "login-feedback error";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

// CONEXÕES COM O BACKEND!

async function carregarProdutos() {
    if (!productsGrid) {
      return;
    }

    if (productsStatus) {
      productsStatus.textContent = "Carregando produtos...";
    }

    try {
      const resposta = await fetch(`${apiBaseUrl}/produtos`);
      const produtos = await resposta.json();

      productsState.todos = Array.isArray(produtos) ? produtos : [];
      preencherMarcas(productsState.todos);
      preencherFaixasDePreco(productsState.todos);
      aplicarFiltrosEOrdenacao();
    } catch (erro) {
      if (productsStatus) {
        productsStatus.textContent = "Não foi possível carregar os produtos agora.";
      }
      productsGrid.innerHTML = '<div class="sem-produtos">Não foi possível carregar os produtos agora.</div>';
      console.error(erro);
    }
}

async function carregarProdutosPorNome(nome) {
    productsState.termoBusca = (nome || "").trim();

    if (productSearchInput && productSearchInput.value !== productsState.termoBusca) {
      productSearchInput.value = productsState.termoBusca;
    }

    aplicarFiltrosEOrdenacao();
}

function normalizarTexto(valor) {
  return (valor || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function preencherMarcas(produtos) {
  if (!filtroMarca) {
    return;
  }

  const marcasUnicas = [...new Set(produtos
    .map((produto) => (produto.marca || "").trim())
    .filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));

  const marcaSelecionada = productsState.marca;
  filtroMarca.innerHTML = '<option value="">Todas as marcas</option>';

  marcasUnicas.forEach((marca) => {
    const option = document.createElement("option");
    option.value = marca;
    option.textContent = formatarTituloTexto(marca) || marca;
    filtroMarca.appendChild(option);
  });

  filtroMarca.value = marcaSelecionada;
}

function preencherFaixasDePreco(produtos) {
  if (!filtroPrecoMin || !filtroPrecoMax) {
    return;
  }

  const precos = produtos
    .map((produto) => Number(produto.preco))
    .filter((preco) => Number.isFinite(preco))
    .sort((a, b) => a - b);

  if (precos.length === 0) {
    return;
  }

  if (!productsState.precoMin) {
    filtroPrecoMin.placeholder = formatarPreco(precos[0]);
  }

  if (!productsState.precoMax) {
    filtroPrecoMax.placeholder = formatarPreco(precos[precos.length - 1]);
  }
}

function parseValorPreco(valor) {
  const texto = (valor || "").toString().trim();
  if (!texto) {
    return null;
  }

  const normalizado = texto
    .replace(/\s/g, "")
    .replace(/R\$/gi, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");

  if (!normalizado) {
    return null;
  }

  const numero = Number(normalizado);
  return Number.isFinite(numero) ? numero : null;
}

function extrairTamanhoMl(produto) {
  const texto = `${produto?.nome || ""} ${produto?.descricao || ""}`;
  const match = texto.match(/(\d{2,3})\s*ml/i);
  return match ? Number(match[1]) : null;
}

function atualizarBreadcrumbCategoria() {
  if (!breadcrumbCategoria) {
    return;
  }

  if (!productsState.categoria) {
    breadcrumbCategoria.textContent = "";
    breadcrumbCategoria.hidden = true;
    if (breadcrumbCategoriaSeparator) {
      breadcrumbCategoriaSeparator.hidden = true;
    }
    return;
  }

  const formatado = productsState.categoria
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
  breadcrumbCategoria.textContent = formatado;
  breadcrumbCategoria.hidden = false;
  if (breadcrumbCategoriaSeparator) {
    breadcrumbCategoriaSeparator.hidden = false;
  }
}

function obterTextoCategoria(categoria) {
  if (!categoria) {
    return "Produtos";
  }

  if (filtroCategoria) {
    const opcao = [...filtroCategoria.options].find((item) => item.value === categoria);
    if (opcao && opcao.textContent) {
      return opcao.textContent;
    }
  }

  return categoria
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function atualizarTituloCatalogo() {
  if (!catalogHeading) {
    return;
  }

  catalogHeading.textContent = obterTextoCategoria(productsState.categoria);
}

function categoriaCompativel(categoriaProduto, categoriaFiltro) {
  const produtoNormalizado = normalizarTexto(categoriaProduto);
  const filtroNormalizado = normalizarTexto(categoriaFiltro);
  const aliases = categoriaAliases[categoriaFiltro] || [filtroNormalizado];

  if (!filtroNormalizado) {
    return true;
  }

  if (!produtoNormalizado) {
    return false;
  }

  return aliases.some((alias) => {
    const aliasNormalizado = normalizarTexto(alias);
    return (
      produtoNormalizado === aliasNormalizado
      || produtoNormalizado.includes(aliasNormalizado)
    );
  });
}

function aplicarFiltrosEOrdenacao() {
  if (!productsGrid) {
    return;
  }

  let produtosFiltrados = [...productsState.todos];

  if (productsState.termoBusca) {
    const termo = normalizarTexto(productsState.termoBusca);
    produtosFiltrados = produtosFiltrados.filter((produto) => {
      const nome = normalizarTexto(produto.nome);
      const marca = normalizarTexto(produto.marca);
      const categoria = normalizarTexto(produto.categoria);
      return nome.includes(termo) || marca.includes(termo) || categoria.includes(termo);
    });
  }

  if (productsState.categoria) {
    produtosFiltrados = produtosFiltrados.filter((produto) => categoriaCompativel(produto.categoria, productsState.categoria));
  }

  if (productsState.marca) {
    const marcaSelecionada = normalizarTexto(productsState.marca);
    produtosFiltrados = produtosFiltrados.filter((produto) => normalizarTexto(produto.marca) === marcaSelecionada);
  }

  if (productsState.tamanhos.length > 0) {
    produtosFiltrados = produtosFiltrados.filter((produto) => {
      const tamanho = extrairTamanhoMl(produto);
      return tamanho && productsState.tamanhos.includes(tamanho);
    });
  }

  const precoMinimo = parseValorPreco(productsState.precoMin);
  if (precoMinimo !== null) {
    produtosFiltrados = produtosFiltrados.filter((produto) => Number(produto.preco) >= precoMinimo);
  }

  const precoMaximo = parseValorPreco(productsState.precoMax);
  if (precoMaximo !== null) {
    produtosFiltrados = produtosFiltrados.filter((produto) => Number(produto.preco) <= precoMaximo);
  }

  if (productsState.ordenacao === "preco-menor") {
    produtosFiltrados.sort((a, b) => Number(a.preco) - Number(b.preco));
  }

  if (productsState.ordenacao === "preco-maior") {
    produtosFiltrados.sort((a, b) => Number(b.preco) - Number(a.preco));
  }

  if (productsState.ordenacao === "nome-az") {
    produtosFiltrados.sort((a, b) => (a.nome || "").localeCompare(b.nome || "", "pt-BR"));
  }

  if (productsState.ordenacao === "nome-za") {
    produtosFiltrados.sort((a, b) => (b.nome || "").localeCompare(a.nome || "", "pt-BR"));
  }

  renderizarProdutos(produtosFiltrados);
}

function formatarPreco(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor || 0));
}

function formatarTituloTexto(valor) {
  const texto = (valor || "").toString().trim().toLowerCase();
  if (!texto) {
    return "";
  }

  return texto.replace(/(^|\s|[-/])(\p{L})/gu, (match, separador, letra) => `${separador}${letra.toUpperCase()}`);
}

function renderizarProdutos(produtos) {
  if (!productsGrid) {
    return;
  }

  productsGrid.innerHTML = "";

  if (productsStatus) {
    productsStatus.textContent = `${produtos.length} produto(s) encontrado(s)`;
  }

  if (produtos.length === 0) {
    productsGrid.innerHTML = '<div class="sem-produtos">Nenhum produto encontrado com os filtros selecionados.</div>';
    return;
  }

  produtos.forEach((produto) => {
    const card = document.createElement("article");
    card.className = "produto-card";

    const imagem = produto.imagem_url || "https://via.placeholder.com/150?text=Sem+Imagem";
    const precoProduto = Number(produto.preco || 0);
    const parcelado = precoProduto / 3;
    const precoPix = precoProduto * 0.93;
    const tamanho = extrairTamanhoMl(produto);
    const nomeFormatado = formatarTituloTexto(produto.nome) || "Produto";
    const marcaFormatada = formatarTituloTexto(produto.marca) || "Sem marca";
    const nomeComTamanho = tamanho ? `${nomeFormatado} (${tamanho}ml)` : nomeFormatado;

    card.innerHTML = `
      <div class="produto-imagem-box">
        <img src="${imagem}" alt="${produto.nome}" class="produto-imagem">
      </div>
      <h3 class="produto-nome">${nomeComTamanho}</h3>
      <p class="produto-marca">${marcaFormatada}</p>
      <p class="produto-preco">${formatarPreco(precoProduto)}</p>
      <p class="produto-parcelado">3x de ${formatarPreco(parcelado)}</p>
      <p class="produto-pix">${formatarPreco(precoPix)} no PIX</p>
      <button class="btn-adicionar" type="button">COMPRAR</button>
    `;

    const botao = card.querySelector(".btn-adicionar");
    botao.addEventListener("click", () => adicionarAoSacola(produto));

    productsGrid.appendChild(card);
  });
}

function obterCategoriaDaUrl() {
  const params = new URLSearchParams(window.location.search);
  const categoriaQuery = params.get("categoria") || "";
  if (categoriaQuery) {
    return categoriaQuery;
  }

  const categoriaStorage = sessionStorage.getItem("shopBeautyCategoria");
  return categoriaStorage || "";
}

function setCategoriaSelecionada(categoria) {
  productsState.categoria = categoria || "";

  if (filtroCategoria) {
    filtroCategoria.value = productsState.categoria;
  }

  atualizarBreadcrumbCategoria();
  atualizarTituloCatalogo();
  aplicarFiltrosEOrdenacao();
}

function limparFiltrosProdutos() {
  productsState.termoBusca = "";
  productsState.categoria = "";
  productsState.marca = "";
  productsState.ordenacao = "nome-az";
  productsState.tamanhos = [];
  productsState.precoMin = "";
  productsState.precoMax = "";

  if (productSearchInput) {
    productSearchInput.value = "";
  }

  if (filtroCategoria) {
    filtroCategoria.value = "";
  }

  if (filtroMarca) {
    filtroMarca.value = "";
  }

  if (ordenarPor) {
    ordenarPor.value = "nome-az";
  }

  if (filtroTamanhoCheckboxes.length > 0) {
    filtroTamanhoCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }

  if (filtroPrecoMin) {
    filtroPrecoMin.value = "";
  }

  if (filtroPrecoMax) {
    filtroPrecoMax.value = "";
  }

  sessionStorage.removeItem("shopBeautyCategoria");
  history.replaceState({}, "", window.location.pathname);
  atualizarBreadcrumbCategoria();
  atualizarTituloCatalogo();
  aplicarFiltrosEOrdenacao();
}

function inicializarFiltrosProdutos() {
  if (!productsGrid) {
    return;
  }

  const categoriaUrl = obterCategoriaDaUrl();
  if (categoriaUrl) {
    productsState.categoria = categoriaUrl;
  }
  sessionStorage.removeItem("shopBeautyCategoria");
  atualizarBreadcrumbCategoria();
  atualizarTituloCatalogo();

  if (filtroCategoria) {
    filtroCategoria.value = productsState.categoria;
    filtroCategoria.addEventListener("change", (event) => {
      productsState.categoria = event.target.value;
      atualizarBreadcrumbCategoria();
      atualizarTituloCatalogo();
      aplicarFiltrosEOrdenacao();
    });
  }

  if (filtroMarca) {
    filtroMarca.addEventListener("change", (event) => {
      productsState.marca = event.target.value;
      aplicarFiltrosEOrdenacao();
    });
  }

  if (ordenarPor) {
    ordenarPor.addEventListener("change", (event) => {
      productsState.ordenacao = event.target.value;
      aplicarFiltrosEOrdenacao();
    });
  }

  if (limparFiltrosButton) {
    limparFiltrosButton.addEventListener("click", () => {
      limparFiltrosProdutos();
    });
  }

  if (mainProductsMenuLink) {
    mainProductsMenuLink.addEventListener("click", (event) => {
      event.preventDefault();
      limparFiltrosProdutos();
    });
  }

  if (filtroTamanhoCheckboxes.length > 0) {
    filtroTamanhoCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        productsState.tamanhos = [...filtroTamanhoCheckboxes]
          .filter((item) => item.checked)
          .map((item) => Number(item.value));
        aplicarFiltrosEOrdenacao();
      });
    });
  }

  if (filtroPrecoMin) {
    filtroPrecoMin.addEventListener("input", (event) => {
      productsState.precoMin = event.target.value;
      aplicarFiltrosEOrdenacao();
    });
  }

  if (filtroPrecoMax) {
    filtroPrecoMax.addEventListener("input", (event) => {
      productsState.precoMax = event.target.value;
      aplicarFiltrosEOrdenacao();
    });
  }

  if (productSearchInput) {
    productSearchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        carregarProdutosPorNome(productSearchInput.value);
      }
    });
  }
}

function adicionarAoSacola(produto) {

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você precisa estar logado para adicionar produtos à sacola.');
        window.location.href = 'login.html';
        return;
    }

    let sacola = JSON.parse(localStorage.getItem('sacola')) || [];

    const index = sacola.findIndex(item => item.id === produto.id)

    if (index >= 0) {
      sacola[index].quantidade += 1
      alert(`Quantidade de ${produto.nome} foi atualizada para ${sacola[index].quantidade}!`)
    } else {
      sacola.push({ ...produto, quantidade: 1 })
      alert(`${produto.nome} foi adicionado à sua sacola!`)
    }

    localStorage.setItem('sacola', JSON.stringify(sacola));
}

function exibirSacola() {
  const token = localStorage.getItem("token");
  const sacola = JSON.parse(localStorage.getItem("sacola")) || [];

  const cartGrid = document.getElementById("cart-grid");
  const summaryItems = document.getElementById("summary-items");
  const totalValueEl = document.getElementById("total-value");
  const container = document.querySelector(".cart-container");

  if (!container || !cartGrid || !summaryItems || !totalValueEl) {
    return;
  }

  if (!token) {
    container.innerHTML = `
      <div style="text-align: center; width: 100%; padding: 50px;">
        <h2>Sua Sacola</h2>
        <p>Você precisa estar logado para ver sua sacola.</p>
        <a href="login.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #000; color: #fff; text-decoration: none;">Fazer Login</a>
      </div>
    `;
    return;
  }

  if (sacola.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; width: 100%; padding: 50px;">
        <h2>Sua Sacola</h2>
        <p>Sua sacola está vazia. Volte para a página de produtos!</p>
        <a href="produtos.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #000; color: #fff; text-decoration: none;">Ver Produtos</a>
      </div>
    `;
    return;
  }

  cartGrid.innerHTML = "";
  summaryItems.innerHTML = "";
  let valorTotal = 0;

  sacola.forEach((produto, index) => {
    const imagem = produto.imagem_url ? produto.imagem_url : "https://via.placeholder.com/80?text=Sem+Imagem";
    const preco = parseFloat(produto.preco);
    const subtotal = preco * produto.quantidade;

    const article = document.createElement("article");
    article.className = "cart-item";
    article.innerHTML = `
      <img src="${imagem}" alt="${produto.nome}" class="cart-item-image">
      <div class="cart-item-details">
        <h3 class="cart-item-title">${produto.nome} ${produto.quantidade > 1 ? `(x${produto.quantidade})` : ''}</h3>
        <span class="cart-item-label">VALOR:</span>
        <span class="cart-item-price">R$ ${preco.toFixed(2).replace('.', ',')}</span>
      </div>
      <button class="btn-remover" data-index="${index}" style="background: none; border: none; color: red; cursor: pointer; font-weight: bold; font-size: 1.2rem; padding: 0 10px;">X</button>
    `;
    cartGrid.appendChild(article);

    const summaryRow = document.createElement("div");
    summaryRow.className = "summary-row";
    summaryRow.innerHTML = `
      <span class="summary-name">${produto.nome} ${produto.quantidade > 1 ? `(x${produto.quantidade})` : ''}</span>
      <span class="summary-price">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
    `;
    summaryItems.appendChild(summaryRow);

    valorTotal += subtotal;
  });

  totalValueEl.innerText = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;

  let boxSummary = document.querySelector(".summary-box");
  if (!document.getElementById("btn-finalizar-novo")) {
     const btnFinalizar = document.createElement("button");
     btnFinalizar.id = "btn-finalizar-novo";
     btnFinalizar.innerText = "FINALIZAR COMPRA";
     btnFinalizar.style.cssText = "width: 100%; background-color: #000; color: #fff; border: none; padding: 15px; cursor: pointer; font-weight: bold; margin-top: 15px; border-radius: 8px;";
     btnFinalizar.addEventListener('click', finalizarCompra);
     boxSummary.appendChild(btnFinalizar);
  }

  const botoesRemover = container.querySelectorAll('.btn-remover');
  botoesRemover.forEach(botao => {
      botao.addEventListener('click', (e) => {
          const indexRemover = e.target.getAttribute('data-index');
          sacola.splice(indexRemover, 1);
          localStorage.setItem('sacola', JSON.stringify(sacola));
          exibirSacola();
      });
  });
}
async function finalizarCompra() {

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você precisa estar logado para finalizar a compra.');
        return;
    }

    const sacola = JSON.parse(localStorage.getItem('sacola')) || [];

    if (sacola.length === 0) {
        alert('Sua sacola está vazia.');
        return;
    }

    const itens = sacola.map(item => ({
        produto_id: item.id,
        quantidade: item.quantidade
    }));

    try {
        const resposta = await fetch('http://localhost:3000/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ itens, observacao: null })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro || 'Erro ao finalizar o pedido. Tente novamente.');
            return;
        }

        localStorage.removeItem('sacola');
        window.location.href = dados.link;

    } catch (erro) {
        alert('Não foi possível conectar ao servidor. Tente novamente.');
    }
}

const currentPath = window.location.pathname.toLowerCase();
const isProductPage = currentPath.endsWith('produtos.html') || currentPath.endsWith('/produtos') || currentPath.endsWith('/produtos/');

document.addEventListener("click", (event) => {
  const alvo = event.target instanceof Element ? event.target.closest(".products-dropdown a") : null;
  if (!alvo) {
    return;
  }

  const href = alvo.getAttribute("href") || "";
  if (!href.toLowerCase().includes("produtos")) {
    return;
  }

  const destinoUrl = new URL(href, window.location.href);
  const categoria = destinoUrl.searchParams.get("categoria") || "";
  const destino = `${destinoUrl.pathname}${destinoUrl.search}`;

  sessionStorage.setItem("shopBeautyCategoria", categoria);
  event.preventDefault();

  if (isProductPage) {
    const queryAtualizada = categoria ? `?categoria=${encodeURIComponent(categoria)}` : "";
    history.replaceState({}, "", `${window.location.pathname}${queryAtualizada}`);
    setCategoriaSelecionada(categoria);
    return;
  }

  window.location.assign(destino);
});

if (isProductPage) {
  inicializarFiltrosProdutos();
  carregarProdutos();
}

const isSacolaPage = currentPath.endsWith('sacola.html') || currentPath.endsWith('/sacola');

if (isSacolaPage) {
  exibirSacola();
}