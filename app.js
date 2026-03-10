document.addEventListener('DOMContentLoaded', () => {
    // ---- Theme (Dark Mode) Toggle ----
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Fallback to system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            root.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            // Ensure dark mode icon permanently stays as moon
            icon.className = 'fas fa-moon';
        }
    }

    // ---- Mobile Hamburger Menu ----
    const hamburger = document.getElementById('hamburger');
    const sidebarLeft = document.getElementById('sidebar-left');

    if (hamburger && sidebarLeft) {
        hamburger.addEventListener('click', () => {
            // Toggle sidebar visibility on mobile
            if (sidebarLeft.style.display === 'block') {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    function openSidebar() {
        sidebarLeft.style.display = 'block';
        sidebarLeft.style.position = 'fixed';
        sidebarLeft.style.top = 'var(--nav-height)';
        sidebarLeft.style.left = '0';
        sidebarLeft.style.width = '280px';
        sidebarLeft.style.height = 'calc(100vh - var(--nav-height))';
        sidebarLeft.style.zIndex = '999';
        sidebarLeft.style.background = 'var(--bg-color)';
        sidebarLeft.style.padding = 'var(--spacing-lg)';
        sidebarLeft.style.boxShadow = '10px 0 30px rgba(0,0,0,0.1)';
        sidebarLeft.style.overflowY = 'auto';
    }

    function closeSidebar() {
        sidebarLeft.style.display = 'none';
    }

    // Check width on resize to reset sidebar styling
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebarLeft) {
            sidebarLeft.style.display = 'block';
            sidebarLeft.style.position = 'sticky';
            sidebarLeft.style.top = 'calc(var(--nav-height) + var(--spacing-lg))';
            sidebarLeft.style.width = 'auto';
            sidebarLeft.style.height = 'calc(100vh - var(--nav-height) - var(--spacing-lg)*2)';
            sidebarLeft.style.zIndex = 'auto';
            sidebarLeft.style.background = 'transparent';
            sidebarLeft.style.boxShadow = 'none';
            sidebarLeft.style.padding = '0';
        } else if (window.innerWidth <= 768 && sidebarLeft) {
            sidebarLeft.style.display = 'none';
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebarLeft && sidebarLeft.style.display === 'block') {
            if (!sidebarLeft.contains(e.target) && !hamburger.contains(e.target)) {
                closeSidebar();
            }
        }
    });

    // ---- Sidebar Dropdown Logic ----
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentDropdown = toggle.closest('.nav-dropdown');
            parentDropdown.classList.toggle('active');
        });
    });

    // ---- Reels Video Scroll Logic ----
    const reelsVideos = document.querySelectorAll('.reel-video');
    if (reelsVideos.length > 0) {
        // Play/Pause on click
        reelsVideos.forEach(video => {
            const card = video.closest('.reel-card');
            video.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    card.classList.remove('paused');
                } else {
                    video.pause();
                    card.classList.add('paused');
                }
            });
        });

        // Intersection Observer to autoplay videos in view
        const observerOptions = {
            root: document.querySelector('.reels-container'), // the scrollable container
            rootMargin: '0px',
            threshold: 0.6 // play when 60% of video is visible
        };

        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                const card = video.closest('.reel-card');

                if (entry.isIntersecting) {
                    // Start playing
                    video.play().then(() => {
                        card.classList.remove('paused');
                    }).catch(error => {
                        console.log("Autoplay prevented:", error);
                        // Show play icon if autoplay is blocked
                        card.classList.add('paused');
                    });
                } else {
                    // Pause if out of view
                    video.pause();
                    card.classList.remove('paused'); // keep clean state
                }
            });
        }, observerOptions);

        reelsVideos.forEach(video => {
            videoObserver.observe(video);
        });
    }

    // ---- Password Toggle Logic ----
    const togglePasswords = document.querySelectorAll('.toggle-password');
    togglePasswords.forEach(icon => {
        icon.addEventListener('click', function () {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

    // ---- Search Field Redirect ----
    const searchInputs = document.querySelectorAll('.nav-search input');
    const searchIcons = document.querySelectorAll('.nav-search i');

    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim() !== '') {
                e.preventDefault();
                window.location.href = 'error.html';
            }
        });
    });

    searchIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const input = icon.nextElementSibling;
            if (input && input.value.trim() !== '') {
                e.preventDefault();
                window.location.href = 'error.html';
            }
        });
    });

    // ---- Post Validation Logic ----
    const postBtn = document.getElementById('post-button');
    const postTextarea = document.getElementById('post-textarea');

    if (postBtn && postTextarea) {
        postBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent global listener from firing
            const content = postTextarea.value.trim();
            if (content === '') {
                alert('Please enter some content before posting.');
            } else {
                window.location.href = 'error.html';
            }
        });
    }

    // ---- Global Dead Links & Buttons Redirect ----
    document.addEventListener('click', (e) => {
        let target = e.target.closest('a, button');

        if (!target) {
            target = e.target.closest('.fas, .far, .fab, svg');
            if (!target) return; // Ignore general clicks on background/text
        }

        // Ignore app logic toggles and valid navigation
        if (target.closest('#theme-toggle') || target.closest('#hamburger') ||
            target.classList.contains('nav-dropdown-toggle') ||
            target.classList.contains('toggle-password') ||
            target.closest('.reel-video') ||
            target.classList.contains('play-pause-btn') ||
            target.closest('.nav-search') ||
            target.id === 'post-button') { // Allow search icon and post button to be handled separately
            return;
        }

        if (target.tagName === 'A') {
            const href = target.getAttribute('href');
            // Redirect placeholder, empty or anchor-only hashes to error.html
            if (!href || href === '#' || href === '') {
                e.preventDefault();
                window.location.href = 'error.html';
            }
        } else if (target.tagName === 'BUTTON' || target.tagName === 'INPUT') {
            if (target.type === 'submit' && target.closest('form')) return; // Allow form submits

            // For any other button (e.g. Share, Follow, Like, Create Post)
            e.preventDefault();
            window.location.href = 'error.html';
        } else {
            // Intercept standalone icons (gallery, attach, info, etc.) not wrapped in functional forms/links
            e.preventDefault();
            window.location.href = 'error.html';
        }
    }, true);

    // Preloader Logic
    const preloader = document.querySelector('.earth');
    if (preloader) {
        const hidePreloader = () => preloader.classList.add('hidden');
        // Force preloader to show for at least 2.5 seconds
        setTimeout(() => {
            if (document.readyState === 'complete') {
                hidePreloader();
            } else {
                window.addEventListener('load', hidePreloader);
            }
        }, 2500);
    }

});
