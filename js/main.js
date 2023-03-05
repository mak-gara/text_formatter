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

const textarea = document.getElementById('textarea');

// toUpperText() function converts the entire contents of a text field to uppercase
const toUpperText = () => {
    textarea.value = textarea.value.toUpperCase();
}

// toLowerText() function converts the entire contents of a text field to lowercase
const toLowerText = () => {
    textarea.value = textarea.value.toLowerCase();
}

// toCapitalizeText() function converts the first letter of each word in the text to uppercase
const toCapitalizeText = () => {
    textarea.value = textarea.value.replace(/\b\w/g, (char) => {
        return char.toUpperCase()
    });
}

// clearTextarea() function clears the text field
const clearTextarea = () => {
    textarea.value = "";
}

// copyToClipboard() function copies the text from the text field to the clipboard 
const copyToClipboard = () => {
    navigator.clipboard.writeText(textarea.value)
    .then(() => {
      console.log('Text copied to clipboard');
    })
    .catch(err => {
      console.error('Error copying text: ', err);
    });
}