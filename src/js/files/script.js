// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

const btnSearch = document.querySelector(".menu__search")
document.addEventListener("click", search);
function search(event) {
    if (event.target.closest('.search-form__icon')) {
        btnSearch.classList.toggle("_active");
    }
    if (!event.target.closest('.menu__search')) {
        btnSearch.classList.remove("_active");
    }
}