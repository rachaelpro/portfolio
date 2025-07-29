// This immediately invoked function expression (IIFE) tries to apply the theme
// as early as possible to prevent a "flash of unstyled content" (FOUC).
// It checks localStorage for a saved preference or defaults to 'light-mode'.
(function() {
    // Attempt to get the body element. If the script is in the <head> without 'defer' or 'async',
    // document.body might not be available yet, but DOMContentLoaded will handle it.
    const body = document.body;

    if (body) {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark-mode') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
        } else if (savedTheme === 'light-mode') { // Prioritize light mode if saved
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
        } else {
            // If no preference is saved, default to light mode immediately for the FOUC prevention.
            body.classList.add('light-mode'); // Set to light mode
            body.classList.remove('dark-mode');
            // Do NOT save to localStorage here, as DOMContentLoaded will handle the definitive save.
        }
    }
})();


// This ensures the script runs only after the entire HTML document is fully loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Fade-In Sections on Scroll ---
    // Uses Intersection Observer API for efficient detection of elements entering the viewport.
    const fadeSections = document.querySelectorAll('.fade-in-section');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the section must be visible to trigger
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'is-visible' class to trigger the CSS transition
                entry.target.classList.add('is-visible');
                // Stop observing once the section has faded in to optimize performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each section with the 'fade-in-section' class
    fadeSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Recommendation Form Submission Handler ---
    // This is a client-side example; in a real application, you'd send data to a backend.
    const recommendationForm = document.getElementById('recommendationForm');
    if (recommendationForm) {
        recommendationForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission and page reload

            const name = document.getElementById('recommenderName').value;
            const email = document.getElementById('recommenderEmail').value;
            const text = document.getElementById('recommendationText').value;

            // Simple client-side validation
            if (!name || !text) {
                alert('Please fill in your name and recommendation text.');
                return;
            }

            // For this static example, just show an alert and reset the form
            alert(`Thank you for your recommendation, ${name}! It has been submitted for review.`);
            recommendationForm.reset();
        });
    }

    // --- Dark Mode Toggle Functionality ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body; // Reference to the body element

    // Helper function to apply the theme classes and update the toggle button's appearance
    function applyThemeToPage(mode) {
        if (mode === 'dark-mode') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            if (darkModeToggle) {
                darkModeToggle.textContent = '☀️'; // Sun emoji for light mode
                darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
            }
        } else { // mode is 'light-mode'
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.textContent = '🌙'; // Moon emoji for dark mode
                darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
            }
        }
    }

    // --- Initial Theme Application (on DOMContentLoaded) ---
    // This logic definitively applies the theme once the DOM is ready.
    // It respects a saved preference or sets the default to light mode and saves it.
    const savedThemeOnLoad = localStorage.getItem('theme');
    if (savedThemeOnLoad) {
        // If a theme preference is already saved in localStorage, use it.
        applyThemeToPage(savedThemeOnLoad);
    } else {
        // If no preference is saved, explicitly default to 'light-mode'.
        applyThemeToPage('light-mode'); // Set to light mode
        // Crucially, save 'light-mode' to localStorage so it persists across sessions.
        localStorage.setItem('theme', 'light-mode'); // Save light mode as default
    }

    // Add event listener for the dark mode toggle button click
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            let newMode;
            // Determine the new mode based on the current state
            if (body.classList.contains('dark-mode')) {
                newMode = 'light-mode';
            } else {
                newMode = 'dark-mode';
            }
            applyThemeToPage(newMode); // Apply the new mode to the page
            localStorage.setItem('theme', newMode); // Save the user's preference for future visits
        });
    }
    const currentPath = window.location.pathname.split('/').pop(); // Extracts filename (e.g., "index.html")
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkFilename = link.getAttribute('href').split('/').pop();

        // If the link's filename matches the current page's filename, add the 'current-page' class.
        // This class is then styled in CSS to prevent hover effects and indicate the non-clickable nature.
        if (currentPath === linkFilename) {
            link.classList.add('current-page');
        }
    });
});