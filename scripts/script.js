function updateDateTime() {
    const dateTimeElement = document.getElementById('current-datetime');
    if (!dateTimeElement) return;

    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    dateTimeElement.textContent = now.toLocaleString('en-US', options);
}

setInterval(updateDateTime, 1000);
updateDateTime();
const bgBtn = document.getElementById('bg-change-btn');

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

if (bgBtn) {
    bgBtn.addEventListener('click', () => {
        const randomColor = getRandomColor();
        document.body.style.backgroundColor = randomColor;
    });
}


const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const accordionContent = accordionItem.querySelector('.accordion-content');
        const isActive = header.classList.contains('active');

       
        document.querySelectorAll('.accordion-header').forEach(h => {
            h.classList.remove('active');
            h.nextElementSibling.style.maxHeight = null;
            h.nextElementSibling.style.padding = '0 1.2rem';
        });

        
        if (!isActive) {
            header.classList.add('active');
            accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
            accordionContent.style.padding = '0.8rem 1.2rem';
        }
    });
});

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();


    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm-password');

    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmError = document.getElementById('confirm-error');
    const successMsg = document.getElementById('form-success');


    emailError.textContent = '';
    passwordError.textContent = '';
    confirmError.textContent = '';
    successMsg.textContent = '';

    emailInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
    confirmInput.classList.remove('input-error');

    let isValid = true;


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Email is required.';
      emailInput.classList.add('input-error');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      emailInput.classList.add('input-error');
      isValid = false;
    }


    if (!passwordInput.value) {
      passwordError.textContent = 'Password is required.';
      passwordInput.classList.add('input-error');
      isValid = false;
    } else if (passwordInput.value.length < 8) {
      passwordError.textContent = 'Password must be at least 8 characters long.';
      passwordInput.classList.add('input-error');
      isValid = false;
    }

    if (!confirmInput.value) {
      confirmError.textContent = 'Please confirm your password.';
      confirmInput.classList.add('input-error');
      isValid = false;
    } else if (passwordInput.value !== confirmInput.value) {
      confirmError.textContent = 'Passwords do not match.';
      confirmInput.classList.add('input-error');
      isValid = false;
    }


    if (isValid) {
      successMsg.textContent = 'Form submitted successfully!';
      contactForm.reset();
    }
  });
}

const openPopupBtn = document.getElementById('open-popup-btn');
const closePopupBtn = document.getElementById('close-popup-btn');
const popupModal = document.getElementById('popup-modal');

if (openPopupBtn && popupModal && closePopupBtn) {

  openPopupBtn.addEventListener('click', () => {
    popupModal.classList.add('active');
  });

  closePopupBtn.addEventListener('click', () => {
    popupModal.classList.remove('active');
  });

  popupModal.addEventListener('click', (e) => {
    if (e.target === popupModal) {
      popupModal.classList.remove('active');
    }
  });
}