'use strict';
window.addEventListener('DOMContentLoaded', function () {
    var waitingQueue = [];
    var table = document.querySelectorAll('.col-4');
    table.forEach(function (table) {
        table.addEventListener('click', function (e) {
            var tableElement = e.target;
            try {
                var regex = /\d+/g;
                var match = tableElement.textContent.match(regex);
                if (!match)
                    throw new Error('Table number not found');
                var tableNumber = parseInt(match[0]);
                var seatNumber = parseInt(match[1]);
                if (table.classList.contains('bg-primary')) {
                    table.classList.replace('bg-primary', 'bg-danger');
                    table.textContent = "Table ".concat(tableNumber, " (").concat(seatNumber, ") Reserved");
                }
                else if (table.classList.contains('bg-danger')) {
                    var customer = prompt('Enter customer to queue: ');
                    if (customer) {
                        var seats = parseInt(prompt('Enter number of people: '));
                        waitingQueue.push({ customer: customer, seats: seats, tableNumber: tableNumber });
                        updateWaitingQueueDisplay();
                    }
                }
            }
            catch (er) {
                console.log(er.message);
            }
        });
        table.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            var tableElement = e.target;
            var regex = /\d+/g;
            var match = tableElement.textContent.match(regex);
            if (!match)
                throw new Error('Table number not found');
            var tableNumber = parseInt(match[0]);
            var seatNumber = parseInt(match[1]);
            try {
                if (table.classList.contains('bg-danger')) {
                    table.classList.replace('bg-danger', 'bg-primary');
                    table.textContent = "Table ".concat(tableNumber, " (").concat(seatNumber, ")");
                }
            }
            catch (er) {
                console.log(er.message);
            }
        }, false);
    });
    var updateWaitingQueueDisplay = function () {
        var queueElement = document.querySelector('#waiting-queue');
        queueElement.innerHTML = '';
        waitingQueue.forEach(function (customer, index) {
            var listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.style.fontSize = '1rem';
            listItem.textContent = "".concat(customer.customer, " has reserved Table ").concat(customer.tableNumber, " for ").concat(customer.seats, " people");
            queueElement.appendChild(listItem);
            if (listItem) {
                listItem.addEventListener('contextmenu', function (e) {
                    e.preventDefault();
                    waitingQueue.splice(index, 1);
                    updateWaitingQueueDisplay();
                });
            }
        });
    };
});
