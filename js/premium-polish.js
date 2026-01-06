/* --- Premium Polish Layer JS --- */

document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initCustomCursor();
    initMagneticElements();
    initTextReveals();
    initSpotlight();
    initHeroGlitch();
    initAudioFade();
    initLiquidBg();
    initTitleScrub();
    initCardShimmer();
    initSectionMorph();
    initOmegaEnvironment();
    initAchievements();
    initNarrativeGuide();
    initAdaptiveSound();
    initParticleField(); // WebGL fallback
    initPortalTransitions();
    init3DVault();
});

// 1. Lenis Smooth Scroll
function initLenis() {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }
}

// 2. Custom Cursor
function initCustomCursor() {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const lerpDot = 0.2;
        const lerpRing = 0.1;

        dotX += (mouseX - dotX) * lerpDot;
        dotY += (mouseY - dotY) * lerpDot;
        ringX += (mouseX - ringX) * lerpRing;
        ringY += (mouseY - ringY) * lerpRing;

        if (dot) dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
        if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, .js-magnetic, .js-tilt');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => ring && ring.classList.add('active'));
        el.addEventListener('mouseleave', () => ring && ring.classList.remove('active'));
    });
}

// 3. Magnetic Elements Effect
function initMagneticElements() {
    const magnets = document.querySelectorAll('.js-magnetic');

    magnets.forEach(target => {
        target.addEventListener('mousemove', function (e) {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(target, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3,
                ease: "power2.out",
                force3D: true
            });

            const ring = document.querySelector('.cursor-ring');
            if (ring) ring.classList.add('magnetic');
        });

        target.addEventListener('mouseleave', function () {
            gsap.to(target, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)",
                force3D: true
            });

            const ring = document.querySelector('.cursor-ring');
            if (ring) ring.classList.remove('magnetic');
        });
    });
}

// 4. Staggered Text Reveals
function initTextReveals() {
    if (typeof ScrollTrigger !== 'undefined') {
        const reveals = document.querySelectorAll('.js-reveal');

        reveals.forEach(el => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power4.out",
                force3D: true
            });
        });
    }
}

// 5. Dynamic Spotlight Glow
function initSpotlight() {
    const spotlightSections = document.querySelectorAll('.about, .cta, .discover');

    spotlightSections.forEach(section => {
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            section.style.setProperty('--mouse-x', `${x}px`);
            section.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// 6. Hero Title Glitch Effect
function initHeroGlitch() {
    const titles = document.querySelectorAll('.hero__label');
    titles.forEach(title => {
        title.addEventListener('mouseenter', () => {
            gsap.to(title, {
                skewX: 20,
                duration: 0.1,
                ease: "power4.inOut",
                onComplete: () => {
                    gsap.to(title, { skewX: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
                }
            });
        });
    });
}

// 7. Audio Volume Fading & Robust Playback (TITAN OVERRIDE)
function initAudioFade() {
    const audio = document.getElementById('master-bg-audio');
    const btn = document.getElementById('master-audio-btn');

    if (!audio || !btn) return;

    audio.volume = 0;

    const handleToggle = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }

        const isPlaying = !audio.paused;
        if (isPlaying) {
            gsap.to(audio, {
                volume: 0, duration: 1, onComplete: () => {
                    audio.pause();
                    btn.classList.remove('is-playing');
                    btn.setAttribute('aria-pressed', 'false');
                }
            });
        } else {
            // "Sonic Rebirth" Unlock: Force max volume and unmute
            audio.muted = false;
            audio.volume = 1;

            audio.play().then(() => {
                btn.classList.add('is-playing');
                btn.setAttribute('aria-pressed', 'true');

                // Visual Pulse to confirm sound is active
                gsap.fromTo(btn, { scale: 0.8 }, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 3 });

                if (!achievementsUnlocked.has('audio-sonic')) {
                    unlockAchievement('Sonic Master', 'Heard the soul of the Nexus');
                    achievementsUnlocked.add('audio-sonic');
                }
            }).catch(err => {
                console.error("Audio Recovery Blocked:", err);
                gsap.to(btn, { x: 10, duration: 0.05, repeat: 5, yoyo: true });
            });
        }
    };

    // Layer 1: Direct Event Capture (Highest Priority)
    btn.addEventListener('click', handleToggle, true);

    // Layer 2: Explicit Window Intercept
    window.addEventListener('click', (e) => {
        if (e.target.closest('#master-audio-btn')) {
            handleToggle(e);
        }
    }, true);

    // Layer 3: Direct Property Hijack (Framework bypass)
    btn.onclick = (e) => handleToggle(e);
}

// 8. Liquid Background Animation
function initLiquidBg() {
    const container = document.createElement('div');
    container.className = 'liquid-bg';
    document.body.appendChild(container);

    const blobs = [];
    for (let i = 0; i < 3; i++) {
        const blob = document.createElement('div');
        blob.className = 'blob';
        container.appendChild(blob);
        blobs.push({
            el: blob,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }

    function animateBlobs() {
        blobs.forEach(b => {
            b.x += b.vx;
            b.y += b.vy;

            if (b.x < -300 || b.x > window.innerWidth) b.vx *= -1;
            if (b.y < -300 || b.y > window.innerHeight) b.vy *= -1;

            b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
        });
        requestAnimationFrame(animateBlobs);
    }
    animateBlobs();
}

// 9. Elite Title Scrub (Tracking & Skew)
function initTitleScrub() {
    if (typeof ScrollTrigger !== 'undefined') {
        const titles = document.querySelectorAll('.js-reveal');

        titles.forEach(title => {
            gsap.to(title, {
                scrollTrigger: {
                    trigger: title,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                },
                letterSpacing: "0.1em",
                skewX: -5,
                ease: "none",
                force3D: true
            });
        });
    }
}

// 10. Interactive Card Shimmer
function initCardShimmer() {
    const cards = document.querySelectorAll('.discover__item');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--shimmer-x', `${x}%`);
            card.style.setProperty('--shimmer-y', `${y}%`);

            const rotate = (x - 50) * 0.5;
            card.style.setProperty('--shimmer-rotate', `${rotate}deg`);
        });
    });
}

