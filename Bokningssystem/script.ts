'use strict';

window.addEventListener('DOMContentLoaded', () => {

    interface Queue {
        customer: string;
        seats: number;
        tableNumber: number;
    }

    let waitingQueue: Queue[] = [];
    const table = document.querySelectorAll('.col-4');

    table.forEach( table => {
        table.addEventListener('click', (e: Event) => {
            let tableElement = e.target as HTMLElement;

            try {
                const regex = /\d+/g;
                const match = tableElement.textContent!.match(regex);

                if (!match) throw new Error ('Table number not found');

                let tableNumber = parseInt(match[0]);
                let seatNumber = parseInt(match[1]);
                if (table.classList.contains('bg-primary')) {
                    table.classList.replace('bg-primary', 'bg-danger');
                    table.textContent = `Table ${tableNumber} (${seatNumber}) Reserved`;
                } else if (table.classList.contains('bg-danger')) {
                    const customer = prompt('Enter customer to queue: ');
                    if (customer) {
                        const seats = parseInt(prompt('Enter number of people: ')!);

                        waitingQueue.push( { customer, seats, tableNumber });
                        updateWaitingQueueDisplay();
                    }
                }
            } catch (er) {
                console.log(er.message);
            }
        });

        table.addEventListener('contextmenu', (e: Event) => {
            e.preventDefault();
            let tableElement = e.target as HTMLElement;
            const regex = /\d+/g;
            const match = tableElement.textContent!.match(regex);

            if (!match) throw new Error ('Table number not found');

            let tableNumber = parseInt(match[0]);
            let seatNumber = parseInt(match[1]);
            try {
                if (table.classList.contains('bg-danger')) {
                    table.classList.replace('bg-danger', 'bg-primary');
                    table.textContent = `Table ${tableNumber} (${seatNumber})`;
                }
            } catch (er) {
                console.log(er.message);
            }
        }, false);
    });

    const updateWaitingQueueDisplay = (): void => {
        const queueElement = document.querySelector('#waiting-queue') as HTMLElement;
        queueElement.innerHTML = '';

        waitingQueue.forEach( (customer: Queue, index: number) => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.style.fontSize = '1rem';
            listItem.textContent = `${customer.customer} has reserved Table ${customer.tableNumber} for ${customer.seats} people`;
            queueElement.appendChild(listItem);

            if(listItem) {
                listItem.addEventListener('contextmenu', (e: Event) => {
                    e.preventDefault();
                    waitingQueue.splice(index, 1);
                    updateWaitingQueueDisplay();
                });
            }
        });
    }
});