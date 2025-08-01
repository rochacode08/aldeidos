// --- CÓDIGO DO JOGO ALDEÍDO ATÔMICO ---

const aldeidoss = [
  { name: "Metanal (Formaldeído)", hint: "O aldeído mais simples!", atoms: { C: 1, H: 2, O: 1 }, bonds: { single: 2, double: 1 }, completed: false, image: "js/metanal.png" },
  { name: "Etanal (Acetaldeído)", hint: "Um metil ligado ao grupo -CHO.", atoms: { C: 2, H: 4, O: 1 }, bonds: { single: 5, double: 1 }, completed: false, image: "js/etanal.png" },
  { name: "Propanal", hint: "3 carbonos em cadeia linear.", atoms: { C: 3, H: 6, O: 1 }, bonds: { single: 8, double: 1 }, completed: false, image: "js/propanal.png" },
  { name: "Butanal", hint: "4 carbonos em cadeia linear.", atoms: { C: 4, H: 8, O: 1 }, bonds: { single: 11, double: 1 }, completed: false, image: "js/butanal.webp" }
];

let currentChallengeIndex = 0;
let score = 0;
let selectedItem = null;

// Variáveis para suporte touch
let isDragging = false;
let dragElement = null;
let touchOffset = { x: 0, y: 0 };

