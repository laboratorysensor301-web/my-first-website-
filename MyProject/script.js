const book = document.getElementById('book');
const bookColorInput = document.getElementById('bookColor');
const totalPages = 10;
const totalLeaves = Math.ceil(totalPages / 2) + 1;
let currentLeafIdx = 0;
let currentMode = 'light';

// Mode Configurations
const modes = {
    light: {
        pageBg: 'linear-gradient(to right, #e2d7bd 0%, #fff9f2 10%, #fff9f2 100%)',
        pageBackBg: 'linear-gradient(to left, #e2d7bd 0%, #f7f2e7 10%, #f7f2e7 100%)',
        textColor: '#6d5c4b',
        headingColor: '#5a433d',
        borderColor: '#e2d7bd'
    },
    dark: {
        pageBg: '#2a2420',
        pageBackBg: '#2a2420',
        textColor: '#e2d7bd',
        headingColor: '#f0e6d2',
        borderColor: '#5a5450'
    },
    sepia: {
        pageBg: 'linear-gradient(to right, #d4a574 0%, #e8d4b8 10%, #e8d4b8 100%)',
        pageBackBg: 'linear-gradient(to left, #d4a574 0%, #dcc7a9 10%, #dcc7a9 100%)',
        textColor: '#5a433d',
        headingColor: '#3d2817',
        borderColor: '#a67c52'
    }
};

// Mode Buttons Handler
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentMode = e.target.dataset.mode;
        applyMode(currentMode);
    });
});

function applyMode(mode) {
    const modeConfig = modes[mode];
    const leaves = document.querySelectorAll('.leaf');
    
    leaves.forEach((leaf, index) => {
        // Skip cover page (first) and back cover (last)
        if (index === 0 || index === leaves.length - 1) {
            return;
        }
        
        const pageFront = leaf.querySelector('.page-front');
        const pageBack = leaf.querySelector('.page-back');
        
        if (pageFront) {
            pageFront.style.background = modeConfig.pageBg;
        }
        if (pageBack) {
            pageBack.style.background = modeConfig.pageBackBg;
        }
        
        const paragraphs = leaf.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.style.color = modeConfig.textColor;
        });
        
        const headings = leaf.querySelectorAll('h2');
        headings.forEach(h2 => {
            h2.style.color = modeConfig.headingColor;
            h2.style.borderBottomColor = modeConfig.borderColor;
        });
    });
}

// Color Picker Handler
bookColorInput.addEventListener('change', (e) => {
    updateBookColor(e.target.value);
});

bookColorInput.addEventListener('input', (e) => {
    updateBookColor(e.target.value);
});

function updateBookColor(color) {
    const leaves = document.querySelectorAll('.leaf');
    const firstLeafFront = leaves[0].querySelector('.page-front');
    const lastLeafBack = leaves[leaves.length - 1].querySelector('.page-back');
    
    if (firstLeafFront) firstLeafFront.style.backgroundColor = color;
    if (lastLeafBack) lastLeafBack.style.backgroundColor = color;
    
    // Determine if color is light or dark
    const isLight = isLightColor(color);
    const textColor = isLight ? '#5a433d' : '#e2d7bd';
    const borderColor = isLight ? '#d4a574' : '#7a5e56';
    
    const firstH2 = firstLeafFront?.querySelector('h2');
    const lastH2 = lastLeafBack?.querySelector('h2');
    const firstP = firstLeafFront?.querySelector('p');
    const lastP = lastLeafBack?.querySelector('p');
    
    if (firstH2) {
        firstH2.style.color = textColor;
        firstH2.style.borderBottomColor = borderColor;
    }
    if (lastH2) {
        lastH2.style.color = textColor;
        lastH2.style.borderBottomColor = borderColor;
    }
    if (firstP) firstP.style.color = textColor;
    if (lastP) lastP.style.color = textColor;
}

function isLightColor(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    // Calculate luminance using relative luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
}

function adjustColorBrightness(color, factor) {
    const hex = color.replace('#', '');
    const r = Math.round(parseInt(hex.slice(0, 2), 16) * factor);
    const g = Math.round(parseInt(hex.slice(2, 4), 16) * factor);
    const b = Math.round(parseInt(hex.slice(4, 6), 16) * factor);
    return `rgb(${r}, ${g}, ${b})`;
}

// 1. Generate the Book Structure
function setupBook() {
    for (let i = 0; i < totalLeaves; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.zIndex = totalLeaves - i;

        let frontHtml, backHtml;
        if (i === 0) {
            frontHtml = `<h2>Cover</h2><p>Swipe Right to Start</p>`;
            backHtml = `<h2>Inside Cover</h2><p>Welcome!</p>`;
        } else if (i === totalLeaves - 1) {
            const lastPg = (i - 1) * 2 + 1;
            frontHtml = `<h2>Page ${lastPg}</h2><p>The End.</p>`;
            backHtml = `<h2>Back Cover</h2><p>Fin.</p>`;
        } else {
            const pg = (i - 1) * 2 + 1;
            frontHtml = `<h2>Page ${pg}</h2><p>Right Side Content</p>`;
            backHtml = `<h2>Page ${pg + 1}</h2><p>Left Side Content</p>`;
        }

        leaf.innerHTML = `
            <div class="page-front">${frontHtml}</div>
            <div class="page-back">${backHtml}</div>
        `;
        book.appendChild(leaf);
    }
}

setupBook();
const leaves = document.querySelectorAll('.leaf');
applyMode('light');

// 2. Centralized Flip Logic
function flipForward() {
    if (currentLeafIdx < totalLeaves) {
        const leaf = leaves[currentLeafIdx];
        leaf.classList.add('flipped');
        leaf.style.zIndex = currentLeafIdx + 1; 
        currentLeafIdx++;
        updateBookState();
    }
}

function flipBackward() {
    if (currentLeafIdx > 0) {
        currentLeafIdx--;
        const leaf = leaves[currentLeafIdx];
        leaf.classList.remove('flipped');
        leaf.style.zIndex = totalLeaves - currentLeafIdx;
        updateBookState();
    }
}

function updateBookState() {
    if (currentLeafIdx > 0) {
        book.classList.add('open');
    } else {
        book.classList.remove('open');
    }
}

// 3. Updated Opposite Swipe Logic
let startX = 0;

document.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const distance = startX - endX;

    // Opposite logic:
    // If distance is negative (Finger moved Left -> Right), go NEXT
    if (distance < -50) {
        flipForward();
    } 
    // If distance is positive (Finger moved Right -> Left), go PREVIOUS
    else if (distance > 50) {
        flipBackward();
    }
}, { passive: true });

// 4. Click Logic (Centered)
book.addEventListener('click', (e) => {
    const rect = book.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    if (x > rect.width / 2) {
        flipForward();
    } else {
        flipBackward();
    }
});