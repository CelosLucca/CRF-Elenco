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
    

    const nome = document.createElement('h1');
    nome.innerHTML = dados.nome;
    body.appendChild(nome);

    const nomeCompleto = document.createElement('h2');
    nomeCompleto.innerHTML = `Nome completo: ${dados.nome_completo}`;
    nomeCompleto.style.color = '#666';
    body.appendChild(nomeCompleto);

    const imagem = document.createElement('img');
    imagem.alt = 'imagem do atleta';
    imagem.src = dados.imagem;
    body.appendChild(imagem);

    const posicao = document.createElement('p');
    posicao.innerText = `Posição: ${dados.posicao}`;
    posicao.style.fontSize = '18px';
    posicao.style.fontWeight = 'bold';
    body.appendChild(posicao);

    const nascimento = document.createElement('p');
    nascimento.innerText = `Data de nascimento: ${dados.nascimento}`;
    body.appendChild(nascimento);

    const cidadeOrigem = document.createElement('p'); 
    cidadeOrigem.innerText = `Cidade de origem: ${dados.cidade_origem}`;
    body.appendChild(cidadeOrigem);

   const botaoVoltar = document.createElement('button');
   botaoVoltar.innerText = 'Voltar';
   botaoVoltar.addEventListener('click', () => {
       window.history.back();
   });
   body.appendChild(botaoVoltar);
};
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


