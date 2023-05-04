'use strict';
window.addEventListener('DOMContentLoaded', function () {
    var waitingQueue = [];
    var tables = document.querySelectorAll('.btn');
    tables.forEach(function (table) {
        /* Left click to reserve */
        table.addEventListener("click", function (e) {
            var tableElement = e.target;
            try {
                if (!tableElement)
                    throw new Error("Table not found.");
                /* Variables to grab data-table-number and data-seat-number */
                var tableNumber = tableElement.dataset.tableNumber;
                var spanElement = tableElement.querySelector("span.badge");
                var seatNumber = spanElement === null || spanElement === void 0 ? void 0 : spanElement.dataset.seatNumber;
                /* If table is available */
                if (table.classList.contains("bg-primary")) {
                    table.classList.replace("bg-primary", "bg-danger");
                    table.textContent = '';
                    var tableTextNode = document.createTextNode("Table ".concat(tableNumber));
                    spanElement === null || spanElement === void 0 ? void 0 : spanElement.classList.replace("bg-primary", "bg-danger");
                    var spanTextNode = document.createTextNode(" ".concat(seatNumber, " seats reserved"));
                    if (spanElement) {
                        spanElement.textContent = '';
                        spanElement.appendChild(spanTextNode);
                    }
                    table.appendChild(tableTextNode);
                    table.appendChild(spanElement);
                }
                /* If table already reserved */
                else if (table.classList.contains("bg-danger")) {
                    var customer = prompt("Enter customer to queue: ");
                    if (customer) {
                        var seats = parseInt(prompt("Enter number of people: "));
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
        /* Right click to remove active reservation */
        table.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            var tableElement = e.target;
            if (!tableElement)
                throw new Error('Table not found.');
            try {
                if (table.classList.contains('bg-danger')) {
                    /* Variables to grab data-table-number and data-seat-number */
                    var tableNumber = tableElement.dataset.tableNumber;
                    var spanElement = tableElement.querySelector("span.badge");
                    var seatNumber = spanElement === null || spanElement === void 0 ? void 0 : spanElement.dataset.seatNumber;
                    table.classList.replace("bg-danger", "bg-primary");
                    table.textContent = "";
                    var tableTextNode = document.createTextNode("Table ".concat(tableNumber));
                    spanElement === null || spanElement === void 0 ? void 0 : spanElement.classList.replace("bg-danger", "bg-primary");
                    var spanTextNode = document.createTextNode(" ".concat(seatNumber, " seats available"));
                    if (spanElement) {
                        spanElement.textContent = '';
                        spanElement.appendChild(spanTextNode);
                    }
                    table.appendChild(tableTextNode);
                    table.appendChild(spanElement);
                }
            }
            catch (error) {
                console.log(error.message);
            }
        }, false);
    });
    /* Update waiting queue display */
    var updateWaitingQueue = function () {
        var queueElement = document.querySelector('#waiting-queue');
        queueElement.innerHTML = '';
        waitingQueue.forEach(function (customer, index) {
            var listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.style.fontSize = '1rem';
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
    /* Update reserved table */
    var updateReservedTable = function (seats) {
        for (var _i = 0, _a = Array.prototype.slice.call(tables); _i < _a.length; _i++) {
            var table = _a[_i];
            try {
                if (!table)
                    throw new Error("Table not found");
                var tableNumber = table.dataset.tableNumber;
                var spanElement = table.querySelector("span.badge");
                var seatNumber = parseInt(spanElement === null || spanElement === void 0 ? void 0 : spanElement.dataset.seatNumber);
                if (table.classList.contains("bg-primary") &&
                    seatNumber >= seats) {
                    table.classList.replace("bg-primary", "bg-danger");
                    table.textContent = "";
                    var tableTextNode = document.createTextNode("Table ".concat(tableNumber));
                    spanElement === null || spanElement === void 0 ? void 0 : spanElement.classList.replace("bg-primary", "bg-danger");
                    var spanTextNode = document.createTextNode(" ".concat(seatNumber, " seats reserved"));
                    if (spanElement) {
                        spanElement.textContent = '';
                        spanElement.appendChild(spanTextNode);
                    }
                    table.appendChild(tableTextNode);
                    table.appendChild(spanElement);
                    break;
                }
            }
            catch (error) {
                console.log(error.message);
            }
        }
    };
});
