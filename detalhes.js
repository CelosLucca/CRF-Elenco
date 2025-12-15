const params = new URLSearchParams(window.location.search);

const id = params.get("id");

const container = document.getElementById("container");

const pega_json = async (caminho) => {
    const resposta = await fetch(caminho);
    const dados = await resposta.json();
    return dados;
}

const dadosSessionStorage = sessionStorage.getItem('dados');
const obj = JSON.parse(dadosSessionStorage);

const achaCookie = (chave) => {
    const lista = document.cookie.split('; ');
    const par = lista.find(
        (ele) => ele.startsWith(`${chave}=`)
    )

    return par.split('=')[1];
}

const montaPagina = (dados) => {
    const body = document.body;
    body.innerHTML = '';
    
    // Container principal
    const container = document.createElement('div');
    container.className = 'detalhes-container';
    
    // Seção esquerda (informações)
    const leftSection = document.createElement('div');
    leftSection.className = 'info-section';
    
    const nome = document.createElement('h1');
    nome.innerHTML = dados.nome.toUpperCase();
    nome.className = 'player-name';
    leftSection.appendChild(nome);
    
    const underline = document.createElement('div');
    underline.className = 'name-underline';
    leftSection.appendChild(underline);
    
    // Container de stats
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-container';
    
    const idade = calcularIdade(dados.nascimento);
    
    const statAge = createStat(idade, 'IDADE');
    const statNumber = createStat(dados.numero, 'NÚMERO\nDA CAMISA');
    
    statsContainer.appendChild(statAge);
    statsContainer.appendChild(statNumber);
    leftSection.appendChild(statsContainer);
    
    // Tag de posição
    const positionTag = document.createElement('div');
    positionTag.className = 'position-tag';
    positionTag.innerHTML = `<span class="position-abbr">${getPosicaoAbrev(dados.posicao)}</span> ${dados.posicao}`;
    leftSection.appendChild(positionTag);
    
    // Informações adicionais
    const infoList = document.createElement('div');
    infoList.className = 'info-list';
    
    const nomeCompleto = document.createElement('p');
    nomeCompleto.innerHTML = `<strong>Nome completo:</strong> ${dados.nome_completo}`;
    infoList.appendChild(nomeCompleto);
    
    const nascimento = document.createElement('p');
    nascimento.innerHTML = `<strong>Data de nascimento:</strong> ${dados.nascimento}`;
    infoList.appendChild(nascimento);
    
    const cidadeOrigem = document.createElement('p');
    cidadeOrigem.innerHTML = `<strong>Cidade de origem:</strong> ${dados.cidade_origem}`;
    infoList.appendChild(cidadeOrigem);
    
    leftSection.appendChild(infoList);
    
    // Botão voltar
    const botaoVoltar = document.createElement('button');
    botaoVoltar.innerText = 'Voltar';
    botaoVoltar.className = 'btn-voltar';
    botaoVoltar.addEventListener('click', () => {
        window.history.back();
    });
    leftSection.appendChild(botaoVoltar);
    
    // Seção direita (imagem)
    const rightSection = document.createElement('div');
    rightSection.className = 'image-section';
    
    const imagem = document.createElement('img');
    imagem.alt = dados.nome;
    imagem.src = dados.imagem;
    imagem.className = 'player-image';
    rightSection.appendChild(imagem);
    
    container.appendChild(leftSection);
    container.appendChild(rightSection);
    body.appendChild(container);
};

function createStat(value, label) {
    const stat = document.createElement('div');
    stat.className = 'stat-item';
    
    const statValue = document.createElement('div');
    statValue.className = 'stat-value';
    statValue.textContent = value;
    
    const statLabel = document.createElement('div');
    statLabel.className = 'stat-label';
    statLabel.textContent = label;
    
    stat.appendChild(statValue);
    stat.appendChild(statLabel);
    return stat;
}

function calcularIdade(nascimento) {
    const [dia, mes, ano] = nascimento.split('/');
    const dataNasc = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const m = hoje.getMonth() - dataNasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
        idade--;
    }
    return idade;
}

function getPosicaoAbrev(posicao) {
    const abrev = {
        'Goleiro': 'GK',
        'Goleira': 'GK',
        'Zagueiro': 'CB',
        'Zagueira': 'CB',
        'Lateral-direito': 'RB',
        'Lateral-esquerdo': 'LB',
        'Lateral-direita': 'RB',
        'Lateral-esquerda': 'LB',
        'Lateral': 'FB',
        'Meia': 'MF',
        'Atacante': 'FW'
    };
    return abrev[posicao] || 'PL';
}
if(sessionStorage.getItem("logado")){
    // Buscar o jogador específico no JSON do Flamengo
    pega_json('flamengo-atletas.json').then((jogadores) => {
        const jogador = jogadores.find(j => j.id == id);
        if (jogador) {
            montaPagina(jogador);
        } else {
            document.body.innerHTML = "<h1>Jogador não encontrado</h1>";
        }
    }).catch(() => {
        document.body.innerHTML = "<h1>Erro ao carregar dados do jogador</h1>";
    });
} else {
    document.body.innerHTML = "<h1>Você precisa estar logado para ter acesso</h1>";
}


