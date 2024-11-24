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

console.log('nJogos: ', obj.nJogos);

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

    const imagem = document.createElement('img');
    imagem.alt = 'imagem do atleta';
    imagem.src = dados.imagem;
    body.appendChild(imagem);

    const nJogos = document.createElement('p');
    nJogos.innerText = `Jogos pelo Botafogo: ${dados.n_jogos}`;
    body.appendChild(nJogos);

    const elenco = document.createElement('p');
    elenco.innerText = `Genero:  ${dados.elenco}`;
    body.appendChild(elenco);

    const noTimeDesde = document.createElement('p');
    noTimeDesde.innerText = `No Botafogo desde: ${dados.no_botafogo_desde}`;
    body.appendChild(noTimeDesde);

    const posicao = document.createElement('p');
    posicao.innerText = `Função: ${dados.posicao}`;
    body.appendChild(posicao);
 
   const detalhes = document.createElement('p');
   detalhes.innerText = `${dados.detalhes}`;
   body.appendChild(detalhes);

   const botaoVoltar = document.createElement('button');
   botaoVoltar.innerText = 'Voltar';
   botaoVoltar.addEventListener('click', () => {
       window.history.back();
   });
   body.appendChild(botaoVoltar);
};
if(sessionStorage.getItem("logado")){
    pega_json(`https://botafogo-atletas.mange.li/2024-1/${id}`).then(
        (r) => montaPagina(r)
    );
} else {
    document.body.innerHTML = "<h1>Você precisa estar logado para ter acesso</h1>";
}