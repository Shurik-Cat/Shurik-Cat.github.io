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
    addSet(7654, 2007, "Droids Battle Pack", "7654", "118 деталей", "1 минифигурки");
    addSet(7655, 2007, "Clone Troopers Battle Pack", "7655", "58 деталей", "4 минифигурки");
    addSet(7656, 2007, "General Grievous Starfighter", "7656", "232 деталей", "1 минифигурки");
    addSet(7657, 2007, "AT-ST", "7657", "244 деталей", "1 минифигурки");
    addSet(7658, 2007, "Y-wing Fighter", "7658", "454 деталей", "2 минифигурки");
    addSet(7659, 2007, "Imperial Landing Craft", "7659", "471 деталей", "5 минифигурки");
    addSet(7660, 2007, "Naboo N-1 Starfighter with Vulture Droid", "7660", "280 деталей", "3 минифигурки");
    addSet(7661, 2007, "Jedi Starfighter with Hyperdrive Booster Ring", "7661", "575 деталей", "2 минифигурки");
    addSet(7662, 2007, "Trade Federation MTT", "7662", "1330 деталей", "21 минифигурки");
    addSet(7663, 2007, "Sith Infiltrator", "7663", "310 деталей", "1 минифигурки");
    addSet(7664, 2007, "TIE Crawler", "7664", "548 деталей", "2 минифигурки");
    addSet(7665, 2007, "Republic Cruiser", "7665", "919 деталей", "5 минифигурки");
    addSet(7666, 2007, "Hoth Rebel Base", "7666", "548 деталей", "8 минифигурки");
    addSet(10178, 2007, "Motorized Walking AT-AT", "10178", "1137 деталей", "4 минифигурки");
    addSet(10179, 2007, "Ultimate Collector's Millennium Falcon", "10179", "5197 деталей", "5 минифигурки"); 
    
    // 2008
    addSet(7667, 2008, "Imperial Dropship", "7667", "81 деталей", "4 минифигурки");
    addSet(7668, 2008, "Rebel Scout Speeder", "7668", "82 деталей", "4 минифигурки");
    addSet(7669, 2008, "Anakin's Jedi Starfighter", "7669", "153 деталей", "2 минифигурки");
    addSet(7670, 2008, "Hailfire Droid & Spider Droid", "7670", "249 деталей", "5 минифигурки");
    addSet(7671, 2008, "AT-AP Walker", "7671", "392 деталей", "2 минифигурки");
    addSet(7672, 2008, "Rogue Shadow", "7672", "482 деталей", "3 минифигурки");
    addSet(7673, 2008, "Magna Guard Starfighter", "7673", "431 деталей", "2 минифигурки");
    addSet(7674, 2008, "V-19 Torrent", "7674", "471 деталей", "1 минифигурки");
    addSet(7675, 2008, "AT-TE Walker", "7675", "798 деталей", "6 минифигурки");
    addSet(7676, 2008, "Republic Attack Gunship", "7676", "1034 деталей", "7 минифигурки");
    addSet(7678, 2008, "Droid Gunship", "7678", "329 деталей", "3 минифигурки");
    addSet(7679, 2008, "Republic Fighter Tank", "7679", "592 деталей", "2 минифигурки");
    addSet(7680, 2008, "The Twilight", "7680", "882 деталей", "4 минифигурки");
    addSet(7681, 2008, "Separatist Spider Droid", "7681", "206 деталей", "5 минифигурки");
    addSet(10188, 2008, "Death Star", "10188", "3803 деталей", "24 минифигурки");
    
    // 2009
    addSet(7748, 2009, "Corporate Alliance Tank Droid", "7748", "216 деталей", "4 минифигурки");
    addSet(7749, 2009, "Echo Base", "7749", "155 деталей", "5 минифигурки");
    addSet(7751, 2009, "Ahsoka's Starfighter and Vulture Droid", "7751", "291 деталей", "4 минифигурки");
    addSet(7752, 2009, "Count Dooku's Solar Sailer", "7752", "385 деталей", "4 минифигурки");
    addSet(7753, 2009, "Pirate Tank", "7753", "372 деталей", "3 минифигурки");
    addSet(7754, 2009, "Home One Mon Calamari Star Cruiser", "7754", "789 деталей", "6 минифигурки");
    addSet(8014, 2009, "Clone Walker Battle Pack", "8014", "72 деталей", "4 минифигурки");
    addSet(8015, 2009, "Assassin Droids Battle Pack", "8015", "94 деталей", "5 минифигурки");
    addSet(8016, 2009, "Hyena Droid Bomber", "8016", "232 деталей", "3 минифигурки");
    addSet(8017, 2009, "Darth Vader's TIE Fighter", "8017", "251 деталей", "1 минифигурки");
    addSet(8018, 2009, "Armored Assault Tank (AAT)", "8018", "407 деталей", "7 минифигурки");
    addSet(8019, 2009, "Republic Attack Shuttle", "8019", "636 деталей", "3 минифигурки");
    addSet(8036, 2009, "Separatist Shuttle", "8036", "259 деталей", "5 минифигурки");
    addSet(8037, 2009, "Anakin's Y-wing Starfighter", "8037", "570 деталей", "3 минифигурки");
    addSet(8038, 2009, "The Battle of Endor", "8038", "890 деталей", "12 минифигурки");
    addSet(8039, 2009, "Venator-class Republic Attack Cruiser", "8039", "1170 деталей", "5 минифигурки");
    addSet(10195, 2009, "Republic Dropship with AT-OT", "10195", "1758 деталей", "8 минифигурки");
    addSet(10198, 2009, "Tantive IV", "10198", "1408 деталей", "5 минифигурки");
    
    // 2010
    addSet(8083, 2010, "Rebel Trooper Battle Pack", "8083", "79 деталей", "4 минифигурки");
    addSet(8084, 2010, "Snowtrooper Battle Pack", "8084", "74 деталей", "4 минифигурки");
    addSet(8085, 2010, "Freeco Speeder", "8085", "177 деталей", "2 минифигурки");
    addSet(8086, 2010, "Droid Tri-Fighter", "8086", "268 деталей", "3 минифигурки");
    addSet(8087, 2010, "TIE Defender", "8087", "304 деталей", "2 минифигурки");
    addSet(8088, 2010, "ARC-170 Starfighter", "8088", "396 деталей", "4 минифигурки");
    addSet(8089, 2010, "Hoth Wampa Cave", "8089", "297 деталей", "3 минифигурки");
    addSet(8091, 2010, "Republic Swamp Speederk", "8091", "176 деталей", "5 минифигурки");
    addSet(8092, 2010, "Luke's Landspeeder", "8092", "163 деталей", "6 минифигурки");
    addSet(8093, 2010, "Plo Koon's Jedi Starfighter", "8093", "175 деталей", "2 минифигурки");
    addSet(8095, 2010, "General Grievous' Starfighter", "8095", "454 деталей", "3 минифигурки");
    addSet(8096, 2010, "Emperor Palpatine's Shuttle", "8096", "592 деталей", "4 минифигурки");
    addSet(8097, 2010, "Slave I", "8097", "573 деталей", "3 минифигурки");
    addSet(8098, 2010, "Clone Turbo Tank", "8098", "1141 деталей", "6 минифигурки");
    addSet(8128, 2010, "Cad Bane's Speeder", "8128", "79 деталей", "4 минифигурки");
    addSet(8129, 2010, "AT-AT Walker", "8129", "815 деталей", "8 минифигурки");
    addSet(10212, 2010, "Imperial Shuttle", "10212", "2503 деталей", "5 минифигурки");
    addSet(10215, 2010, "Obi-Wan's Jedi Starfighter", "10215", "676 деталей", "0 минифигурки");
    
    // 2011
    addSet(7868, 2011, "Mace Windu's Jedi Starfighter", "7868", "309 деталей", "5 минифигурки");
    addSet(7869, 2011, "Battle for Geonosis", "7869", "331 деталей", "5 минифигурки");
    addSet(7877, 2011, "Naboo Starfighter", "7877", "318 деталей", "6 минифигурки");
    addSet(7879, 2011, "Hoth Echo Base", "7879", "773 деталей", "8 минифигурки");
    addSet(7913, 2011, "Clone Trooper Battle Pack", "7913", "85 деталей", "4 минифигурки");
    addSet(7914, 2011, "Mandalorian Battle Pack", "7914", "68 деталей", "4 минифигурки");
    addSet(7915, 2011, "Imperial V-wing Starfighter", "7915", "139 деталей", "2 минифигурки");
    addSet(7929, 2011, "The Battle of Naboo", "7929", "241 деталей", "12 минифигурки");
    addSet(7930, 2011, "Bounty Hunter Assault Gunship", "7930", "389 деталей", "4 минифигурки");
    addSet(7931, 2011, "T-6 Jedi Shuttle", "7931", "389 деталей", "4 минифигурки");
    addSet(7956, 2011, "Ewok Attack", "7956", "166 деталей", "3 минифигурки");
    addSet(7957, 2011, "Sith Nightspeeder", "7957", "214 деталей", "3 минифигурки");
    addSet(7959, 2011, "Geonosian Starfighter", "7959", "155 деталей", "3 минифигурки");
    addSet(7961, 2011, "Darth Maul's Sith Infiltrator", "7961", "479 деталей", "4 минифигурки");
    addSet(7962, 2011, "Anakin Skywalker and Sebulba's Podracers", "7962", "810 деталей", "5 минифигурки");
    addSet(7964, 2011, "Republic Frigate", "7964", "1015 деталей", "5 минифигурки");
    addSet(7965, 2011, "Millennium Falcon", "7965", "1254 деталей", "6 минифигурки");
    addSet(10221, 2011, "Super Star Destroyer", "10221", "3152 деталей", "5 минифигурки");
    
    // 2012
    addSet(9488, 2012, "Elite Clone Trooper & Commando Droid Battle Pack", "9488", "98 деталей", "4 минифигурки");
    addSet(9489, 2012, "Endor Rebel Trooper & Imperial Trooper Battle Pack", "9489", "77 деталей", "4 минифигурки");
    addSet(9490, 2012, "Droid Escape", "9490", "137 деталей", "4 минифигурки");
    addSet(9491, 2012, "Geonosian Cannon", "9491", "132 деталей", "4 минифигурки");
    addSet(9492, 2012, "TIE Fighter", "9492", "413 деталей", "4 минифигурки");
    addSet(9493, 2012, "X-wing Starfighter", "9493", "560 деталей", "4 минифигурки");
    addSet(9494, 2012, "Anakin's Jedi Interceptor", "9494", "300 деталей", "5 минифигурки");
    addSet(9495, 2012, "Gold Leader's Y-wing Starfighter", "9495", "458 деталей", "3 минифигурки");
    addSet(9496, 2012, "Desert Skiff", "9496", "213 деталей", "4 минифигурки");
    addSet(9497, 2012, "Republic Striker-class Starfighter", "9497", "376 деталей", "3 минифигурки");
    addSet(9498, 2012, "Saesee Tiin's Jedi Starfighter", "9498", "244 деталей", "3 минифигурки");
    addSet(9499, 2012, "Gungan Sub", "9499", "465 деталей", "4 минифигурки");
    addSet(9500, 2012, "Sith Fury-class Interceptor", "9500", "748 деталей", "3 минифигурки");
    addSet(9515, 2012, "The Malevolence", "9515", "1101 деталей", "6 минифигурки");
    addSet(9516, 2012, "Jabba's Palace", "9516", "717 деталей", "9 минифигурки");
    addSet(9525, 2012, "Pre Vizsla's Mandalorian Fighter", "9525", "403 деталей", "3 минифигурки");
    addSet(9526, 2012, "Palpatine's Arrest", "9526", "645 деталей", "6 минифигурки");
    addSet(10227, 2012, "B-wing Starfighter", "10227", "1487 деталей", "0 минифигурки");
    
    // 2013
    addSet(10236, 2013, "Ewok Village", "10236", "1990 деталей", "17 минифигурки");
    addSet(10240, 2013, "Red Five X-wing Starfighter", "10240", "1559 деталей", "1 минифигурки");
    addSet(75000, 2013, "Clone Troopers vs. Droidekas", "75000", "124 деталей", "4 минифигурки");
    addSet(75001, 2013, "Republic Troopers vs. Sith Troopers", "75001", "63 деталей", "4 минифигурки");
    addSet(75002, 2013, "AT-RT", "75002", "222 деталей", "4 минифигурки");
    addSet(75003, 2013, "A-wing Starfighter", "75003", "177 деталей", "3 минифигурки");
    addSet(75004, 2013, "Z-95 Headhunter", "75004", "373 деталей", "3 минифигурки");
    addSet(75005, 2013, "Rancor Pit", "75005", "380 деталей", "4 минифигурки");
    addSet(75012, 2013, "BARC Speeder with Sidecar", "75012", "226 деталей", "4 минифигурки");
    addSet(75013, 2013, "Umbaran MHC (Mobile Heavy Cannon)", "75013", "493 деталей", "4 минифигурки");
    addSet(75014, 2013, "Battle of Hoth", "75014", "426 деталей", "7 минифигурки");
    addSet(75015, 2013, "Corporate Alliance Tank Droid", "75015", "271 деталей", "3 минифигурки");
    addSet(75016, 2013, "Homing Spider Droid", "75016", "295 деталей", "5 минифигурки");
    addSet(75017, 2013, "Duel on Geonosis", "75017", "391 деталей", "4 минифигурки");
    addSet(75018, 2013, "Jek-14's Stealth Starfighter", "75018", "550 деталей", "4 минифигурки");
    addSet(75019, 2013, "AT-TE", "75019", "794 деталей", "5 минифигурки");
    addSet(75020, 2013, "Jabba's Sail Barge", "75020", "850 деталей", "6 минифигурки");
    addSet(75021, 2013, "Republic Gunship", "75021", "1175 деталей", "7 минифигурки");
    addSet(75022, 2013, "Mandalorian Speeder", "75022", "211 деталей", "3 минифигурки");
    addSet(75024, 2013, "HH-87 Starhopper", "75024", "362 деталей", "3 минифигурки");
    addSet(75025, 2013, "Jedi Defender-class Cruiser", "75025", "927 деталей", "4 минифигурки");
    
    // 2014
    addSet(75028, 2014, "Clone Turbo Tank", "75028", "96 деталей", "1 минифигурки");
    addSet(75029, 2014, "AAT", "75029", "95 деталей", "1 минифигурки");
    addSet(75030, 2014, "Millennium Falcon", "75030", "94 деталей", "1 минифигурки");
    addSet(75031, 2014, "TIE Interceptor", "75031", "92 деталей", "1 минифигурки");
    addSet(75032, 2014, "X-wing Fighter", "75032", "97 деталей", "1 минифигурки");
    addSet(75033, 2014, "Star Destroyer", "75033", "97 деталей", "1 минифигурки");
    addSet(75034, 2014, "Death Star Troopers", "75034", "100 деталей", "4 минифигурки");
    addSet(75035, 2014, "Kashyyyk Troopers", "75035", "99 деталей", "4 минифигурки");
    addSet(75036, 2014, "Utapau Troopers", "75036", "83 деталей", "4 минифигурки");
    addSet(75037, 2014, "Battle on Saleucami", "75037", "183 деталей", "5 минифигурки");
    addSet(75038, 2014, "Jedi Interceptor", "75038", "223 деталей", "2 минифигурки");
    addSet(75039, 2014, "V-wing Starfighter", "75039", "201 деталей", "2 минифигурки");
    addSet(75040, 2014, "General Grievous' Wheel Bike", "75040", "261 деталей", "2 минифигурки");
    addSet(75041, 2014, "Vulture Droid", "75041", "205 деталей", "3 минифигурки");
    addSet(75042, 2014, "Droid Gunship", "75042", "439 деталей", "4 минифигурки");
    addSet(75043, 2014, "AT-AP", "75043", "717 деталей", "5 минифигурки");
    addSet(75044, 2014, "Droid Tri-Fighter", "75044", "262 деталей", "4 минифигурки");
    addSet(75045, 2014, "Republic AV-7 Anti-Vehicle Cannon", "75045", "434 деталей", "4 минифигурки");
    addSet(75046, 2014, "Coruscant Police Gunship", "75046", "481 деталей", "4 минифигурки");
    addSet(75048, 2014, "The Phantom", "75048", "234 деталей", "2 минифигурки");
    addSet(75049, 2014, "Snowspeeder", "75049", "279 деталей", "3 минифигурки");
    addSet(75050, 2014, "B-wing", "75050", "448 деталей", "3 минифигурки");
    addSet(75051, 2014, "Jedi Scout Fighter", "75051", "490 деталей", "4 минифигурки");
    addSet(75052, 2014, "Mos Eisley Cantina", "75052", "616 деталей", "8 минифигурки");
    addSet(75053, 2014, "The Ghost", "75053", "929 деталей", "4 минифигурки");
    addSet(75054, 2014, "AT-AT", "75054", "1137 деталей", "5 минифигурки");
    addSet(75055, 2014, "Imperial Star Destroyer", "75055", "1359 деталей", "7 минифигурки");
    addSet(75058, 2014, "MTT", "75058", "954 деталей", "12 минифигурки");
    addSet(75059, 2014, "Sandcrawler", "75059", "3296 деталей", "14 минифигурки");
    
    // 2015
    addSet(75060, 2015, "Slave I", "75060", "1996 деталей", "4 минифигурки");
    addSet(75072, 2015, "ARC-170 Starfighter", "75072", "95 деталей", "1 минифигурки");
    addSet(75073, 2015, "Vulture Droid", "75073", "77 деталей", "1 минифигурки");
    addSet(75074, 2015, "Snowspeeder", "75074", "97 деталей", "1 минифигурки");
    addSet(75075, 2015, "AT-AT", "75075", "88 деталей", "1 минифигурки");
    addSet(75076, 2015, "Republic Gunship", "75076", "105 деталей", "1 минифигурки");
    addSet(75077, 2015, "Homing Spider Droid", "75077", "102 деталей", "1 минифигурки");
    addSet(75078, 2015, "Imperial Troop Transport", "75078", "141 деталей", "4 минифигурки");
    addSet(75079, 2015, "Shadow Troopers", "75079", "95 деталей", "4 минифигурки");
    addSet(75080, 2015, "AAT", "75080", "251 деталей", "3 минифигурки");
    addSet(75081, 2015, "T-16 Skyhopper", "75081", "247 деталей", "2 минифигурки");
    addSet(75082, 2015, "TIE Advanced Prototype", "75082", "355 деталей", "3 минифигурки");
    addSet(75083, 2015, "AT-DP", "75083", "500 деталей", "4 минифигурки");
    addSet(75084, 2015, "Wookiee Gunship", "75084", "570 деталей", "4 минифигурки");
    addSet(75085, 2015, "Hailfire Droid", "75085", "163 деталей", "3 минифигурки");
    addSet(75086, 2015, "Battle Droid Troop Carrier", "75086", "565 деталей", "15 минифигурки");
    addSet(75087, 2015, "Anakin's Custom Jedi Starfighter", "75087", "370 деталей", "3 минифигурки");
    addSet(75088, 2015, "Senate Commando Troopers", "75088", "106 деталей", "4 минифигурки");
    addSet(75089, 2015, "Geonosis Troopers", "75089", "105 деталей", "4 минифигурки");
    addSet(75090, 2015, "Ezra's Speeder Bike", "75090", "253 деталей", "3 минифигурки");
    addSet(75091, 2015, "Flash Speeder", "312 деталей", "5 минифигурки");
    addSet(75092, 2015, "Naboo Starfighter", "75092", "442 деталей", "9 минифигурки");
    addSet(75093, 2015, "Death Star Final Duel", "75093", "724 деталей", "5 минифигурки");
    addSet(75094, 2015, "Imperial Shuttle Tydirium", "75094", "937 деталей", "5 минифигурки");
    addSet(75095, 2015, "TIE Fighter", "75095", "1685 деталей", "1 минифигурки");
    addSet(75096, 2015, "Sith Infiltrator", "75096", "662 деталей", "8 минифигурки");
    addSet(75099, 2015, "Rey's Speeder", "75099", "193 деталей", "2 минифигурки");
    addSet(75100, 2015, "First Order Snowspeeder", "75100", "444 деталей", "3 минифигурки");
    addSet(75101, 2015, "First Order Special Forces TIE Fighter", "75101", "517 деталей", "4 минифигурки");
    addSet(75102, 2015, "Poe's X-wing Fighter", "75102", "717 деталей", "4 минифигурки");
    addSet(75103, 2015, "First Order Transporter", "75103", "792 деталей", "7 минифигурки");
    addSet(75104, 2015, "Kylo Ren's Command Shuttle", "75104", "1005 деталей", "6 минифигурки");
    addSet(75105, 2015, "Millennium Falcon", "75105", "1329 деталей", "7 минифигурки");
    addSet(75106, 2015, "Imperial Assault Carrier", "75106", "1216 деталей", "6 минифигурки");
    
    // 2016
    addSet(75098, 2016, "Assault on Hoth", "75098", "2144 деталей", "15 минифигурки");
    addSet(75125, 2016, "Resistance X-wing Fighter", "75125", "87 деталей", "1 минифигурки");
    addSet(75126, 2016, "First Order Snowspeeder", "75126", "91 деталей", "1 минифигурки");
    addSet(75127, 2016, "The Ghost", "75127", "104 деталей", "1 минифигурки");
    addSet(75128, 2016, "TIE Advanced Prototype", "75128", "93 деталей", "1 минифигурки");
    addSet(75129, 2016, "Wookiee Gunship", "75129", "84 деталей", "1 минифигурки");
    addSet(75130, 2016, "AT-DP", "75130", "76 деталей", "1 минифигурки");
    addSet(75131, 2016, "Resistance Trooper Battle Pack", "75131", "112 деталей", "4 минифигурки");
    addSet(75132, 2016, "First Order Battle Pack", "75132", "88 деталей", "4 минифигурки");
    addSet(75133, 2016, "Rebel Alliance Battle Pack", "75133", "101 деталей", "4 минифигурки");
    addSet(75134, 2016, "Galactic Empire Battle Pack", "75134", "109 деталей", "4 минифигурки");
    addSet(75135, 2016, "Obi-Wan's Jedi Interceptor", "75135", "215 деталей", "2 минифигурки");
    addSet(75136, 2016, "Droid Escape Pod", "75136", "197 деталей", "4 минифигурки");
    addSet(75137, 2016, "Carbon-Freezing Chamber", "75137", "231 деталей", "3 минифигурки");
    addSet(75138, 2016, "Hoth Attack", "75138", "233 деталей", "4 минифигурки");
    addSet(75139, 2016, "Battle on Takodana", "75139", "409 деталей", "5 минифигурки");
    addSet(75140, 2016, "Resistance Troop Transporter", "75140", "646 деталей", "4 минифигурки");
    addSet(75141, 2016, "Kanan's Speeder Bike", "75141", "234 деталей", "3 минифигурки");
    addSet(75142, 2016, "Homing Spider Droid", "75142", "310 деталей", "5 минифигурки");
    addSet(75145, 2016, "Eclipse Fighter", "75145", "363 деталей", "2 минифигурки");
    addSet(75147, 2016, "StarScavenger", "75147", "558 деталей", "4 минифигурки");
    addSet(75148, 2016, "Encounter on Jakku", "75148", "530 деталей", "4 минифигурки");
    addSet(75149, 2016, "Resistance X-wing Fighter", "75149", "740 деталей", "4 минифигурки");
    addSet(75150, 2016, "Vader's TIE Advanced vs. A-wing Starfighter", "75150", "702 деталей", "4 минифигурки");
    addSet(75151, 2016, "Clone Turbo Tank", "75151", "903 деталей", "6 минифигурки");
    addSet(75152, 2016, "Imperial Assault Hovertank", "75152", "385 деталей", "3 минифигурки");
    addSet(75153, 2016, "AT-ST Walker", "75153", "449 деталей", "3 минифигурки");
    addSet(75154, 2016, "TIE Striker", "75154", "543 деталей", "4 минифигурки");
    addSet(75155, 2016, "Rebel U-wing Fighter", "75155", "659 деталей", "5 минифигурки");
    addSet(75156, 2016, "Krennic's Imperial Shuttle", "75156", "863 деталей", "6 минифигурки");
    addSet(75157, 2016, "Captain Rex's AT-TE", "75157", "972 деталей", "5 минифигурки");
    addSet(75158, 2016, "Rebel Combat Frigate", "75158", "936 деталей", "5 минифигурки");
    addSet(75159, 2016, "Death Star", "75159", "4016 деталей", "27 минифигурки");
    
    // 2017
    addSet(75144, 2017, "Snowspeeder", "75144", "1703 деталей", "2 минифигурки");
    addSet(75160, 2017, "U-wing Microfighter", "75144", "109 деталей", "1 минифигурки");
    addSet(75161, 2017, "TIE Striker Microfighter", "75144", "88 деталей", "1 минифигурки");
    addSet(75162, 2017, "Y-wing Microfighter", "75144", "90 деталей", "1 минифигурки");
    addSet(75163, 2017, "Krennic's Imperial Shuttle Microfighter", "75144", "78 деталей", "1 минифигурки");
    addSet(75164, 2017, "Rebel Trooper Battle Pack", "75144", "120 деталей", "4 минифигурки");
    addSet(75165, 2017, "Imperial Trooper Battle Pack", "75144", "112 деталей", "4 минифигурки");
    addSet(75166, 2017, "First Order Transport Speeder Battle Pack", "75144", "117 деталей", "4 минифигурки");
    addSet(75167, 2017, "Bounty Hunter Speeder Bike Battle Pack", "75144", "125 деталей", "4 минифигурки");
    addSet(75168, 2017, "Yoda's Jedi Starfighter", "75144", "262 деталей", "2 минифигурки");
    addSet(75169, 2017, "Duel on Naboo", "75144", "208 деталей", "3 минифигурки");
    addSet(75170, 2017, "The Phantom", "75144", "269 деталей", "3 минифигурки");
    addSet(75171, 2017, "Battle on Scarif", "75144", "419 деталей", "4 минифигурки");
    addSet(75172, 2017, "Y-wing Starfighter", "75144", "691 деталей", "5 минифигурки");
    addSet(75173, 2017, "Luke's Landspeeder", "75144", "149 деталей", "4 минифигурки");
    addSet(75174, 2017, "Desert Skiff Escape", "75144", "277 деталей", "4 минифигурки");
    addSet(75175, 2017, "A-wing Starfighter", "75144", "358 деталей", "3 минифигурки");
    addSet(75176, 2017, "Resistance Transport Pod", "75144", "294 деталей", "3 минифигурки");
    addSet(75177, 2017, "First Order Heavy Scout Walker", "75144", "554 деталей", "3 минифигурки");
    addSet(75178, 2017, "Jakku Quadjumper", "75144", "457 деталей", "5 минифигурки");
    addSet(75179, 2017, "Kylo Ren's TIE Fighter", "75144", "630 деталей", "4 минифигурки");
    addSet(75180, 2017, "Rathtar Escape", "75144", "836 деталей", "5 минифигурки");
    addSet(75182, 2017, "Republic Fighter Tank", "75144", "305 деталей", "4 минифигурки");
    addSet(75183, 2017, "Darth Vader Transformation", "75183", "282 деталей", "6 минифигурки");
    addSet(75185, 2017, "Tracker I", "75185", "557 деталей", "4 минифигурки");
    addSet(75186, 2017, "The Arrowhead", "75186", "775 деталей", "5 минифигурки");
    addSet(75188, 2017, "Resistance Bomber (standard pilot version)", "75188", "780 деталей", "5 минифигурки");
    addSet(75189, 2017, "First Order Heavy Assault Walker", "75189", "1376 деталей", "5 минифигурки");
    addSet(75190, 2017, "First Order Star Destroyer", "75190", "1416 деталей", "7 минифигурки");
    addSet(75191, 2017, "Jedi Starfighter with Hyperdrive", "75191", "825 деталей", "4 минифигурки");
    addSet(75192, 2017, "Millennium Falcon", "75192", "7541 деталей", "8 минифигурки");
    
    // 2018
    addSet(75181, 2018, "Y-wing Starfighter", "75181", "1967 деталей", "2 минифигурки");
    addSet(75188, 2018, "Resistance Bomber (Finch Dallow version)", "75188", "780 деталей", "5 минифигурки");
    addSet(75193, 2018, "Millennium Falcon Microfighter", "75193", "92 деталей", "1 минифигурки");
    addSet(75194, 2018, "First Order TIE Fighter Microfighter", "75194", "91 деталей", "1 минифигурки");
    addSet(75195, 2018, "Ski Speeder vs. First Order Walker Microfighters", "75195", "216 деталей", "2 минифигурки");
    addSet(75196, 2018, "A-Wing vs. TIE Silencer Microfighters", "75196", "188 деталей", "2 минифигурки");
    addSet(75197, 2018, "First Order Specialists Battle Pack", "75197", "108 деталей", "4 минифигурки");
    addSet(75198, 2018, "Tatooine Battle Pack", "75198", "97 деталей", "4 минифигурки");
    addSet(75199, 2018, "General Grievous' Combat Speeder", "75199", "157 деталей", "2 минифигурки");
    addSet(75200, 2018, "Ahch-To Island Training", "75200", "241 деталей", "2 минифигурки");
    addSet(75201, 2018, "First Order AT-ST", "75201", "370 деталей", "4 минифигурки");
    addSet(75202, 2018, "Defense of Crait", "75202", "746 деталей", "5 минифигурки");
    addSet(75203, 2018, "Hoth Medical Chamber", "75203", "255 деталей", "4 минифигурки");
    addSet(75204, 2018, "Sandspeeder", "75204", "278 деталей", "2 минифигурки");
    addSet(75205, 2018, "Mos Eisley Cantina", "75205", "376 деталей", "4 минифигурки");
    addSet(75206, 2018, "Jedi and Clone Troopers Battle Pack", "75206", "102 деталей", "4 минифигурки");
    addSet(75207, 2018, "Imperial Patrol Battle Pack", "75207", "99 деталей", "4 минифигурки");
    addSet(75208, 2018, "Yoda's Hut", "75208", "229 деталей", "3 минифигурки");
    addSet(75209, 2018, "Han Solo's Landspeeder", "75209", "345 деталей", "2 минифигурки");
    addSet(75210, 2018, "Moloch's Landspeeder", "75210", "464 деталей", "2 минифигурки");
    addSet(75211, 2018, "Imperial TIE Fighter", "75211", "519 деталей", "4 минифигурки");
    addSet(75212, 2018, "Kessel Run Millennium Falcon", "75212", "1414 деталей", "7 минифигурки");
    addSet(75214, 2018, "Anakin's Jedi Starfighter", "75214", "247 деталей", "2 минифигурки");
    addSet(75215, 2018, "Cloud-Rider Swoop Bikes", "75215", "355 деталей", "3 минифигурки");
    addSet(75216, 2018, "Snoke's Throne Room", "75216", "492 деталей", "5 минифигурки");
    addSet(75217, 2018, "Imperial Conveyex Transport", "75217", "622 деталей", "5 минифигурки");
    addSet(75218, 2018, "X-wing Starfighter", "75218", "731 деталей", "4 минифигурки");
    addSet(75219, 2018, "Imperial AT-Hauler", "75219", "829 деталей", "5 минифигурки");
    addSet(75220, 2018, "Sandcrawler", "75220", "1239 деталей", "6 минифигурки");
    addSet(75221, 2018, "Imperial Landing Craft", "75221", "636 деталей", "5 минифигурки");
    addSet(75222, 2018, "Betrayal at Cloud City", "75222", "2812 деталей", "20 минифигурки");

    // 2019
    addSet(75223, 2019, "Naboo Starfighter Microfighter", "75223", "62 деталей", "1 минифигурки");
    addSet(75224, 2019, "Sith Infiltrator Microfighter", "75224", "92 деталей", "1 минифигурки");
    addSet(75225, 2019, "Elite Praetorian Guard Battle Pack", "75225", "109 деталей", "5 минифигурки");
    addSet(75226, 2019, "Inferno Squad Battle Pack", "75226", "118 деталей", "4 минифигурки");
    addSet(75228, 2019, "Escape Pod vs. Dewback Microfighters", "75228", "177 деталей", "3 минифигурки");
    addSet(75229, 2019, "Death Star Escape", "75229", "329 деталей", "4 минифигурки");
    addSet(75233, 2019, "Droid Gunship", "75233", "389 деталей", "4 минифигурки");
    addSet(75234, 2019, "AT-AP Walker", "75234", "689 деталей", "5 минифигурки");
    addSet(75235, 2019, "X-wing Starfighter Trench Run", "75235", "132 деталей", "3 минифигурки");
    addSet(75236, 2019, "Duel on Starkiller Base", "75236", "191 деталей", "2 минифигурки");
    addSet(75237, 2019, "TIE Fighter Attack", "75237", "77 деталей", "2 минифигурки");
    addSet(75238, 2019, "Action Battle Endor Assault", "75238", "193 деталей", "2 минифигурки");
    addSet(75239, 2019, "Action Battle Hoth Generator Attack", "75239", "235 деталей", "2 минифигурки");
    addSet(75240, 2019, "Major Vonreg's TIE Fighter", "75240", "496 деталей", "4 минифигурки");
    addSet(75241, 2019, "Action Battle Echo Base Defense", "75241", "504 деталей", "6 минифигурки");
    addSet(75242, 2019, "Black Ace TIE Interceptor", "75242", "396 деталей", "3 минифигурки");
    addSet(75243, 2019, "Slave I - 20th Anniversary Edition", "75243", "1007 деталей", "5 минифигурки");
    addSet(75244, 2019, "Tantive IV", "75244", "1768 деталей", "6 минифигурки");
    addSet(75246, 2019, "Death Star Cannon", "75246", "159 деталей", "2 минифигурки");
    addSet(75247, 2019, "Rebel A-wing Starfighter", "75247", "62 деталей", "2 минифигурки");
    addSet(75248, 2019, "Resistance A-wing Starfighter", "75248", "269 деталей", "2 минифигурки");
    addSet(75249, 2019, "Resistance Y-wing Starfighter", "75249", "578 деталей", "5 минифигурки");
    addSet(75250, 2019, "Pasaana Speeder Chase", "75250", "373 деталей", "4 минифигурки");
    addSet(75251, 2019, "Darth Vader's Castle", "75251", "1060 деталей", "6 минифигурки");
    addSet(75252, 2019, "Imperial Star Destroyer", "75252", "4784 деталей", "2 минифигурки");
    addSet(75254, 2019, "AT-ST Raider", "75254", "540 деталей", "4 минифигурки");
    addSet(75255, 2019, "Yoda", "75255", "1771 деталей", "1 минифигурки");
    addSet(75256, 2019, "Kylo Ren's Shuttle", "75256", "1005 деталей", "6 минифигурки");
    addSet(75257, 2019, "Millennium Falcon", "75257", "1351 деталей", "7 минифигурки");
    addSet(75258, 2019, "Anakin's Podracer 20th Anniversary Edition", "75258", "279 деталей", "3 минифигурки");
    addSet(75259, 2019, "Snowspeeder 20th Anniversary Edition", "75259", "309 деталей", "4 минифигурки");
    addSet(75261, 2019, "Clone Scout Walker 20th Anniversary Edition", "75261", "250 деталей", "5 минифигурки");
    addSet(75262, 2019, "Imperial Dropship 20th Anniversary Edition", "75262", "125 деталей", "5 минифигурки");
    
    // 2020
    addSet(75263, 2020, "Resistance Y-wing Microfighter", "75263", "86 деталей", "1 минифигурки");
    addSet(75264, 2020, "Kylo Ren's Shuttle Microfighter", "75264", "72 деталей", "1 минифигурки");
    addSet(75265, 2020, "T-16 Skyhopper vs Bantha Microfighters", "75265", "198 деталей", "2 минифигурки");
    addSet(75266, 2020, "Sith Troopers Battle Pack", "75266", "105 деталей", "4 минифигурки");
    addSet(75267, 2020, "Mandalorian Battle Pack", "75267", "102 деталей", "4 минифигурки");
    addSet(75268, 2020, "Snowspeeder", "75268", "91 деталей", "2 минифигурки");
    addSet(75269, 2020, "Duel on Mustafar", "75269", "208 деталей", "2 минифигурки");
    addSet(75270, 2020, "Obi-Wan's Hut", "75270", "200 деталей", "4 минифигурки");
    addSet(75271, 2020, "Luke Skywalker's Landspeeder", "75271", "236 деталей", "3 минифигурки");
    addSet(75272, 2020, "Sith TIE Fighter", "75272", "470 деталей", "3 минифигурки");
    addSet(75273, 2020, "Poe Dameron's X-wing Fighter", "75273", "761 деталей", "4 минифигурки");
    addSet(75275, 2020, "A-wing Starfighter", "75275", "1673 деталей", "1 минифигурки");
    addSet(75280, 2020, "501st Legion Clone Troopers", "75280", "285 деталей", "6 минифигурки");
    addSet(75281, 2020, "Anakin's Jedi Interceptor", "75281", "248 деталей", "2 минифигурки");
    addSet(75283, 2020, "Armored Assault Tank (AAT)", "75283", "286 деталей", "4 минифигурки");
    addSet(75284, 2020, "Knights of Ren Transport Ship", "75284", "595 деталей", "3 минифигурки");
    addSet(75286, 2020, "General Grievous's Starfighter", "75286", "487 деталей", "3 минифигурки");
    addSet(75288, 2020, "AT-AT", "75290", "1267 деталей", "6 минифигурки");
    addSet(75290, 2020, "Mos Eisley Cantina", "75291", "3187 деталей", "21 минифигурки");
    addSet(75291, 2020, "Death Star Final Duel", "75292", "775 деталей", "5 минифигурки");
    addSet(75292, 2020, "The Razor Crest", "75293", "1023 деталей", "5 минифигурки");
    addSet(75293, 2020, "Resistance I-TS Transport", "75293", "932 деталей", "4 минифигурки");
    addSet(75294, 2020, "Bespin Duel", "75294", "295 деталей", "2 минифигурки");
    
    // 2021
    addSet(75295, 2021, "Millennium Falcon Microfighter", "75295", "101 деталей", "1 минифигурки");
    addSet(75296, 2021, "Darth Vader Meditation Chamber", "75296", "663 деталей", "2 минифигурки");
    addSet(75297, 2021, "Resistance X-wing Starfighter", "75297", "60 деталей", "2 минифигурки");
    addSet(75298, 2021, "AT-AT vs. Tauntaun Microfighters", "75298", "205 деталей", "2 минифигурки");
    addSet(75299, 2021, "Trouble on Tatooine", "75299", "276 деталей", "3 минифигурки");
    addSet(75300, 2021, "Imperial TIE Fighter", "75300", "432 деталей", "3 минифигурки");
    addSet(75301, 2021, "Luke Skywalker's X-wing Fighter", "75301", "474 деталей", "4 минифигурки");
    addSet(75302, 2021, "Imperial Shuttle", "75302", "660 деталей", "3 минифигурки");
    addSet(75309, 2021, "Republic Gunship", "75309", "3292 деталей", "2 минифигурки");
    addSet(75310, 2021, "Duel on Mandalore", "75310", "147 деталей", "2 минифигурки");
    addSet(75311, 2021, "Imperial Armored Marauder", "75311", "478 деталей", "4 минифигурки");
    addSet(75312, 2021, "Boba Fett's Starship", "75312", "593 деталей", "2 минифигурки");
    addSet(75313, 2021, "AT-AT", "75313", "6785 деталей", "9 минифигурки");
    addSet(75314, 2021, "The Bad Batch Attack Shuttle", "75314", "969 деталей", "6 минифигурки");
    addSet(75315, 2021, "Imperial Light Cruiser", "75315", "1336 деталей", "6 минифигурки");
    addSet(75316, 2021, "Mandalorian Starfighter", "75316", "544 деталей", "3 минифигурки");
    addSet(75319, 2021, "The Armorer's Mandalorian Forge", "75319", "258 деталей", "3 минифигурки");
    
    // 2022
    addSet(40531, 2022, "Lars Family Homestead Kitchen", "40531", "195 деталей", "1 минифигурки");
    addSet(40557, 2022, "Defense of Hoth", "40557", "64 деталей", "3 минифигурки");
    addSet(40558, 2022, "Clone Trooper Command Station", "40558", "66 деталей", "3 минифигурки");
    addSet(75320, 2022, "Snowtrooper Battle Pack", "75320", "105 деталей", "4 минифигурки");
    addSet(75321, 2022, "The Razor Crest Microfighter", "75321", "98 деталей", "1 минифигурки");
    addSet(75322, 2022, "Hoth AT-ST", "75322", "586 деталей", "4 минифигурки");
    addSet(75323, 2022, "The Justifier", "75323", "1022 деталей", "5 минифигурки");
    addSet(75324, 2022, "Dark Trooper Attack", "75324", "166 деталей", "4 минифигурки");
    addSet(75325, 2022, "The Mandalorian's N-1 Starfighter", "75325", "412 деталей", "4 минифигурки");
    addSet(75326, 2022, "Boba Fett's Throne Room", "75326", "732 деталей", "7 минифигурки");
    addSet(75330, 2022, "Dagobah Jedi Training Diorama", "75330", "1000 деталей", "3 минифигурки");
    addSet(75331, 2022, "The Razor Crest", "75331", "6187 деталей", "4 минифигурки");
    addSet(75332, 2022, "AT-ST", "75332", "87 деталей", "3 минифигурки");
    addSet(75333, 2022, "Obi-Wan Kenobi's Jedi Starfighter", "75333", "282 деталей", "3 минифигурки");
    addSet(75334, 2022, "Obi-Wan Kenobi vs. Darth Vader", "75334", "408 деталей", "4 минифигурки");
    addSet(75336, 2022, "Inquisitor Transport Scythe", "75336", "924 деталей", "4 минифигурки");
    addSet(75337, 2022, "AT-TE Walker", "75337", "1082 деталей", "9 минифигурки");
    addSet(75338, 2022, "Ambush on Ferrix", "75338", "679 деталей", "3 минифигурки");
    addSet(75339, 2022, "Death Star Trash Compactor Diorama", "75339", "802 деталей", "6 минифигурки");
    addSet(75341, 2022, "Luke Skywalker's Landspeeder", "75341", "1890 деталей", "2 минифигурки");
    addSet(75342, 2022, "Republic Fighter Tank", "75342", "262 деталей", "6 минифигурки");

    // 2023
    addSet(40658, 2023, "Millennium Falcon Holiday Diorama", "40658", "282 деталей", "4 минифигурки");
    addSet(75344, 2023, "Boba Fett's Starship Microfighter", "75344", "85 деталей", "1 минифигурки");
    addSet(75345, 2023, "501st Clone Troopers Battle Pack", "75345", "119 деталей", "4 минифигурки");
    addSet(75346, 2023, "Pirate Snub Fighter", "75346", "285 деталей", "2 минифигурки");
    addSet(75347, 2023, "TIE Bomber", "75347", "625 деталей", "4 минифигурки");
    addSet(75348, 2023, "Mandalorian Fang Fighter vs TIE Interceptor", "75348", "957 деталей", "4 минифигурки");
    addSet(75352, 2023, "Emperor's Throne Room Diorama", "75352", "807 деталей", "3 минифигурки");
    addSet(75353, 2023, "Endor Speeder Chase Diorama", "75353", "608 деталей", "3 минифигурки");
    addSet(75354, 2023, "Coruscant Guard Gunship", "75354", "1083 деталей", "5 минифигурки");
    addSet(75355, 2023, "X-wing Starfighter", "75355", "1949 деталей", "2 минифигурки");
    addSet(75357, 2023, "Ghost & Phantom II", "75357", "1394 деталей", "5 минифигурки");
    addSet(75358, 2023, "Tenoo Jedi Temple", "75358", "124 деталей", "4 минифигурки");
    addSet(75359, 2023, "332nd Ahsoka's Clone Trooper Battle Pack", "75359", "108 деталей", "4 минифигурки");
    addSet(75360, 2023, "Yoda's Jedi Starfighter", "75360", "253 деталей", "2 минифигурки");
    addSet(75361, 2023, "Spider Tank", "75361", "526 деталей", "3 минифигурки");
    addSet(75362, 2023, "Ahsoka Tano's T-6 Jedi Shuttle", "75362", "601 деталей", "4 минифигурки");
    addSet(75363, 2023, "The Mandalorian N-1 Starfighter Microfighter", "75363", "88 деталей", "2 минифигурки");
    addSet(75364, 2023, "New Republic E-wing vs. Shin Hati's Starfighter", "75364", "1056 деталей", "5 минифигурки");
    addSet(75365, 2023, "Yavin 4 Rebel Base", "75365", "1066 деталей", "12 минифигурки");
    addSet(75367, 2023, "Venator-class Republic Attack Cruiser", "75367", "5374 деталей", "2 минифигурки");
    
    // 2024
    addSet(40686, 2024, "Trade Federation Troop Carrier", "40686", "262 деталей", "8 минифигурки");
    addSet(40755, 2024, "Imperial Dropship vs. Rebel Scout Speeder", "40755", "383 деталей", "7 минифигурки");
    addSet(75372, 2024, "Clone Trooper & Battle Droid Battle Pack", "75372", "215 деталей", "9 минифигурки");
    addSet(75373, 2024, "Ambush on Mandalore Battle Pack", "75373", "109 деталей", "4 минифигурки");
    addSet(75374, 2024, "The Onyx Cinder", "75374", "1325 деталей", "5 минифигурки");
    addSet(75378, 2024, "BARC Speeder Escape", "75378", "221 деталей", "4 минифигурки");
    addSet(75381, 2024, "Droideka", "75381", "583 деталей", "1 минифигурки");
    addSet(75382, 2024, "TIE Interceptor", "75382", "1931 деталей", "2 минифигурки");
    addSet(75383, 2024, "Darth Maul's Sith Infiltrator", "75383", "640 деталей", "7 минифигурки");
    addSet(75384, 2024, "The Crimson Firehawk", "75384", "136 деталей", "3 минифигурки");
    addSet(75385, 2024, "Ahsoka Tano's Duel on Peridea", "75385", "382 деталей", "5 минифигурки");
    addSet(75386, 2024, "Paz Vizsla and Moff Gideon Battle", "75386", "289 деталей", "4 минифигурки");
    addSet(75387, 2024, "Boarding the Tantive IV", "75387", "502 деталей", "7 минифигурки");
    addSet(75388, 2024, "Jedi Bob's Starfighter", "75388", "305 деталей", "3 минифигурки");
    addSet(75389, 2024, "The Dark Falcon", "75389", "1579 деталей", "6 минифигурки");
    addSet(75391, 2024, "Captain Rex Y-wing Microfighter", "75391", "99 деталей", "1 минифигурки");
    addSet(75393, 2024, "TIE Fighter & X-wing Mash-up", "75393", "1063 деталей", "5 минифигурки");
    addSet(75394, 2024, "Imperial Star Destroyer", "75394", "1555 деталей", "7 минифигурки");
    addSet(75396, 2024, "Desert Skiff & Sarlacc Pit", "40686", "558 деталей", "6 минифигурки");
    addSet(75397, 2024, "Jabba's Sail Barge", "40686", "3942 деталей", "11 минифигурки");
    addSet(75380, 2024, "Mos Espa Podrace Diorama", "75380", "718 деталей", "0 минифигурки");
    
    // 2025
    addSet(40765, 2025, "Kamino Training Facility", "40765", "190 деталей", "3 минифигурки");
    addSet(40771, 2025, "TIE Fighter with Imperial Hangar Rack", "40771", "236 деталей", "3 минифигурки");
    addSet(40806, 2025, "Gingerbread AT-AT Walker", "40806", "697 деталей", "1 минифигурки");
    addSet(75399, 2025, "Rebel U-wing Starfighter", "75399", "594 деталей", "4 минифигурки");
    addSet(75400, 2025, "Plo Koon's Jedi Starfighter Microfighter", "75400", "89 деталей", "1 минифигурки");
    addSet(75401, 2025, "Ahsoka's Jedi Interceptor", "75401", "290 деталей", "3 минифигурки");
    addSet(75402, 2025, "ARC-170 Starfighter", "75402", "497 деталей", "4 минифигурки");
    addSet(75409, 2025, "Jango Fett's Starship", "75409", "2970 деталей", "2 минифигурки");
    addSet(75410, 2025, "Mando and Grogu's N-1 Starfighter", "75410", "92 деталей", "3 минифигурки");
    addSet(75412, 2025, "Death Trooper & Night Trooper Battle Pack", "75412", "119 деталей", "4 минифигурки");
    addSet(75413, 2025, "Republic Juggernaut", "75413", "813 деталей", "8 минифигурки");
    addSet(75414, 2025, "The Force Burner Snowspeeder", "75414", "349 деталей", "3 минифигурки");
    addSet(75417, 2025, "AT-ST", "75417", "1513 деталей", "1 минифигурки");
    addSet(75419, 2025, "Death Star", "75419", "9023 деталей", "40 минифигурки");
    addSet(75431, 2025, "327th Star Corps Clone Troopers Battle Pack", "75431", "258 деталей", "8 минифигурки");
    addSet(75432, 2025, "V-19 Torrent Starfighter", "75432", "567 деталей", "3 минифигурки");
    addSet(75433, 2025, "Jango Fett's Starship", "75433", "707 деталей", "3 минифигурки");
    addSet(75435, 2025, "Battle of Felucia Separatist MTT", "75435", "976 деталей", "12 минифигурки");

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