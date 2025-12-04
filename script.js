// =============================================================================
// CONFIGURAÇÃO INICIAL
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Atualiza o ano atual no footer
  const elementoAno = document.getElementById('year');
  if (elementoAno) {
    elementoAno.textContent = new Date().getFullYear();
  }
  
  // Inicializa todos os sistemas
  inicializarBotaoEmail();
  inicializarAccordionsSobre();
  inicializarAccordionsPublicacoes();
  inicializarCarrosselGitHub();
});

// =============================================================================
// SISTEMA DE BOTÃO DE EMAIL (SIMPLIFICADO)
// =============================================================================

function inicializarBotaoEmail() {
  const btnEmail = document.getElementById('btnEmail');
  if (!btnEmail) return;

  btnEmail.addEventListener('click', () => {
    const email = 'leandroteodoro.engenharia@gmail.com';
    
    // Se já está mostrando "Copiado", não faz nada
    if (btnEmail.classList.contains('copied')) return;
    
    navigator.clipboard.writeText(email).then(() => {
      // Mostra "Email Copiado!" e muda para verde
      btnEmail.classList.add('copied');
      
      // Volta para estado normal após 2 segundos
      setTimeout(() => {
        btnEmail.classList.remove('copied');
      }, 2000);
      
    }).catch(err => {
      console.error('Erro ao copiar email:', err);
      
      // Fallback para navegadores antigos
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      // Mostra feedback mesmo com fallback
      btnEmail.classList.add('copied');
      
      setTimeout(() => {
        btnEmail.classList.remove('copied');
      }, 2000);
    });
  });
}

// =============================================================================
// ACCORDION - SEÇÃO "SOBRE"
// =============================================================================

function inicializarAccordionsSobre() {
  const botoesAccordion = document.querySelectorAll(".accordion-header");

  botoesAccordion.forEach(botao => {
    botao.addEventListener("click", () => {
      // Alterna estado ativo do botão
      botao.classList.toggle("active");

      // Encontra o conteúdo associado ao botão
      const conteudo = botao.nextElementSibling;
      if (!conteudo) return;

      // Expande ou recolhe o conteúdo
      if (botao.classList.contains("active")) {
        conteudo.style.maxHeight = conteudo.scrollHeight + "px";
      } else {
        conteudo.style.maxHeight = 0;
      }
    });
  });
}

// =============================================================================
// ACCORDION - SEÇÃO "PUBLICAÇÕES"
// =============================================================================

function inicializarAccordionsPublicacoes() {
  const itensPublicacoes = document.querySelectorAll('.publication-accordion-item');
  
  itensPublicacoes.forEach(item => {
    const cabecalho = item.querySelector('.publication-accordion-header');
    
    cabecalho.addEventListener('click', () => {
      // Fecha todos os outros itens antes de abrir o atual
      itensPublicacoes.forEach(outroItem => {
        if (outroItem !== item) {
          outroItem.classList.remove('active');
        }
      });
      
      // Abre/fecha o item clicado
      item.classList.toggle('active');
    });
  });
}

// =============================================================================
// CARROSSEL DE PROJETOS DO GITHUB
// =============================================================================

