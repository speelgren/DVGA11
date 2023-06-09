'use strict';

window.addEventListener('DOMContentLoaded', (e) => {

    let menuContainer = document.querySelector('.menu');
    let receiptContainer = document.querySelector('.receipt-container');
    let receiptDiv = document.querySelector('.receipt');
    let note = document.querySelector('input');
    let clearReceiptBtn = document.querySelector('.clear-receipt');
    let totalDiv = document.querySelector('.total');
    let totalElement = document.createElement('p');
    totalElement.style.fontWeight = 'bold';
    totalDiv.appendChild(totalElement);

    let total = 0;

    let noteContainer = document.querySelector('.note-container');
    let noteOffsetTop = noteContainer.offsetTop;
    let initialWidth = noteContainer.offsetWidth;
    /* Placeholder för att det inte ska "hoppa" när användaren skrollar förbi inputfältet för notering. */
    let placeholder = document.createElement('div');
    placeholder.style.height = `${noteContainer.offsetHeight}px`;

    /* För att inputfältet för notering ska följa med när användaren skrollar. */
    window.addEventListener('scroll', (e) => {
        if(window.pageYOffset >= noteOffsetTop) {
            noteContainer.style.width = `${initialWidth}px`;
            noteContainer.classList.add('sticky');
            noteContainer.parentNode.insertBefore(placeholder, noteContainer);
        } else {
            noteContainer.style.width = '';
            noteContainer.classList.remove('sticky');
            if (noteContainer.parentNode.contains(placeholder)) {
                noteContainer.parentNode.removeChild(placeholder);
            }
        }
    });

    /* För input för notering. Nödlösning för att fixa så att inputfältet för notering ska vara responsivt när användaren ändrar storlek på webbläsaren */
    window.addEventListener('resize', (e) => {
        initialWidth = noteContainer.offsetWidth;
        if(noteContainer.classList.contains('sticky')) {
            noteContainer.style.width = `${initialWidth}px`;
        }
        placeholder.style.height = `${noteContainer.offsetHeight}px`;
    });
    
    /* Rensa receipt */
    clearReceiptBtn.addEventListener('click', (e) => {
        receiptDiv.innerHTML = '';
        receiptContainer.classList.add('d-none');
        total = 0;
        totalElement.textContent = '';
    });

    const receipt = (item, price, note) => {
        receiptContainer.classList.remove('d-none');
        clearReceiptBtn.classList.remove('d-none');
        displayReceiptItems(receiptDiv, item, price, note);
    };

    const updatePrice = (price) => {
        total += price;
        totalDiv.classList.remove('d-none');
        totalElement.innerHTML = `Total: ${total}kr`;
    };

    const displayReceiptItems = (receiptDiv, item, price, note) => {
        let newLine = document.createElement('br');
        let newItem = document.createTextNode(`${item} ${price}kr `);
        let newNote = document.createElement('i');
        let noteText = document.createTextNode(`${note.value.charAt(0).toUpperCase() + note.value.slice(1)}`);
        newNote.appendChild(noteText);
        receiptDiv.appendChild(newItem);

        if (note.value) {
            receiptDiv.appendChild(newNote);
        }

        receiptDiv.appendChild(newLine);
        note.value = '';
    };

    /* För att hämta ut informationen i json-filen. 
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries */
    for (const [category, items] of Object.entries(menu)) {

        /* Category */
        let categoryElement = document.createElement('h4');
        let categoryNode = document.createTextNode(category.toUpperCase());
        categoryElement.appendChild(categoryNode);
        menuContainer.appendChild(categoryElement);

        /* List-group */
        let listGroup = document.createElement('div');
        listGroup.classList.add('list-group');
        let listGroupItem = document.createElement('div');
        listGroupItem.classList.add('list-group-item', 'mb-3', 'border', 'border-0');
        
        items.forEach( (item) => {

            /* Title */
            let titleElement = document.createElement('div');
            titleElement.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'border-top', 'pt-2');

            /* Name */
            let itemNameElement = document.createElement('h5');
            let itemNameNode = document.createTextNode(item.name);
            itemNameElement.appendChild(itemNameNode);

            /* BTN */
            let btnElement = document.createElement('div');
            btnElement.classList.add('btn', 'btn-primary');
            let btnNode = document.createTextNode('+');
            btnElement.appendChild(btnNode);


            /* Price */
            let itemPriceElement = document.createElement('p');
            let itemPriceNode = document.createTextNode(` ${item.price}kr`);
            itemNameElement.appendChild(itemPriceNode);


            titleElement.appendChild(itemNameElement);
            titleElement.appendChild(btnElement);
            menuContainer.appendChild(listGroup);

            if (item.contents) {

                let itemContentsElement = document.createElement('p');

                /* För att välja ut varje contents
                 * sedan gör de som börjar med "a:" bold
                 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
                 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring */
                item.contents.forEach(content => {
                    if(content.startsWith('a:')) {
                        let strong = document.createElement('strong');
                        let contentNode = document.createTextNode(`${content.substring(2)}`);
                        strong.appendChild(contentNode);
                        itemContentsElement.appendChild(strong);    
                    } else {
                        let contentNode = document.createTextNode(`${content}`);
                        itemContentsElement.appendChild(contentNode);            
                    }
                    if (content !== item.contents[item.contents.length - 1]) {
                        itemContentsElement.appendChild(document.createTextNode(', '));
                    }
                });
                listGroupItem.appendChild(titleElement);
                listGroupItem.appendChild(itemPriceElement);
                listGroupItem.appendChild(itemContentsElement);
            } else {
                listGroupItem.appendChild(titleElement);
                listGroupItem.appendChild(itemPriceElement);
            }

            listGroup.appendChild(listGroupItem);

            /* Klickevent för knapparna. Skickar info till receipt och updatePrice i receiptContainer */
            btnElement.addEventListener('click', (e) => {
                receipt(item.name, item.price, note);
                updatePrice(item.price);
            });
        });
    };
});