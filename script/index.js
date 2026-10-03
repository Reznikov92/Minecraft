"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_data_1 = require("./types.data");
const skinsGrid = document.querySelector('.skins-grid');
const searchInput = document.querySelector(".mc-filter-bar__input");
const filterButtons = document.querySelectorAll(".mc-filter-bar__btn");
let currentCategory = 'Все скины';
let searchQuery = '';
function renderSkins() {
    skinsGrid.innerHTML = '';
    let filteredSkins = skinsData.filter((skin) => {
        let query = searchQuery.trim().toLowerCase();
        return matchesSearch && matchesCategory;
    });
}

