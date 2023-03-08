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

const text_field = document.getElementById('text-field');
const searchInput = document.getElementById('find');
const replaceInput = document.getElementById('replace');
const characters = document.getElementById('characters');
const words = document.getElementById('words');

// adding an input event to a text field
text_field.addEventListener('input', () => {
    const searchTerm = searchInput.value;
    const inputText = text_field.innerText;

    // highlighting
    text_field.innerHTML = highlightText(searchTerm, inputText);

    // displaying the number of characters and words
    if (inputText.length == 0) {
        characters.innerHTML = 0;
        words.innerHTML = 0;
    } else {
        characters.innerHTML = inputText.length;
        words.innerHTML = inputText.match(/[^\s.,!?":;()\[\]]+/gu).length;
    }    
})

// highlightText() function highlights the text
const highlightText = (searchTerm, searchText) => {
    const regex = new RegExp(searchTerm, 'g');
    const highlightedText = searchText.replace(regex, `<span class="highlighted">${searchTerm}</span>`);
    return highlightedText;
}

// toUpperText() function converts the entire contents of a text field to uppercase
const toUpperText = () => {
    text_field.innerText = text_field.innerText.toUpperCase();
}

// toLowerText() function converts the entire contents of a text field to lowercase
const toLowerText = () => {
    text_field.innerText = text_field.innerText.toLowerCase();
}

// toCapitalizeText() function converts the first letter of each word in the text to uppercase
const toCapitalizeText = () => {
    text_field.innerText = text_field.innerText.replace(/\b\w/g, (char) => {
        return char.toUpperCase()
    });
}

// clearTextField() function clears the text field
const clearTextField = () => {
    text_field.innerText = "";
    characters.innerText = 0;
    words.innerText = 0;
}

// copyToClipboard() function copies the text from the text field to the clipboard 
const copyToClipboard = () => {
    navigator.clipboard.writeText(text_field.innerText)
    .then(() => {
      console.log('Text copied to clipboard');
    })
    .catch(err => {
      console.error('Error copying text: ', err);
    });
}