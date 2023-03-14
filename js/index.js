// createRegexFromString() function creates a regular expression from a string
const createRegexFromString = (string) => {
    const regexParts = string.match(/^\/([^/]+)\/([a-z]*)$/);
    if (!regexParts) {
        throw new Error(`Invalid regex string: ${string}`);
    }
    const pattern = regexParts[1];
    const flags = regexParts[2];
    return new RegExp(pattern, flags);
}

// escapeRegex() function creates a regular expression ignoring special characters
const escapeRegex = (string) => {
    return new RegExp(string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
}

/*
highlightText() function highlights text by wrapping matches
in the text in a span element with the appropriate highlight class
*/
const highlightText = (regex, text) => {
    const highlightedText = text.replace(regex, `<span class="highlighted">$&</span>`);
    return highlightedText;
}

// moveCursorToEnd() function moves the cursor to the end of the entered text in the text box
const moveCursorToEnd = (elem) => {
    elem.focus();
    let range = document.createRange();
    range.selectNodeContents(elem);
    range.collapse(false);
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

/* 
generateRegex() function generates a regular expression
based on the content of the searchInput text field and
the state of the regexCheckBox, firstMatchCheckBox checkboxes 
*/
const generateRegex = () => {
    let regex;
    if (regexCheckBox.checked) {
        regex = createRegexFromString(searchInput.value);
    } else {
        regex = escapeRegex(searchInput.value);
        if (!firstMatchCheckBox.checked) {
            regex = new RegExp(regex.source, 'g');
        }
    }
    return regex;
}

/*
updateTextBox() function updates the markup in a text box by generating 
regular expression based on the state of regexCheckBox, showMatchCheckBox,
firstMatchCheckBox, and then highlighting the matches.
*/
const updateTextBox = () => {
    if (showMatchCheckBox.checked) {
        let regex;
        if (regexCheckBox.checked) {
            /* catch an error that occurs when it is impossible
            to create a regular expression from a string */
            try {
                regex = createRegexFromString(searchInput.value);
            } catch (e) {
                textBox.innerHTML = textBox.innerText;
                return;
            }
        } else {
            regex = escapeRegex(searchInput.value);
            if (!firstMatchCheckBox.checked) {
                regex = new RegExp(regex.source, 'g');
            }
        }
        textBox.innerHTML = highlightText(regex, textBox.innerText);
    } else {
        textBox.innerHTML = textBox.innerText;
    }
}

// updateCounters() function updates the value of the character and word counter 
const updateCounters = () => {
    const text = textBox.innerText
    characterCounter.innerHTML = text.length;

    // checking whether the string is empty and does not consist of only spaces
    if (!/^\s*$/g.test(text)) {
        wordCounter.innerHTML = textBox.innerText.match(/[^\s.,!?":;()\[\]]+/gu).length;
    } else {
        wordCounter.innerHTML = 0;
    }
}

// copyToClipboard() function copies the text from the text box to the clipboard
const copyToClipboard = (elem) => {
    navigator.clipboard.writeText(elem.innerText)
        .then(() => {
            console.log('Text copied to clipboard');
        })
        .catch(err => {
            console.error('Error copying text: ', err);
        });
}


const accordion = document.getElementById('accordion');
const accordionItems = accordion.getElementsByClassName('accordion-item');
const textBox = document.getElementById('textBox');
const searchInput = document.getElementById('searchInput');
const replaceInput = document.getElementById('replaceInput');
const regexCheckBox = document.getElementById('usingRegex');
const showMatchCheckBox = document.getElementById('showMatch');
const firstMatchCheckBox = document.getElementById('firstMatch');
const characterCounter = document.getElementById('characters');
const wordCounter = document.getElementById('words');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const upperBtn = document.getElementById('upperBtn');
const lowerBtn = document.getElementById('lowerBtn');
const capitalizeBtn = document.getElementById('capitalizeBtn');
const replaceBtn = document.getElementById('replaceBtn');


for (i = 0; i < accordionItems.length; i++) {
    accordionItems[i].addEventListener('click', function (event) {
        if (event.target.className != 'badge') {
            this.classList.toggle('active');
        }
    });
}

textBox.addEventListener('input', () => {
    updateTextBox();
    moveCursorToEnd(textBox);
    updateCounters();
});

searchInput.addEventListener('input', () => {
    updateTextBox();
});

clearBtn.addEventListener('click', () => {
    textBox.innerHTML = '';
    updateCounters();
});

copyBtn.addEventListener('click', () => {
    copyToClipboard(textBox);
});

upperBtn.addEventListener('click', () => {
    textBox.innerText = textBox.innerText.toUpperCase();
    updateTextBox();
});

lowerBtn.addEventListener('click', () => {
    textBox.innerText = textBox.innerText.toLowerCase();
    updateTextBox();
});

capitalizeBtn.addEventListener('click', () => {
    textBox.innerText = textBox.innerText.replace(/\b\w/g, (char) => {
        return char.toUpperCase()
    });
    updateTextBox();
});

[regexCheckBox, showMatchCheckBox, firstMatchCheckBox].forEach((item) => {
    item.addEventListener('change', updateTextBox);
})

replaceBtn.addEventListener('click', (event) => {
    event.preventDefault();
    let regex;
    try {
        regex = generateRegex();
    } catch {
        return;
    }
    const replacedText = textBox.innerText.replace(regex, replaceInput.value);
    textBox.innerHTML = highlightText(regex, replacedText);
});









