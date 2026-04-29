document.addEventListener('DOMContentLoaded', () => {
    let animationsInitialized = false;

    const startAnimations = () => {
        if (animationsInitialized) return;
        animationsInitialized = true;
        
        // Check if GSAP and SplitType are loaded
        if (typeof gsap !== 'undefined' && typeof SplitType !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            initAnimations();
        } else {
            // Fallback: Reveal all animated elements if libraries are missing
            document.querySelectorAll('.animate-text, .animate-card, .animate-fade').forEach(el => {
                el.style.opacity = '1';
            });
        }
    };

    // Wait for the preloader to finish before starting animations
    window.addEventListener('preloaderFinished', startAnimations);

    // Safety timeout: If preloader takes too long or fails to dispatch, start anyway
    setTimeout(startAnimations, 5000);
});

function initAnimations() {
    // 1. Hero & Story Headings (Character Reveal)
    const textReveals = document.querySelectorAll('.animate-text');
    textReveals.forEach(text => {
        // Set initial visibility to container but hidden characters
        gsap.set(text, { opacity: 1 });
        
        const split = new SplitType(text, { types: 'chars, words' });
        
        gsap.from(split.chars, {
            scrollTrigger: {
                trigger: text,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            rotateX: -90,
            duration: 0.8,
            stagger: 0.02,
            ease: 'back.out(1.7)'
        });
    });

    // 2. Component/Card Entry (Slide Up + Fade)
    const cardReveals = document.querySelectorAll('.animate-card');
    cardReveals.forEach(card => {
        gsap.fromTo(card, 
            { 
                y: 60, 
                opacity: 0,
                scale: 0.95
            },
            {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 92%',
                    toggleActions: 'play none none none'
                },
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: 'power4.out'
            }
        );
    });

    // 3. Staggered Children Animations
    const staggerContainers = document.querySelectorAll('.animate-stagger');
    staggerContainers.forEach(container => {
        const children = container.children;
        
        gsap.fromTo(children,
            { 
                y: 40, 
                opacity: 0 
            },
            {
                scrollTrigger: {
                    trigger: container,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out'
            }
        );
    });

    // 4. Simple Fade In
    const fadeReveals = document.querySelectorAll('.animate-fade');
    fadeReveals.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                duration: 1.5,
                ease: 'linear'
            }
        );
    });
}
