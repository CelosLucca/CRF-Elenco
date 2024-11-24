const url = "https://botafogo-atletas.mange.li/2024-1/";
const inputBusca = document.getElementById("busca");
const container = document.getElementById("container");

let jogadoresAtuais = [];
let generoSelecionado = null;

const carregarConteudoProtegido = (genero) => {
    generoSelecionado = genero;

    pega_json(`${url}${genero}`).then((jogadores) => {
        jogadoresAtuais = jogadores;
        if (jogadoresAtuais.length > 0) {
            atualizarJogadores(jogadoresAtuais);
            container.style.display = "flex";
        } else {
            container.style.display = "none";
            exibirMensagemErro("Nenhum jogador encontrado para o gÃªnero selecionado.");
        }
    }).catch(() => {
        exibirMensagemErro("Erro ao carregar os dados. Por favor, tente novamente mais tarde.");
    });
};

const atualizarJogadores = (jogadores) => {
    container.innerHTML = "";

    const totalJogadores = Math.ceil(jogadores.length / 5) * 5;

    for (let i = 0; i < totalJogadores; i++) {
        if (i < jogadores.length) {
            container.appendChild(montaCard(jogadores[i]));
        } else {
            container.appendChild(criaPlaceholder());
        }
    }
};

const handleInputChange = () => {
    const termoBusca = inputBusca.value.toLowerCase().trim();

    const jogadoresFiltrados = jogadoresAtuais.filter(
        (jogador) =>
            jogador.nome.toLowerCase().includes(termoBusca) ||
            String(jogador.id).includes(termoBusca)
    );

    if (jogadoresFiltrados.length > 0) {
        atualizarJogadores(jogadoresFiltrados);
        container.style.display = "flex";
    } else {
        container.style.display = "none";
    }
};

const manipulaLogout = () => {
    sessionStorage.removeItem("logado");
    location.reload();
    window.location.href =`index.html`;
};

const manipulaCLick = (e) => {
    const id = e.currentTarget.dataset.id;
    const redirecionaUrl = `detalhes.html?id=${id}`;

    localStorage.setItem("id", id);
    localStorage.setItem("dados", JSON.stringify(e.currentTarget.dataset));
    sessionStorage.setItem("id", id);
    sessionStorage.setItem("dados", JSON.stringify(e.currentTarget.dataset));

    window.location.href = redirecionaUrl;
};

const pega_json = async (caminho) => {
    try {
        const resposta = await fetch(caminho);
        const dados = await resposta.json();
        return dados;
    } catch (error) {
        console.error("Erro ao buscar JSON:", error);
        throw error;
    }
};

const montaCard = (atleta) => {
    const cartao = document.createElement("article");
    const nome = document.createElement("h1");
    const imagem = document.createElement("img");
    const detalhes = document.createElement("p");

    nome.innerText = atleta.nome;
    nome.style.fontFamily = "sans-serif";
    cartao.appendChild(nome);

    imagem.src = atleta.imagem;
    imagem.alt = atleta.nome;
    cartao.appendChild(imagem);

    cartao.appendChild(detalhes);

    cartao.dataset.id = atleta.id;
    cartao.dataset.nJogos = atleta.n_jogos;

    cartao.onclick = manipulaCLick;

    return cartao;
};


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("logout").onclick = manipulaLogout;
    
    document.getElementById("masculino").addEventListener("click", () => {
        carregarConteudoProtegido("masculino");
    });

    document.getElementById("feminino").addEventListener("click", () => {
        carregarConteudoProtegido("feminino");
    });

    document.getElementById("todos").addEventListener("click", () => {
        carregarConteudoProtegido("all");
    });

    inputBusca.addEventListener("input", handleInputChange);
    });



