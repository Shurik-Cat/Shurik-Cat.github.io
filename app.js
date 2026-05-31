const catalog = {
    sets: [],           
    setsByYear: {},     
    nextId: 1,          
    ownedIds: new Set()
};

function addSet(id, year, name, number, pieces, minifigs) {
    
    const set = {
        id: id,
        year: year,
        name: name,
        number: number,
        pieces: pieces,
        minifigs: minifigs
    };
    
    catalog.sets.push(set);
    
    if (!catalog.setsByYear[year]) {
        catalog.setsByYear[year] = [];
    }
    catalog.setsByYear[year].push(set);
    
    return id;
}

function loadOwnedSets() {
    const stored = localStorage.getItem('SetsOwned');
    if (stored) {
        try {
            const ids = JSON.parse(stored);
            catalog.ownedIds = new Set(ids);
        } catch (error) {
            console.warn('Failed to load owned sets:', error);
            catalog.ownedIds = new Set();
        }
    }
}

function saveOwnedSets() {
    const idsArray = Array.from(catalog.ownedIds);
    localStorage.setItem('SetsOwned', JSON.stringify(idsArray));
}

function toggleOwned(setId, cardElement) {
    if (catalog.ownedIds.has(setId)) {
        catalog.ownedIds.delete(setId);
        cardElement.classList.remove('owned-set');
    } else {
        catalog.ownedIds.add(setId);
        cardElement.classList.add('owned-set');
    }
    saveOwnedSets();
}

function createImageElement(setId) {
    const container = document.createElement('div');
    container.className = 'set-image';
    
    const img = document.createElement('img');
    img.src = `images/${setId}.jpg`;
    img.alt = `Set ${setId}`;
 
    container.appendChild(img);
    return container;
}

function createSetCard(set) {
    const card = document.createElement('div');
    card.className = 'lego-card';
    
    if (catalog.ownedIds.has(set.id)) {
        card.classList.add('owned-set');
    }
    
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'card-checkbox';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = catalog.ownedIds.has(set.id);
    
    checkbox.addEventListener('change', function(event) {
        event.stopPropagation();
        toggleOwned(set.id, card);
        checkbox.checked = catalog.ownedIds.has(set.id);
    });
    
    const label = document.createElement('span');
    label.textContent = 'В коллекции';
    
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
    
    const imageContainer = createImageElement(set.id);
    
    const content = document.createElement('div');
    content.className = 'card-content';
    content.innerHTML = `
        <div class="set-name">${escapeHtml(set.name)}</div>
        <div class="set-details">
            <span class="detail-item">№ ${escapeHtml(set.number)}</span>
            <span class="detail-item">${escapeHtml(set.pieces)}</span>
            <span class="detail-item">${escapeHtml(set.minifigs)}</span>
        </div>
    `;
    
    card.appendChild(checkboxContainer);
    card.appendChild(imageContainer);
    card.appendChild(content);
    
    return card;
}

function createYearPage(year) {
    const page = document.createElement('div');
    page.id = `page-${year}`;
    page.className = 'year-page';

    const title = document.createElement('div');
    title.className = 'year-title';
    const setCount = catalog.setsByYear[year] ? catalog.setsByYear[year].length : 0;
    title.textContent = `${year} год`;
    page.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'sets-grid';
    
    const yearSets = catalog.setsByYear[year] || [];
    yearSets.forEach(set => {
        const card = createSetCard(set);
        grid.appendChild(card);
    });
    
    page.appendChild(grid);
    return page;
}

function createYearButton(year) {
    const button = document.createElement('button');
    button.className = 'year-vert-btn';
    button.setAttribute('data-year', year);
    button.textContent = year;
    
    button.addEventListener('click', function() {
        showYear(year);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    return button;
}

let currentYear = null;

function showYear(year) {
    document.querySelectorAll('.year-page').forEach(page => {
        page.classList.remove('active-page');
    });
    
    const selectedPage = document.getElementById(`page-${year}`);
    if (selectedPage) {
        selectedPage.classList.add('active-page');
    }
    
    document.querySelectorAll('.year-vert-btn').forEach(btn => {
        const btnYear = parseInt(btn.getAttribute('data-year'));
        if (btnYear === year) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    currentYear = year;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function populateSampleData() {
    // 1999
    addSet(7101, 1999, "Lightsaber Duel", "7101", "52 деталей", "2 минифигурки");
    addSet(7110, 1999, "Landspeeder", "7110", "49 деталей", "2 минифигурки");
    addSet(7111, 1999, "Droid Fighter", "7111", "62 деталей", "0 минифигурки");
    addSet(7121, 1999, "Naboo Swamp", "7121", "82 деталей", "4 минифигурки");
    addSet(7128, 1999, "Speeder Bikes", "7128", "93 деталей", "3 минифигурки");
    addSet(7140, 1999, "X-wing Fighter", "7140", "265 деталей", "4 минифигурки");
    addSet(1999, "TIE Fighter & Y-wing", "7150", "439 деталей", "3 минифигурки");
    
    // 2000

 
    // 2001

    
    // 2002

    
    // 2003

    
    // 2004

    
    // 2005

    
    // 2006

    
    // 2007

    
    // 2008

    
    // 2009

    
    // 2010

    
    // 2011

    
    // 2012

    
    // 2013

    
    // 2014

    
    // 2015

    
    // 2016

    
    // 2017

    
    // 2018

    
    // 2019

    
    // 2020

    
    // 2021

    
    // 2022

    
    // 2023

    
    // 2024

    
    // 2025

}

function initApp() {
    loadOwnedSets();
    
    populateSampleData();
    
    const sidebar = document.getElementById('yearSidebar');
    const pagesContainer = document.getElementById('pagesContainer');
    
    const startYear = 1999;
    const endYear = 2025;
    
    for (let year = startYear; year <= endYear; year++) {
        if (!catalog.setsByYear[year]) {
            catalog.setsByYear[year] = [];
        }
        
        const button = createYearButton(year);
        sidebar.appendChild(button);
        
        const page = createYearPage(year);
        pagesContainer.appendChild(page);
    }

    showYear(startYear);

    console.log('LEGO STAR WARS CATALOG');
    console.log(`Total sets: ${catalog.sets.length}`);
    console.log(`Next available ID: ${catalog.nextId}`);
    console.log('To add a new set, use: addSet(year, name, number, pieces, minifigs)');
    console.log('Then create images/[ID].jpg for the image');
}

document.addEventListener('DOMContentLoaded', initApp);