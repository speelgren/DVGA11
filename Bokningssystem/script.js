'use strict';

window.addEventListener('DOMContentLoaded',  () => {
    const waitingQueue = [];

    /* querySelect alla bord */
    const tables = document.querySelectorAll('.btn');

    tables.forEach((table) => {
        /* Lyssnare för vänsterklick på ett bord */
        table.addEventListener('click', (e) => {
            const tableElement = e.currentTarget;

            if (!tableElement) {
                console.error('Table not found.');
                return;
            }

            /* Variabler för att hämta data-table-number och data-seat-number
             * Återkommande. */
            const tableNumber = tableElement.dataset.tableNumber;
            const spanElement = tableElement.querySelector('span.badge');
            const seatNumber = spanElement?.dataset.seatNumber;

            /* Om table innehåller klassen bg-primary */
            if (tableElement.classList.contains('bg-primary')) {
                reserveTable(tableElement, tableNumber, spanElement, seatNumber);
            } else if (tableElement.classList.contains('bg-danger')) {
                /* Om table innehåller bg-danger */
                addToWaitingQueue(tableNumber);
            }
        });
        /* Lyssnare för högerklick på ett bord */
        table.addEventListener('contextmenu', (e) => {
            /* Ta bort defaultbeteendet (muspekar-menyn vid högerklick) */
            e.preventDefault();
            const tableElement = e.currentTarget;

            if (!tableElement) {
                console.error('Table not found.');
                return;
            }
            /* Om table innehåller klassen bg-danger */
            if (tableElement.classList.contains('bg-danger')) {
                const tableNumber = tableElement.dataset.tableNumber;
                const spanElement = tableElement.querySelector('span.badge');
                const seatNumber = spanElement?.dataset.seatNumber;

                unreserveTable(tableElement, tableNumber, spanElement, seatNumber);
            }
        }, false);
    });

    /* Reservera ett bord som innehöll klassen bg-primary */
    const reserveTable = (tableElement, tableNumber, spanElement, seatNumber) => {
        tableElement.classList.replace('bg-primary', 'bg-danger');
        tableElement.textContent = '';
        
        /* Uppdatera textnod och ändra från klassen bg-primary till bg-danger.
         * För att indikera att bordet är bokat. */
        const tableTextNode = document.createTextNode(`Table ${tableNumber}`);
        spanElement?.classList.replace('bg-primary', 'bg-danger');
        spanElement.textContent = '';

        /* Uppdatera span-elementet */
        const spanTextNode = document.createTextNode(` ${seatNumber} seats reserved`);
        
        /* Append */
        spanElement.appendChild(spanTextNode);
        tableElement.appendChild(tableTextNode);
        tableElement.appendChild(spanElement);
    }

    /* Om ett bord innehåller klassen bg-danger (är reserverat) */
    const unreserveTable = (tableElement, tableNumber, spanElement, seatNumber) => {
        tableElement.classList.replace('bg-danger', 'bg-primary');
        tableElement.textContent = '';
        
        const tableTextNode = document.createTextNode(`Table ${tableNumber}`);
        spanElement?.classList.replace('bg-danger', 'bg-primary');
        spanElement.textContent = '';

        /* Uppdatera span-elementet */
        const spanTextNode = document.createTextNode(` ${seatNumber} seats available`);
        
        /* Append */
        spanElement.appendChild(spanTextNode);
        tableElement.appendChild(tableTextNode);
        tableElement.appendChild(spanElement);
    }

    /* Kalkylera maxantalet platser för det största bordet */
    /* Kunde hårdkodats, men det är inte lika roligt. */
    const tableSize = () => {
        let maxTableSize = 0; 
        tables.forEach( (table) => {
            const spanElement = table.querySelector('span.badge');
            const seatNumber = parseInt(spanElement?.dataset.seatNumber) || 0;
            maxTableSize = Math.max(maxTableSize, seatNumber);
        });
        return maxTableSize;
    }

    /* Om bordet innehåller klassen bg-danger: 
     * Lägg till sällskap i kösystemet. */
    const addToWaitingQueue = (tableNumber) => {
        const customer = prompt('Enter customer to queue: ');
        if (customer) {
            const maxTableSize = tableSize();
            let seats = parseInt(prompt(`Enter number of people (max ${maxTableSize}): `));

            /* Om användaren skriver in ett antal större än det bord med flest antal platser. */
            while (isNaN(seats) || seats < 1 || seats > maxTableSize) {
                alert(`Please enter a valid number of people (1 to ${maxTableSize}).`);
                seats = parseInt(prompt(`Enter number of people (max ${maxTableSize}): `));
            }
            waitingQueue.push({
                customer,
                seats,
                tableNumber: parseInt(tableNumber),
            });
            updateWaitingQueue();
        }
    }

    /* Uppdatera väntelistan varje gång en ny sällskap läggs till i kösystemet */
    const updateWaitingQueue = () => {
        const queueElement = document.querySelector('#waiting-queue');
        queueElement.innerHTML = '';

        waitingQueue.forEach((customer, index) => {
            const listItem = createListItem(customer, index);
            queueElement.appendChild(listItem);
        });
    }

    /* Skapa listan för varje sällskap */
    const createListItem = (customer, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.style.fontSize = '1rem';

        const listItemTextNode = document.createTextNode(
            `${customer.customer} has reserved Table ${customer.tableNumber} for ${customer.seats} people.`
        );

        listItem.appendChild(listItemTextNode);
        listItem.addEventListener('contextmenu', (e) => handleListItemRightClick(e, index));

        /* Returnera listItem och append till queueElement */
        return listItem;
    }

    /* Om användaren högerklickar på ett sällskap i väntelistan */
    const handleListItemRightClick = (e, index) => {
        e.preventDefault();

        const emptyTable = updateReservedTable(waitingQueue[index].seats);

        /* Om ett ledigt bord finns */
        if (emptyTable) {
            waitingQueue.splice(index, 1);
            updateWaitingQueue();
        }
        /* Om ett ledigt bord inte finns */
        if (!emptyTable) {
            alert(`There are currently no tables available for ${waitingQueue[index].seats} people.`);
        }
    }

    /* Leta efter ett ledigt bord som passar sällskapet */
    const updateReservedTable = (seats) => {
        /* Returvärde för om det finns ett ledigt bord */
        let tableFound = false;

        for (const table of tables) {
            if (!table) {
                console.error('Table not found.');
                return;
            }

            const tableNumber = table.dataset.tableNumber;
            const spanElement = table.querySelector('span.badge');
            const seatNumber = parseInt(spanElement?.dataset.seatNumber);

            /* Om det finns ett bord med klassen bg-primary och tillräckligt många platser */
            if (table.classList.contains('bg-primary') && seatNumber >= seats) {
                reserveTable(table, tableNumber, spanElement, seatNumber);
                tableFound = true;
                break;
            }
        }
        return tableFound;
    }
});