async function inicializarCarrosselGitHub() {
  const trilhaCarrossel = document.querySelector(".project-carousel-track");
  const setaEsquerda = document.querySelector(".carousel-arrow.left");
  const setaDireita = document.querySelector(".carousel-arrow.right");

  if (!trilhaCarrossel) return;

  // Mapa de ícones por linguagem
  const iconesLinguagens = {
    'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    'C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    'C': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
    'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
    'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    'Ruby': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
    'Go': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
    'Rust': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',
    'Swift': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
    'Kotlin': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
    'Scala': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg',
    'R': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg',
    'MATLAB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg',
    'Shell': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg'
  };

  const iconePadrao = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg';

  try {
    const usuarioGitHub = 'LeandroTeodoroRJ';
    const repositorios = await buscarTodosRepositorios(usuarioGitHub);
    
    // Limpa mensagem de carregamento
    trilhaCarrossel.innerHTML = '';
    
    // Cria os cards para cada repositório
    for (const repositorio of repositorios) {
      const cardProjeto = criarCardProjeto(repositorio, iconesLinguagens, iconePadrao);
      trilhaCarrossel.appendChild(cardProjeto);
    }
    
    // Atualiza o título da seção
    atualizarTituloProjetos(repositorios.length);
    
    // Configura navegação do carrossel
    configurarNavegacaoCarrossel(trilhaCarrossel, setaEsquerda, setaDireita);
    
  } catch (erro) {
    console.error('Erro ao carregar projetos do GitHub:', erro);
    trilhaCarrossel.innerHTML = '<div class="error">Erro ao carregar projetos do GitHub.</div>';
  }
}

async function buscarTodosRepositorios(usuarioGitHub) {
  let todosRepositorios = [];
  let paginaAtual = 1;
  let temMaisPaginas = true;
  
  while (temMaisPaginas) {
    const urlAPI = `https://api.github.com/users/${usuarioGitHub}/repos?sort=updated&per_page=100&page=${paginaAtual}`;
    const resposta = await fetch(urlAPI);
    const repositorios = await resposta.json();
    
    if (repositorios.length === 0) {
      temMaisPaginas = false;
    } else {
      todosRepositorios = todosRepositorios.concat(repositorios);
      paginaAtual++;
      
      // Limite de segurança
      if (paginaAtual > 5) break;
    }
  }
  
  return todosRepositorios;
}

function criarCardProjeto(repositorio, iconesLinguagens, iconePadrao) {
  const card = document.createElement('a');
  card.className = 'project';
  card.href = repositorio.html_url;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.title = `Abrir "${repositorio.name}" no GitHub`;
  
  const iconeURL = iconesLinguagens[repositorio.language] || iconePadrao;
  const dataAtualizacao = new Date(repositorio.updated_at).toLocaleDateString('pt-BR');
  
  card.innerHTML = `
    <div class="proj-img">
      <img src="${iconeURL}" alt="${repositorio.language || 'Repositório'}" loading="lazy">
    </div>
    <div class="proj-body">
      <h3>${repositorio.name}</h3>
      <p>${repositorio.description || 'Repositório sem descrição'}</p>
      
      <div class="project-meta">
        <span class="meta-item" title="Número de stars">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
          </svg>
          ${repositorio.stargazers_count}
        </span>
        <span class="meta-item" title="Número de forks">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.25 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
          </svg>
          ${repositorio.forks_count}
        </span>
        <span class="meta-item" title="Última atualização">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.5 4a.5.5 0 00-1 0v4a.5.5 0 00.5.5h3a.5.5 0 000-1H8.5V4z"/>
          </svg>
          ${dataAtualizacao}
        </span>
      </div>
      
      ${repositorio.language ? `
        <div class="project-meta">
          <span class="meta-item">${repositorio.language}</span>
        </div>
      ` : ''}
    </div>
  `;
  
  return card;
}

function atualizarTituloProjetos(quantidade) {
  const tituloProjetos = document.querySelector('#projetos h2');
  if (tituloProjetos && quantidade > 0) {
    tituloProjetos.textContent = `Projetos GitHub (${quantidade} repositórios)`;
  }
}

function configurarNavegacaoCarrossel(trilhaCarrossel, setaEsquerda, setaDireita) {
  function rolarCarrossel(direcao) {
    const card = trilhaCarrossel.querySelector(".project");
    if (!card) return;

    const larguraCard = card.offsetWidth + 24;
    trilhaCarrossel.scrollBy({ 
      left: direcao * larguraCard, 
      behavior: "smooth" 
    });
  }

  setaEsquerda?.addEventListener("click", () => rolarCarrossel(-1));
  setaDireita?.addEventListener("click", () => rolarCarrossel(1));
}