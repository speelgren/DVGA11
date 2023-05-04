'use strict';

window.addEventListener('DOMContentLoaded', () => {

    interface Queue {
        customer: string;
        seats: number;
        tableNumber: number;
    }
    const waitingQueue: Queue[] = [];
    const tables  = document.querySelectorAll('.btn');

    tables.forEach((table) => {
        /* Left click to reserve */
        table.addEventListener("click", (e: Event) => {
            const tableElement = e.target as HTMLElement;
    
            try {
                if (!tableElement) throw new Error("Table not found.");
    
                /* Variables to grab data-table-number and data-seat-number */
                const tableNumber = tableElement.dataset.tableNumber;
                const spanElement = tableElement.querySelector("span.badge");
                const seatNumber = (spanElement as HTMLElement)?.dataset.seatNumber;
    
                /* If table is available */
                if (table.classList.contains("bg-primary")) {
                    table.classList.replace("bg-primary", "bg-danger");
                    table.textContent = '';
                    let tableTextNode = document.createTextNode(`Table ${tableNumber}`);
                    (spanElement as HTMLElement)?.classList.replace("bg-primary", "bg-danger");
                    let spanTextNode = document.createTextNode(` ${seatNumber} seats reserved`);
                    if (spanElement) {
                        spanElement.textContent = '';
                        spanElement.appendChild(spanTextNode);
                    }
                    table.appendChild(tableTextNode);
                    table.appendChild(spanElement!);
                }

                /* If table already reserved */
                else if (table.classList.contains("bg-danger")) {
                    const customer = prompt("Enter customer to queue: ");
                    if (customer) {
                        const seats = parseInt(prompt("Enter number of people: ")!);
    
                        waitingQueue.push({
                            customer,
                            seats,
                            tableNumber: parseInt(tableNumber!),
                        });
                        updateWaitingQueue();
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        });

        /* Right click to remove active reservation */
        table.addEventListener('contextmenu', (e: Event) => {
            e.preventDefault();
            const tableElement = e.target as HTMLElement;

            if (!tableElement) throw new Error('Table not found.');

            try {
                if (table.classList.contains('bg-danger')) {

                    /* Variables to grab data-table-number and data-seat-number */
                    const tableNumber = tableElement.dataset.tableNumber;
                    const spanElement = tableElement.querySelector("span.badge");
                    const seatNumber = (spanElement as HTMLElement)?.dataset.seatNumber;

                    table.classList.replace("bg-danger", "bg-primary");
                    table.textContent = "";
                    let tableTextNode = document.createTextNode(`Table ${tableNumber}`);
                    (spanElement as HTMLElement)?.classList.replace("bg-danger", "bg-primary");
                    let spanTextNode = document.createTextNode(` ${seatNumber} seats available`);
                    if (spanElement) {
                        spanElement.textContent = '';
                        spanElement.appendChild(spanTextNode);
                    }
                    table.appendChild(tableTextNode);
                    table.appendChild(spanElement!);
                }

            } catch (error) {
                console.log(error.message);
            }
        }, false);
    });

    /* Update waiting queue display */
    const updateWaitingQueue = () => {
        const queueElement = document.querySelector('#waiting-queue') as HTMLElement;
        queueElement.innerHTML = '';

        waitingQueue.forEach( (customer: Queue, index: number) => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.style.fontSize = '1rem';
            const listItemTextNode = document.createTextNode(`${customer.customer} has reserved Table ${customer.tableNumber} for ${customer.seats} people`);
            listItem.appendChild(listItemTextNode);
            queueElement.appendChild(listItem);

            if (listItem) {
                listItem.addEventListener('contextmenu', (e: Event) => {
                    e.preventDefault();
                    updateReservedTable(customer.seats);
                    waitingQueue.splice(index, 1);
                    updateWaitingQueue();
                });
            }
        });
    }

    /* Update reserved table */
    const updateReservedTable = (seats: number) => {

        for (const table of Array.prototype.slice.call(tables)) {
            try {
                if (!table) throw new Error("Table not found");

                const tableNumber = (table as HTMLElement).dataset.tableNumber;
                const spanElement = table.querySelector("span.badge");
                const seatNumber = parseInt((spanElement as HTMLElement)?.dataset.seatNumber!);

                if (
                    table.classList.contains("bg-primary") &&
                    seatNumber >= seats
                ) {
                    table.classList.replace("bg-primary", "bg-danger");
                    table.textContent = "";
                    let tableTextNode = document.createTextNode(`Table ${tableNumber}`);
                    (spanElement as HTMLElement)?.classList.replace("bg-primary", "bg-danger");
                    let spanTextNode = document.createTextNode(` ${seatNumber} seats reserved`);
                    if (spanElement) {
                        spanElement.textContent = '';
                        spanElement.appendChild(spanTextNode);
                    }
                    table.appendChild(tableTextNode);
                    table.appendChild(spanElement!);

                    break;
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    };
});