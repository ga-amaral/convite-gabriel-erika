/*
 * Autoria: [Gabriel Amaral](https://instagram.com/sougabrielamaral)
 * Versão: v1.3.1
 * Data/Hora: 2026-05-23T14:22:50-03:00
 */

// Inicializa comportamentos da página
document.addEventListener('DOMContentLoaded', () => {

  // Atualiza ano no rodapé dinamicamente
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // Lógica da Contagem Regressiva para a data da festa (19/07 às 13:00)
  const targetDate = new Date('2026-07-19T13:00:00');
  
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
  }

  if (daysEl && hoursEl && minutesEl && secondsEl) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
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
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

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

        // Desabilita o botão para evitar múltiplos cliques
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Enviando...';
        }

        // Salvar localmente em localStorage como fallback de segurança
        try {
          let respostas = JSON.parse(localStorage.getItem('chaRevelacaoRespostas') || '[]');
          respostas.push(resposta);
          localStorage.setItem('chaRevelacaoRespostas', JSON.stringify(respostas));
        } catch (err) {
          console.error('Erro ao salvar no localStorage:', err);
        }

        // Enviar os dados para o webhook do n8n (ambiente de teste)
        fetch('https://n8n.globalportfolio.com.br/webhook-test/convite-gabriel-erika', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resposta)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro na resposta do webhook');
          }
          return response;
        })
        .catch(err => {
          // Log detalhado para identificar o erro de forma autônoma
          console.error('[RSVP Webhook Connection Error]:', err);
        })
        .finally(() => {
          // Exibir mensagem de sucesso independente do webhook para garantir fluxo do usuário
          form.style.display = 'none';
          if (successMessage) {
            successMessage.style.display = 'block';
          }
        });
      }
    });
  }
});
