window.header = (function() {
    const NAV_LINKS = [
        { href: 'startseite.html', label: 'Startseite' },
        { href: 'heute-morgen.html', label: 'Heute & Morgen' },
        { href: 'alle-kurse.html', label: 'Alle Kurse' },
        { href: 'faqs.html', label: 'FAQs' },
        { href: 'jobs.html', label: 'Jobs' }
    ];
    const PROFILE_ICON = `<span id='header-profile-pic-wrapper'></span>`;
    const NOTIFICATION_ICON = `
        <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span id="notification-badge" class="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></span>
        </div>
    `;

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

    function getNotifications() {
        try {
            return JSON.parse(localStorage.getItem('notifications')) || [];
        } catch {
            return [];
        }
    }

    function hasUnreadNotifications() {
        const notifications = getNotifications();
        return notifications.some(notification => !notification.read);
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
            <!-- Profil-Icon und Notification-Icon rechts -->
            <div class="flex-1 flex justify-end items-center">
                <button id="notification-btn" class="ml-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none flex items-center justify-center">
                    ${NOTIFICATION_ICON}
                </button>
                <button id="profile-btn" class="ml-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none flex items-center justify-center">
                    ${PROFILE_ICON}
                </button>
            </div>
        </nav>
        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu" class="fixed inset-0 bg-black bg-opacity-30 z-50 hidden flex justify-start">
            <div class="w-4/5 max-w-xs bg-white h-full shadow-lg flex flex-col">
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <img src="img/hsg-logo.png" alt="HSG Logo" class="h-8">
                    <button id="menu-close" class="p-2 hover:bg-gray-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto flex flex-col items-start">
                    <nav class="space-y-6 w-full px-6 pt-6">
                        ${NAV_LINKS.map(link => `<a href="${link.href}" class="block text-lg text-hsg-gray hover:text-hsg-green text-left">${link.label}</a>`).join('')}
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
        // Schliessen bei Klick auf den dunklen Hintergrund
        document.getElementById('mobile-menu').addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
        // Profile logic
        document.getElementById('profile-btn').onclick = function(e) {
            e.stopPropagation();
            const currentPage = window.location.pathname.split('/').pop();
            
            if (currentPage === 'dashboard.html') {
                const existing = document.getElementById('profile-dropdown');
                if (existing) {
                    existing.remove();
                    return;
                }
                // Dropdown erstellen
                const btn = document.getElementById('profile-btn');
                const rect = btn.getBoundingClientRect();
                const dropdown = document.createElement('div');
                dropdown.id = 'profile-dropdown';
                dropdown.className = 'absolute right-2 top-14 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-50';
                dropdown.innerHTML = `
                    <a href="profil.html" class="block px-4 py-2 text-hsg-gray hover:bg-hsg-light">Profil</a>
                    <a id="settings-link" href="einstellungen.html" class="block px-4 py-2 text-hsg-gray hover:bg-hsg-light">Einstellungen</a>
                    <button id="logout-btn" class="w-full text-left px-4 py-2 text-red-600 hover:bg-hsg-light">Logout</button>
                `;
                btn.parentElement.appendChild(dropdown);

                // Event-Listener für "Einstellungen"
                document.getElementById('settings-link').onclick = function(e) {
                    e.preventDefault(); // Verhindert das Standardverhalten
                    window.location.href = 'einstellungen.html'; // Öffnet die Datei
                };

                // Logout-Handler
                document.getElementById('logout-btn').onclick = function() {
                    window.header.setLoggedOut();
                    window.location.href = 'login.html';
                };
                // Schliessen bei Klick ausserhalb
                document.addEventListener('click', function handler(ev) {
                    if (!dropdown.contains(ev.target) && ev.target !== btn) {
                        dropdown.remove();
                        document.removeEventListener('click', handler);
                    }
                });
            } else {
                if (window.header.isLoggedIn()) {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'login.html';
                }
            }
        };

        // Notification logic
        document.getElementById('notification-btn').onclick = function() {
            if (window.header.isLoggedIn()) {
                window.location.href = 'notifications.html';
            } else {
                window.location.href = 'login.html';
            }
        };

        // Update notification badge
        updateNotificationBadge();

        // Profilbild im Header setzen
        const wrapper = document.getElementById('header-profile-pic-wrapper');
        if (wrapper) {
            if (isLoggedIn()) {
                const imgData = localStorage.getItem('profilePic');
                if (imgData) {
                    wrapper.innerHTML = `<img id='header-profile-pic' src='${imgData}' alt='Profil' class='w-8 h-8 rounded-full object-cover'>`;
                } else {
                    wrapper.innerHTML = `<img id='header-profile-pic' src='img/profile-photo.jpeg' alt='Profil' class='w-8 h-8 rounded-full object-cover'>`;
                }
            } else {
                wrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-hsg-gray border-2 border-current rounded-full p-1">
                    <circle cx="12" cy="8" r="4"></circle>
                    <path d="M12 12c-5 0-8 2.5-8 5v1c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-1c0-2.5-3-5-8-5z"></path>
                </svg>`;
            }
        }
    }

    function updateNotificationBadge() {
        const badge = document.getElementById('notification-badge');
        if (badge) {
            if (hasUnreadNotifications()) {
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    function setLoggedIn(user) {
        setUser(user);
    }
    function setLoggedOut() {
        clearUser();
        localStorage.removeItem('profilePic');
        localStorage.removeItem('bookings');
    }

    // Add demo notifications if none exist
    function addDemoNotifications() {
        if (!localStorage.getItem('notifications')) {
            const demoNotifications = [
                {
                    id: 1,
                    title: 'Kursabsage: Yoga Flow',
                    message: 'Der Yoga Flow Kurs am Montag, 14:15 - 15:45 wurde leider abgesagt. Wir bitten um Verständnis.',
                    date: new Date().toISOString(),
                    type: 'cancellation',
                    read: false
                },
                {
                    id: 2,
                    title: 'Ortsänderung: HIIT',
                    message: 'Der HIIT Kurs am Mittwoch findet in Halle 3 statt (statt Fitnessraum).',
                    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    type: 'location_change',
                    read: false
                }
            ];
            localStorage.setItem('notifications', JSON.stringify(demoNotifications));
        }
    }

    // Initialize notifications when header is loaded
    function initNotifications() {
        addDemoNotifications();
        updateNotificationBadge();
    }

    return {
        renderHeader,
        setLoggedIn,
        setLoggedOut,
        isLoggedIn,
        getUser,
        getNotifications,
        hasUnreadNotifications,
        updateNotificationBadge,
        initNotifications
    };
})();

// Initialize notifications when the script loads
document.addEventListener('DOMContentLoaded', function() {
    window.header.initNotifications();
});