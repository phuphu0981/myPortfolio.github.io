// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const introHeadline = document.getElementById('intro-headline');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const darkModeToggle = document.getElementById('darkModeToggle');

  // 1. Typing Effect for Intro Headline
  const introText = "Hi, I'm a Backend Developer.";
  let index = 0;

  function typeWriter() {
    if (index < introText.length) {
      introHeadline.textContent += introText.charAt(index);
      index++;
      setTimeout(typeWriter, 150);
    }
  }
  typeWriter();

  // 2. Scroll Reveal Animations
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('reveal');
    revealObserver.observe(section);
  });

  // 3. Active Link Highlight on Scroll
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 60; // offset for nav height
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Smooth Scroll for Nav Links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 4. Dark Mode Toggle
  const body = document.body;
  // Load preference from local storage
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
  }

  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // Save preference
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('darkMode', 'enabled');
    } else {
      localStorage.setItem('darkMode', 'disabled');
    }
  });
});