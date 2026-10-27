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
let currentCategory: string = localStorage.getItem('selectedCategory') || 'All Skins';

// Подсвечиваем нужную кнопку фильтра на английском
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
      console.warn("Audio playback blocked by browser!", err);
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

      if (currentCategory === 'All Skins') {
         matchesCategory = true;
      } else if (currentCategory === 'HD Skins' && skin.tag === 'hd') {
         matchesCategory = true;
      } else if (currentCategory === '3D Models' && skin.tag === '3d') {
         matchesCategory = true;
      }

      return matchesCategory;
   });

   if (filteredSkins.length === 0 && skinsGrid) {
      skinsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ff5555; font-family: monospace; padding: 20px;">[ Skins not found ]</p>`;
      return;
   }

   const fragment = document.createDocumentFragment();

   for (let j = 0; j < filteredSkins.length; j++) {
      const skin = filteredSkins[j]!;
      const card = document.createElement('article');
      card.className = 'mc-card';

      // Вычисляем правильный БЭМ-модификатор плашки под SCSS стили
      const tagModifier = skin.tag === '3d' ? 'models' : 'hd';

      card.innerHTML = ` 
         <div class="mc-card__preview">
             <img src="${skin.img}" alt="${skin.name}" class="mc-card__img" loading="lazy">
         </div>
         <h3 class="mc-card__name">${skin.name}</h3>
         <span class="skin-card__tag skin-card__tag--${tagModifier}">${skin.tagText}</span>
      `;

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

      currentCategory = button.textContent ? button.textContent.trim() : 'All Skins';
      localStorage.setItem('selectedCategory', currentCategory);
      renderSkins();
   });
});

// Бургер меню
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

// Стартовый запуск
renderSkins();
