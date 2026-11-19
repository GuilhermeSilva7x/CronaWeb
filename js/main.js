/**
 * ============================================================================
 * CRONA WEB - SCRIPT PRINCIPAL & INTERATIVIDADES
 * Arquitetura limpa, leve, rápida e sem dependências pesadas
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de Ícones Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* --------------------------------------------------------------------------
     1. CABEÇALHO COM EFEITO DE VIDRO AO ROLAR (SCROLL)
     -------------------------------------------------------------------------- */
  const cabecalho = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (cabecalho) {
      if (window.scrollY > 25) {
        cabecalho.classList.add('scrolled');
      } else {
        cabecalho.classList.remove('scrolled');
      }
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
     3. CARROSSEL INFINITO DE PROJETOS (PRECISÃO TOTAL)
     -------------------------------------------------------------------------- */
  const areaCarrossel = document.getElementById('carouselViewport');
  const botaoAnterior = document.getElementById('carouselPrev');
  const botaoProximo = document.getElementById('carouselNext');
  const pontosIndicadores = document.querySelectorAll('.carousel-dots-indicator .c-dot');
  const slidesProjetos = document.querySelectorAll('.carousel-slide');

  if (areaCarrossel && botaoAnterior && botaoProximo && slidesProjetos.length > 0) {
    let indiceAtual = 0;

    const atualizarPontos = (indice) => {
      pontosIndicadores.forEach((ponto, idx) => {
        if (idx === indice) {
          ponto.classList.add('active');
        } else {
          ponto.classList.remove('active');
        }
      });
    };

    const navegarParaSlide = (indice) => {
      if (indice < 0) indice = 0;
      if (indice >= slidesProjetos.length) indice = slidesProjetos.length - 1;

      indiceAtual = indice;
      const slideAlvo = slidesProjetos[indice];

      const centroViewport = areaCarrossel.clientWidth / 2;
      const centroSlide = slideAlvo.offsetLeft + (slideAlvo.offsetWidth / 2);
      const posicaoAlvo = centroSlide - centroViewport;

      areaCarrossel.scrollTo({ left: Math.max(0, posicaoAlvo), behavior: 'smooth' });
      atualizarPontos(indiceAtual);
    };

    botaoProximo.addEventListener('click', () => {
      if (indiceAtual < slidesProjetos.length - 1) {
        navegarParaSlide(indiceAtual + 1);
      } else {
        navegarParaSlide(0);
      }
    });

    botaoAnterior.addEventListener('click', () => {
      if (indiceAtual > 0) {
        navegarParaSlide(indiceAtual - 1);
      } else {
        navegarParaSlide(slidesProjetos.length - 1);
      }
    });

    pontosIndicadores.forEach((ponto, idx) => {
      ponto.addEventListener('click', () => {
        navegarParaSlide(idx);
      });
    });

    // Sincroniza arraste com o dedo no celular
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

      pontosAlternador.forEach((ponto, idx) => {
        ponto.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          trocarImagem(idx);
        });
      });

      // Transição automática suave
      let temporizadorAuto = setInterval(() => {
        const proximo = (indiceAtual + 1) % imagens.length;
        trocarImagem(proximo);
      }, 4000);

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
        itensFaq.forEach(outroItem => outroItem.classList.remove('active'));
        if (!estaAtivo) {
          item.classList.add('active');
        }
      });
    }
  });

  /* --------------------------------------------------------------------------
     6. MOTOR 3D GEOMÉTRICO (CANVAS 3D INTERATIVO DE FUNDO)
     Malha espacial com poliedros 3D flutuantes (cubos e octaedros)
     -------------------------------------------------------------------------- */
  const canvas3D = document.getElementById('bg3d-canvas');
  if (canvas3D) {
    const ctx = canvas3D.getContext('2d');
    let largura, altura;
    let pontos = [];
    let mouse = { x: 0, y: 0, alvoX: 0, alvoY: 0 };

    // Definição geométrica dos poliedros 3D
    const verticesCubo = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1,  1], [1, -1,  1], [1, 1,  1], [-1, 1,  1]
    ];
    const arestasCubo = [
      [0,1], [1,2], [2,3], [3,0],
      [4,5], [5,6], [6,7], [7,4],
      [0,4], [1,5], [2,6], [3,7]
    ];

    const verticesOcta = [
      [ 1,  0,  0], [-1,  0,  0],
      [ 0,  1,  0], [ 0, -1,  0],
      [ 0,  0,  1], [ 0,  0, -1]
    ];
    const arestasOcta = [
      [0,2], [2,1], [1,3], [3,0],
      [0,4], [1,4], [2,4], [3,4],
      [0,5], [1,5], [2,5], [3,5]
    ];

    const poliedros = [
      {
        tipo: 'cubo',
        x: 460, y: -150, z: 260,
        tam: 62,
        rotX: 0.2, rotY: 0.3, rotZ: 0.1,
        velX: 0.007, velY: 0.011, velZ: 0.005,
        corAresta: 'rgba(0, 240, 255, 0.45)',
        corPonto: '#00f0ff'
      },
      {
        tipo: 'octa',
        x: -420, y: 130, z: 300,
        tam: 76,
        rotX: 0.5, rotY: 0.2, rotZ: 0.4,
        velX: 0.009, velY: 0.006, velZ: 0.008,
        corAresta: 'rgba(56, 189, 248, 0.4)',
        corPonto: '#38bdf8'
      },
      {
        tipo: 'cubo',
        x: 340, y: 350, z: 360,
        tam: 48,
        rotX: 0.8, rotY: 0.4, rotZ: 0.6,
        velX: 0.006, velY: 0.008, velZ: 0.01,
        corAresta: 'rgba(0, 240, 255, 0.35)',
        corPonto: '#ffffff'
      }
    ];

    const redimensionar = () => {
      largura = canvas3D.width = window.innerWidth;
      altura = canvas3D.height = window.innerHeight;
      gerarMalha();
    };

    const gerarMalha = () => {
      pontos = [];
      const colunas = Math.max(12, Math.floor(largura / 95));
      const linhas = Math.max(8, Math.floor(altura / 95));
      const espacoX = (largura * 1.4) / colunas;
      const espacoY = (altura * 1.4) / linhas;

      for (let i = 0; i <= colunas; i++) {
        for (let j = 0; j <= linhas; j++) {
          pontos.push({
            origemX: (i - colunas / 2) * espacoX,
            origemY: (j - linhas / 2) * espacoY,
            z: Math.sin(i * 0.5) * Math.cos(j * 0.5) * 80,
            fase: Math.random() * Math.PI * 2,
            velocidade: 0.015 + Math.random() * 0.01
          });
        }
      }
    };

    window.addEventListener('resize', redimensionar);
    window.addEventListener('mousemove', (e) => {
      mouse.alvoX = (e.clientX - largura / 2) * 0.05;
      mouse.alvoY = (e.clientY - altura / 2) * 0.05;
    });

    redimensionar();

    let tempo = 0;
    const animar3D = () => {
      tempo += 0.02;
      mouse.x += (mouse.alvoX - mouse.x) * 0.05;
      mouse.y += (mouse.alvoY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, largura, altura);

      const centroX = largura / 2;
      const centroY = altura / 2 + 50;
      const distanciaFocal = 550;

      // 1. Renderiza a malha espacial 3D de fundo
      ctx.fillStyle = 'rgba(0, 240, 255, 0.45)';
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
      ctx.lineWidth = 1;

      const pontosProjetados = [];

      for (let i = 0; i < pontos.length; i++) {
        const p = pontos[i];
        const ondaZ = Math.sin(tempo + p.fase) * 45;
        const x3d = p.origemX + mouse.x * 2;
        const y3d = p.origemY + mouse.y * 2;
        const z3d = p.z + ondaZ + 350;

        if (z3d > 0) {
          const escala = distanciaFocal / (distanciaFocal + z3d);
          const x2d = centroX + x3d * escala;
          const y2d = centroY + y3d * escala;
          pontosProjetados.push({ x: x2d, y: y2d, escala: escala });

          const raio = Math.max(0.6, 2.0 * escala);
          ctx.beginPath();
          ctx.arc(x2d, y2d, raio, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.beginPath();
      for (let i = 0; i < pontosProjetados.length; i += 2) {
        const p1 = pontosProjetados[i];
        for (let j = i + 1; j < Math.min(i + 4, pontosProjetados.length); j++) {
          const p2 = pontosProjetados[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 90) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.stroke();

      // 2. Renderiza os poliedros geométricos 3D flutuantes
      poliedros.forEach(obj => {
        obj.rotX += obj.velX;
        obj.rotY += obj.velY;
        obj.rotZ += obj.velZ;

        const verts = obj.tipo === 'cubo' ? verticesCubo : verticesOcta;
        const arestas = obj.tipo === 'cubo' ? arestasCubo : arestasOcta;

        const cosX = Math.cos(obj.rotX), sinX = Math.sin(obj.rotX);
        const cosY = Math.cos(obj.rotY), sinY = Math.sin(obj.rotY);
        const cosZ = Math.cos(obj.rotZ), sinZ = Math.sin(obj.rotZ);

        const projetados = [];

        for (let v = 0; v < verts.length; v++) {
          let [vx, vy, vz] = verts[v];
          vx *= obj.tam; vy *= obj.tam; vz *= obj.tam;

          // Rotação 3D
          let y1 = vy * cosX - vz * sinX;
          let z1 = vy * sinX + vz * cosX;
          let x2 = vx * cosY + z1 * sinY;
          let z2 = -vx * sinY + z1 * cosY;
          let x3 = x2 * cosZ - y1 * sinZ;
          let y3 = x2 * sinZ + y1 * cosZ;

          const posX = x3 + obj.x + mouse.x * 2.2;
          const posY = y3 + obj.y + mouse.y * 2.2;
          const posZ = z2 + obj.z;

          if (posZ + distanciaFocal > 0) {
            const esc = distanciaFocal / (distanciaFocal + posZ);
            projetados.push({
              x: centroX + posX * esc,
              y: centroY + posY * esc,
              esc: esc
            });
          }
        }

        if (projetados.length === verts.length) {
          // Arestas luminosas
          ctx.strokeStyle = obj.corAresta;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          for (let e = 0; e < arestas.length; e++) {
            const pA = projetados[arestas[e][0]];
            const pB = projetados[arestas[e][1]];
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
          }
          ctx.stroke();

          // Vértices 3D
          ctx.fillStyle = obj.corPonto;
          for (let p = 0; p < projetados.length; p++) {
            ctx.beginPath();
            ctx.arc(projetados[p].x, projetados[p].y, 2.4 * projetados[p].esc, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      requestAnimationFrame(animar3D);
    };

    animar3D();
  }

  /* --------------------------------------------------------------------------
     7. CONTROLADOR ESPACIAL 3D DO HERO (TILT, GLARE & PROFUNDIDADE Z)
     -------------------------------------------------------------------------- */
  const heroStage = document.getElementById('heroStage3D');
  const heroRig = document.getElementById('heroRig3D');
  const heroGlare = document.getElementById('heroGlare');
  const cardSpeed = document.getElementById('floatCard1');
  const cardBooking = document.getElementById('floatCard2');
  const heroPhone = document.getElementById('heroPhone3D');

  if (heroStage && heroRig) {
    let mouseX = 0, mouseY = 0;
    let atualRotX = 0, atualRotY = 0;

    const limiteRotacao = 12;

    window.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const centroX = rect.left + rect.width / 2;
      const centroY = rect.top + rect.height / 2;

      const normalX = (e.clientX - centroX) / (window.innerWidth / 2);
      const normalY = (e.clientY - centroY) / (window.innerHeight / 2);

      mouseX = Math.max(-1, Math.min(1, normalX));
      mouseY = Math.max(-1, Math.min(1, normalY));
    });

    const atualizarHero3D = () => {
      const alvoRotY = mouseX * limiteRotacao;
      const alvoRotX = -mouseY * limiteRotacao;

      atualRotX += (alvoRotX - atualRotX) * 0.08;
      atualRotY += (alvoRotY - atualRotY) * 0.08;

      heroRig.style.transform = `rotateX(${atualRotX.toFixed(2)}deg) rotateY(${atualRotY.toFixed(2)}deg)`;

      if (heroGlare) {
        heroGlare.style.background = `linear-gradient(${135 + atualRotY * 2.5}deg, rgba(255,255,255,${0.16 + Math.abs(mouseY) * 0.06}) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)`;
      }

      if (cardSpeed) {
        const offsetSpeedX = atualRotY * 1.6;
        const offsetSpeedY = -atualRotX * 1.6;
        cardSpeed.style.transform = `translate3d(${offsetSpeedX.toFixed(1)}px, ${offsetSpeedY.toFixed(1)}px, 65px)`;
      }

      if (cardBooking) {
        const offsetBookingX = -atualRotY * 2.0;
        const offsetBookingY = atualRotX * 2.0;
        cardBooking.style.transform = `translate3d(${offsetBookingX.toFixed(1)}px, ${offsetBookingY.toFixed(1)}px, 90px)`;
      }

      if (heroPhone) {
        const offsetPhoneX = atualRotY * 2.5;
        const offsetPhoneY = -atualRotX * 2.5;
        heroPhone.style.transform = `translate3d(${offsetPhoneX.toFixed(1)}px, ${offsetPhoneY.toFixed(1)}px, 115px) rotateY(${-14 + atualRotY * 0.4}deg) rotateX(${8 + atualRotX * 0.3}deg)`;
      }

      requestAnimationFrame(atualizarHero3D);
    };

    atualizarHero3D();
  }

  /* --------------------------------------------------------------------------
     8. MOTOR UNIVERSAL DE INCLINAÇÃO 3D (CARD TILT & SPOTLIGHT)
     -------------------------------------------------------------------------- */
  const cardsInclinaveis = document.querySelectorAll(
    '.project-item-card, .simple-sol-card, .perk-box'
  );

  cardsInclinaveis.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Atualiza coordenadas do spotlight de luz
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Calcula física de inclinação 3D espacial
      const centroX = rect.width / 2;
      const centroY = rect.height / 2;
      const rotX = ((y - centroY) / centroY) * -7.5;
      const rotY = ((x - centroX) / centroX) * 7.5;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  const outrosCardsComSpotlight = document.querySelectorAll('.clean-cta-box');
  outrosCardsComSpotlight.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  /* --------------------------------------------------------------------------
     9. BARRA DE PROGRESSO DE SCROLL NO TOPO
     -------------------------------------------------------------------------- */
  const barraProgresso = document.getElementById('scrollProgressBar');
  if (barraProgresso) {
    window.addEventListener('scroll', () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal > 0) {
        const progresso = (window.scrollY / scrollTotal) * 100;
        barraProgresso.style.width = `${Math.min(100, Math.max(0, progresso))}%`;
      }
    });
  }
});
