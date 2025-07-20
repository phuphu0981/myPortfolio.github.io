// Configuration
const config = {
  defaultPage: 'home',
  pageContainerId: 'main-content',
  pageTransitionClass: 'page-transition',
  loadingDelay: 200, // ms
  pagesPath: './pages/'  // Đường dẫn tương đối đến thư mục pages
};

// DOM Elements
const mainContent = document.getElementById(config.pageContainerId);
const navLinks = document.querySelectorAll('.nav-link');
const darkModeToggle = document.getElementById('darkModeToggle');

// Typing Effect
let typingTimeout;
const introText = "Hi, I'm a Backend Developer.";
let index = 0;

function typeWriter() {
  const introHeadline = document.getElementById('intro-headline');
  if (introHeadline && index < introText.length) {
    introHeadline.textContent += introText.charAt(index);
    index++;
    typingTimeout = setTimeout(typeWriter, 150);
  }
}

// Load Page Content
async function loadPage(pageId) {
  // Show loading state
  mainContent.classList.add('loading');
  
  try {
    // Clear any ongoing typing animation
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Load the page content
    const response = await fetch(`${config.pagesPath}${pageId}.html`);
    if (!response.ok) throw new Error('Page not found');
    
    const html = await response.text();
    
    // Apply the new content with a small delay for transition
    setTimeout(() => {
      mainContent.innerHTML = html;
      mainContent.classList.remove('loading');
      
      // If loading home page, start typing effect
      if (pageId === 'home') {
        index = 0;
        const introHeadline = document.getElementById('intro-headline');
        if (introHeadline) introHeadline.textContent = '';
        typeWriter();
      }
      
      // Update URL without reloading the page
      window.history.pushState({ page: pageId }, '', `#${pageId}`);
      
      // Update active nav link
      updateActiveNavLink(pageId);
      
      // Add active class for transition
      const pageElement = mainContent.firstElementChild;
      if (pageElement) {
        requestAnimationFrame(() => {
          pageElement.classList.add('active');
        });
      }
    }, config.loadingDelay);
    
  } catch (error) {
    console.error('Error loading page:', error);
    mainContent.innerHTML = `
      <div class="error-message">
        <h2>Page Not Found</h2>
        <p>The requested page could not be loaded: ${error.message}</p>
        <button onclick="loadPage('${config.defaultPage}')">Return to Home</button>
      </div>
    `;
    mainContent.classList.remove('loading');
  }
}

// Update active navigation link
function updateActiveNavLink(activePage) {
  navLinks.forEach(link => {
    if (link.getAttribute('data-page') === activePage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Handle Navigation
function handleNavigation(e) {
  e.preventDefault();
  const pageId = this.getAttribute('data-page');
  loadPage(pageId);
}

// Handle Browser Back/Forward
window.addEventListener('popstate', (e) => {
  const pageId = window.location.hash.substring(1) || config.defaultPage;
  loadPage(pageId);
});

// Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
  localStorage.setItem('darkMode', isDarkMode);
}

// Initialize the application
function init() {
  // Set up event listeners for navigation
  navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  // Set up dark mode toggle
  darkModeToggle.addEventListener('click', toggleDarkMode);
  
  // Check for saved dark mode preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
  } else {
    darkModeToggle.textContent = '🌙';
  }
  
  // Load the initial page based on URL hash or default to home
  const initialPage = window.location.hash.substring(1) || config.defaultPage;
  loadPage(initialPage);
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Make loadPage available globally for error handling
window.loadPage = loadPage;
