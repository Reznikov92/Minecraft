import { skinsData, type Skin } from './types.data.ts';

// ================= 1. НАХОДИМ ЭЛЕМЕНТЫ (DOM) =================
const skinsGrid = document.querySelector<HTMLElement>('.skins-grid'); 
const searchInput = document.querySelector<HTMLInputElement>(".mc-filter-bar__input"); 
const filterButtons = document.querySelectorAll<HTMLButtonElement>(".mc-filter-bar__btn"); 
const ctaBtn = document.querySelector<HTMLButtonElement>('.mc-btn-cta'); 

// Бургер элементы
const burgerBtn = document.querySelector<HTMLButtonElement>('.mc-burger'); 
const mobileMenu = document.querySelector<HTMLElement>('.mc-mobile-menu'); 
const closeMenuBtn = document.querySelector<HTMLButtonElement>('.mc-mobile-menu__close'); 
const mobileLinks = document.querySelectorAll<HTMLAnchorElement>('.mc-mobile-menu__link'); 

// ================= 2. СИНХРОНИЗАЦИЯ LOCALSTORAGE =================
let currentCategory: string = localStorage.getItem('selectedCategory') || 'Все скины'; 
let searchQuery: string = localStorage.getItem('savedSearch') || ''; 

if (searchInput && searchQuery) {
   searchInput.value = searchQuery;
}

// ================= 3. АУДИО ДВИЖОК =================
const clickSound = new Audio('audio/click.mp3'); 

function playClickSound(): void { 
   clickSound.currentTime = 0; 
   clickSound.play().catch(err => { 
      console.log("Ожидание клика для аудио:", err); 
   });
}

// ================= 4. КОНВЕЙЕР РЕНДЕРИНГА СКИНОВ =================
function renderSkins(): void { 
   if (!skinsData || skinsData.length === 0) return; 

   if (skinsGrid) { 
      skinsGrid.innerHTML = ''; 
   }

   const filteredSkins = skinsData.filter((skin) => { 
      const query = searchQuery.toLowerCase().trim(); 
      const matchesSearch = skin.name.toLowerCase().includes(query); 

      let matchesCategory = false; 

      if (currentCategory === 'Все скины') { 
         matchesCategory = true; 
      } else if (currentCategory.includes('HD') && skin.tag === 'hd') { 
         matchesCategory = true; 
      } else if (currentCategory.includes('3D') && skin.tag === '3d') { 
         matchesCategory = true; 
      }

      return matchesSearch && matchesCategory; 
   });

   if (filteredSkins.length === 0 && skinsGrid) { 
      skinsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ff5555; font-family: monospace; padding: 20px;">[ Скины не найдены ]</p>`; 
      return; 
   }

   for (let j = 0; j < filteredSkins.length; j++) { 
      const skin = filteredSkins[j]!; 
      const card = document.createElement('div'); 
      card.className = 'mc-card'; 
      
      // Безопасное формирование коммерческой ссылки с автозаполнением сообщения
      const textMessage = `Здравствуйте! Хочу заказать скин ${skin.name}`;
      const telegramUrl = `https://t.me{encodeURIComponent(textMessage)}`;

      card.innerHTML = ` 
    <div class="mc-card__preview">
        <img src="${skin.img}" alt="${skin.name}" class="mc-card__img">
    </div>
    <h3 class="mc-card__name">${skin.name}</h3>
    <span class="mc-card__tag mc-card__tag--${skin.tag}">${skin.tagText}</span>
    <a href="${telegramUrl}" target="_blank" class="mc-card__btn-download" style="text-decoration: none; display: inline-block; width: 100%;">КУПИТЬ</a>`; 

      skinsGrid?.appendChild(card); 
   }
}

// ================= 5. ПОДКЛЮЧЕНИЕ ОБРАБОТЧИКОВ СОБЫТИЙ =================

searchInput?.addEventListener('input', (e: Event) => { 
   searchQuery = (e.target as HTMLInputElement).value; 
   localStorage.setItem('savedSearch', searchQuery); 
   renderSkins(); 
});

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

filterButtons.forEach(button => {
   const btnText = button.textContent ? button.textContent.trim() : '';
   if (btnText === currentCategory) { 
      button.classList.add('mc-filter-bar__btn--active'); 
   } else {
      button.classList.remove('mc-filter-bar__btn--active'); 
   }
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

// Звуковое сопровождение при клике на покупку
skinsGrid?.addEventListener('click', (e: MouseEvent) => { 
   const target = e.target as HTMLElement; 
   if (target.classList.contains('mc-card__btn-download')) { 
      playClickSound(); 
   }
});

renderSkins();
