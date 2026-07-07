/*==================================================
ARVIO BUILDERS — main.js
Header behaviour, reveals, counters, tilt, hud clock
==================================================*/

document.addEventListener('DOMContentLoaded', () => {

    /*========================
    HEADER — shrink + blur on scroll
    ========================*/
    const header = document.getElementById('header');
    const onScroll = () => {
        if (window.scrollY > 40) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /*========================
    MOBILE MENU
    ========================*/
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
    });
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
        });
    });

    /*========================
    HERO — line reveal on load
    ========================*/
    const heroH1 = document.querySelector('.hero h1');
    requestAnimationFrame(() => {
        setTimeout(() => heroH1 && heroH1.classList.add('animate'), 150);
    });

    /*========================
    LIVE HUD CLOCK (Kathmandu, UTC+5:45)
    ========================*/
    const clockEl = document.getElementById('liveClock');
    function updateClock(){
        if (!clockEl) return;
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const ktm = new Date(utc + (5.75 * 3600000));
        const hh = String(ktm.getHours()).padStart(2,'0');
        const mm = String(ktm.getMinutes()).padStart(2,'0');
        const ss = String(ktm.getSeconds()).padStart(2,'0');
        clockEl.textContent = `KTM — ${hh}:${mm}:${ss}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    /*========================
    SCROLL REVEAL (IntersectionObserver)
    ========================*/
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = (el.dataset.delay) ? Number(el.dataset.delay) : (i % 4) * 90;
                setTimeout(() => el.classList.add('in-view'), delay);
                revealObserver.unobserve(el);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));

    /*========================
    ANIMATED STAT COUNTERS
    ========================*/
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const duration = 1600;
            const start = performance.now();

            function tick(now){
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                const value = Math.round(target * eased);
                el.textContent = value + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));

    /*========================
    SKYLINE SELF-DRAW ANIMATION
    ========================*/
    const skylinePath = document.querySelector('.skyline-path');
    if (skylinePath) {
        const skylineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skylinePath.classList.add('drawn');
                    skylineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        skylineObserver.observe(skylinePath);
    }

    /*========================
    MAGNETIC TILT — service cards (pointer devices only)
    ========================*/
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.tilt').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotateX = ((y - cy) / cy) * -6;
                const rotateY = ((x - cx) / cx) * 6;
                card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    /*========================
    SMOOTH ANCHOR SCROLL (offset for fixed header)
    ========================*/
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id.length <= 1) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = 90;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

});
