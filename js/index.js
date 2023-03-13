const accordion = document.getElementById('accordion');
const accordionItems = accordion.getElementsByClassName('accordion-item');

// adding a click event handler to each accordionItems element
for (i = 0; i < accordionItems.length; i++) {
    accordionItems[i].addEventListener('click', function (event) {
        if (event.target.className != 'badge') {
            this.classList.toggle('active');
        }
    });
}

const textBox = document.getElementById('textBox');
const searchInput = document.getElementById('searchInput');
const regexCheckBox = document.getElementById('usingRegex');
const showMatchCheckBox = document.getElementById('showMatch');
const firstMatchCheckBox = document.getElementById('firstMatch');

const createRegexFromString = (string) => {
    const regexParts = string.match(/^\/([^/]+)\/([a-z]*)$/);
    if (!regexParts) {
        throw new Error(`Invalid regex string: ${string}`);
    }
    const pattern = regexParts[1];
    const flags = regexParts[2];
    return new RegExp(pattern, flags);
}

const escapeRegex = (string) => {
    return new RegExp(string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
}

const highlightText = (regex, text) => {
    const highlightedText = text.replace(regex, `<span class="highlighted">$&</span>`);
    return highlightedText;
}

const moveCursorToEnd = (elem) => {
    elem.focus();
    let range = document.createRange();
    range.selectNodeContents(elem);
    range.collapse(false);
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

const updateTextBox = () => {
    // перевірка чи потрібно підсвічувати співпадіння
    if (showMatchCheckBox.checked) {
        let regex;
        if (regexCheckBox.checked) {
            regex = createRegexFromString(searchInput.value);
        } else {
            // ігнорування метасимволів та літералів
            regex = escapeRegex(searchInput.value);

            if (!firstMatchCheckBox.checked) {
                // додавання модифікатора g
                regex = new RegExp(regex.source, 'g');
            }
        }
        textBox.innerHTML = highlightText(regex, textBox.innerText);
    }
}

textBox.addEventListener('input', () => {
    updateTextBox();
    // переміщення курсора в кінець
    moveCursorToEnd(textBox);
    updateCounters();
})

searchInput.addEventListener('input', () => {
    updateTextBox();
})


const characterCounter = document.getElementById('characters');
const wordCounter = document.getElementById('words');

const updateCounters = () => {
    const text = textBox.innerText
    characterCounter.innerHTML = text.length;
    
    // перевірка чи не є рядок пустим та чи не складається він тільки з пробілів
    if (!/^\s*$/g.test(text)) {
        wordCounter.innerHTML = textBox.innerText.match(/[^\s.,!?":;()\[\]]+/gu).length;
    } else {
        wordCounter.innerHTML = 0;
    }
}





