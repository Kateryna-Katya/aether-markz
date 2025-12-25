document.addEventListener('DOMContentLoaded', () => {
  // === 1. Инициализация иконок ===
  const refreshIcons = () => lucide.createIcons();
  refreshIcons();

  // === 2. Smooth Scroll (Lenis) ===
  const lenis = new Lenis();
  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // === 3. Мобильное меню ===
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = document.getElementById('menu-icon');
  const body = document.body;

  const toggleMenu = (isOpen) => {
      navMenu.classList.toggle('nav--active', isOpen);

      // Меняем иконку (x или menu)
      const iconName = navMenu.classList.contains('nav--active') ? 'x' : 'menu';
      menuIcon.setAttribute('data-lucide', iconName);
      refreshIcons();

      // Блокируем скролл при открытом меню
      body.style.overflow = navMenu.classList.contains('nav--active') ? 'hidden' : '';
  };

  // Клик по гамбургеру
  menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.contains('nav--active');
      toggleMenu(!isActive);
  });

  // ЗАКРЫТИЕ: При клике на любую ссылку в меню
  navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
  });

  // ЗАКРЫТИЕ: При клике вне области меню
  document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          toggleMenu(false);
      }
  });

  // === 4. GSAP Анимации ===
  gsap.registerPlugin(ScrollTrigger);

  // Эффект хедера при скролле
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
      header.classList.toggle('header--scrolled', window.scrollY > 50);
  });

  // Появление элементов (снизу вверх)
  gsap.utils.toArray('.reveal-up').forEach(elem => {
      gsap.from(elem, {
          scrollTrigger: {
              trigger: elem,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
      });
  });

  // Появление элементов (сбоку)
  gsap.utils.toArray('.reveal').forEach(elem => {
      gsap.from(elem, {
          scrollTrigger: {
              trigger: elem,
              start: 'top 80%'
          },
          x: 50,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out'
      });
  });

  // === 5. Капча ===
  const captchaLabel = document.getElementById('captcha-label');
  let captchaSum = 0;

  const generateCaptcha = () => {
      const n1 = Math.floor(Math.random() * 10);
      const n2 = Math.floor(Math.random() * 5);
      captchaSum = n1 + n2;
      if(captchaLabel) captchaLabel.innerText = `${n1} + ${n2} =`;
  };
  generateCaptcha();

  // === 6. Валидация и отправка формы ===
  const form = document.getElementById('career-form');
  const phoneInput = document.getElementById('phone');
  const formMessage = document.getElementById('form-message');

  if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/\D/g, ''); // Только цифры
      });
  }

  if (form) {
      form.addEventListener('submit', (e) => {
          e.preventDefault();
          const userAnswer = parseInt(document.getElementById('captcha-input').value);

          if (userAnswer !== captchaSum) {
              formMessage.innerText = 'Ошибка проверки! Попробуйте снова.';
              formMessage.style.color = '#ff4444';
              generateCaptcha(); // Обновляем капчу при ошибке
              return;
          }

          formMessage.innerText = 'Заявка отправляется...';
          formMessage.style.color = 'var(--cyan, #00ffff)';

          // Имитация отправки
          setTimeout(() => {
              formMessage.innerText = 'Успешно отправлено! Мы свяжемся с вами.';
              formMessage.style.color = '#44ff44';
              form.reset();
              generateCaptcha();
          }, 2000);
      });
  }

  // === 7. Cookie Popup ===
  const cookiePopup = document.getElementById('cookie-popup');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookiePopup && !localStorage.getItem('aether_cookies')) {
      setTimeout(() => {
          cookiePopup.classList.add('cookie-popup--active');
      }, 3000);
  }

  if (cookieAcceptBtn) {
      cookieAcceptBtn.addEventListener('click', () => {
          localStorage.setItem('aether_cookies', 'true');
          cookiePopup.classList.remove('cookie-popup--active');
      });
  }
});