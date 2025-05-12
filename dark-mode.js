// Dark mode functionality
(function() {
  // Function to apply dark mode
  function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }

  // Check settings on page load
  document.addEventListener('DOMContentLoaded', function() {
    try {
      const savedSettings = JSON.parse(localStorage.getItem('settings')) || {};
      if (savedSettings.dark !== undefined) {
        applyDarkMode(savedSettings.dark);
      }
    } catch (e) {
      console.error('Error loading dark mode settings:', e);
    }
  });
})(); 