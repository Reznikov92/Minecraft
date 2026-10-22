import { skinsData, type Skin } from './types.data.ts';

// ================= 1. НАХОДИМ ЭЛЕМЕНТЫ (DOM) =================
const skinsGrid = document.querySelector<HTMLElement>('.skins-grid');
const filterButtons = document.querySelectorAll<HTMLButtonElement>(".mc-filter-bar__btn");
const ctaBtn = document.querySelector<HTMLButtonElement>('.mc-btn-cta');

// Бургер элементы
const burgerBtn = document.querySelector<HTMLButtonElement>('.mc-burger');
const mobileMenu = document.querySelector<HTMLElement>('.mc-mobile-menu');
const closeMenuBtn = document.querySelector<HTMLButtonElement>('.mc-mobile-menu__close');
const mobileLinks = document.querySelectorAll<HTMLAnchorElement>('.mc-mobile-menu__link');

// ================= 2. СИНХРОНИЗАЦИЯ LOCALSTORAGE =================
let currentCategory: string = localStorage.getItem('selectedCategory') || 'Все скины';

// Сразу подсвечиваем нужную кнопку фильтра на основе данных из localStorage
filterButtons.forEach(button => {
   const btnText = button.textContent ? button.textContent.trim() : '';
   if (btnText === currentCategory) {
      button.classList.add('mc-filter-bar__btn--active');
   } else {
      button.classList.remove('mc-filter-bar__btn--active');
   }
});

// ================= 3. АУДИО ДВИЖОК =================
const clickSound = new Audio('audio/click.mp3');

function playClickSound(): void {
   clickSound.pause();
   clickSound.currentTime = 0;
   clickSound.play().catch(err => {
      console.warn("Браузер заблокировал автозвук до первого клика, но код продолжает работу!", err);
   });
}

// ================= 4. КОНВЕЙЕР РЕНДЕРИНГА СКИНОВ =================
function renderSkins(): void {
   if (!skinsData || skinsData.length === 0) return;

   if (skinsGrid) {
      skinsGrid.innerHTML = '';
   }

   const filteredSkins = skinsData.filter((skin) => {
      let matchesCategory = false;

      if (currentCategory === 'Все скины') {
         matchesCategory = true;
      } else if (currentCategory === 'HD Скины' && skin.tag === 'hd') {
         matchesCategory = true;
      } else if (currentCategory === '3D Модели' && skin.tag === '3d') {
         matchesCategory = true;
      }

      return matchesCategory;
   });

   if (filteredSkins.length === 0 && skinsGrid) {
      skinsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ff5555; font-family: monospace; padding: 20px;">[ Скины не найдены ]</p>`;
      return;
   }

   const fragment = document.createDocumentFragment();

   for (let j = 0; j < filteredSkins.length; j++) {
      const skin = filteredSkins[j]!;
      const card = document.createElement('div');
      card.className = 'mc-card';

      card.innerHTML = ` 
    <div class="mc-card__preview">
        <img src="${skin.img}" alt="${skin.name}" class="mc-card__img" loading="lazy">
    </div>
    <h3 class="mc-card__name">${skin.name}</h3>`;

      fragment.appendChild(card);
   }

   skinsGrid?.appendChild(fragment);
}

// ================= 5. ПОДКЛЮЧЕНИЕ ОБРАБОТЧИКОВ СОБЫТИЙ =================

filterButtons.forEach(button => {
   button.addEventListener('click', () => {
      playClickSound();
      filterButtons.forEach(btn => btn.classList.remove('mc-filter-bar__btn--active'));
      button.classList.add('mc-filter-bar__btn--active');

      currentCategory = button.textContent ? button.textContent.trim() : 'Все скины';
      localStorage.setItem('selectedCategory', currentCategory);
      renderSkins();
   });
});

// Бургер меню логика
burgerBtn?.addEventListener('click', () => {
   playClickSound();
   mobileMenu?.classList.toggle('mc-mobile-menu--open');
});

closeMenuBtn?.addEventListener('click', () => {
   playClickSound();
   mobileMenu?.classList.remove('mc-mobile-menu--open');
});

mobileLinks.forEach(link => {
   link.addEventListener('click', () => {
      mobileMenu?.classList.remove('mc-mobile-menu--open');
   });
});

if (ctaBtn) {
   ctaBtn.addEventListener('click', playClickSound);
}

// Звук клика по карточкам
skinsGrid?.addEventListener('click', (e: MouseEvent) => {
   const target = e.target as HTMLElement;
   if (target.closest('.mc-card')) {
      playClickSound();
   }
});

// Стартовый запуск отрисовки
renderSkins();