// 11. 3D Section Morphing
function initSectionMorph() {
    if (typeof ScrollTrigger !== 'undefined') {
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            gsap.fromTo(section,
                { rotationX: 2, scale: 0.98, opacity: 0.9 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "top top",
                        scrub: 1
                    },
                    rotationX: 0,
                    scale: 1,
                    opacity: 1,
                    ease: "none",
                    force3D: true
                }
            );
        });
    }
}

// 12. Real-Time Environment Sync
function initOmegaEnvironment() {
    const overlay = document.createElement('div');
    overlay.className = 'env-overlay';
    document.body.appendChild(overlay);

    const hour = new Date().getHours();
    let tint = '';

    if (hour >= 20 || hour < 6) tint = 'rgba(0, 0, 100, 0.4)';
    else if (hour >= 6 && hour < 10) tint = 'rgba(255, 100, 0, 0.2)';
    else if (hour >= 17 && hour < 20) tint = 'rgba(255, 0, 50, 0.2)';
    else tint = 'transparent';

    overlay.style.backgroundColor = tint;
}

// 13. Achievement & XP System
let userXP = 0;
const achievementsUnlocked = new Set();

function initAchievements() {
    const xpContainer = document.createElement('div');
    xpContainer.className = 'xp-container';
    xpContainer.innerHTML = '<div class="xp-bar"></div>';
    document.body.appendChild(xpContainer);

    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        updateXP(Math.floor(scrolled));

        if (scrolled > 50 && !achievementsUnlocked.has('explorer')) {
            unlockAchievement('Halfway Point', 'Explorer of the Nexus');
            achievementsUnlocked.add('explorer');
        }
    });

    let moveCount = 0;
    window.addEventListener('mousemove', () => {
        moveCount++;
        if (moveCount > 1000 && !achievementsUnlocked.has('active')) {
            unlockAchievement('Hyper-Active', 'High-frequency interactions');
            achievementsUnlocked.add('active');
        }
    });
}

function updateXP(amount) {
    userXP = Math.max(userXP, amount);
    const bar = document.querySelector('.xp-bar');
    if (bar) bar.style.width = userXP + '%';
}

function unlockAchievement(title, desc) {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `🏆 <strong>${title}</strong>: ${desc}`;
    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add('show'), 100);
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 600);
    }, 4000);
}

// 14. Narrative Guide (Subtitles)
function initNarrativeGuide() {
    const guide = document.createElement('div');
    guide.className = 'narrative-guide';
    guide.innerHTML = '<div class="narrative-text"></div>';
    document.body.appendChild(guide);

    const narrativeData = [
        { trigger: '#home', text: "Welcome to the Nexus of Gaming" },
        { trigger: '#about', text: "Discover the world's largest shared adventure..." },
        { trigger: '#contact', text: "The future is ours to build" }
    ];

    narrativeData.forEach(item => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
                trigger: item.trigger,
                start: "top center",
                onEnter: () => showNarrative(item.text)
            });
        }
    });
}

function showNarrative(text) {
    const el = document.querySelector('.narrative-text');
    if (el) {
        gsap.to(el, {
            opacity: 0, scale: 0.9, filter: "blur(5px)", duration: 0.5, onComplete: () => {
                el.textContent = text;
                gsap.to(el, { opacity: 0.8, scale: 1, filter: "blur(0px)", duration: 1 });
            }
        });
    }
}

// 15. Adaptive Soundscape (BPM/Filter sync)
function initAdaptiveSound() {
    const audio = document.getElementById('master-bg-audio');
    if (!audio) return;

    window.addEventListener('scroll', () => {
        if (!audio.paused) {
            const scrollFactor = 1 + (window.scrollY / 5000);
            gsap.to(audio, { playbackRate: Math.min(1.2, scrollFactor), duration: 0.5 });
        }
    });
}

// 16. WebGL Particle Field (Canvas)
function initParticleField() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.zIndex = '-2';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }

    function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// 17. Magnetic Portal Transitions
function initPortalTransitions() {
    const navLinks = document.querySelectorAll('.menu__link, .menu__logo');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    gsap.to('.wrapper', {
                        scale: 1.2,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.inOut",
                        onComplete: () => {
                            window.scrollTo(0, target.offsetTop);
                            gsap.fromTo('.wrapper', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" });
                        }
                    });
                }
            }
        });
    });
}

// 18. The 3D Vault (Interactive Item Inspection)
function init3DVault() {
    const vaultItems = document.querySelectorAll('.discover__item');

    vaultItems.forEach(item => {
        item.addEventListener('click', () => {
            gsap.to(item, {
                z: 500,
                rotationY: 360,
                duration: 1.2,
                ease: "back.inOut(1.7)",
                onComplete: () => {
                    gsap.to(item, { z: 0, rotationY: 0, duration: 0.8 });
                    unlockAchievement('The Vault', 'Inspected an ancient artifact');
                }
            });
        });
    });
}
