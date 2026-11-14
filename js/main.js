/**
 * ============================================================================
 * CRONA WEB - SCRIPT PRINCIPAL & INTERATIVIDADES
 * Arquitetura limpa, leve e sem dependências pesadas
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de Ícones Lucide (se disponíveis)
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* --------------------------------------------------------------------------
     1. EFEITO DE VIDRO NO CABEÇALHO AO ROLAR A PÁGINA (SCROLL)
     -------------------------------------------------------------------------- */
  const cabecalho = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      cabecalho.classList.add('scrolled');
    } else {
      cabecalho.classList.remove('scrolled');
    }
  });

  /* --------------------------------------------------------------------------
     2. MENU MOBILE (ABRIR E FECHAR)
     -------------------------------------------------------------------------- */
  const botaoMenuMobile = document.querySelector('.mobile-toggle');
  const linksNavegacao = document.querySelector('.nav-links');

  if (botaoMenuMobile && linksNavegacao) {
    botaoMenuMobile.addEventListener('click', () => {
      linksNavegacao.classList.toggle('mobile-open');
      const icone = botaoMenuMobile.querySelector('i');
      if (icone) {
        if (linksNavegacao.classList.contains('mobile-open')) {
          icone.setAttribute('data-lucide', 'x');
        } else {
          icone.setAttribute('data-lucide', 'menu');
        }
        if (window.lucide) window.lucide.createIcons();
      }
    });

    // Fecha o menu automaticamente ao clicar em qualquer link
    linksNavegacao.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        linksNavegacao.classList.remove('mobile-open');
        const icone = botaoMenuMobile.querySelector('i');
        if (icone) {
          icone.setAttribute('data-lucide', 'menu');
          if (window.lucide) window.lucide.createIcons();
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. CARROSSEL INFINITO DE PROJETOS (LOOP SUAVE & PRECISÃO TOTAL)
     -------------------------------------------------------------------------- */
  const areaCarrossel = document.getElementById('carouselViewport');
  const botaoAnterior = document.getElementById('carouselPrev');
  const botaoProximo = document.getElementById('carouselNext');
  const pontosIndicadores = document.querySelectorAll('.carousel-dots-indicator .c-dot');
  const slidesProjetos = document.querySelectorAll('.carousel-slide');

  if (areaCarrossel && botaoAnterior && botaoProximo && slidesProjetos.length > 0) {
    let indiceAtual = 0;

    // Atualiza visualmente os pontos da barra de paginação
    const atualizarPontos = (indice) => {
      pontosIndicadores.forEach((ponto, idx) => {
        if (idx === indice) {
          ponto.classList.add('active');
        } else {
          ponto.classList.remove('active');
        }
      });
    };

    // Navega e centraliza com perfeição o card no celular e no computador
    const navegarParaSlide = (indice) => {
      if (indice < 0) indice = 0;
      if (indice >= slidesProjetos.length) indice = slidesProjetos.length - 1;

      indiceAtual = indice;
      const slideAlvo = slidesProjetos[indice];

      // Centraliza perfeitamente o card na tela (elimina qualquer vão ou espaço vazio lateral)
      const centroViewport = areaCarrossel.clientWidth / 2;
      const centroSlide = slideAlvo.offsetLeft + (slideAlvo.offsetWidth / 2);
      const posicaoAlvo = centroSlide - centroViewport;

      areaCarrossel.scrollTo({ left: Math.max(0, posicaoAlvo), behavior: 'smooth' });

      atualizarPontos(indiceAtual);
    };

    // Botão Próximo (Passa card por card; ao chegar no último, clica novamente e volta ao primeiro)
    botaoProximo.addEventListener('click', () => {
      if (indiceAtual < slidesProjetos.length - 1) {
        // Garante que o último card apareça 100% por completo
        navegarParaSlide(indiceAtual + 1);
      } else {
        // Só volta ao início quando o usuário já viu o último card completo e clicou em avançar
        navegarParaSlide(0);
      }
    });

    // Botão Anterior (Volta card por card; se estiver no primeiro, vai ao último)
    botaoAnterior.addEventListener('click', () => {
      if (indiceAtual > 0) {
        navegarParaSlide(indiceAtual - 1);
      } else {
        navegarParaSlide(slidesProjetos.length - 1);
      }
    });

    // Clique direto nos pontos de navegação
    pontosIndicadores.forEach((ponto, idx) => {
      ponto.addEventListener('click', () => {
        navegarParaSlide(idx);
      });
    });

    // Sincroniza o índice caso o usuário arraste no celular com o dedo
    let timeoutScroll;
    areaCarrossel.addEventListener('scroll', () => {
      clearTimeout(timeoutScroll);
      timeoutScroll = setTimeout(() => {
        const centroVisivel = areaCarrossel.scrollLeft + (areaCarrossel.clientWidth / 2);
        let menorDistancia = Infinity;
        let indiceMaisProximo = 0;

        slidesProjetos.forEach((slide, idx) => {
          const centroSlide = slide.offsetLeft + (slide.offsetWidth / 2);
          const distancia = Math.abs(centroSlide - centroVisivel);
          if (distancia < menorDistancia) {
            menorDistancia = distancia;
            indiceMaisProximo = idx;
          }
        });

        indiceAtual = indiceMaisProximo;
        atualizarPontos(indiceAtual);
      }, 50);
    });
  }

  /* --------------------------------------------------------------------------
     4. ALTERNADOR DE 3 IMAGENS POR CARD (THUMBNAIL SWITCHER)
     -------------------------------------------------------------------------- */
  document.querySelectorAll('.project-thumb-box').forEach(caixaImagem => {
    const imagens = caixaImagem.querySelectorAll('.project-thumb-img');
    const pontosAlternador = caixaImagem.querySelectorAll('.thumb-dot');

    if (imagens.length > 1 && pontosAlternador.length > 0) {
      let indiceAtual = 0;

      const trocarImagem = (indiceAlvo) => {
        indiceAtual = indiceAlvo;
        imagens.forEach((img, idx) => {
          if (idx === indiceAlvo) {
            img.classList.add('active-img');
          } else {
            img.classList.remove('active-img');
          }
        });

        pontosAlternador.forEach((ponto, idx) => {
          if (idx === indiceAlvo) {
            ponto.classList.add('active');
          } else {
            ponto.classList.remove('active');
          }
        });
      };

      // Clique manual nos pontinhos do card
      pontosAlternador.forEach((ponto, idx) => {
        ponto.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          trocarImagem(idx);
        });
      });

      // Transição automática suave a cada 4 segundos
      let temporizadorAuto = setInterval(() => {
        const proximo = (indiceAtual + 1) % imagens.length;
        trocarImagem(proximo);
      }, 4000);

      // Pausa a transição quando o cursor passa por cima
      caixaImagem.addEventListener('mouseenter', () => clearInterval(temporizadorAuto));
      caixaImagem.addEventListener('mouseleave', () => {
        clearInterval(temporizadorAuto);
        temporizadorAuto = setInterval(() => {
          const proximo = (indiceAtual + 1) % imagens.length;
          trocarImagem(proximo);
        }, 4000);
      });
    }
  });

  /* --------------------------------------------------------------------------
     5. DÚVIDAS FREQUENTES (FAQ ACCORDION)
     -------------------------------------------------------------------------- */
  const itensFaq = document.querySelectorAll('.faq-item');
  itensFaq.forEach(item => {
    const botaoPergunta = item.querySelector('.faq-question');
    if (botaoPergunta) {
      botaoPergunta.addEventListener('click', () => {
        const estaAtivo = item.classList.contains('active');
        // Fecha todos os outros itens
        itensFaq.forEach(outroItem => outroItem.classList.remove('active'));
        // Alterna o item clicado
        if (!estaAtivo) {
          item.classList.add('active');
        }
      });
    }
  });
});
