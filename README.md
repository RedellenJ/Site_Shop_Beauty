<p align="center">
<img width="150" height="150" alt="Logo3" src="https://github.com/user-attachments/assets/dae31f00-5b51-40c6-a720-7422e496c81e" />
</p>

<h1 align="center">Shop Beauty</h1>

<p align="center">
  Plataforma web da Shop Beauty com catálogo de produtos, autenticação de clientes e integração com backend em Node.js + Supabase.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-239415?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-344532?style=for-the-badge" alt="Frontend" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-000000?style=for-the-badge" alt="Backend" />
  <img src="https://img.shields.io/badge/Database-Supabase-239415?style=for-the-badge" alt="Supabase" />
</p>

---


## Sobre

O projeto foi desenvolvido para oferecer uma experiência completa de e-commerce no segmento de beleza, com foco em:

- navegação intuitiva
- identidade visual da marca
- performance para catálogo de produtos
- fluxo simples de cadastro, login e pedido

## Prints do sistema

Home
<img width="1911" height="934" alt="home1" src="https://github.com/user-attachments/assets/77355baf-3740-466b-8972-30173559cdb7" />
---
Produto
<img width="1904" height="1079" alt="image" src="https://github.com/user-attachments/assets/fe2fb413-09f6-40ed-9c6a-914aa60b6580" />
---
Cadastro
<img width="1900" height="1079" alt="image" src="https://github.com/user-attachments/assets/a64a292f-d537-425e-adc3-20ce8145c86b" />
---
Login
<img width="1900" height="1077" alt="image" src="https://github.com/user-attachments/assets/fee7a959-cfca-4b8f-b385-657f9a822b85" />
---
Contato
<img width="1898" height="1079" alt="image" src="https://github.com/user-attachments/assets/8b895612-0f96-4416-b33f-9be1a6ac3d0b" />
---
Barra de pesquisa
<img width="887" height="621" alt="GifJs1" src="https://github.com/user-attachments/assets/1787564c-f22f-4d37-aeda-ec62fc91d7e4" />
---
Rodapé
<img width="1900" height="341" alt="image" src="https://github.com/user-attachments/assets/49dbb941-c099-476f-8a98-4e43f57420b3" />


## Funcionalidades

- Banner rotativo na página inicial
- Catálogo de produtos com filtros e busca por nome
- Barra de pesquisa com sugestões
- Cadastro e login de clientes
- Sessão persistida no navegador via token
- Criação de pedidos com link automático para WhatsApp
- Páginas institucionais: contato, quem somos, política de privacidade e trocas/devoluções
- VLibras

## Stack utilizada

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express
- Supabase

## Estrutura de pastas

```text
Site_Shop_Beauty/
  backend/
    middleware.js
    server.js
    supabase.js
    package.json
  Img/
    Background/
    Logos/
  cadastro.html
  contato.html
  index.html
  login.html
  politica-de-privacidade.html
  produtos.html
  quem-somos.html
  recuperar-senha.html
  resetarSenha.html
  sacola.html
  script.js
  style.css
  trocas-devolucoes.html
```

## Como rodar localmente

### 1. Iniciar backend

```powershell
cd "C:\Users\User\Desktop\Area De Trabalho\Repositorio Local\Site_Shop_Beauty\backend"
npm.cmd install
npm.cmd run dev
```

API disponível em:

- http://localhost:3000

### 2. Iniciar frontend

Em outro terminal:

```powershell
cd "C:\Users\User\Desktop\Area De Trabalho\Repositorio Local\Site_Shop_Beauty"
npx.cmd -y http-server -p 5500 .
```

Frontend disponível em:

- http://127.0.0.1:5500/index.html

## Variáveis de ambiente

Crie um arquivo .env em backend/ com:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_do_supabase
JWT_SECRET=seu_segredo_jwt
PORT=3000
```

## Próximos passos

- publicar deploy do frontend e backend

# Autores

Redellen Junior
  <a href="https://github.com/RedellenJ">
    <img src="https://img.shields.io/static/v1?message=GitHub&logo=github&label=&color=181717&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="github logo" />
  </a> <br> 
  ---
Emmanuel Andrade
  <a href="https://github.com/emmanuel-andrade4">
    <img src="https://img.shields.io/static/v1?message=GitHub&logo=github&label=&color=181717&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="github logo" />
  </a> <br>
  ---
Eduardo Mendes
  <a href="https://github.com/eduardo-es">
    <img src="https://img.shields.io/static/v1?message=GitHub&logo=github&label=&color=181717&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="github logo" />
  </a> <br>
  ---
Vinícius Lemes Cazelato
  <a href="https://github.com/ViniciusLC-30">
    <img src="https://img.shields.io/static/v1?message=GitHub&logo=github&label=&color=181717&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="github logo" />
  </a> <br>
  ---
Matheus Souza Reys
  <a href="https://github.com/MatheusReys">
    <img src="https://img.shields.io/static/v1?message=GitHub&logo=github&label=&color=181717&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="github logo" />
  </a>
  ---
