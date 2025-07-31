// --- CÓDIGO DO JOGO ALDEÍDO ATÔMICO ---

const aldeidoss = [
  { name: "Metanal (Formaldeído)", hint: "O aldeído mais simples!", atoms: { C: 1, H: 2, O: 1 }, bonds: { single: 2, double: 1 }, completed: false },
  { name: "Etanal (Acetaldeído)", hint: "Um metil ligado ao grupo -CHO.", atoms: { C: 2, H: 4, O: 1 }, bonds: { single: 5, double: 1 }, completed: false },
  { name: "Propanal", hint: "3 carbonos em cadeia linear.", atoms: { C: 3, H: 6, O: 1 }, bonds: { single: 8, double: 1 }, completed: false },
  { name: "Butanal", hint: "4 carbonos em cadeia linear.", atoms: { C: 4, H: 8, O: 1 }, bonds: { single: 11, double: 1 }, completed: false }
];

let currentChallengeIndex = 0;
let score = 0;
let selectedItem = null;

function loadChallenge() {
  const challenge = aldeidoss[currentChallengeIndex];
  document.getElementById('aldehydeName').textContent = challenge.name;
  document.getElementById('hint').textContent = challenge.hint;
  clearCanvas();
  clearSelection();

  // Remover botão "Avançar", se existir
  const existingNextBtn = document.getElementById('nextButton');
  if (existingNextBtn) existingNextBtn.remove();

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

function clearCanvas() {
  document.getElementById('moleculeCanvas').innerHTML = '<p style="color: #94D2BD; font-style: italic; opacity: 0.7;">Selecione um item da paleta e clique aqui para adicioná-lo</p>';
  clearSelection();
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

window.onload = loadChallenge;