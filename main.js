const url = "flamengo-atletas.json";
const inputBusca = document.getElementById("busca");
const container = document.getElementById("container");

let jogadoresAtuais = [];
let generoSelecionado = null;

const carregarConteudoProtegido = (genero) => {
    generoSelecionado = genero;

    pega_json(url).then((jogadores) => {
        let jogadoresFiltrados;
        
        if (genero === "all") {
            jogadoresFiltrados = jogadores;
        } else {
            jogadoresFiltrados = jogadores.filter(jogador => jogador.genero === genero);
        }
        
        jogadoresAtuais = jogadoresFiltrados;
        if (jogadoresAtuais.length > 0) {
            atualizarJogadores(jogadoresAtuais);
            container.style.display = "flex";
        } else {
            container.style.display = "none";
            exibirMensagemErro("Nenhum jogador encontrado para o gênero selecionado.");
        }
    }).catch(() => {
        exibirMensagemErro("Erro ao carregar os dados. Por favor, tente novamente mais tarde.");
    });
};

const agruparPorPosicao = (jogadores) => {
    const ordemPosicoes = ['Goleiro', 'Goleira', 'Zagueiro', 'Zagueira', 'Lateral-esquerdo', 'Lateral-direito', 'Lateral-esquerda', 'Lateral-direita', 'Meia', 'Atacante'];
    
    const grupos = {
        'Goleiros': [],
        'Zagueiros': [],
        'Laterais': [],
        'Meias': [],
        'Atacantes': []
    };

    jogadores.forEach(jogador => {
        const posicao = jogador.posicao;
        
        if (posicao === 'Goleiro' || posicao === 'Goleira') {
            grupos['Goleiros'].push(jogador);
        } else if (posicao === 'Zagueiro' || posicao === 'Zagueira') {
            grupos['Zagueiros'].push(jogador);
        } else if (posicao.includes('Lateral')) {
            grupos['Laterais'].push(jogador);
        } else if (posicao === 'Meia') {
            grupos['Meias'].push(jogador);
        } else if (posicao === 'Atacante') {
            grupos['Atacantes'].push(jogador);
        }
    });

    return grupos;
};

const atualizarJogadores = (jogadores) => {
    container.innerHTML = "";

    const grupos = agruparPorPosicao(jogadores);
    
    Object.keys(grupos).forEach(posicaoGrupo => {
        const jogadoresDaPosicao = grupos[posicaoGrupo];
        
        if (jogadoresDaPosicao.length > 0) {
            // Criar título da seção
            const tituloSecao = document.createElement('h2');
            tituloSecao.innerText = posicaoGrupo.toUpperCase();
            tituloSecao.className = 'titulo-posicao';
            container.appendChild(tituloSecao);
            
            // Criar container para os jogadores da posição
            const containerPosicao = document.createElement('div');
            containerPosicao.className = 'container-posicao';
            
            jogadoresDaPosicao.forEach(jogador => {
                containerPosicao.appendChild(montaCard(jogador));
            });
            
            container.appendChild(containerPosicao);
        }
    });
};

const handleInputChange = () => {
    const termoBusca = inputBusca.value.toLowerCase().trim();

    const jogadoresFiltrados = jogadoresAtuais.filter(
        (jogador) =>
            jogador.nome.toLowerCase().includes(termoBusca) ||
            jogador.nome_completo.toLowerCase().includes(termoBusca) ||
            jogador.posicao.toLowerCase().includes(termoBusca) ||
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
    const id = e.currentTarget.dataset.atletaId;
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

const exibirMensagemErro = (mensagem) => {
    container.innerHTML = `<p style="text-align: center; color: red; font-size: 18px;">${mensagem}</p>`;
};

const criaPlaceholder = () => {
    const placeholder = document.createElement("article");
    placeholder.style.visibility = "hidden";
    return placeholder;
};

const montaCard = (atleta) => {
    const cartao = document.createElement("article");
    const nome = document.createElement("h1");
    const imagem = document.createElement("img");
    const posicao = document.createElement("p");

    nome.innerText = atleta.nome;
    nome.style.fontFamily = "sans-serif";
    cartao.appendChild(nome);

    imagem.src = atleta.imagem;
    imagem.alt = atleta.nome;
    cartao.appendChild(imagem);

    posicao.innerText = atleta.posicao;
    posicao.style.fontWeight = "bold";
    cartao.appendChild(posicao);

    cartao.dataset.id = atleta.numero;
    cartao.dataset.atletaId = atleta.id;
    cartao.dataset.nomeCompleto = atleta.nome_completo;
    cartao.dataset.posicao = atleta.posicao;
    cartao.dataset.nascimento = atleta.nascimento;
    cartao.dataset.cidadeOrigem = atleta.cidade_origem;
    cartao.dataset.genero = atleta.genero;
    cartao.dataset.imagem = atleta.imagem;

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



