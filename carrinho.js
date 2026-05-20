function exibirSacola() {
    const sacola = JSON.parse(localStorage.getItem('sacola')) || [];
    const container = document.querySelector('.page-content');
    
    if (sacola.length === 0) {
        container.innerHTML = `
            <h1 class="page-title">Sua Sacola</h1>
            <p style="text-align: center; margin-top: 20px;">Sua sacola está vazia. Volte para a página de produtos!</p>
        `;
        return;
    }

    container.innerHTML = `
        <h1 class="page-title">Sua Sacola</h1>
        <div class="sacola-wrapper" style="display: flex; flex-direction: column; gap: 20px; max-width: 600px; margin: 0 auto;">
            <div class="itens-sacola"></div>
            <div class="resumo-sacola" style="border-top: 2px solid #000; padding-top: 15px; text-align: right;">
                <h3 id="total-sacola" style="font-size: 20px; font-weight: bold;">Total: R$ 0.00</h3>
                <button id="btn-limpar" style="background-color: #ff4d4d; color: #fff; border: none; padding: 10px; cursor: pointer; margin-right: 10px;">Limpar Sacola</button>
                <button style="background-color: #000; color: #fff; border: none; padding: 10px 20px; cursor: pointer; font-weight: bold;">Finalizar Compra</button>
            </div>
        </div>
    `;

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
        
        itemRow.innerHTML = `
            <img src="${imagem}" alt="${produto.nome}" style="width: 50px; height: auto;">
            <div style="flex-grow: 1; margin-left: 15px; text-align: left;">
                <h4 style="margin: 0; font-size: 16px;">${produto.nome}</h4>
                <p style="margin: 0; color: #666; font-size: 12px;">${produto.marca}</p>
            </div>
            <p style="font-weight: bold; margin: 0 20px;">R$ ${produto.preco}</p>
            <button class="btn-remover" data-index="${index}" style="background: none; border: none; color: red; cursor: pointer; font-weight: bold;">X</button>
        `;

        listaItens.appendChild(itemRow);
        
        valorTotal += parseFloat(produto.preco);
    });

    container.querySelector('#total-sacola').innerText = `Total: R$ ${valorTotal.toFixed(2)}`;

    container.querySelector('#btn-limpar').addEventListener('click', () => {
        localStorage.removeItem('sacola');
        exibirSacola();
    });

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

exibirSacola();