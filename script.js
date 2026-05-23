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
    
    try {
        const resposta = await fetch('http://localhost:3000/produtos');
        const produtos = await resposta.json();
        
        const container = document.querySelector('.page-content');
        if (!container) {
            return;
        }

        container.innerHTML = '<h1 class="page-title">Produtos</h1><div class="produtos-grid" style="display: flex; flex-wrap: wrap; gap: 20px;"></div>';
        
        const grid = document.querySelector('.produtos-grid');
        
        produtos.forEach(produto => {
            const card = document.createElement('div');
            card.style.border = "1px solid #ccc";
            card.style.padding = "15px";
            card.style.width = "250px";
            card.style.textAlign = "center";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.justifyContent = "between";
            
            const imagem = produto.imagem_url ? produto.imagem_url : 'https://via.placeholder.com/150?text=Sem+Imagem';
            
            card.innerHTML = 
                `<img src="${imagem}" alt="${produto.nome}" style="width: 100%; height: auto; max-width: 150px; margin: 0 auto;">
                <h3 style="font-size: 16px; margin: 10px 0;">${produto.nome}</h3>
                <p style="color: #666; font-size: 14px;">${produto.marca}</p>
                <p style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                <button class="btn-adicionar" style="background-color: #000; color: #fff; border: none; padding: 10px; cursor: pointer; font-weight: bold; margin-top: auto;">Adicionar à Sacola</button>`;
            
            const botao = card.querySelector('.btn-adicionar');
            botao.addEventListener('click', () => adicionarAoSacola(produto));
            
            grid.appendChild(card);
        });
        
    } catch (erro) {
        console.error(erro);
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
    
    const token = localStorage.getItem('token');
    const sacola = JSON.parse(localStorage.getItem('sacola')) || [];
    const container = document.querySelector('.page-content');

    if (!token) {
        container.innerHTML = 
            `<h1 class="page-title">Sua Sacola</h1>
            <p style="text-align: center; margin-top: 20px;">
                Você precisa estar logado para ver sua sacola.
            </p>`;
        return;
    }

    if (sacola.length === 0) {
        container.innerHTML = 
            `<h1 class="page-title">Sua Sacola</h1>
            <p style="text-align: center; margin-top: 20px;">Sua sacola está vazia. Volte para a página de produtos!</p>`;
        return;
    }

    container.innerHTML = 
        `<h1 class="page-title">Sua Sacola</h1>
        <div class="sacola-wrapper" style="display: flex; flex-direction: column; gap: 20px; max-width: 600px; margin: 0 auto;">
            <div class="itens-sacola"></div>
            <div class="resumo-sacola" style="border-top: 2px solid #000; padding-top: 15px; text-align: right;">
                <h3 id="total-sacola" style="font-size: 20px; font-weight: bold;">Total: R$ 0.00</h3>
                <button id="btn-limpar" style="background-color: #ff4d4d; color: #fff; border: none; padding: 10px; cursor: pointer; margin-right: 10px;">Limpar Sacola</button>
                <button id="btn-finalizar" style="background-color: #000; color: #fff; border: none; padding: 10px 20px; cursor: pointer; font-weight: bold;">Finalizar Compra</button>
            </div>
        </div>`;

    const listaItens = container.querySelector('.itens-sacola');
    let valorTotal = 0;

    sacola.forEach((produto, index) => {
        const itemRow = document.createElement('div');
        itemRow.style.display = 'flex';
        itemRow.style.alignItems = 'center';
        itemRow.style.justifyContent = 'space-between';
        itemRow.style.borderBottom = '1px solid #eee';
        itemRow.style.padding = '10px 0';

        const imagem = produto.imagem_url ? produto.imagem_url : 'https://via.placeholder.com/50?text=Sem+Imagem';
        
        itemRow.innerHTML = 
            `<img src="${imagem}" alt="${produto.nome}" style="width: 50px; height: auto;">
            <div style="flex-grow: 1; margin-left: 15px; text-align: left;">
                <h4 style="margin: 0; font-size: 16px;">${produto.nome}</h4>
                <p style="margin: 0; color: #666; font-size: 12px;">${produto.marca}</p>
            </div>
            <p style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">R$ ${parseFloat(produto.preco).toFixed(2)}</p>
            <button class="btn-remover" data-index="${index}" style="background: none; border: none; color: red; cursor: pointer; font-weight: bold;">X</button>`;

        listaItens.appendChild(itemRow);
        
        valorTotal += parseFloat(produto.preco) * produto.quantidade;
    });

    container.querySelector('#total-sacola').innerText = `Total: R$ ${valorTotal.toFixed(2)}`;

    container.querySelector('#btn-limpar').addEventListener('click', () => {
        localStorage.removeItem('sacola');
        exibirSacola();
    });

    container.querySelector('#btn-finalizar').addEventListener('click', finalizarCompra);

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

const isProductPage = window.location.pathname.toLowerCase().endsWith('produtos.html');

    if (isProductPage) {
      carregarProdutos();
}

const isSacolaPage = window.location.pathname.toLowerCase().endsWith('sacola.html');

    if (isSacolaPage) {
      exibirSacola();
}