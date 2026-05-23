/*
 * Autoria: [Gabriel Amaral](https://instagram.com/sougabrielamaral)
 * Versão: v1.1.1
 * Data/Hora: 2026-05-23T11:52:22-03:00
 */

// Inicializa comportamentos da página
document.addEventListener('DOMContentLoaded', () => {

  // Atualiza ano no rodapé dinamicamente
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // Intersection Observer para animações de fade-in (Otimização de Performance visual)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
  });

  // Lógica de formatação de máscara para telefone
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function (e) {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
  }

  // Tratamento de submissão do formulário RSVP
  const form = document.getElementById('rsvpForm');
  const successMessage = document.getElementById('successMessage');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = document.getElementById('nome').value.trim();
      const telefone = document.getElementById('telefone').value.trim();
      const presenca = document.getElementById('presenca').value;

      if (nome && telefone && presenca) {
        const resposta = {
          nome,
          telefone,
          presenca,
          timestamp: new Date().toISOString()
        };

        // Tratamento de erro simulado (fallback try catch) e salvamento via localStorage
        try {
          let respostas = JSON.parse(localStorage.getItem('chaRevelacaoRespostas') || '[]');
          respostas.push(resposta);
          localStorage.setItem('chaRevelacaoRespostas', JSON.stringify(respostas));

          // Feedback Visual
          form.style.display = 'none';
          if (successMessage) {
            successMessage.style.display = 'block';
          }
        } catch (err) {
          console.error('Erro ao salvar no localStorage:', err);
          alert('Ocorreu um erro ao salvar sua confirmação. Por favor, tente novamente.');
        }
      }
    });
  }
});
