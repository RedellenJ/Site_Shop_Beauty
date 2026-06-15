(function () {

  const style = document.createElement("style");

  style.textContent = `
    #toast-container {
      position: fixed;
      top: 20px;
      left: 50%;
      right: auto;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .toast-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px 28px;
      border-radius: 12px;
      border: 0.5px solid;
      font-size: 16px;
      font-family: sans-serif;
      max-width: 500px;
      pointer-events: all;
      animation: toastIn .25s ease;
      transition: opacity .3s ease, transform .3s ease;
    }
    .toast-item.hide {
      opacity: 0;
      transform: translateY(-12px);
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(-12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .toast-item.success {
      background: #eaf3de;
      border-color: #639922;
      color: #27500a;
    }
    .toast-item.error {
      background: #fcebeb;
      border-color: #a32d2d;
      color: #501313;
    }
    .toast-item.info {
      background: #e6f1fb;
      border-color: #185fa5;
      color: #0c447c;
    }
    .toast-icon { font-size: 18px; flex-shrink: 0; }`;
  
    document.head.appendChild(style);

  const container = document.createElement("div");
  container.id = "toast-container";
  document.body.appendChild(container);

  const icons = { success: "✔", error: "✖", info: "ℹ" };

  window.showToast = function (message, type = "info", duration = 3500) {
    const item = document.createElement("div");
    item.className = `toast-item ${type}`;
    item.innerHTML = `<span class="toast-icon">${icons[type] ?? "ℹ"}</span><span>${message}</span>`;
    container.appendChild(item);

    setTimeout(() => {
      item.classList.add("hide");
      setTimeout(() => item.remove(), 350);
    }, duration);
  };
})();

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
const registerForm = document.querySelector("#register-form");
const resetarForm = document.querySelector("#resetar-form");
const registerPhoneField = document.querySelector("#register-phone");
const recuperarForm = document.querySelector("#recuperar-form");
const passwordToggleButtons = document.querySelectorAll(".password-toggle[data-target]",);
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

if (productSearchInput) {
  productSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      carregarProdutosPorNome(productSearchInput.value);
    }
  });
}
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

const popupProdutoState = {
  produto: null,
  quantidade: 1,
  corSelecionada: "",
  elementos: null,
};

const apiBaseUrl = "https://siteshopbeauty-production.up.railway.app";

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
    localStorage.removeItem("sacola");
    atualizarAreaConta();
    showToast("Você saiu da sua conta.", "error");
    setTimeout(() => { window.location.href = "index.html"; }, 1500);
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
    showToast("Mensagem enviada com sucesso! Obrigado pelo contato.", "success");
    setTimeout(() => { window.location.href = mailtoUrl; }, 1500);
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
      showToast("Preencha e-mail e senha para continuar.", "error");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    const endpoint =
      loginForm.getAttribute("data-login-endpoint") ||
      "https://siteshopbeauty-production.up.railway.app/loginClientes";

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

      localStorage.setItem('token', payload.token)
      if (payload.nome) {
        localStorage.setItem("userName", formatarNomeUsuario(payload.nome));
      } else if (payload.email) {
        localStorage.setItem("userName", formatarNomeUsuario(payload.email.split("@")[0] || "Minha Conta"));
      }
      atualizarAreaConta();
      showToast(payload.mensagem || "Login realizado com sucesso.", "success");
      setTimeout(() => { window.location.href = "index.html"; }, 1500);
      return;

      } catch (error) {
        showToast(error instanceof Error ? error.message : "Não foi possível concluir o login agora.", "error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
  });
}

const currentPath = window.location.pathname.toLowerCase();

const isResetarPage = currentPath.endsWith('resetar-senha.html');
  if (isResetarPage) {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    atualizarAreaConta();
  }

