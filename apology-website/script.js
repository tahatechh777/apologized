/* ============================================================
   APOLOGY WEBSITE FOR YARA — script.js
   Modern vanilla JavaScript for scroll animations,
   floating hearts, confetti, music control, and playful elements.
   ============================================================ */

'use strict';

/* ------------------------------------------------
   1. Floating hearts background
   ------------------------------------------------ */
(function setupFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  if (!container) return;

  const isMobile = window.matchMedia('(max-width: 600px)').matches;
  const count = isMobile ? 10 : 16;
  const hearts = ['❤️', '💜', '💗', '💜', '🩷'];

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[i % hearts.length];

    const size = 12 + Math.random() * 18;
    const duration = 12 + Math.random() * 14;
    const delay = Math.random() * 14;
    const left = Math.random() * 100;

    heart.style.left = left + 'vw';
    heart.style.fontSize = size + 'px';
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = delay + 's';

    container.appendChild(heart);
  }
})();

/* ------------------------------------------------
   2. Reading progress bar & Smooth scrolling
   ------------------------------------------------ */
window.addEventListener('scroll', () => {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;

  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (totalHeight > 0) {
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }
});

document.addEventListener('click', (event) => {
  const startButton = document.getElementById('startButton');
  const keepReadingButton = document.getElementById('keepReadingButton');

  if (event.target.closest('#startButton')) {
    if (startButton) startButton.blur();
    document.getElementById('apology')?.scrollIntoView({ behavior: 'smooth' });
  } else if (event.target.closest('#keepReadingButton')) {
    if (keepReadingButton) keepReadingButton.blur();
    document.getElementById('cards')?.scrollIntoView({ behavior: 'smooth' });
  }
});

/* ------------------------------------------------
   3. Background Music Control (Robust Autoplay Fix)
   ------------------------------------------------ */
(function setupMusicPlayer() {
  const musicBtn = document.getElementById('music-btn');
  const bgMusic = document.getElementById('bg-music');

  if (!bgMusic) {
    console.error('Audio element #bg-music not found!');
    return;
  }

  function playAudio() {
    bgMusic.play().then(() => {
      console.log('Audio playing successfully!');
      if (musicBtn) musicBtn.classList.add('playing');
    }).catch(err => {
      console.warn('Audio play error:', err.message);
    });
  }

  function pauseAudio() {
    bgMusic.pause();
    if (musicBtn) musicBtn.classList.remove('playing');
  }

  // التحكم عبر الزر العائم
  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (bgMusic.paused) {
        playAudio();
      } else {
        pauseAudio();
      }
    });
  }

  // تشغيل الصوت فور نسيان المستخدم أو ضغطه على أي مكان بالصفحة / الزر الأول
  const enableAudioOnInteraction = () => {
    if (bgMusic.paused) {
      playAudio();
    }
  };

  document.addEventListener('click', enableAudioOnInteraction, { once: true });
  document.addEventListener('touchstart', enableAudioOnInteraction, { once: true });
})();
/* ------------------------------------------------
   4. Scroll reveal animations (IntersectionObserver)
   ------------------------------------------------ */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  }
);

document
  .querySelectorAll('.scroll-reveal, .scroll-reveal-card')
  .forEach((el) => revealObserver.observe(el));

/* ------------------------------------------------
   5. Confetti pieces for the "I forgive you" button
   ------------------------------------------------ */
function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  if (!container) return;

  container.innerHTML = '';

  const colors = ['#e74c6f', '#9b6dff', '#d97fbf', '#c084fc', '#ff8fab', '#7c7cff'];
  const pieceCount = 60;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';

    const size = 6 + Math.random() * 8;
    const left = Math.random() * 100;
    const duration = 2.4 + Math.random() * 2.2;
    const delay = Math.random() * 0.9;
    const color = colors[Math.floor(Math.random() * colors.length)];

    piece.style.left = left + 'vw';
    piece.style.width = size + 'px';
    piece.style.height = (size * 1.4) + 'px';
    piece.style.background = color;
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDuration = duration + 's';
    piece.style.animationDelay = delay + 's';

    container.appendChild(piece);
  }

  setTimeout(() => {
    container.innerHTML = '';
  }, 6000);
}

/* ------------------------------------------------
   6. "I forgive you" button & Retry fallback
   ------------------------------------------------ */
function showThankYouMessage() {
  const message = document.getElementById('thankYouMessage');
  const stillMadMessage = document.getElementById('stillMadMessage');
  const buttonsWrapper = document.getElementById('buttonsWrapper');

  if (!message) return;

  if (stillMadMessage) stillMadMessage.classList.add('hidden');
  if (buttonsWrapper) buttonsWrapper.classList.add('hidden');

  message.classList.remove('hidden');
  message.scrollIntoView({ behavior: 'smooth', block: 'center' });
  launchConfetti();
  burstHearts();
}

