// Function to load and insert navigation
async function loadNavigation() {
    try {
        // Determine if we're in a subdirectory by checking the path
        const isInSubdirectory = window.location.pathname.includes('/teacher-resources/') ||
                                 window.location.pathname.includes('/student-resources/') ||
                                 window.location.pathname.includes('/modules/');
        const navPath = isInSubdirectory ? '../components/navigation.html' : 'components/navigation.html';

        const response = await fetch(navPath);
        const html = await response.text();
        document.body.insertAdjacentHTML('afterbegin', html);

        // Adjust navigation links based on current directory depth
        if (isInSubdirectory) {
            const nav = document.querySelector('.main-nav');
            if (nav) {
                // Get all links in the navigation
                const links = nav.querySelectorAll('a[href]');
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    // Only adjust relative paths (not external links or anchors)
                    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('../')) {
                        link.setAttribute('href', '../' + href);
                    }
                });
            }
        }

        // Add event listeners for mobile dropdowns
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.querySelector('a').addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', loadNavigation);