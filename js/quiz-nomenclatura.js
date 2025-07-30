 const challenges = [
      {
        structure: "CH₃–CH₂–CHO",
        structureHtml: '<span class="carbon">CH₃</span><span class="bond">–</span><span class="carbon">CH₂</span><span class="bond">–</span><span class="carbon">C</span><span class="hydrogen">H</span><span class="oxygen">O</span>',
        answer: "propanal",
        hint: "Este aldeído tem 3 carbonos na cadeia principal.",
        detailedHint: "Prop- (3 carbonos) + -an- (ligações simples) + -al (aldeído) = propanal"
      },
      {
        structure: "CHO",
        structureHtml: '<span class="carbon">C</span><span class="hydrogen">H</span><span class="oxygen">O</span>',
        answer: "metanal",
        hint: "O menor aldeído possível, com apenas 1 carbono.",
        detailedHint: "Met- (1 carbono) + -an- (ligações simples) + -al (aldeído) = metanal"
      },
      {
        structure: "CH₃–CHO",
        structureHtml: '<span class="carbon">CH₃</span><span class="bond">–</span><span class="carbon">C</span><span class="hydrogen">H</span><span class="oxygen">O</span>',
        answer: "etanal",
        hint: "Um aldeído simples com 2 carbonos.",
        detailedHint: "Et- (2 carbonos) + -an- (ligações simples) + -al (aldeído) = etanal"
      },
      {
        structure: "CH₃–CH₂–CH₂–CHO",
        structureHtml: '<span class="carbon">CH₃</span><span class="bond">–</span><span class="carbon">CH₂</span><span class="bond">–</span><span class="carbon">CH₂</span><span class="bond">–</span><span class="carbon">C</span><span class="hydrogen">H</span><span class="oxygen">O</span>',
        answer: "butanal",
        hint: "Este aldeído tem 4 carbonos em linha reta.",
        detailedHint: "But- (4 carbonos) + -an- (ligações simples) + -al (aldeído) = butanal"
      },
      {
        structure: "CH₃–CH₂–CH₂–CH₂–CHO",
        structureHtml: '<span class="carbon">CH₃</span><span class="bond">–</span><span class="carbon">CH₂</span><span class="bond">–</span><span class="carbon">CH₂</span><span class="bond">–</span><span class="carbon">CH₂</span><span class="bond">–</span><span class="carbon">C</span><span class="hydrogen">H</span><span class="oxygen">O</span>',
        answer: "pentanal",
        hint: "Este aldeído tem 5 carbonos na cadeia.",
        detailedHint: "Pent- (5 carbonos) + -an- (ligações simples) + -al (aldeído) = pentanal"
      },
      {
        structure: "CH₂=CH–CHO",
        structureHtml: '<span class="carbon">CH₂</span><span class="bond">=</span><span class="carbon">CH</span><span class="bond">–</span><span class="carbon">C</span><span class="hydrogen">H</span><span class="oxygen">O</span>',
        answer: "propenal",
        hint: "Este aldeído tem uma ligação dupla e 3 carbonos.",
        detailedHint: "Prop- (3 carbonos) + -en- (ligação dupla) + -al (aldeído) = propenal"
      },
      {
        structure: "CH≡C–CHO",
        structureHtml: '<span class="carbon">CH</span><span class="bond">≡</span><span class="carbon">C</span><span class="bond">–</span><span class="carbon">C</span><span class="hydrogen">H</span><span class="oxygen">O</span>',
        answer: "propinal",
        hint: "Este aldeído tem uma ligação tripla e 3 carbonos.",
        detailedHint: "Prop- (3 carbonos) + -in- (ligação tripla) + -al (aldeído) = propinal"
      },
      {
        structure: "CH₃–CH=CH–CHO",
        structureHtml: '<span class="carbon">CH₃</span><span class="bond">–</span><span class="carbon">CH</span><span class="bond">=</span><span class="carbon">CH</span><span class="bond">–</span><span class="carbon">C</span><span class="hydrogen">H</span><span class="oxygen">O</span>',
        answer: "but-2-enal",
        hint: "Este aldeído tem 4 carbonos e uma ligação dupla na posição 2.",
        detailedHint: "But- (4 carbonos) + -2-en- (ligação dupla na posição 2) + -al (aldeído) = but-2-enal"
      }
    ];

    let currentChallenge = 0;
    let score = 0;
    let correctAnswers = 0;
    let hintShown = false;

    // Declarar as funções globalmente
    window.checkAnswer = function() {
      console.log('checkAnswer chamada'); // Debug
      const userAnswer = document.getElementById('answerInput').value.toLowerCase().trim();
      const correctAnswer = challenges[currentChallenge].answer;
      
      console.log('Resposta do usuário:', userAnswer);
      console.log('Resposta correta:', correctAnswer);
      
      if (userAnswer === correctAnswer) {
        // Resposta correta
        correctAnswers++;
        const points = hintShown ? 5 : 10;
        score += points;
        
        updateScore();
        showFeedback(`🎉 Correto! +${points} pontos`, 'success');
        
        setTimeout(() => {
          nextChallenge();
        }, 2000);
      } else {
        // Resposta incorreta
        showFeedback(`❌ Incorreto! A resposta é: ${correctAnswer}`, 'error');
        
        setTimeout(() => {
          nextChallenge();
        }, 3000);
      }
    };

    window.showHint = function() {
      console.log('showHint chamada'); // Debug
      const challenge = challenges[currentChallenge];
      document.getElementById('currentHint').textContent = challenge.detailedHint;
      hintShown = true;
      
      // Animação visual para indicar nova dica
      const hintBox = document.querySelector('.hint-box');
      hintBox.style.background = 'linear-gradient(135deg, #E9D8A6, #F4E4BC)';
      hintBox.style.transform = 'scale(1.02)';
      
      setTimeout(() => {
        hintBox.style.transform = 'scale(1)';
      }, 300);
    };

    window.skipChallenge = function() {
      console.log('skipChallenge chamada'); // Debug
      const correctAnswer = challenges[currentChallenge].answer;
      showFeedback(`⏭ Pulado! A resposta era: ${correctAnswer}`, 'error');
      
      setTimeout(() => {
        nextChallenge();
      }, 2500);
    };

    // FUNÇÃO CORRIGIDA PARA REINICIAR O JOGO
    window.restartGame = function() {
      console.log('restartGame chamada'); // Debug
      
      // Resetar todas as variáveis do jogo
      currentChallenge = 0;
      score = 0;
      correctAnswers = 0;
      hintShown = false;
      
      // Remover qualquer feedback que possa estar na tela
      const existingFeedback = document.querySelector('.feedback');
      if (existingFeedback) {
        existingFeedback.remove();
      }
      
      // Recriar a estrutura inicial do jogo
      const gameArea = document.querySelector('.game-area');
      gameArea.innerHTML = `
        <div class="challenge-panel">
          <h2 class="challenge-title">🎯 Desafio Atual</h2>
          
          <div class="progress-indicator">
            <span class="challenge-counter" id="challengeCounter">Desafio 1 de 8</span>
          </div>

          <div class="score-board">
            <div class="score-item">
              <strong>Pontos:</strong> <span id="score">0</span>
            </div>
            <div class="score-item">
              <strong>Acertos:</strong> <span id="correct">0</span>
            </div>
          </div>

          <div class="structure-display">
            <div class="molecule-structure" id="moleculeStructure">
              CH₃–CH₂–CHO
            </div>
          </div>

          <div class="hint-box">
            <strong>💡 Dica:</strong> <span id="currentHint">Este aldeído tem 3 carbonos na cadeia principal.</span>
          </div>
        </div>

        <div class="answer-section">
          <h3 class="answer-title">📝 Digite o Nome do Aldeído</h3>
          
          <div class="input-container">
            <input 
              type="text" 
              class="answer-input" 
              id="answerInput" 
              placeholder="Digite aqui"
              autocomplete="off"
            >
          </div>

          <div class="controls">
            <button class="btn btn-primary" onclick="checkAnswer()">
              Verificar Resposta ✅
            </button>
            <button class="btn btn-secondary" onclick="showHint()">
              Mostrar Dica 💡
            </button>
            <button class="btn btn-danger" onclick="skipChallenge()">
              Pular Desafio ⏭
            </button>
          </div>
        </div>
      `;
      
      // Reconfigurar o event listener para Enter no input
      const newAnswerInput = document.getElementById('answerInput');
      if (newAnswerInput) {
        newAnswerInput.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            checkAnswer();
          }
        });
      }
      
      // Carregar o primeiro desafio novamente
      loadChallenge();
      
      // Mostrar uma mensagem de reinício
      showFeedback('🔄 Jogo reiniciado! Boa sorte!', 'success');
    };

    function loadChallenge() {
      const challenge = challenges[currentChallenge];
      
      // Verificar se os elementos existem antes de tentar modificá-los
      const moleculeStructure = document.getElementById('moleculeStructure');
      const currentHint = document.getElementById('currentHint');
      const answerInput = document.getElementById('answerInput');
      const challengeCounter = document.getElementById('challengeCounter');
      
      if (moleculeStructure) {
        moleculeStructure.innerHTML = challenge.structureHtml;
      }
      
      if (currentHint) {
        currentHint.textContent = challenge.hint;
      }
      
      if (answerInput) {
        answerInput.value = '';
        answerInput.focus();
      }
      
      if (challengeCounter) {
        challengeCounter.textContent = `Desafio ${currentChallenge + 1} de ${challenges.length}`;
      }
      
      hintShown = false;
    }

    function nextChallenge() {
      currentChallenge++;
      
      if (currentChallenge >= challenges.length) {
        showCompletionMessage();
      } else {
        loadChallenge();
      }
    }

    function updateScore() {
      const scoreElement = document.getElementById('score');
      const correctElement = document.getElementById('correct');
      
      if (scoreElement) {
        scoreElement.textContent = score;
      }
      
      if (correctElement) {
        correctElement.textContent = correctAnswers;
      }
    }

    function showFeedback(message, type) {
      // Remove feedback anterior se existir
      const existingFeedback = document.querySelector('.feedback');
      if (existingFeedback) {
        existingFeedback.remove();
      }
      
      const feedback = document.createElement('div');
      feedback.className = `feedback ${type}`;
      feedback.textContent = message;
      document.body.appendChild(feedback);
      
      // Remove o feedback após 3 segundos
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.remove();
        }
      }, 3000);
    }

    function showCompletionMessage() {
      const accuracy = ((correctAnswers / challenges.length) * 100).toFixed(1);
      
      const completionHtml = `
        <div class="completion-message">
          <h2>🎉 Quiz Concluído!</h2>
          <p><strong>Pontuação Final:</strong> ${score} pontos</p>
          <p><strong>Acertos:</strong> ${correctAnswers}/${challenges.length} (${accuracy}%)</p>
          <p>Parabéns! Você completou todos os desafios de nomenclatura de aldeídos!</p>
          <button class="btn btn-primary" onclick="restartGame()">
            🔄 Jogar Novamente
          </button>
        </div>
      `;
      
      document.querySelector('.game-area').innerHTML = completionHtml;
    }

    // Event listener para Enter no input
    document.addEventListener('DOMContentLoaded', function() {
      const answerInput = document.getElementById('answerInput');
      if (answerInput) {
        answerInput.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            checkAnswer();
          }
        });
      }
      
      // Carregar o primeiro desafio
      loadChallenge();
    });

    // --- CÓDIGO DO ASSISTENTE DE IA ---
    const GEMINI_API_KEY = "AIzaSyDLWuGITQ2weE9jauEBZkTOFwKSH31V1h4";
    const aiModal = document.getElementById("aiModal");
    const openAiModalBtn = document.getElementById("openAiModalBtn");
    const closeButton = document.querySelector(".close-button");
    const aiForm = document.getElementById("aiForm");
    const questionInput = document.getElementById("questionInput");
    const askButton = document.getElementById("askButton");
    const aiResponse = document.getElementById("aiResponse");
    const responseContent = aiResponse ? aiResponse.querySelector('.response-content') : null;

    const markdownToHTML = text => new showdown.Converter().makeHtml(text);

    // Event listeners para o modal da IA
    if (openAiModalBtn) {
      openAiModalBtn.onclick = () => aiModal.style.display = "block";
    }

    if (closeButton) {
      closeButton.onclick = () => aiModal.style.display = "none";
    }

    window.onclick = event => { 
      if (event.target == aiModal) {
        aiModal.style.display = "none"; 
      }
    };

    async function askAI(question) {
      const promptDeNomenclatura = `
## Especialidade
Você é um assistente especialista para o jogo "Dê um Nome ao Aldeído!".

## Tarefa
Você deve responder as perguntas do usuário com base no seu conhecimento sobre nomenclatura de aldeídos, suas regras e estruturas.

## Regras
- Se você não sabe a resposta, responda com 'Não sei'.
- Se a pergunta não está relacionada a química ou nomenclatura de aldeídos, responda com 'Essa pergunta não está relacionada ao jogo de nomenclatura de aldeídos'.
- Suas respostas devem ser baseadas no conhecimento fornecido abaixo.
- Responda outras perguntas sobre química mas somente se tiver certeza da resposta.

### Conhecimento do Jogo:
**Regras de Nomenclatura de Aldeídos:**
- O grupo funcional é o –CHO (sempre no carbono 1)
- A cadeia principal deve ser a mais longa que contenha o –CHO
- O nome sempre termina com "-al"
- Para ligações duplas: use "-en-" (ex: propenal)
- Para ligações triplas: use "-in-" (ex: propinal)
- Para posições específicas: use números (ex: but-2-enal)

**Exemplos de Aldeídos:**
- Metanal (CHO): 1 carbono
- Etanal (CH₃–CHO): 2 carbonos
- Propanal (CH₃–CH₂–CHO): 3 carbonos
- Butanal (CH₃–CH₂–CH₂–CHO): 4 carbonos
- Pentanal (CH₃–CH₂–CH₂–CH₂–CHO): 5 carbonos
- Propenal (CH₂=CH–CHO): 3 carbonos com ligação dupla
- Propinal (CH≡C–CHO): 3 carbonos com ligação tripla
- But-2-enal (CH₃–CH=CH–CHO): 4 carbonos com ligação dupla na posição 2

## Resposta
- Seja direto e responda no máximo 500 caracteres.
- Responda em markdown.
- Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

## Exemplo de resposta
Pergunta do usuário: Como nomear um aldeído com 4 carbonos?
Resposta: Para um aldeído com 4 carbonos em cadeia linear, use **But-** (4 carbonos) + **-an-** (ligações simples) + **-al** (aldeído) = **Butanal**.

---
Aqui está a pergunta do usuário: ${question}
`;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptDeNomenclatura }] }] })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message);
        }
        
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
          return data.candidates[0].content.parts[0].text;
        }
        return "Não consegui gerar uma resposta. Tente novamente.";
      } catch (error) {
        console.error("Erro na API:", error);
        return "Desculpe, ocorreu um erro ao buscar a resposta.";
      }
    }

    if (aiForm) {
      aiForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!questionInput.value.trim()) return;
        
        askButton.disabled = true;
        askButton.classList.add('loading');
        aiResponse.classList.remove('hidden');
        if (responseContent) {
          responseContent.innerHTML = "Pensando...";
        }
        
        const text = await askAI(questionInput.value);
        if (responseContent) {
          responseContent.innerHTML = markdownToHTML(text);
        }
        
        askButton.disabled = false;
        askButton.classList.remove('loading');
      });
    }