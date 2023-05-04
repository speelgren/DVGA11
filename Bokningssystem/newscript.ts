'use strict';

window.addEventListener('DOMContentLoaded', () => {

    interface Queue {
        customer: string;
        seats: number;
        tableNumber: number;
    }

    const waitingQueue: Queue[] = [];
    const tables  = document.querySelectorAll('.btn');

    const updateTableStatus = (table: Element, tableNumber: string | undefined, spanElement: Element | null, seatNumber: string | undefined, reserved: boolean) => {
        const status = reserved ? 'bg-danger' : 'bg-primary';
        const text = reserved ? 'seats reserved' : 'seats available';
        table.classList.replace(reserved ? 'bg-primary' : 'bg-danger', status);
        table.textContent = '';
        const tableTextNode = document.createTextNode(`Table ${tableNumber}`);
        spanElement?.classList.replace(reserved ? 'bg-primary' : 'bg-danger', status);
        const spanTextNode = document.createTextNode(` ${seatNumber ?? ''} ${text}`);

        if (spanElement) {
            spanElement.textContent = '';
            spanElement.appendChild(spanTextNode);
        }

        table.appendChild(tableTextNode);
        table.appendChild(spanElement!);
    }

    const updateWaitingQueue = () => {
        const queueElement = document.querySelector('#waiting-queue') as HTMLElement;
        queueElement.innerHTML = '';

        waitingQueue.forEach( (customer: Queue, index: number) => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            const listItemTextNode = document.createTextNode(`${customer.customer} has reserved Table ${customer.tableNumber} for ${customer.seats} people`);
            listItem.appendChild(listItemTextNode);
            queueElement.appendChild(listItem);

            if (listItem) {
                listItem.addEventListener('contextmenu', (e: Event) => {
                    e.preventDefault();
                    updateReservedTable(customer.seats);
                    waitingQueue.splice(index, 1);
                    updateWaitingQueue();
                })
            }
       });
    }

    const updateReservedTable = (seats: number) => { 
        for(const table of Array.prototype.slice.call(tables)) {
            try {
                if (!table) throw new Error('Table not found');

                const tableNumber = (table as HTMLElement).dataset.tableNumber;
                const spanElement = (table as HTMLElement).querySelector('span.badge');
                const seatNumber = (spanElement as HTMLElement)?.dataset.seatNumber;

                if(
                    table.classList.contains('bg-danger') &&
                    parseInt(seatNumber!) >= seats
                ) {
                    updateTableStatus(table, tableNumber, spanElement, seatNumber, false);
                    break;
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    };

    tables.forEach( table => {
        table.addEventListener('click', (e: Event) => {
            const tableElement = e.target as HTMLElement;

            try {
                if (!tableElement) throw new Error('Table not found');

                const tableNumber = tableElement.dataset.tableNumber;
                const spanElement = tableElement.querySelector('span.badge');
                const seatNumber = (spanElement as HTMLElement)?.dataset.seatNumber;

                if (table.classList.contains('bg-primary')) {
                    updateTableStatus(table, tableNumber, spanElement, seatNumber, true);
                } else if (table.classList.contains('bg-danger')) {
                    const customer = prompt('Enter customer to queue: ');
                    if (customer) {
                        const seats = parseInt(prompt('Enter number of people: ')!);

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

        table.addEventListener('contextmenu', (e: Event) => { 
            e.preventDefault();
            const tableElement = e.target as HTMLElement;

            if (!tableElement) throw new Error('Table not found');

            try {
                if (table.classList.contains('bg-danger')) {
                    const tableNumber = tableElement.dataset.tableNumber;
                    const spanElement = tableElement.querySelector('span.badge');
                    const seatNumber = (spanElement as HTMLElement)?.dataset.seatNumber;

                    updateTableStatus(table, tableNumber, spanElement, seatNumber, false);
                }
            } catch (error) {
                console.log(error.message);
            }
        }, false);
    });
});