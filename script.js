function triggerButtonEffect(event) {
  const button = event.currentTarget;
  const burst = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);

  burst.className = 'click-burst';
  burst.style.width = size + 'px';
  burst.style.height = size + 'px';
  burst.style.left = (event.clientX - rect.left - size / 2) + 'px';
  burst.style.top = (event.clientY - rect.top - size / 2) + 'px';

  button.appendChild(burst);
  setTimeout(() => burst.remove(), 600);

  const pulse = document.createElement('span');
  pulse.className = 'sound-wave';
  pulse.style.left = '50%';
  pulse.style.top = '50%';
  button.appendChild(pulse);
  setTimeout(() => pulse.remove(), 500);
}

function showScreen(id) {
  document.querySelectorAll('main > section').forEach((section) => {
    section.classList.add('hidden');
  });

  const next = document.getElementById(id);
  if (!next) return;

  next.classList.remove('hidden');
  next.style.animation = 'none';
  void next.offsetWidth;
  next.style.animation = 'rise .7s ease both';
}

function updateMusicToggle(isPlaying) {
  const toggle = document.getElementById('musicToggle');
  toggle.hidden = false;
  toggle.setAttribute('aria-pressed', String(isPlaying));
  toggle.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
}

function startAmbientMusic() {
  const music = document.getElementById('backgroundMusic');
  if (!music) return;

  music.volume = 0.4;
  music.play()
    .then(() => updateMusicToggle(true))
    .catch(() => updateMusicToggle(false));
}

function toggleAmbientMusic() {
  const music = document.getElementById('backgroundMusic');
  if (!music) return;

  if (music.paused) {
    music.play()
      .then(() => updateMusicToggle(true))
      .catch(() => updateMusicToggle(false));
    return;
  }

  music.pause();
  updateMusicToggle(false);
}

function formatDateInput(event) {
  const input = event.currentTarget;
  const cursor = input.selectionStart ?? input.value.length;
  const digitsBeforeCursor = input.value.slice(0, cursor).replace(/\D/g, '').length;
  const digits = input.value.replace(/\D/g, '').slice(0, 8);
  let formatted = digits.slice(0, 2);

  if (digits.length > 2) formatted += '/' + digits.slice(2, 4);
  if (digits.length > 4) formatted += '/' + digits.slice(4);
  input.value = formatted;

  let nextCursor = 0;
  let digitsSeen = 0;
  while (nextCursor < formatted.length && digitsSeen < digitsBeforeCursor) {
    if (/\d/.test(formatted[nextCursor])) digitsSeen += 1;
    nextCursor += 1;
  }
  if (formatted[nextCursor] === '/' && digitsSeen >= 2) nextCursor += 1;
  input.setSelectionRange(nextCursor, nextCursor);
}

function checkDate() {
  const value = document
    .getElementById('dateAnswer')
    .value.trim()
    .toLowerCase()
    .replace(/\s+/g, '');

  const accepted = [
    '07/12/2026',
    '7/12/2026',
    '07/12/26',
    '7/12/26',
    'july12,2026'
  ];

  if (accepted.includes(value)) {
    showScreen('codeScreen');
    return;
  }

  document.getElementById('dateToast').textContent = 'Not quite, darling. Try 07/12/2026';
}

function checkCode() {
  if (document.getElementById('codeAnswer').value.trim() === '12') {
    showScreen('colorScreen');
    return;
  }

  document.getElementById('codeToast').textContent = 'Hmm, try again, darling. Hint: the day of our monthsarry.';
}

function checkColor(button, color) {
  if (color === 'Black') {
    showScreen('loveScreen');
    return;
  }

  document.getElementById('colorToast').textContent = 'Hehe, not that one. Try again!';
  document.querySelectorAll('.choice').forEach((item) => item.classList.remove('selected'));
  button.classList.add('selected');
}

function sayNo() {
  const button = document.getElementById('noButton');
  const rect = button.getBoundingClientRect();

  for (let i = 0; i < 12; i++) {
    const piece = document.createElement('span');
    piece.className = 'burst-piece';
    piece.textContent = ['♥', '✦', '✿', '❀'][i % 4];
    piece.style.left = (rect.left + Math.random() * rect.width) + 'px';
    piece.style.top = (rect.top + Math.random() * rect.height) + 'px';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 700);
  }

  document.getElementById('loveToast').textContent = 'No button has exploded! Only YES is allowed.';
  button.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(0) rotate(25deg)' }
    ],
    { duration: 450, fill: 'forwards' }
  );

  setTimeout(() => {
    button.style.visibility = 'hidden';
  }, 450);
}

function sayYes() {
  const yesButton = document.getElementById('yesButton');
  if (!yesButton || yesButton.disabled) return;

  yesButton.disabled = true;
  yesButton.textContent = 'I knew it! ❤️';

  setTimeout(() => {
    showScreen('messageScreen');
    sprinkleHearts();
  }, 420);
}

function openLoveMessage() {
  const letter = document.getElementById('loveLetter');
  const button = document.getElementById('openMessageButton');

  if (!letter || !button || !letter.classList.contains('hidden')) return;

  letter.classList.remove('hidden');
  letter.classList.remove('message-reveal');
  void letter.offsetWidth;
  letter.classList.add('message-reveal');
  button.hidden = true;
  document.getElementById('moreLoveButton').hidden = false;
  sprinkleHearts();
}

function sprinkleHearts() {
  const symbols = ['♥', '✦', '✿', '❀', '♡'];

  for (let i = 0; i < 26; i++) {
    const item = document.createElement('span');
    item.className = 'burst-piece';
    item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    item.style.left = Math.random() * 100 + 'vw';
    item.style.top = (25 + Math.random() * 70) + 'vh';
    item.style.fontSize = (18 + Math.random() * 20) + 'px';
    document.body.appendChild(item);
    setTimeout(() => item.remove(), 900);
  }
}

const introOverlay = document.querySelector('.intro-overlay');
if (introOverlay) {
  setTimeout(() => introOverlay.classList.add('hide'), 5000);
}

document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', triggerButtonEffect);
});

document.querySelector('[data-next="dateScreen"]').addEventListener('click', () => {
  startAmbientMusic();
  showScreen('dateScreen');
});
document.getElementById('musicToggle').addEventListener('click', toggleAmbientMusic);
document.getElementById('dateButton').addEventListener('click', checkDate);
document.getElementById('codeButton').addEventListener('click', checkCode);
document.getElementById('dateAnswer').addEventListener('input', formatDateInput);

document.querySelectorAll('[data-color]').forEach((button) => {
  button.addEventListener('click', () => checkColor(button, button.dataset.color));
});

document.getElementById('noButton').addEventListener('click', sayNo);
document.getElementById('yesButton').addEventListener('click', sayYes);
document.getElementById('openMessageButton').addEventListener('click', openLoveMessage);
document.getElementById('moreLoveButton').addEventListener('click', sprinkleHearts);

document.getElementById('dateAnswer').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') checkDate();
});

document.getElementById('codeAnswer').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') checkCode();
});
