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
        try {
            regex = createRegexFromString(searchInput.value);
        } catch {
            return undefined;
        }
    } else {
        regex = escapeRegex(searchInput.value);
        if (!firstMatchCheckBox.checked) {
            regex = new RegExp(regex.source, 'g');
        }
    }
    return regex;
}

// updateTextBox() function updates the markup in text box
const updateTextBox = () => {
    if (showMatchCheckBox.checked) {
        const regex = generateRegex();
        if (regex) {
            textBox.innerHTML = highlightText(regex, textBox.innerText);
            return;
        }
    }
    textBox.innerHTML = textBox.innerText;
}

// updateCounters() function updates the value of the character and word counter 
const updateCounters = () => {
    // remove the newline character (\n) when clearing
    // the text field to ensure an accurate character count
    const text = textBox.innerText == '\n' ? '' : textBox.innerText;
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
            showAlert('success', 'Text copied to clipboard');
            console.log('Text copied to clipboard');
        })
        .catch(err => {
            showAlert('danger', 'Error copying text');
            console.error('Error copying text: ', err);
        });
}

// showAlert() function displays alert
const showAlert = (type, message) => {
    const alert = document.createElement('div');
    alert.classList.add('alert', `alert_${type}`);
    alert.innerHTML = `
        <div class="alert__container">
            <div class="alert__icon">
                <img src="img/${type}.svg" alt="${type}-icon">
            </div>
            <div class="alert__message">
                ${message}
            </div>
            <button class="alert__btn-close">
                <img src="img/cross.svg" alt="close">
            </button>
        </div>
    `;
    document.getElementById('overlay').appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 8000);

    const closeBtn = alert.querySelector('.alert__btn-close');
    closeBtn.addEventListener('click', () => {
        alert.remove();
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
const removingBlock = document.getElementById('removing');
const removingItems = removingBlock.getElementsByClassName('badge');
const replacePatterns = {
    'minus': [/-/g, ''],
    'slash': [/\//g, ''],
    'backslash': [/\\/g, ''],
    'extra-spaces': [/ {2,}/g, ' '],
    'all-spaces': [/ /g, ''],
    'enter': [/\n/g, ' ']
};

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
    const regex = generateRegex();
    if (regex) {
        const replacedText = textBox.innerText.replace(regex, replaceInput.value);
        textBox.innerHTML = highlightText(regex, replacedText);
    }
});

Object.values(removingItems).forEach((item) => {
    item.addEventListener('click', (event) => {
        const dataType = event.target.getAttribute('data-type');
        const replacePattern = replacePatterns[dataType];
        const regex = generateRegex();
        if (replacePattern) {
            const clearedText = textBox.innerText.replace(replacePattern[0], replacePattern[1])
            if (regex) {
                textBox.innerHTML = highlightText(regex, clearedText);
            } else {
                textBox.innerHTML = clearedText;
            }
            updateCounters();
        }
    });
});