function loadChallenge() {
  const challenge = aldeidoss[currentChallengeIndex];
  document.getElementById('aldehydeName').textContent = challenge.name;
  document.getElementById('hint').textContent = challenge.hint;
  clearCanvas();
  clearSelection();

  // Remover botão "Avançar", se existir
  const existingNextBtn = document.getElementById('nextButton');
  if (existingNextBtn) existingNextBtn.remove();

  // Remover imagem da fórmula estrutural, se existir
  const existingFormulaImage = document.getElementById('formulaImage');
  if (existingFormulaImage) existingFormulaImage.remove();

  // Scroll para o painel do desafio atual
  document.querySelector('.challenge-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function selectItem(element) {
  clearSelection();
  element.classList.add('item-selected');

  const { atom, bond } = element.dataset;
  if (atom) {
    selectedItem = { type: "atom", value: atom, className: element.className.replace(' item-selected', '') };
  } else if (bond) {
    selectedItem = { type: "bond", value: bond, className: element.className.replace(' item-selected', '') };
  }

  updateCanvasMessage();
}

function clearSelection() {
  document.querySelectorAll('.atom-palette .item-selected').forEach(el => el.classList.remove('item-selected'));
  selectedItem = null;
  updateCanvasMessage();
}

function updateCanvasMessage() {
  const canvas = document.getElementById('moleculeCanvas');
  const hasItems = canvas.querySelector('.placed-atom');

  if (!hasItems) {
    if (selectedItem) {
      canvas.innerHTML = '<p style="color: #0A9396; font-style: italic; opacity: 0.8;">Clique aqui para adicionar o item selecionado</p>';
    } else {
      canvas.innerHTML = '<p style="color: #94D2BD; font-style: italic; opacity: 0.7;">Selecione um item da paleta e clique aqui para adicioná-lo</p>';
    }
  }
}

function addSelectedItem(event) {
  if (!selectedItem) {
    showFeedback('Selecione um item da paleta primeiro!', 'error');
    return;
  }

  const canvas = document.getElementById('moleculeCanvas');
  if (canvas.querySelector('p')) canvas.innerHTML = '';

  const newElement = document.createElement('div');
  newElement.className = selectedItem.className + ' placed-atom';
  newElement.dataset.type = selectedItem.type;
  newElement.dataset.value = selectedItem.value;
  newElement.textContent = selectedItem.value === 'double' ? '=' : (selectedItem.value === 'single' ? '—' : selectedItem.value);
  newElement.onclick = (e) => {
    e.stopPropagation();
    newElement.remove();
    updateCanvasMessage();
  };

  canvas.appendChild(newElement);
  clearSelection();
}

// Nova função para adicionar item em posição específica (touch)
function addSelectedItemAtPosition(x, y) {
  if (!selectedItem) {
    showFeedback('Selecione um item da paleta primeiro!', 'error');
    return;
  }

  const canvas = document.getElementById('moleculeCanvas');
  if (canvas.querySelector('p')) canvas.innerHTML = '';

  const newElement = document.createElement('div');
  newElement.className = selectedItem.className + ' placed-atom';
  newElement.dataset.type = selectedItem.type;
  newElement.dataset.value = selectedItem.value;
  newElement.textContent = selectedItem.value === 'double' ? '=' : (selectedItem.value === 'single' ? '—' : selectedItem.value);
  
  // Posicionar elemento
  newElement.style.position = 'absolute';
  newElement.style.left = Math.max(0, Math.min(x - 30, canvas.offsetWidth - 60)) + 'px';
  newElement.style.top = Math.max(0, Math.min(y - 30, canvas.offsetHeight - 60)) + 'px';
  
  newElement.onclick = (e) => {
    e.stopPropagation();
    newElement.remove();
    updateCanvasMessage();
  };

  canvas.appendChild(newElement);
  clearSelection();
}

// Função para iniciar o arraste (touch)
function startDrag(element, event) {
  if (event.type === 'touchstart') {
    event.preventDefault();
    const touch = event.touches[0];
    isDragging = true;
    dragElement = element.cloneNode(true);
    
    // Calcular offset do toque
    const rect = element.getBoundingClientRect();
    touchOffset.x = touch.clientX - rect.left;
    touchOffset.y = touch.clientY - rect.top;
    
    // Estilizar elemento sendo arrastado
    dragElement.style.position = 'fixed';
    dragElement.style.zIndex = '9999';
    dragElement.style.pointerEvents = 'none';
    dragElement.style.opacity = '0.8';
    dragElement.style.transform = 'scale(1.1)';
    dragElement.style.left = (touch.clientX - touchOffset.x) + 'px';
    dragElement.style.top = (touch.clientY - touchOffset.y) + 'px';
    
    document.body.appendChild(dragElement);
    
    // Selecionar o item original se não estiver selecionado
    if (!element.classList.contains('item-selected')) {
      selectItem(element);
    }
  }
}

// Função para mover durante o arraste
function moveDrag(event) {
  if (!isDragging || !dragElement) return;
  
  event.preventDefault();
  const touch = event.touches[0];
  
  dragElement.style.left = (touch.clientX - touchOffset.x) + 'px';
  dragElement.style.top = (touch.clientY - touchOffset.y) + 'px';
  
  // Verificar se está sobre a área de construção
  const canvas = document.getElementById('moleculeCanvas');
  const canvasRect = canvas.getBoundingClientRect();
  
  if (touch.clientX >= canvasRect.left && 
      touch.clientX <= canvasRect.right && 
      touch.clientY >= canvasRect.top && 
      touch.clientY <= canvasRect.bottom) {
    canvas.classList.add('drag-over');
  } else {
    canvas.classList.remove('drag-over');
  }
}

// Função para finalizar o arraste
function endDrag(event) {
  if (!isDragging || !dragElement) return;
  
  event.preventDefault();
  const touch = event.changedTouches[0];
  
  // Remover elemento visual do arraste
  document.body.removeChild(dragElement);
  
  // Verificar se foi solto na área de construção
  const canvas = document.getElementById('moleculeCanvas');
  const canvasRect = canvas.getBoundingClientRect();
  
  if (touch.clientX >= canvasRect.left && 
      touch.clientX <= canvasRect.right && 
      touch.clientY >= canvasRect.top && 
      touch.clientY <= canvasRect.bottom) {
    // Adicionar o item na posição específica
    addSelectedItemAtPosition(touch.clientX - canvasRect.left, touch.clientY - canvasRect.top);
  }
  
  canvas.classList.remove('drag-over');
  isDragging = false;
  dragElement = null;
}

function clearCanvas() {
  document.getElementById('moleculeCanvas').innerHTML = '<p style="color: #94D2BD; font-style: italic; opacity: 0.7;">Selecione um item da paleta e clique aqui para adicioná-lo</p>';
  clearSelection();
}

function showFormulaImage(challenge) {
  // Verificar se já existe uma imagem da fórmula
  const existingFormulaImage = document.getElementById('formulaImage');
  if (existingFormulaImage) {
    existingFormulaImage.remove();
  }

  // Criar container para a imagem da fórmula estrutural
  const formulaContainer = document.createElement('div');
  formulaContainer.id = 'formulaImage';
  formulaContainer.className = 'formula-image-container';

  const formulaTitle = document.createElement('h3');
  formulaTitle.textContent = '🧪 Fórmula Estrutural';
  formulaTitle.className = 'formula-title';

  const formulaImg = document.createElement('img');
  formulaImg.src = challenge.image;
  formulaImg.alt = `Fórmula estrutural do ${challenge.name}`;
  formulaImg.className = 'formula-image';

  formulaContainer.appendChild(formulaTitle);
  formulaContainer.appendChild(formulaImg);

  // Inserir após o painel de desafio
  const challengePanel = document.querySelector('.challenge-panel');
  challengePanel.parentNode.insertBefore(formulaContainer, challengePanel.nextSibling);

  // Scroll suave para mostrar a imagem
  setTimeout(() => {
    formulaContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 500);
}

function checkAnswer() {
  const challenge = aldeidoss[currentChallengeIndex];
  const userCounts = { atoms: { C: 0, H: 0, O: 0 }, bonds: { single: 0, double: 0 } };

  document.querySelectorAll('#moleculeCanvas .placed-atom').forEach(el => {
    const { type, value } = el.dataset;
    if (type === 'atom') userCounts.atoms[value]++;
    else if (type === 'bond') userCounts.bonds[value]++;
  });

  const atomsCorrect = JSON.stringify(userCounts.atoms) === JSON.stringify(challenge.atoms);
  const bondsCorrect = JSON.stringify(userCounts.bonds) === JSON.stringify(challenge.bonds);
  const hasBonds = userCounts.bonds.single > 0 || userCounts.bonds.double > 0;

  let answeredCorrectly = false;

  if (atomsCorrect && bondsCorrect) {
    showFeedback('Excelente! Estrutura perfeita! 🎉 (+150 Pontos)', 'success');
    score += 150;
    answeredCorrectly = true;
  }
  else if (atomsCorrect && !hasBonds) {
    showFeedback('Correto! Fórmula molecular certa! 👍 (+75 Pontos)', 'success');
    score += 75;
    answeredCorrectly = true;
  }
  else {
    let error = 'Ops! Verifique sua montagem.\n';
    if (!atomsCorrect) error += 'A contagem de átomos está incorreta. ';
    else if (hasBonds && !bondsCorrect) error += 'A contagem de ligações está incorreta.';
    showFeedback(error, 'error');
  }

  if (answeredCorrectly) {
    challenge.completed = true;
    document.getElementById('score').textContent = score;

    // Mostrar a imagem da fórmula estrutural
    showFormulaImage(challenge);

    // Mostrar botão para avançar
    const controlsDiv = document.querySelector('.controls');
    if (!document.getElementById('nextButton')) {
      const nextBtn = document.createElement('button');
      nextBtn.id = 'nextButton';
      nextBtn.className = 'btn btn-secondary';
      nextBtn.textContent = 'Avançar ▶️';
      nextBtn.onclick = nextChallenge;
      controlsDiv.appendChild(nextBtn);
    }
    // Scroll para o painel do desafio atual após resposta
    document.querySelector('.challenge-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function showFeedback(message, type) {
  const feedback = document.createElement('div');
  feedback.className = `feedback ${type}`;
  feedback.textContent = message;
  document.body.appendChild(feedback);
  setTimeout(() => feedback.remove(), 4000);
}

function nextChallenge() {
  const remainingChallenges = aldeidoss.filter(c => !c.completed);

  if (remainingChallenges.length === 0) {
    document.querySelector('.game-area').innerHTML = `
      <div class="completion-message">
        <h2>Parabéns! 🏆</h2>
        <p>Você completou todos os desafios com sucesso!</p>
        <p>Sua pontuação final foi: <strong>${score}</strong></p>
        <button class="btn btn-primary" onclick="location.reload()">Jogar Novamente</button>
        <br><br>
        <a href="nomenclatura.html" class="btn btn-secondary">Desafio de Nomenclatura 🧪</a>
      </div>
    `;
  } else {
    currentChallengeIndex = aldeidoss.indexOf(remainingChallenges[0]);
    loadChallenge();
  }
}

// Modificação da função window.onload para incluir eventos touch
window.onload = function() {
  loadChallenge();
  
  // Adicionar eventos touch globais
  document.addEventListener('touchmove', moveDrag, { passive: false });
  document.addEventListener('touchend', endDrag, { passive: false });
  
  // Adicionar eventos touch para todos os elementos da paleta
  document.querySelectorAll('.atom, .bond').forEach(element => {
    element.addEventListener('touchstart', (e) => {
      startDrag(element, e);
    }, { passive: false });
  });
};

// --- CÓDIGO DO ASSISTENTE DE IA CORRIGIDO ---
const GEMINI_API_KEY = "AIzaSyDLWuGITQ2weE9jauEBZkTOFwKSH31V1h4";

// Aguardar o DOM carregar antes de configurar os event listeners
document.addEventListener('DOMContentLoaded', function() {
  const aiModal = document.getElementById("aiModal");
  const openAiModalBtn = document.getElementById("openAiModalBtn");
  const closeButton = document.querySelector(".close-button");
  const aiForm = document.getElementById("aiForm");
  const questionInput = document.getElementById("questionInput");
  const askButton = document.getElementById("askButton");
  const aiResponse = document.getElementById("aiResponse");
  const responseContent = aiResponse ? aiResponse.querySelector('.response-content') : null;

  // Verificar se showdown está disponível
  const markdownToHTML = (text) => {
    if (typeof showdown !== 'undefined') {
      return new showdown.Converter().makeHtml(text);
    }
    return text; // Fallback se showdown não estiver disponível
  };

  // Event listeners para o modal da IA
  if (openAiModalBtn && aiModal) {
    openAiModalBtn.onclick = () => aiModal.style.display = "block";
  }

  if (closeButton && aiModal) {
    closeButton.onclick = () => aiModal.style.display = "none";
  }

  // Fechar modal clicando fora
  window.onclick = event => { 
    if (event.target == aiModal) {
      aiModal.style.display = "none"; 
    }
  };

  // Função para fazer pergunta à IA com retry automático
  async function askAI(question, retryCount = 0) {
    const maxRetries = 3;
    const promptDeQuimica = `
## Especialidade
Você é um assistente especialista para o jogo "Aldeído Atômico".

## Tarefa
Você deve responder as perguntas do usuário com base no seu conhecimento sobre os aldeídos presentes no jogo (Metanal, Etanal, Propanal, Butanal), suas fórmulas e estruturas.

## Regras
- Se você não sabe a resposta, responda com 'Não sei'.
- Se a pergunta não está relacionada a química ou aldeídos, responda com 'Essa pergunta não está relacionada ao jogo de aldeídos'.
- Suas respostas devem ser baseadas no conhecimento fornecido abaixo.
- Responda outras perguntas sobre química mas somente se tiver certeza da resposta.

### Conhecimento do Jogo:
**Fórmulas Moleculares:**
- Metanal: CH₂O
- Etanal: C₂H₄O
- Propanal: C₃H₆O
- Butanal: C₄H₈O

**Fórmulas Estruturais (Contagem de Ligações):**
- Metanal: 2 ligações simples, 1 ligação dupla.
- Etanal: 5 ligações simples, 1 ligação dupla.
- Propanal: 8 ligações simples, 1 ligação dupla.
- Butanal: 11 ligações simples, 1 ligação dupla.

## Resposta
- Seja direto e responda no máximo 500 caracteres.
- Responda em markdown.
- Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

## Exemplo de resposta
Pergunta do usuário: Quantas ligações simples tem o propanal?
Resposta: O Propanal (C₃H₆O) possui **8 ligações simples** e 1 ligação dupla.

---
Aqui está a pergunta do usuário: ${question}
`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: promptDeQuimica }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro HTTP:', response.status, errorText);
        
        if (retryCount < maxRetries) {
          console.log(`Tentativa ${retryCount + 1} de ${maxRetries + 1} falhou. Tentando novamente...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Delay progressivo
          return askAI(question, retryCount + 1);
        }
        
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      }
      
      if (retryCount < maxRetries) {
        console.log(`Resposta inválida. Tentativa ${retryCount + 1} de ${maxRetries + 1}. Tentando novamente...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return askAI(question, retryCount + 1);
      }
      
      return "Não consegui gerar uma resposta válida. Tente reformular sua pergunta.";
      
    } catch (error) {
      console.error("Erro na API:", error);
      
      if (error.name === 'AbortError') {
        if (retryCount < maxRetries) {
          console.log(`Timeout. Tentativa ${retryCount + 1} de ${maxRetries + 1}. Tentando novamente...`);
          return askAI(question, retryCount + 1);
        }
        return "A consulta demorou muito para responder. Tente novamente.";
      }
      
      if (retryCount < maxRetries) {
        console.log(`Erro: ${error.message}. Tentativa ${retryCount + 1} de ${maxRetries + 1}. Tentando novamente...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return askAI(question, retryCount + 1);
      }
      
      return "Desculpe, ocorreu um erro ao buscar a resposta. Tente novamente mais tarde.";
    }
  }

  // Event listener para o formulário da IA
  if (aiForm) {
    aiForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      if (!questionInput || !questionInput.value.trim()) {
        return;
      }
      
      if (!askButton || !aiResponse || !responseContent) {
        console.error('Elementos da IA não encontrados');
        return;
      }
      
      // Desabilitar botão e mostrar loading
      askButton.disabled = true;
      askButton.classList.add('loading');
      askButton.textContent = 'Pensando...';
      
      // Mostrar área de resposta
      aiResponse.classList.remove('hidden');
      responseContent.innerHTML = "🤔 Analisando sua pergunta...";
      
      try {
        const text = await askAI(questionInput.value);
        responseContent.innerHTML = markdownToHTML(text);
      } catch (error) {
        console.error('Erro final:', error);
        responseContent.innerHTML = "❌ Não foi possível obter uma resposta. Tente novamente.";
      } finally {
        // Reabilitar botão
        askButton.disabled = false;
        askButton.classList.remove('loading');
        askButton.textContent = 'Perguntar';
      }
    });
  }
});