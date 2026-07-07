/*==================================================
ARVIO BUILDERS — main.js
Header shrink, mobile menu, smooth scroll
==================================================*/

document.addEventListener('DOMContentLoaded', () => {

    /*========================
    HEADER — subtle shrink on scroll
    (header already has its own background at all times,
    so it never disappears over light sections)
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
    if (hamburger && menu) {
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
    }

    /*========================
    SMOOTH ANCHOR SCROLL (offset for fixed header)
    ========================*/
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (!id || id.length <= 1) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = 84;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

});
