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
    addSet(7130, 1999, "Snowspeeder", "7130", "215 деталей", "3 минифигурки");
    addSet(7131, 1999, "Anakin's Podracer", "7131", "136 деталей", "3 минифигурки");
    addSet(7140, 1999, "X-wing Fighter", "7140", "266 деталей", "4 минифигурки");
    addSet(7141, 1999, "Naboo Fighter", "7141", "179 деталей", "4 минифигурки");
    addSet(7150, 1999, "TIE Fighter and Y-wing", "7150", "409 деталей", "3 минифигурки");
    addSet(7151, 1999, "Sith Inflitraitor", "7151", "244 деталей", "1 минифигурки");
    addSet(7161, 1999, "Geungan Sub", "7161", "379 деталей", "3 минифигурки");
    addSet(7171, 1999, "Mos Espa Podrace", "7171", "896 деталей", "10 минифигурки");
    
    // 2000
    addSet(7104, 2000, "Desert Skiff", "7104", "55 деталей", "2 минифигурки");
    addSet(7115, 2000, "Gungan Patrol", "7115", "77 деталей", "2 минифигурки");
    addSet(7124, 2000, "Flash Speeder", "7124", "106 деталей", "1 минифигурки");
    addSet(7134, 2000, "A-wing Fighter", "7134", "125 деталей", "2 минифигурки");
    addSet(7144, 2000, "Slave 1", "7144", "166 деталей", "1 минифигурки");
    addSet(7155, 2000, "Trade Federation AAT", "7155", "158 деталей", "2 минифигурки");
    addSet(7180, 2000, "B-wing at Rebel Control Centre", "7180", "338 деталей", "3 минифигурки");
    addSet(7181, 2000, "TIE Interceptor", "7181", "703 деталей", "0 минифигурки");
    addSet(7184, 2000, "Trade Federation MTT", "7184", "470 деталей", "7 минифигурки");
    addSet(7190, 2000, "Millenium Falcon", "7190", "663 деталей", "6 минифигурки");
    addSet(7191, 2000, "X-wing Fighter", "7191", "1300 деталей", "1 минифигурки");
 
    // 2001
    addSet(7106, 2001, "Droid Escape", "7106", "45 деталей", "2 минифигурки");
    addSet(7126, 2001, "Battle Droid Carrier", "7126", "133 деталей", "7 минифигурки");
    addSet(7127, 2001, "Imperial AT-ST", "7127", "107 деталей", "1 минифигурки");
    addSet(7146, 2001, "TIE Fighter", "7146", "171 деталей", "2 минифигурки");
    addSet(7166, 2001, "Imperial Shuttle", "7166", "238 деталей", "4 минифигурки");
    addSet(7186, 2001, "Watto's Junkyard", "7186", "443 деталей", "2 минифигурки");
    addSet(10018, 2001, "Darth Maul", "10018", "4868 деталей", "0 минифигурки");
    addSet(10019, 2001, "Rebel Blockade Runner", "10019", "1747 деталей", "0 минифигурки");
    
    // 2002
    addSet(7103, 2002, "Jedi Duel", "7103", "82 деталей", "2 минифигурки");
    addSet(7113, 2002, "Tusken Raider Encounter", "7113", "93 деталей", "3 минифигурки");
    addSet(7119, 2002, "Twin-Pod Cloud Car", "7119", "118 деталей", "1 минифигурки");
    addSet(7133, 2002, "Bounty Hunter Pursuit", "7133", "259 деталей", "3 минифигурки");
    addSet(7139, 2002, "Ewok Attack", "7139", "121 деталей", "4 минифигурки");
    addSet(7142, 2002, "X-wing Fighter", "7142", "267 деталей", "4 минифигурки");
    addSet(7143, 2002, "Jedi Starfighter", "7143", "138 деталей", "1 минифигурки");
    addSet(7152, 2002, "TIE Fighter and Y-wing", "7152", "410 деталей", "3 минифигурки");
    addSet(7153, 2002, "Jango Fett's Slave 1", "7153", "369 деталей", "2 минифигурки");
    addSet(7163, 2002, "Republic Gunship", "7163", "686 деталей", "8 минифигурки");
    addSet(7200, 2002, "Final Duel 1", "7200", "29 деталей", "2 минифигурки");
    addSet(7201, 2002, "Final Duel 2", "7201", "23 деталей", "3 минифигурки");
    addSet(7203, 2002, "Jedi Defense 1", "7203", "59 деталей", "3 минифигурки");
    addSet(7204, 2002, "Jedi Defense 2", "7204", "53 деталей", "3 минифигурки");
    addSet(10026, 2002, "Special Edition Naboo Starfighter", "10026", "187 деталей", "0 минифигурки");
    addSet(10030, 2002, "Imperial Star Destroyer", "10030", "3096 деталей", "0 минифигурки");
    
    // 2003
    addSet(4475, 2003, "Jabba's Message", "4475", "44 деталей", "3 минифигурки");
    addSet(4476, 2003, "Jabba's Prize", "4476", "40 деталей", "2 минифигурки");
    addSet(4477, 2003, "T-16 Skyhopper", "4477", "98 деталей", "1 минифигурки");
    addSet(4478, 2003, "Geonosian Fighter", "4478", "170 деталей", "4 минифигурки");
    addSet(4479, 2003, "TIE Bomber", "4479", "230 деталей", "1 минифигурки");
    addSet(4480, 2003, "Jabba's Palace", "4480", "231 деталей", "6 минифигурки");
    addSet(4481, 2003, "Hellfire Droid", "4481", "681 деталей", "0 минифигурки");
    addSet(4482, 2003, "AT-TE", "4482", "658 деталей", "4 минифигурки");
    addSet(4483, 2003, "AT-AT", "4483", "1064 деталей", "4 минифигурки");
    addSet(10123, 2003, "Cloud City", "10123", "698 деталей", "7 минифигурки");
    addSet(10129, 2003, "Rebel Snowspeeder", "10129", "1457 деталей", "0 минифигурки");
    
    // 2004
    addSet(4501, 2004, "Mos Eisley Cantina", "4501", "193 деталей", "5 минифигурки");
    addSet(4502, 2004, "X-wing Fighter", "4502", "563 деталей", "3 минифигурки");
    addSet(4504, 2004, "Millenium Falcon", "4504", "985 деталей", "5 минифигурки");
    addSet(10131, 2004, "TIE Fighter Collection", "10131", "682 деталей", "4 минифигурки");
    addSet(10134, 2004, "Y-wing Attack Starfighter", "10134", "1473 деталей", "1 минифигурки");

    // 2005
    addSet(7250, 2005, "Clone Scout Walker", "7250", "108 деталей", "1 минифигурки");
    addSet(7251, 2005, "Darth Vader Transformation", "7251", "53 деталей", "3 минифигурки");
    addSet(7252, 2005, "Droid TRI-Fighter", "7252", "148 деталей", "1 минифигурки");
    addSet(7255, 2005, "General Grievous Chase", "7255", "111 деталей", "2 минифигурки");
    addSet(7256, 2005, "Jedi Starfighter vs Vulture Droid", "7256", "202 деталей", "1 минифигурки");
    addSet(7257, 2005, "Ultimate Lightsaber Duel", "7257", "282 деталей", "2 минифигурки");
    addSet(7258, 2005, "Wookie Attack", "7258", "366 деталей", "5 минифигурки");
    addSet(7259, 2005, "ARC-170 Fighter", "7259", "396 деталей", "4 минифигурки");
    addSet(7260, 2005, "Wookie Catamaran", "7260", "376 деталей", "6 минифигурки");
    addSet(7261, 2005, "Clone Turbo Tank", "7261", "801 деталей", "7 минифигурки");
    addSet(7263, 2005, "TIE Fighter", "7263", "159 деталей", "2 минифигурки");
    addSet(7264, 2005, "Imperial Inspection", "7264", "367 деталей", "10 минифигурки");
    addSet(10143, 2005, "Death Star 2", "10143", "3449 деталей", "0 минифигурки");
    addSet(10144, 2005, "Sandcrawler", "10144", "1669 деталей", "11 минифигурки");
    
    // 2006
    addSet(6205, 2006, "V-wing Fighter", "6205", "118 деталей", "1 минифигурки");
    addSet(6206, 2006, "TIE Interceptor", "6206", "212 деталей", "1 минифигурки");
    addSet(6207, 2006, "A-wing Fighter", "6207", "194 деталей", "2 минифигурки");
    addSet(6208, 2006, "B-wing Fighter", "6208", "435 деталей", "2 минифигурки");
    addSet(6209, 2006, "Slave 1", "6209", "537 деталей", "4 минифигурки");
    addSet(6210, 2006, "Jabba's Sail Barge", "6210", "781 деталей", "8 минифигурки");
    addSet(6211, 2006, "Imperial Star Destroyer", "6211", "1367 деталей", "9 минифигурки");
    addSet(6212, 2006, "X-wing Fighter", "6212", "437 деталей", "6 минифигурки");
    addSet(10174, 2006, "Imperial AT-ST", "10174", "1068 деталей", "0 минифигурки");
    addSet(10175, 2006, "Vader's TIE Advanced", "10175", "1212 деталей", "0 минифигурки");
    
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