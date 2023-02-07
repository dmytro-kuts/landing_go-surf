/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper, { Navigation, Pagination , Parallax, EffectFade, EffectCoverflow, Effectflip, Autoplay} from 'swiper';
/*
Основниые модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

// Стили Swiper
// Базовые стили
import "../../scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
// import 'swiper/css';

// Инициализация слайдеров
function initSliders() {
	// Перечень слайдеров
	// Проверяем, есть ли слайдер на стронице
	if (document.querySelector('.main-block__slider')) { // Указываем скласс нужного слайдера
		// Создаем слайдер
		new Swiper('.main-block__slider', { // Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, Pagination, Parallax, EffectFade, Autoplay],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			grabCursor: true,
			// autoHeight: true,
			speed: 1200,
			parallax: true,
			//touchRatio: 0,
			//simulateTouch: false,
			loop: true,
			//preloadImages: false,
			//lazy: true,
			
			// Эффекты
			effect: 'fade',
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			

			// Пагинация
			
			pagination: {
				el: '.controls-slider-main__dotts',
				clickable: true,
			},
			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.slider-arrow_prev',
				nextEl: '.slider-arrow_next',
			},
			// Брейкпоинты

			// События
			on: {

			}
		});
	}
	if (document.querySelector('.surf-block__slider')) { // Указываем скласс нужного слайдера
		// Создаем слайдер
		new Swiper('.surf-block__slider', { // Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, Pagination, Parallax, EffectCoverflow],
			observer: true,
			observeParents: true,
			slidesPerView: 3.5,
			// spaceBetween: 100,
			// autoHeight: true,
			speed: 1000,
			effect: "coverflow",
			grabCursor: true,
			// centeredSlides: true,
			// slidesPerView: "auto",
			coverflowEffect: {
				rotate: 10,
				stretch: 50,
				// depth: 100,
				// modifier: 1,
				// slideShadows: true,
			},
			loop: true,
			// autoplay: {
			// 	delay: 4000,
			// 	disableOnInteraction: false,
			// },
			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.slider-arrow_prev',
				nextEl: '.slider-arrow_next',
			},
			// Брейкпоинты
			
			breakpoints: {
				320: {
					slidesPerView: 1.1,
					spaceBetween: 0,
					// autoHeight: true,
				},
				479: {
					slidesPerView: 1.6,
					spaceBetween: 0,
					// autoHeight: true,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 0,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 0,
				},
			},
			
			// События
			on: {

			}
		});
	}
	if (document.querySelector('.travel-block__slider-content')) { // Указываем скласс нужного слайдера
		// Создаем слайдер
		new Swiper('.travel-block__slider-content', { // Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, EffectFade, Parallax],
			observer: true,
			watchOverflow: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 100,
			speed: 1000,
			loop: true,
			parallax: true,
			grabCursor: true,
			// effect: 'fade',
			// autoplay: {
			// 	delay: 5000,
			// 	disableOnInteraction: false,
			// },
			// События
			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.slider-arrow_prev',
				nextEl: '.slider-arrow_next',
			},
			on: {
				
			}
		});
	}
	if (document.querySelector('.sleep-block__body')) { // Указываем скласс нужного слайдера
		// Создаем слайдер
		new Swiper('.sleep-block__slider-content', { // Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, EffectFade, Parallax],
			observer: true,
			watchOverflow: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 100,
			speed: 1000,
			loop: true,
			parallax: true,
			grabCursor: true,
			// effect: 'fade',
			// autoplay: {
			// 	delay: 5000,
			// 	disableOnInteraction: false,
			// },
			// События
			// Кнопки "влево/вправо"
			navigation: {
				prevEl: ' .slider-arrows-sleep_prev',
				nextEl: ' .slider-arrows-sleep_next',
			},
			on: {
				
			}
		});
	}
	if (document.querySelector('.shop-block__body')) { // Указываем скласс нужного слайдера
		// Создаем слайдер
		new Swiper('.shop-block__slider-content', { // Указываем скласс нужного слайдера
			// Подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, Parallax],
			observer: true,
			watchOverflow: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 20,
			speed: 1000,
			loop: true,
			parallax: true,
			grabCursor: true,
			// effect: 'fade',
			// События
			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.slider-arrows-shop_prev',
				nextEl: '.slider-arrows-shop_next',
			},
			on: {
				
			}
		});
	}
}
// Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSlidersScroll() {
	let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: 'vertical',
				slidesPerView: 'auto',
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initSliders();
	// Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
	//initSlidersScroll();
});