if (recuperarForm) {
  recuperarForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailField = document.querySelector("#recuperar-email");
    const submitButton = recuperarForm.querySelector(".login-submit");
    const email = emailField ? emailField.value.trim() : "";

    if (!email) {
        showToast("Informe o e-mail para recuperar sua senha.", "error");
        return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    const endpoint =
      recuperarForm.getAttribute("data-forgot-endpoint") ||
      "https://siteshopbeauty-production.up.railway.app/recuperarSenha";

    try {
      const response = await fetch("https://siteshopbeauty-production.up.railway.app/recuperarSenha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload.erro || payload.mensagem || "Falha ao enviar e-mail de recuperação.",
        );
      }

      showToast(
        "Link de recuperação enviado com sucesso. Verifique seu e-mail.", "success");
        setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);

      recuperarForm.reset();
    } catch (error) {
        showToast(error instanceof Error ? error.message : "Não foi possível enviar o e-mail de recuperação agora.", "error");

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (resetarForm) {
  resetarForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const passwordField = document.querySelector("#reset-password");
    const confirmPasswordField = document.querySelector("#reset-password-confirm");
    const submitButton = resetarForm.querySelector(".login-submit");

    const senha = passwordField ? passwordField.value : "";
    const confirmaSenha = confirmPasswordField ? confirmPasswordField.value : "";
    const token = new URLSearchParams(window.location.search).get("token") || "";

    if (!token) {
        showToast("Link inválido ou expirado. Solicite uma nova recuperação de senha.", "error");
        return;
    }

    if (!senha || !confirmaSenha) {
        showToast("Preencha os dois campos de senha.", "error");
        return;
    }

    if (senha.length < 6) {
        showToast("A nova senha deve ter no mínimo 6 caracteres.", "error");
        return;
    }

    if (senha !== confirmaSenha) {
      showToast("As senhas precisam ser iguais.", "error");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    const endpoint =
      resetarForm.getAttribute("data-reset-endpoint") ||
      "https://siteshopbeauty-production.up.railway.app/resetarSenha";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ senha, token }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload.erro || payload.mensagem || "Falha ao redefinir senha.",
        );
      }

      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      atualizarAreaConta();

      showToast("Senha redefinida com sucesso!", "success");
      setTimeout(() => {
      window.close();
      }, 3000);
            
      resetarForm.reset();
    } catch (error) {
        showToast(error instanceof Error ? error.message : "Não foi possível redefinir sua senha agora.", "error");
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
        showToast("Preencha todos os campos para continuar.", "error");
        return;
    }

    if (!isValidPhoneDigits(telefone)) {
      if (registerPhoneField) {
        registerPhoneField.setCustomValidity("Informe um telefone com 11 dígitos.");
        registerPhoneField.reportValidity();
      }
      showToast("Telefone deve ter exatamente 11 dígitos.", "error");
      return;
    }

    if (registerPhoneField) {
      registerPhoneField.setCustomValidity("");
    }

    if (senha !== confirmaSenha) {
      showToast("As senhas precisam ser iguais.", "error");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    const endpoint =
      registerForm.getAttribute("data-register-endpoint") ||
      "https://siteshopbeauty-production.up.railway.app/cadastroClientes";

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

      showToast("Conta criada com sucesso! Redirecionando para o login...", "success");
      setTimeout(() => { window.location.href = "login.html"; }, 1500);

    } catch (error) {
        showToast(error instanceof Error ? error.message : "Não foi possível concluir o cadastro agora.", "error");
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

    if (!isProductPage) {
      const query = productsState.termoBusca
        ? `?search=${encodeURIComponent(productsState.termoBusca)}`
        : "";
      const destino = `produtos.html${query}`;
      window.location.assign(destino);
      return;
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

function obterCoresProduto(produto) {
  const colecao = [];

  const adicionarItem = (valor) => {
    if (Array.isArray(valor)) {
      valor.forEach((item) => adicionarItem(item));
      return;
    }

    const texto = (valor || "").toString().trim();
    if (!texto) {
      return;
    }

    const partes = texto.split(/[|,;\n]+/);
    partes
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => colecao.push(item));
  };

  adicionarItem(produto?.cor);
  adicionarItem(produto?.cores);
  adicionarItem(produto?.variacao_cor);
  adicionarItem(produto?.variacoes_cores);
  adicionarItem(produto?.tonalidades);

  return [...new Set(colecao)];
}

function obterDescricaoProduto(produto) {
  const descricao = (
    produto?.descricao
    || produto?.descricao_curta
    || produto?.descricaoCurta
    || produto?.description
    || ""
  ).toString().trim();

  return descricao;
}

function criarPopupProduto() {
  if (popupProdutoState.elementos) {
    return popupProdutoState.elementos;
  }

  const overlay = document.createElement("div");
  overlay.className = "produto-popup-overlay";
  overlay.hidden = true;

  overlay.innerHTML = `
    <div class="produto-popup" role="dialog" aria-modal="true" aria-labelledby="produto-popup-title">
      <button class="produto-popup-close" type="button" aria-label="Fechar pop-up">&times;</button>
      <div class="produto-popup-media">
        <img class="produto-popup-image" src="" alt="">
      </div>
      <div class="produto-popup-content">
        <h2 id="produto-popup-title" class="produto-popup-title"></h2>
        <p class="produto-popup-price"></p>
        <p class="produto-popup-pix"></p>
        <div class="produto-popup-description-block">
          <p class="produto-popup-description-label">Descrição:</p>
          <p class="produto-popup-description-text"></p>
        </div>
        <p class="produto-popup-color-title">Cor: <strong class="produto-popup-color-selected"></strong></p>
        <div class="produto-popup-colors"></div>
        <div class="produto-popup-actions-row">
          <div class="produto-popup-quantity" aria-label="Selecionar quantidade">
            <button class="produto-popup-qty-btn" type="button" data-action="decrease" aria-label="Diminuir quantidade">-</button>
            <span class="produto-popup-qty-value">1</span>
            <button class="produto-popup-qty-btn" type="button" data-action="increase" aria-label="Aumentar quantidade">+</button>
          </div>
          <button class="produto-popup-buy" type="button">Comprar</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const elementos = {
    overlay,
    container: overlay.querySelector(".produto-popup"),
    closeButton: overlay.querySelector(".produto-popup-close"),
    image: overlay.querySelector(".produto-popup-image"),
    title: overlay.querySelector(".produto-popup-title"),
    price: overlay.querySelector(".produto-popup-price"),
    pix: overlay.querySelector(".produto-popup-pix"),
    descriptionLabel: overlay.querySelector(".produto-popup-description-label"),
    descriptionText: overlay.querySelector(".produto-popup-description-text"),
    colorTitle: overlay.querySelector(".produto-popup-color-title"),
    colorSelected: overlay.querySelector(".produto-popup-color-selected"),
    colors: overlay.querySelector(".produto-popup-colors"),
    qtyValue: overlay.querySelector(".produto-popup-qty-value"),
    buyButton: overlay.querySelector(".produto-popup-buy"),
  };

  const atualizarQuantidade = (passo) => {
    const novoValor = popupProdutoState.quantidade + passo;
    popupProdutoState.quantidade = Math.max(1, Math.min(99, novoValor));
    elementos.qtyValue.textContent = String(popupProdutoState.quantidade);
  };

  const fecharPopup = () => {
    overlay.hidden = true;
    document.body.classList.remove("produto-popup-open");
    popupProdutoState.produto = null;
  };

  overlay.addEventListener("click", (event) => {
    const alvoFechar = event.target instanceof Element
      ? event.target.closest(".produto-popup-close")
      : null;

    if (alvoFechar) {
      event.preventDefault();
      event.stopPropagation();
      fecharPopup();
      return;
    }

    if (event.target === overlay) {
      fecharPopup();
    }
  });

  elementos.closeButton.addEventListener("click", fecharPopup);

  overlay.querySelectorAll(".produto-popup-qty-btn").forEach((botao) => {
    botao.addEventListener("click", () => {
      const passo = botao.dataset.action === "decrease" ? -1 : 1;
      atualizarQuantidade(passo);
    });
  });

  elementos.buyButton.addEventListener("click", () => {
    if (!popupProdutoState.produto) {
      return;
    }

    adicionarAoSacola(popupProdutoState.produto, popupProdutoState.quantidade);
    fecharPopup();
  });

  document.addEventListener("keydown", (event) => {
    if (!overlay.hidden && event.key === "Escape") {
      fecharPopup();
    }
  });

  popupProdutoState.elementos = {
    ...elementos,
    fecharPopup,
  };

  return popupProdutoState.elementos;
}

function abrirPopupProduto(produto) {
  if (!isProductPage || !produto) {
    return;
  }

  const elementos = criarPopupProduto();
  popupProdutoState.produto = produto;
  popupProdutoState.quantidade = 1;

  const imagem = produto.imagem_url || "https://via.placeholder.com/400x400?text=Sem+Imagem";
  const preco = Number(produto.preco || 0);
  const precoPix = preco * 0.95;
  const nome = formatarTituloTexto(produto.nome) || "Produto";
  const marca = formatarTituloTexto(produto.marca) || "Sem marca";
  const descricao = obterDescricaoProduto(produto);
  const cores = obterCoresProduto(produto);
  const primeiraCor = cores[0] || "Cor única";

  popupProdutoState.corSelecionada = primeiraCor;

  elementos.image.src = imagem;
  elementos.image.alt = nome;
  elementos.title.textContent = `${nome} - ${marca}`;
  elementos.price.textContent = formatarPreco(preco);
  elementos.pix.textContent = `${formatarPreco(precoPix)} com Pix`;
  elementos.descriptionText.textContent = descricao || "Sem descrição disponível para este produto.";
  elementos.qtyValue.textContent = "1";
  elementos.colorSelected.textContent = primeiraCor;

  elementos.colors.innerHTML = "";

  if (cores.length <= 1) {
    elementos.colorTitle.hidden = true;
    elementos.colors.hidden = true;
  } else {
    elementos.colorTitle.hidden = false;
    elementos.colors.hidden = false;

    cores.forEach((cor, index) => {
      const botaoCor = document.createElement("button");
      botaoCor.className = "produto-popup-color-btn";
      botaoCor.type = "button";
      botaoCor.textContent = cor;
      botaoCor.setAttribute("aria-pressed", index === 0 ? "true" : "false");
      if (index === 0) {
        botaoCor.classList.add("is-active");
      }

      botaoCor.addEventListener("click", () => {
        popupProdutoState.corSelecionada = cor;
        elementos.colorSelected.textContent = cor;
        elementos.colors.querySelectorAll(".produto-popup-color-btn").forEach((item) => {
          const ativo = item === botaoCor;
          item.classList.toggle("is-active", ativo);
          item.setAttribute("aria-pressed", ativo ? "true" : "false");
        });
      });

      elementos.colors.appendChild(botaoCor);
    });
  }

  elementos.overlay.hidden = false;
  document.body.classList.add("produto-popup-open");
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

    const imagemBox = card.querySelector(".produto-imagem-box");
    if (imagemBox) {
      imagemBox.setAttribute("role", "button");
      imagemBox.setAttribute("tabindex", "0");
      imagemBox.setAttribute("aria-label", `Abrir detalhes de ${nomeFormatado}`);
      imagemBox.addEventListener("click", () => abrirPopupProduto(produto));
      imagemBox.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          abrirPopupProduto(produto);
        }
      });
    }

    const botao = card.querySelector(".btn-adicionar");
    botao.addEventListener("click", () => abrirPopupProduto(produto));

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

function obterTermoBuscaDaUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("search") || "";
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

  const termoBuscaUrl = obterTermoBuscaDaUrl();
  if (termoBuscaUrl) {
    productsState.termoBusca = termoBuscaUrl.trim();
    if (productSearchInput) {
      productSearchInput.value = productsState.termoBusca;
    }
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

}

function adicionarAoSacola(produto, quantidade = 1) {

    const qtdSelecionada = Number.isFinite(Number(quantidade))
      ? Math.max(1, Math.floor(Number(quantidade)))
      : 1;

    const token = localStorage.getItem('token');

    if (!token) {
        showToast('Você precisa estar logado para adicionar produtos à sacola.', 'error');
        setTimeout(() => { window.location.href = 'login.html'; }, 2000);
        return;
    }

    let sacola = JSON.parse(localStorage.getItem('sacola')) || [];

    const index = sacola.findIndex(item => item.id === produto.id)

    if (index >= 0) {
      sacola[index].quantidade += qtdSelecionada
      showToast(`Quantidade de "${formatarTituloTexto(produto.nome)}" atualizada para ${sacola[index].quantidade}!`, 'info');
    } else {
      sacola.push({ ...produto, quantidade: qtdSelecionada })
      showToast(`"${formatarTituloTexto(produto.nome)}" adicionado à sua sacola!`, 'success');
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
  const logoFundo = document.querySelector('.sacola-ajuste');

  const fundoLogoSacola = document.getElementById("fundo-logo-sacola");
  if (fundoLogoSacola) {
      if (sacola.length === 0) {
        fundoLogoSacola.classList.remove("esconder-fundo");
      } else {
        fundoLogoSacola.classList.add("esconder-fundo");
      }
  }

if (!container || !cartGrid || !summaryItems || !totalValueEl) {
  return;
}

if (logoFundo) logoFundo.style.display = 'none';

 if (!token) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <h2 class="cart-empty-title">Sua Sacola</h2>
        <p class="cart-empty-text">Você precisa estar logado para ver sua sacola.</p>
        <a class="cart-empty-cta" href="login.html">Fazer Login</a>
      </div>
    `;
    return;
  }

 if (sacola.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <p class="cart-empty-text cart-empty-text--large">Sua sacola está vazia. Volte para a página de produtos!</p>
        <a class="cart-empty-cta" href="produtos.html">Ver Produtos</a>
      </div>
    `;
    return;
  }
  
  if (logoFundo) logoFundo.style.display = 'block';

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
        <h3 class="cart-item-title">${produto.nome}</h3>
        <span class="cart-item-label">VALOR:</span>
        <span class="cart-item-price">R$ ${preco.toFixed(2).replace('.', ',')}</span>
        
        <div class="cart-qty-control">
          <button class="btn-diminuir cart-qty-btn" data-index="${index}" type="button">-</button>
          <input
            class="cart-qty-input"
            data-index="${index}"
            type="number"
            min="1"
            step="1"
            inputmode="numeric"
            value="${produto.quantidade}"
            aria-label="Quantidade de ${produto.nome}"
          />
          <button class="btn-aumentar cart-qty-btn" data-index="${index}" type="button">+</button>
        </div>
      </div>
      <button class="btn-remover" data-index="${index}">X</button>
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
     btnFinalizar.addEventListener('click', finalizarCompra);
     boxSummary.appendChild(btnFinalizar);
  }

  const botoesRemover = container.querySelectorAll('.btn-remover');
  botoesRemover.forEach(botao => {
      botao.addEventListener('click', () => {
          const indexRemover = Number(botao.getAttribute('data-index'));
          const nomeProduto = formatarTituloTexto(sacola[indexRemover]?.nome) || "Produto";         
          sacola.splice(indexRemover, 1);
          localStorage.setItem('sacola', JSON.stringify(sacola));
          exibirSacola();
        showToast(`"${nomeProduto}" removido da sacola.`, 'error');
      });
    });

  const botoesAumentar = container.querySelectorAll('.btn-aumentar');
  botoesAumentar.forEach(botao => {
      botao.addEventListener('click', (e) => {
        const index = Number(e.currentTarget.getAttribute('data-index'));
          sacola[index].quantidade += 1;
          localStorage.setItem('sacola', JSON.stringify(sacola));
          exibirSacola();
      });
  });

  const botoesDiminuir = container.querySelectorAll('.btn-diminuir');
  botoesDiminuir.forEach(botao => {
      botao.addEventListener('click', (e) => {
        const index = Number(e.currentTarget.getAttribute('data-index'));
          if (sacola[index].quantidade > 1) {
              sacola[index].quantidade -= 1;
              localStorage.setItem('sacola', JSON.stringify(sacola));
              exibirSacola();
          }
      });
  });

        const camposQuantidade = container.querySelectorAll('.cart-qty-input');
        camposQuantidade.forEach(campo => {
          campo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          });

          campo.addEventListener('change', (e) => {
            const index = Number(e.currentTarget.getAttribute('data-index'));
            const valorDigitado = Number.parseInt(e.currentTarget.value, 10);
            const novaQuantidade = Number.isFinite(valorDigitado) && valorDigitado > 0 ? valorDigitado : 1;

            sacola[index].quantidade = novaQuantidade;
            localStorage.setItem('sacola', JSON.stringify(sacola));
            exibirSacola();
          });
        });
}

function exibirPopupPedidoConcluido() {
  
  const overlay = document.createElement("div");
  
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(18, 14, 14, 0.66);
    display: flex; align-items: center; justify-content: center;
    z-index: 99999;
  `;

  overlay.innerHTML = `
    <div style="
      background: #fff; border-radius: 18px; padding: 44px 40px;
      max-width: 420px; width: 90%; text-align: center;
      box-shadow: 0 24px 50px rgba(0,0,0,0.28);
    ">
      <div style="
        width: 64px; height: 64px; border-radius: 50%;
        background-color: #e7a9a5; display: flex;
        align-items: center; justify-content: center;
        margin: 0 auto 20px; font-size: 32px; color: #fff;
        ">✔</div>
      <h2 style="
        margin: 0 0 14px; font-size: 26px; color: #111;
        font-family: Arial, Helvetica, sans-serif; font-weight: 800;
      ">Pedido realizado com sucesso!</h2>
      <p style="
        margin: 0 0 28px; color: #555; font-size: 16px;
        line-height: 1.6; font-family: Arial, Helvetica, sans-serif;
      ">
        Seu pedido foi enviado para o WhatsApp.<br>
        Em breve entraremos em contato para confirmar e finalizar sua compra.
        Agradeçemos a preferência!
      </p>
      <button id="popup-pedido-ok" style="
        background-color: #cd7f7a; color: #fff; border: none;
        border-radius: 6px; padding: 14px 40px;
        font-size: 20px; font-weight: 800; cursor: pointer;
        font-family: Arial, Helvetica, sans-serif;
        transition: opacity 0.2s ease;
      " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
        OK
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("popup-pedido-ok").addEventListener("click", () => {
    overlay.remove();
    window.location.href = "index.html";
  });
}

async function finalizarCompra() {

    const token = localStorage.getItem('token');

    if (!token) {
        showToast('Você precisa estar logado para finalizar a compra.', 'error');
        return;
    }

    const sacola = JSON.parse(localStorage.getItem('sacola')) || [];

    if (sacola.length === 0) {
        showToast('Sua sacola está vazia.', 'info');
        return;
    }

    const itens = sacola.map(item => ({
        produto_id: item.id,
        quantidade: item.quantidade
    }));

    try {
        const resposta = await fetch('https://siteshopbeauty-production.up.railway.app/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ itens, observacao: null })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            showToast(dados.erro || 'Erro ao finalizar o pedido. Tente novamente.', 'error');
            return;
        }

      localStorage.removeItem('sacola');
      window.open(dados.link, '_blank');
      exibirPopupPedidoConcluido();

    } catch (erro) {
        showToast('Não foi possível conectar ao servidor. Tente novamente.', 'error');
    }
}

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

const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');

if (searchInput && searchSuggestions) {
  let debounceTimer;
  let activeSuggestionIndex = -1;

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);

    const q = searchInput.value.trim();

    if (q.length < 2) {
      fecharSugestoes();
      return;
    }

    buscarSugestoes(q)
  });

  async function buscarSugestoes(q) {
    try {
      const res = await fetch(`${apiBaseUrl}/filtroProdutoNome?nome=${encodeURIComponent(q)}`);
      const produtos = await res.json();
      const comImagem = produtos.filter((p) => p.imagem_url);
      renderizarSugestoes(comImagem);
    } catch (err) {
      console.error('Erro na busca:', err);
      showToast("Erro ao buscar produtos. Tente novamente.", "error");
    }
  }

  window.buscarSugestoes = buscarSugestoes;

  function renderizarSugestoes(produtos) {
    searchSuggestions.innerHTML = '';

    if (!produtos.length) {
      searchSuggestions.innerHTML = '<li style="padding: 12px; color: #888; font-size: 14px; cursor: default;">Nenhum produto encontrado.</li>';
      searchSuggestions.style.display = 'block';
      return;
    }

    activeSuggestionIndex = -1;
    const itens = produtos.slice(0, 8);
    itens.forEach((p, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${p.imagem_url ? `<img src="${p.imagem_url}" alt="${p.nome}">` : ''}
        <span class="produto-nome">${formatarTituloTexto(p.nome)}</span>
        <span class="produto-preco">${formatarPreco(p.preco)}</span>
      `;
      li.addEventListener('click', () => {
        window.location.href = `produtos.html?search=${encodeURIComponent(p.nome)}`;
      });
      searchSuggestions.appendChild(li);
      li.dataset.suggestionIndex = String(idx);
    });

    searchSuggestions.style.display = 'block';
    const menuEl = document.querySelector('.menu');
    if (menuEl) menuEl.classList.add('menu--disabled');
  }

  function fecharSugestoes() {
    searchSuggestions.style.display = 'none';
    searchSuggestions.innerHTML = '';
    const menuEl = document.querySelector('.menu');
    if (menuEl) menuEl.classList.remove('menu--disabled');
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search')) {
      fecharSugestoes();
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    const items = Array.from(searchSuggestions.querySelectorAll('li'));
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, items.length - 1);
      items.forEach((it, i) => it.classList.toggle('selected', i === activeSuggestionIndex));
      items[activeSuggestionIndex].scrollIntoView({ block: 'nearest' });
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, 0);
      items.forEach((it, i) => it.classList.toggle('selected', i === activeSuggestionIndex));
      items[activeSuggestionIndex].scrollIntoView({ block: 'nearest' });
      return;
    }

    if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && items[activeSuggestionIndex]) {
        e.preventDefault();
        items[activeSuggestionIndex].click();
        return;
      }
      e.preventDefault();
      const q = searchInput.value.trim();
      if (q.length >= 1) {
        buscarSugestoes(q);
      }
    }
  });
}