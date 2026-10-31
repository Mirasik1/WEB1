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

async function submitContact(data, callback) {
  try {
    const response = await fetch(contactForm.action, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Request failed');
    await response.json();
  } catch (error) { callback(error); return; }
  callback(null);
}
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const button = contactForm.querySelector('button[type="submit"]');
    if (button.disabled || !contactForm.reportValidity()) return;
    const status = document.getElementById('form-success');
    const data = Object.fromEntries(new FormData(contactForm));
    if (!data.name.trim() || !data.message.trim()) {
      status.style.color = '#ff8585';
      status.textContent = 'Please enter your name and message, not just spaces.';
      return;
    }
    button.disabled = true;
    status.textContent = 'Sending…';
    status.style.color = 'var(--text-secondary)';
    submitContact(data, error => {
      button.disabled = false;
      status.style.color = error ? '#ff8585' : '#00e676';
      status.textContent = error ? 'Could not send. Please try again.' : 'Demo submitted successfully! No message was delivered to NomadAUTO.';
      if (!error) contactForm.reset();
    });
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
class Car {
  constructor(id, brand, model, year, price, image, category) {
    this.id = id;
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.price = price;
    this.image = image;
    this.category = category;
  }

  getFullName() {
    return `${this.brand} ${this.model} (${this.year})`;
  }

  getFormattedPrice() {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.price);
  }
}

const carInventory = [
  new Car(1, 'Porsche', '911 Carrera', 2023, 114000, 'images/porsche-911.webp', 'sports'),
  new Car(2, 'BMW', 'M4 Competition', 2024, 79100, 'images/bmw-m4.webp', 'sports'),
  new Car(3, 'Audi', 'RS6 Avant', 2024, 125900, 'images/audi-rs6.webp', 'wagon'),
  new Car(4, 'Porsche', '911 GT3', 2023, 182900, 'images/1.webp', 'sports'),
  new Car(5, 'BMW', 'M3 CS', 2024, 118700, 'images/7.webp', 'sports'),
  new Car(6, 'Audi', 'RS7 Sportback', 2023, 127800, 'images/3.webp', 'wagon'),
  new Car(7, 'Porsche', '911 Turbo S', 2024, 230400, 'images/4.webp', 'sports'),
  new Car(8, 'BMW', 'M2 Coupe', 2023, 63200, 'images/5.webp', 'sports'),
  new Car(9, 'Audi', 'R8 V10 Performance', 2023, 158600, 'images/2.webp', 'sports')
];


const audioFiles = [
  'audio/1.mp3',
  'audio/2.mp3',
  'audio/3.mp3'
];

function playRandomMp3Sound() {
  const randomAudioPath = audioFiles[Math.floor(Math.random() * audioFiles.length)];
  const audio = new Audio(randomAudioPath);
  audio.volume = 0.6;
  audio.play().catch(err => {
    console.warn("Ошибка воспроизведения аудио (проверь пути к файлам):", err);
  });
}

function renderGalleryItems(cars) {
  const galleryContainer = document.querySelector('.gallery-container');
  if (!galleryContainer) return;

  galleryContainer.innerHTML = cars
    .map(car => `
      <div class="gallery-item" data-id="${car.id}">
        <img src="${car.image}" alt="${car.getFullName()}">
        <div class="caption">${car.getFullName()} - ${car.getFormattedPrice()}</div>
      </div>
    `)
    .join('');

  attachGalleryEvents();
}

function attachGalleryEvents() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.caption');

    item.addEventListener('mouseenter', () => {
      if (img) img.style.transform = 'scale(1.12) rotate(1deg)';
      if (caption) {
        caption.style.transform = 'translateY(0)';
        caption.style.opacity = '1';
      }
    });

    item.addEventListener('mouseleave', () => {
      if (img) img.style.transform = 'scale(1)';
      if (caption) {
        caption.style.transform = 'translateY(100%)';
        caption.style.opacity = '0';
      }
    });

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      playRandomMp3Sound();

      item.style.transform = 'scale(0.95)';
      setTimeout(() => {
        item.style.transform = 'scale(1)';
      }, 150);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderGalleryItems(carInventory);
});

window.addEventListener('hashchange', () => {
  if (window.location.hash === '#gallery-modal') {
    renderGalleryItems(carInventory);
  }
});
// Arrow keys move focus within the navigation menu, wrapping at the ends.
document.querySelectorAll('.nav-links').forEach(menu => {
  const links = Array.from(menu.querySelectorAll('a'));
  menu.addEventListener('keydown', event => {
    const current = links.indexOf(document.activeElement);
    if (current === -1) return;
    let next;
    switch (event.key) {
      case 'ArrowRight': case 'ArrowDown': next = (current + 1) % links.length; break;
      case 'ArrowLeft': case 'ArrowUp': next = (current - 1 + links.length) % links.length; break;
      case 'Home': next = 0; break;
      case 'End': next = links.length - 1; break;
      default: return;
    }
    event.preventDefault();
    links[next].focus();
  });
});
document.querySelectorAll('.read-more').forEach(button => {
  button.addEventListener('click', () => {
    const content = document.getElementById(button.getAttribute('aria-controls'));
    const expanded = button.getAttribute('aria-expanded') === 'true';
    content.style.display = expanded ? 'none' : 'block';
    button.setAttribute('aria-expanded', String(!expanded));
    button.textContent = expanded ? 'Read More' : 'Read Less';
  });
});
document.querySelectorAll('.rating').forEach(rating => {
  const stars = rating.querySelectorAll('.rating-star');
  stars.forEach(star => star.addEventListener('click', () => {
    const value = Number(star.dataset.value);
    stars.forEach(button => {
      button.style.color = Number(button.dataset.value) <= value ? '#ffbf47' : '#8e8e93';
      button.setAttribute('aria-pressed', String(button === star));
    });
    rating.querySelector('.rating-status').textContent = `Your rating: ${value} / 5`;
  }));
});
const timeButton = document.getElementById('show-time-btn');
if (timeButton) timeButton.addEventListener('click', () => {
  document.getElementById('clicked-time').textContent = new Date().toLocaleTimeString();
});
const categoryFilter = document.getElementById('category-filter');
if (categoryFilter) categoryFilter.addEventListener('change', () => {
  let category;
  switch (categoryFilter.value) {
    case 'sports': category = 'sports'; break;
    case 'wagon': category = 'wagon'; break;
    default: category = 'all';
  }
  let count = 0;
  document.querySelectorAll('#featured-models .card').forEach(card => {
    const visible = category === 'all' || card.dataset.category === category;
    card.style.display = visible ? 'flex' : 'none';
    if (visible) count++;
  });
  document.getElementById('filter-status').textContent = `${count} models shown`;
});
