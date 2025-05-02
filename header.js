window.header = (function() {
    const NAV_LINKS = [
        { href: 'startseite.html', label: 'Startseite' },
        { href: 'heute-morgen.html', label: 'Heute & Morgen' },
        { href: 'alle-kurse.html', label: 'Alle Kurse' },
        { href: 'faqs.html', label: 'FAQs' },
        { href: 'jobs.html', label: 'Jobs' },
        { href: 'kontakt.html', label: 'Kontakt' },
    ];
    const PROFILE_ICON = `<span id='header-profile-pic-wrapper'></span>`;

    function getUser() {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    }
    function setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
    function clearUser() {
        localStorage.removeItem('user');
    }
    function isLoggedIn() {
        return !!getUser();
    }

    function renderHeader() {
        // Remove existing header if present
        const old = document.getElementById('hsg-header');
        if (old) old.remove();
        // Create header
        const header = document.createElement('header');
        header.id = 'hsg-header';
        header.className = 'bg-white nav-shadow mb-8';
        header.innerHTML = `
        <nav class="max-w-7xl mx-auto flex items-center h-16 px-2 sm:px-4 border-b border-gray-200 relative">
            <!-- Hamburger immer sichtbar -->
            <button id="menu-toggle" class="mr-2 p-2 rounded hover:bg-gray-100 focus:outline-none flex" aria-label="Menü">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            </button>
            <!-- Logo immer zentriert -->
            <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <a href="startseite.html" class="flex items-center">
                    <img src="img/hsg-logo.png" alt="HSG Logo" class="h-8 w-auto" style="cursor:pointer">
                </a>
            </div>
            <!-- Profil-Icon immer rechts -->
            <div class="flex-1 flex justify-end">
                <button id="profile-btn" class="ml-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none flex items-center justify-center">
                    ${PROFILE_ICON}
                </button>
            </div>
        </nav>
        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu" class="fixed inset-0 bg-white z-50 hidden">
            <div class="flex flex-col h-full">
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <img src="img/hsg-logo.png" alt="HSG Logo" class="h-8">
                    <button id="menu-close" class="p-2 hover:bg-gray-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto flex flex-col justify-center items-center">
                    <nav class="space-y-6 text-center">
                        ${NAV_LINKS.map(link => `<a href="${link.href}" class="block text-lg text-hsg-gray hover:text-hsg-green">${link.label}</a>`).join('')}
                    </nav>
                </div>
            </div>
        </div>
        `;
        document.body.prepend(header);
        // Menu logic
        document.getElementById('menu-toggle').onclick = function() {
            document.getElementById('mobile-menu').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        };
        document.getElementById('menu-close').onclick = function() {
            document.getElementById('mobile-menu').classList.add('hidden');
            document.body.style.overflow = '';
        };
        // Profile logic
        document.getElementById('profile-btn').onclick = function() {
            if (isLoggedIn()) {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'login.html';
            }
        };
        // Profilbild im Header setzen
        const wrapper = document.getElementById('header-profile-pic-wrapper');
        const imgData = localStorage.getItem('profilePic');
        if (wrapper) {
            if (imgData) {
                wrapper.innerHTML = `<img id='header-profile-pic' src='${imgData}' alt='Profil' class='w-8 h-8 rounded-full object-cover'>`;
            } else {
                wrapper.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' class='w-8 h-8 text-hsg-gray'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z'/><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'/></svg>`;
            }
        }
    }
    function setLoggedIn(user) {
        setUser(user);
    }
    function setLoggedOut() {
        clearUser();
    }
    return {
        renderHeader,
        setLoggedIn,
        setLoggedOut,
        isLoggedIn,
        getUser
    };
})(); 