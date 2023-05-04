'use strict';
window.addEventListener('DOMContentLoaded', function () {
    var waitingQueue = [];
    var tables = document.querySelectorAll('.btn');
    var updateTableStatus = function (table, tableNumber, spanElement, seatNumber, reserved) {
        var status = reserved ? 'bg-danger' : 'bg-primary';
        var text = reserved ? 'seats reserved' : 'seats available';
        table.classList.replace(reserved ? 'bg-primary' : 'bg-danger', status);
        table.textContent = '';
        var tableTextNode = document.createTextNode("Table ".concat(tableNumber));
        spanElement === null || spanElement === void 0 ? void 0 : spanElement.classList.replace(reserved ? 'bg-primary' : 'bg-danger', status);
        var spanTextNode = document.createTextNode(" ".concat(seatNumber !== null && seatNumber !== void 0 ? seatNumber : '', " ").concat(text));
        if (spanElement) {
            spanElement.textContent = '';
            spanElement.appendChild(spanTextNode);
        }
        table.appendChild(tableTextNode);
        table.appendChild(spanElement);
    };
    var updateWaitingQueue = function () {
        var queueElement = document.querySelector('#waiting-queue');
        queueElement.innerHTML = '';
        waitingQueue.forEach(function (customer, index) {
            var listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            var listItemTextNode = document.createTextNode("".concat(customer.customer, " has reserved Table ").concat(customer.tableNumber, " for ").concat(customer.seats, " people"));
            listItem.appendChild(listItemTextNode);
            queueElement.appendChild(listItem);
            if (listItem) {
                listItem.addEventListener('contextmenu', function (e) {
                    e.preventDefault();
                    updateReservedTable(customer.seats);
                    waitingQueue.splice(index, 1);
                    updateWaitingQueue();
                });
            }
        });
    };
    var updateReservedTable = function (seats) {
        for (var _i = 0, _a = Array.prototype.slice.call(tables); _i < _a.length; _i++) {
            var table = _a[_i];
            try {
                if (!table)
                    throw new Error('Table not found');
                var tableNumber = table.dataset.tableNumber;
                var spanElement = table.querySelector('span.badge');
                var seatNumber = spanElement === null || spanElement === void 0 ? void 0 : spanElement.dataset.seatNumber;
                if (table.classList.contains('bg-danger') &&
                    parseInt(seatNumber) >= seats) {
                    updateTableStatus(table, tableNumber, spanElement, seatNumber, false);
                    break;
                }
            }
            catch (error) {
                console.log(error.message);
            }
        }
    };
    tables.forEach(function (table) {
        table.addEventListener('click', function (e) {
            var tableElement = e.target;
            try {
                if (!tableElement)
                    throw new Error('Table not found');
                var tableNumber = tableElement.dataset.tableNumber;
                var spanElement = tableElement.querySelector('span.badge');
                var seatNumber = spanElement === null || spanElement === void 0 ? void 0 : spanElement.dataset.seatNumber;
                if (table.classList.contains('bg-primary')) {
                    updateTableStatus(table, tableNumber, spanElement, seatNumber, true);
                }
                else if (table.classList.contains('bg-danger')) {
                    var customer = prompt('Enter customer to queue: ');
                    if (customer) {
                        var seats = parseInt(prompt('Enter number of people: '));
                        waitingQueue.push({
                            customer: customer,
                            seats: seats,
                            tableNumber: parseInt(tableNumber),
                        });
                        updateWaitingQueue();
                    }
                }
            }
            catch (error) {
                console.log(error.message);
            }
        });
        table.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            var tableElement = e.target;
            if (!tableElement)
                throw new Error('Table not found');
            try {
                if (table.classList.contains('bg-danger')) {
                    var tableNumber = tableElement.dataset.tableNumber;
                    var spanElement = tableElement.querySelector('span.badge');
                    var seatNumber = spanElement === null || spanElement === void 0 ? void 0 : spanElement.dataset.seatNumber;
                    updateTableStatus(table, tableNumber, spanElement, seatNumber, false);
                }
            }
            catch (error) {
                console.log(error.message);
            }
        }, false);
    });
});
