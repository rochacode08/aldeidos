 document.addEventListener('DOMContentLoaded', function () {
      // Função para criar partículas
      function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.classList.add('particle');

          // Posição aleatória
          const posX = Math.random() * 100;
          const posY = Math.random() * 100;

          // Tamanho aleatório
          const size = Math.random() * 3 + 1;

          // Atraso aleatório
          const delay = Math.random() * 5;

          particle.style.left = `${posX}%`;
          particle.style.top = `${posY}%`;
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          particle.style.animationDelay = `${delay}s`;

          particlesContainer.appendChild(particle);
        }
      }

      // Função para animação de scroll
      function animateOnScroll() {
        const cards = document.querySelectorAll('.card');
        const featureCards = document.querySelectorAll('.feature-card');

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1
        });

        cards.forEach(card => {
          observer.observe(card);
        });

        featureCards.forEach(card => {
          observer.observe(card);
        });
      }

      // Inicializar funções
      createParticles();
      animateOnScroll();
    });