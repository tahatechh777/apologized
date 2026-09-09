/* ============================================================
   APOLOGY WEBSITE FOR YARA — script.js
   Modern vanilla JavaScript for scroll animations,
   floating hearts, confetti, and the playful moving button.
   ============================================================ */

'use strict';

/* ------------------------------------------------
   1. Floating hearts background
   ------------------------------------------------ */
(function setupFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  if (!container) return;

  // Reduce number of hearts on small screens for better performance
  const isMobile = window.matchMedia('(max-width: 600px)').matches;
  const count = isMobile ? 10 : 16;
  const hearts = ['❤️', '💜', '💗', '💜', '🩷'];

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[i % hearts.length];

    // Randomize position, size, duration and delay
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
   2. Smooth scrolling buttons
   ------------------------------------------------ */
document.addEventListener('click', (event) => {
  const startButton = document.getElementById('startButton');
  const keepReadingButton = document.getElementById('keepReadingButton');

  if (event.target.closest('#startButton')) {
    startButton.blur();
    document.getElementById('apology').scrollIntoView({ behavior: 'smooth' });
  } else if (event.target.closest('#keepReadingButton')) {
    keepReadingButton.blur();
    document.getElementById('cards').scrollIntoView({ behavior: 'smooth' });
  }
});

/* ------------------------------------------------
   3. Scroll reveal animations (IntersectionObserver)
   ------------------------------------------------ */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Reveal only once
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
   4. Confetti pieces for the "I forgive you" button
   ------------------------------------------------ */
function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  if (!container) return;

  // Remove any previous pieces
  container.innerHTML = '';

  const colors = [
    '#e74c6f', // red
    '#9b6dff', // purple
    '#d97fbf', // pink
    '#c084fc', // lavender
    '#ff8fab', // soft coral
    '#7c7cff', // soft blue-purple
  ];

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

  // Clean up after animation finishes
  setTimeout(() => {
    container.innerHTML = '';
  }, 6000);
}

/* ------------------------------------------------
   5. "I forgive you" button → thank-you message
   ------------------------------------------------ */
function showThankYouMessage() {
  const message = document.getElementById('thankYouMessage');
  if (!message) return;

  message.classList.remove('hidden');
  message.scrollIntoView({ behavior: 'smooth', block: 'center' });
  launchConfetti();

  // Gentle heart burst delivered as emoji rain from message position
  burstHearts();
}

const forgiveButton = document.getElementById('forgiveButton');
if (forgiveButton) {
  forgiveButton.addEventListener('click', showThankYouMessage);
}

/* Heart burst — a few hearts that pop upward near the message */
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

    // Animate outward using Web Animations API
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

    // Remove element after animation completes
    setTimeout(() => h.remove(), 1800);
  }
}

/* ------------------------------------------------
   6. Playful moving "Still mad" button
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

  /* Determine the safe area to move the button within.
     We keep it inside the wrapper area but nudge it around,
     staying within the viewport at all times. */
  function moveAway(event) {
    attempts += 1;

    if (attempts >= maxAttempts) {
      revealedFallback();
      return;
    }

    const btnRect = madButton.getBoundingClientRect();
    const wrapRect = wrapper.getBoundingClientRect();
    const btnW = btnRect.width;
    const btnH = btnRect.height;

    // Candidate movement amount (px)
    const travel = 40 + attempts * 14;

    // Pick a direction (x and y) without leaving the viewport
    let dx = (Math.random() - 0.5) * 2;
    let dy = (Math.random() - 0.5) * 2;

    if (dx === 0) dx = 1;
    if (dy === 0) dy = 1;

    let newX = Math.round(btnRect.left - wrapRect.left + dx * travel);
    let newY = Math.round(btnRect.top - wrapRect.top + dy * travel);

    // Clamp within the wrapper bounds (which itself stays in view)
    const margin = 4;
    newX = Math.max(margin, Math.min(newX, wrapRect.width - btnW - margin));
    newY = Math.max(margin, Math.min(newY, wrapRect.height - btnH - margin));

    madButton.style.position = 'absolute';
    madButton.style.left = newX + 'px';
    madButton.style.top = newY + 'px';

    // Slight playful tilt
    madButton.style.transform = `rotate(${(Math.random() - 0.5) * 12}deg)`;
  }

  // Desktop: trigger on mouse enter / click attempt
  function onDesktopMove(event) {
    const btnRect = madButton.getBoundingClientRect();
    const padX = 8;
    const padY = 8;
    // Only dodge when the cursor is actually near/over the button
    if (
      event.clientX >= btnRect.left - padX &&
      event.clientX <= btnRect.right + padX &&
      event.clientY >= btnRect.top - padY &&
      event.clientY <= btnRect.bottom + padY
    ) {
      moveAway(event);
    }
  }

  // Touch: dodge on touchstart before the click could register
  function onTouchStart(event) {
    event.preventDefault();
    moveAway(event);
  }

  // Suppress real activation
  madButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    moveAway(event);
  });

  // Add listeners (guard for environments lacking old APIs)
  if (window.PointerEvent) {
    madButton.addEventListener(
      'pointerdown',
      (event) => {
        if (event.pointerType === 'touch') {
          event.preventDefault();
          moveAway(event);
        }
      },
      { passive: false }
    );

    madButton.addEventListener(
      'pointerenter',
      (event) => {
        if (event.pointerType === 'mouse') onDesktopMove(event);
      }
    );
  } else {
    // Fallback for older browsers
    madButton.addEventListener('mouseenter', onDesktopMove);
    madButton.addEventListener('touchstart', onTouchStart, { passive: false });
  }

  // Keep the button reachable when the window resizes
  window.addEventListener('resize', () => {
    madButton.style.position = '';
    madButton.style.left = '';
    madButton.style.top = '';
    madButton.style.transform = '';
  });
})();