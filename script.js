/* ============================================================
   YARA JAMAL — BIRTHDAY SURPRISE WEBSITE
   Premium Interactive Script
   ============================================================ */

(function () {
    'use strict';

    /* ---------- UTILITIES ---------- */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) || window.innerWidth < 768;

    /* ---------- DOM ELEMENTS ---------- */
    const opening = $('#opening');
    const openBtn = $('#open-btn');
    const mainContent = $('#main-content');
    const musicToggle = $('#music-toggle');
    const bgMusic = $('#bg-music');
    const wishBtn = $('#wish-btn');
    const wishMessage = $('#wish-message');
    const secretBtn = $('#secret-btn');
    const secretReveal = $('#secret-reveal');
    const countdownDisplay = $('#countdown-display');
    const countdownComplete = $('#countdown-complete');
    const canvas = $('#particles-canvas');
    const ctx = canvas.getContext('2d');
    const cursorTrail = $('#cursor-trail');
    const cakeVisual = $('#cake-visual');

    /* ============================================================
       PARTICLES SYSTEM
       ============================================================ */
    let particles = [];
    let animFrame;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.type = Math.random() > 0.7 ? 'heart' : Math.random() > 0.5 ? 'star' : 'dot';
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += this.pulseSpeed;
            this.opacity = (Math.sin(this.pulse) * 0.3 + 0.4) * (prefersReducedMotion ? 0.8 : 1);

            if (this.x < -10 || this.x > canvas.width + 10 ||
                this.y < -10 || this.y > canvas.height + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;

            if (this.type === 'heart') {
                ctx.fillStyle = '#EC4899';
                ctx.font = `${this.size * 6}px serif`;
                ctx.fillText('💜', this.x, this.y);
            } else if (this.type === 'star') {
                ctx.fillStyle = '#A78BFA';
                ctx.beginPath();
                this.drawStar(this.x, this.y, 5, this.size * 3, this.size * 1.5);
                ctx.fill();
            } else {
                ctx.fillStyle = 'rgba(167, 139, 250, 0.6)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }

        drawStar(cx, cy, spikes, outerR, innerR) {
            let rot = Math.PI / 2 * 3;
            const step = Math.PI / spikes;
            ctx.beginPath();
            ctx.moveTo(cx, cy - outerR);
            for (let i = 0; i < spikes; i++) {
                ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
                rot += step;
                ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
                rot += step;
            }
            ctx.closePath();
        }
    }

    function initParticles() {
        if (prefersReducedMotion) return;
        resizeCanvas();
        const count = isMobile ? 30 : 60;
        particles = Array.from({ length: count }, () => new Particle());
        animateParticles();
    }

    function animateParticles() {
        if (prefersReducedMotion) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animFrame = requestAnimationFrame(animateParticles);
    }

    /* ============================================================
       CURSOR TRAIL (Desktop Only)
       ============================================================ */
    let trailDots = [];
    const TRAIL_COUNT = 12;

    function initCursorTrail() {
        if (isMobile || prefersReducedMotion) return;

        for (let i = 0; i < TRAIL_COUNT; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-dot';
            dot.style.width = `${8 - i * 0.5}px`;
            dot.style.height = `${8 - i * 0.5}px`;
            cursorTrail.appendChild(dot);
            trailDots.push({ el: dot, x: 0, y: 0 });
        }

        document.addEventListener('mousemove', (e) => {
            trailDots[0].x = e.clientX;
            trailDots[0].y = e.clientY;
        });

        animateTrail();
    }

    function animateTrail() {
        if (prefersReducedMotion) return;

        for (let i = trailDots.length - 1; i > 0; i--) {
            trailDots[i].x += (trailDots[i - 1].x - trailDots[i].x) * 0.35;
            trailDots[i].y += (trailDots[i - 1].y - trailDots[i].y) * 0.35;
        }

        trailDots.forEach((dot, i) => {
            dot.el.style.left = `${dot.x}px`;
            dot.el.style.top = `${dot.y}px`;
            dot.el.style.opacity = `${0.6 - i * 0.05}`;
        });

        requestAnimationFrame(animateTrail);
    }

    /* ============================================================
       OPENING SCREEN
       ============================================================ */
    function initOpening() {
        spawnOpeningHearts();

        openBtn.addEventListener('click', () => {
            openBtn.style.pointerEvents = 'none';
            spawnBurstHearts(opening.querySelector('.opening-hearts'));

            setTimeout(() => {
                opening.classList.add('fade-out');
                setTimeout(() => {
                    opening.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    document.body.style.overflow = '';
                    initScrollAnimations();
                    startCountdown();
                }, 800);
            }, 400);
        });
    }

    function spawnOpeningHearts() {
        const container = opening.querySelector('.opening-hearts');
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('span');
                heart.className = 'floating-heart';
                heart.textContent = ['💜', '💗', '✨', '🌸'][Math.floor(Math.random() * 4)];
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.bottom = `${Math.random() * 20}%`;
                heart.style.animationDuration = `${3 + Math.random() * 3}s`;
                container.appendChild(heart);
                setTimeout(() => heart.remove(), 6000);
            }, i * 300);
        }
    }

    function spawnBurstHearts(container) {
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('span');
            heart.className = 'floating-heart';
            heart.textContent = ['💜', '💗', '✨', '🎂', '🎉'][Math.floor(Math.random() * 5)];
            heart.style.left = `${40 + Math.random() * 20}%`;
            heart.style.bottom = '40%';
            heart.style.animationDuration = `${2 + Math.random() * 2}s`;
            heart.style.fontSize = `${1 + Math.random() * 1.5}rem`;
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 5000);
        }
    }

    /* ============================================================
       MUSIC
       ============================================================ */
    function initMusic() {
        let isPlaying = false;

        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
            } else {
                bgMusic.play().then(() => {
                    musicToggle.classList.add('playing');
                }).catch(() => {});
            }
            isPlaying = !isPlaying;
        });
    }

    /* ============================================================
       COUNTDOWN
       ============================================================ */
    function startCountdown() {
        const target = new Date('2026-08-30T00:00:00').getTime();

        function update() {
            const now = Date.now();
            const diff = target - now;

            if (diff <= 0) {
                countdownDisplay.classList.add('hidden');
                countdownComplete.classList.remove('hidden');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            $('#cd-days').textContent = String(days).padStart(2, '0');
            $('#cd-hours').textContent = String(hours).padStart(2, '0');
            $('#cd-minutes').textContent = String(minutes).padStart(2, '0');
            $('#cd-seconds').textContent = String(seconds).padStart(2, '0');
        }

        update();
        setInterval(update, 1000);
    }

    /* ============================================================
       CAKE WISH
       ============================================================ */
    function initCakeWish() {
        wishBtn.addEventListener('click', () => {
            wishBtn.style.pointerEvents = 'none';
            wishBtn.textContent = '✨';

            const candles = cakeVisual.querySelectorAll('.candle');
            candles.forEach(c => c.classList.add('candles-lit'));

            setTimeout(() => {
                wishMessage.classList.remove('hidden');
                wishMessage.style.animation = 'fadeInUp 1s var(--ease-smooth)';
                spawnConfetti();
            }, 1200);
        });
    }

    /* ============================================================
       SECRET MESSAGE
       ============================================================ */
    function initSecret() {
        secretBtn.addEventListener('click', () => {
            secretBtn.style.pointerEvents = 'none';
            secretReveal.classList.remove('hidden');
            secretBtn.classList.add('hidden');

            const reveals = $$('.secret-final', secretReveal);
            reveals.forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.filter = 'blur(4px)';
                setTimeout(() => {
                    el.style.transition = 'all 0.8s var(--ease-smooth)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    el.style.filter = 'blur(0)';
                }, 300 + i * 600);
            });

            setTimeout(() => spawnConfetti(), 800);
        });
    }

    /* ============================================================
       CONFETTI
       ============================================================ */
    function spawnConfetti() {
        if (prefersReducedMotion) return;

        const colors = ['#7C3AED', '#A78BFA', '#EC4899', '#F9A8D4', '#FFFFFF'];
        const shapes = ['circle', 'rect', 'heart'];
        const count = isMobile ? 40 : 80;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const piece = document.createElement('div');
                piece.className = 'confetti-piece';
                const color = colors[Math.floor(Math.random() * colors.length)];
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                const size = 6 + Math.random() * 8;

                piece.style.left = `${Math.random() * 100}vw`;
                piece.style.width = `${size}px`;
                piece.style.height = `${size}px`;
                piece.style.background = color;
                piece.style.borderRadius = shape === 'circle' ? '50%' : shape === 'heart' ? '50% 0 0 50%' : '2px';
                piece.style.animationDuration = `${3 + Math.random() * 4}s`;
                piece.style.animationDelay = `${Math.random() * 0.5}s`;

                if (shape === 'heart') {
                    piece.style.background = 'none';
                    piece.style.color = color;
                    piece.style.fontSize = `${size}px`;
                    piece.style.width = 'auto';
                    piece.style.height = 'auto';
                    piece.textContent = '💜';
                }

                document.body.appendChild(piece);
                setTimeout(() => piece.remove(), 8000);
            }, i * 30);
        }
    }

    /* ============================================================
       SCROLL ANIMATIONS
       ============================================================ */
    function initScrollAnimations() {
        if (prefersReducedMotion) {
            $$('.animate-on-scroll').forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        $$('.animate-on-scroll').forEach(el => observer.observe(el));
    }

    /* ============================================================
       INITIALIZATION
       ============================================================ */
    document.body.style.overflow = 'hidden';

    window.addEventListener('load', () => {
        initParticles();
        initCursorTrail();
        initOpening();
        initMusic();
        initCakeWish();
        initSecret();
    });

    window.addEventListener('resize', () => {
        if (!prefersReducedMotion) {
            resizeCanvas();
        }
    });

})();