const forgiveButton = document.getElementById('forgiveButton');
if (forgiveButton) {
  forgiveButton.addEventListener('click', showThankYouMessage);
}

const retryButton = document.getElementById('retryButton');
if (retryButton) {
  retryButton.addEventListener('click', () => {
    const stillMadMessage = document.getElementById('stillMadMessage');
    const madButton = document.getElementById('madButton');
    
    if (stillMadMessage) stillMadMessage.classList.add('hidden');
    if (madButton) {
      madButton.style.position = '';
      madButton.style.left = '';
      madButton.style.top = '';
      madButton.style.transform = '';
    }
  });
}

function burstHearts() {
  const message = document.getElementById('thankYouMessage');
  if (!message) return;

  const heartEmojis = ['❤️', '💜', '💗', '💜', '🩷'];
  const rect = message.getBoundingClientRect();
  const burstCount = 12;

  for (let i = 0; i < burstCount; i++) {
    const h = document.createElement('span');
    h.textContent = heartEmojis[i % heartEmojis.length];
    h.style.position = 'fixed';
    h.style.left = rect.left + rect.width / 2 + (Math.random() - 0.5) * 160 + 'px';
    h.style.top = rect.top + rect.height / 2 + 'px';
    h.style.fontSize = 16 + Math.random() * 18 + 'px';
    h.style.zIndex = '1001';
    h.style.pointerEvents = 'none';
    h.style.opacity = '0';
    document.body.appendChild(h);

    const angle = Math.random() * Math.PI * 2;
    const distance = 90 + Math.random() * 110;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 60;

    h.animate(
      [
        { transform: 'translate(0,0) scale(0.6)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(1)`, opacity: 0 }
      ],
      { duration: 1200 + Math.random() * 600, easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)' }
    );

    setTimeout(() => h.remove(), 1800);
  }
}

/* ------------------------------------------------
   7. Playful moving "Still mad" button
   ------------------------------------------------ */
(function setupMoveAwayButton() {
  const madButton = document.getElementById('madButton');
  if (!madButton) return;

  const wrapper = document.getElementById('buttonsWrapper');
  let attempts = 0;
  const maxAttempts = 6;

  const revealedFallback = () => {
    const fallbackMsg = document.getElementById('stillMadMessage');
    if (fallbackMsg) fallbackMsg.classList.remove('hidden');
  };

  function moveAway() {
    attempts += 1;

    if (attempts >= maxAttempts) {
      revealedFallback();
      return;
    }

    const btnRect = madButton.getBoundingClientRect();
    const wrapRect = wrapper.getBoundingClientRect();
    const btnW = btnRect.width;
    const btnH = btnRect.height;

    const travel = 40 + attempts * 14;

    let dx = (Math.random() - 0.5) * 2;
    let dy = (Math.random() - 0.5) * 2;

    if (dx === 0) dx = 1;
    if (dy === 0) dy = 1;

    let newX = Math.round(btnRect.left - wrapRect.left + dx * travel);
    let newY = Math.round(btnRect.top - wrapRect.top + dy * travel);

    const margin = 4;
    newX = Math.max(margin, Math.min(newX, wrapRect.width - btnW - margin));
    newY = Math.max(margin, Math.min(newY, wrapRect.height - btnH - margin));

    madButton.style.position = 'absolute';
    madButton.style.left = newX + 'px';
    madButton.style.top = newY + 'px';
    madButton.style.transform = `rotate(${(Math.random() - 0.5) * 12}deg)`;
  }

  function onDesktopMove(event) {
    const btnRect = madButton.getBoundingClientRect();
    const padX = 8;
    const padY = 8;
    if (
      event.clientX >= btnRect.left - padX &&
      event.clientX <= btnRect.right + padX &&
      event.clientY >= btnRect.top - padY &&
      event.clientY <= btnRect.bottom + padY
    ) {
      moveAway();
    }
  }

  madButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    moveAway();
  });

  if (window.PointerEvent) {
    madButton.addEventListener(
      'pointerdown',
      (event) => {
        if (event.pointerType === 'touch') {
          event.preventDefault();
          moveAway();
        }
      },
      { passive: false }
    );

    madButton.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') onDesktopMove(event);
    });
  } else {
    madButton.addEventListener('mouseenter', onDesktopMove);
    madButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      moveAway();
    }, { passive: false });
  }

  window.addEventListener('resize', () => {
    madButton.style.position = '';
    madButton.style.left = '';
    madButton.style.top = '';
    madButton.style.transform = '';
  });
})();