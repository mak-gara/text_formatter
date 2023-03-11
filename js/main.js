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

const textField = document.getElementById('text-field');
const searchInput = document.getElementById('find');
const replaceInput = document.getElementById('replace');
const characters = document.getElementById('characters');
const words = document.getElementById('words');

// adding an input event to a text field
textField.addEventListener('input', () => {
    const searchTerm = searchInput.value;
    const inputText = textField.innerText;

    textField.innerHTML = highlightText(searchTerm, inputText);
    moveCursorToEnd(textField);

    // displaying the number of characters and words
    if (inputText.length == 0) {
        characters.innerHTML = 0;
        words.innerHTML = 0;
    } else {
        characters.innerHTML = inputText.length;
        words.innerHTML = inputText.match(/[^\s.,!?":;()\[\]]+/gu).length;
    }    
})

// moveCursorToEnd() function moves the cursor to the end of the typed text in an editable div 
const moveCursorToEnd = (elem) => {
    elem.focus();
    let range = document.createRange();
    range.selectNodeContents(elem);
    range.collapse(false);
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

// highlightText() function highlights the text
const highlightText = (searchTerm, searchText) => {
    const regex = new RegExp(searchTerm, 'g');
    const highlightedText = searchText.replace(regex, `<span class="highlighted">${searchTerm}</span>`);
    return highlightedText;
}

// toUpperText() function converts the entire contents of a text field to uppercase
const toUpperText = () => {
    textField.innerText = textField.innerText.toUpperCase();
}

// toLowerText() function converts the entire contents of a text field to lowercase
const toLowerText = () => {
    textField.innerText = textField.innerText.toLowerCase();
}

// toCapitalizeText() function converts the first letter of each word in the text to uppercase
const toCapitalizeText = () => {
    textField.innerText = textField.innerText.replace(/\b\w/g, (char) => {
        return char.toUpperCase()
    });
}

// clearTextField() function clears the text field
const clearTextField = () => {
    textField.innerText = "";
    characters.innerText = 0;
    words.innerText = 0;
}

// copyToClipboard() function copies the text from the text field to the clipboard 
const copyToClipboard = () => {
    navigator.clipboard.writeText(textField.innerText)
    .then(() => {
      console.log('Text copied to clipboard');
    })
    .catch(err => {
      console.error('Error copying text: ', err);
    });
}