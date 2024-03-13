let apiRoutes = 'https://edu.std-900.ist.mospolytech.ru/api/routes?api_key=d0090de7-f9e3-4564-9dd4-27e4d1544238';
let apiGuides = 'https://edu.std-900.ist.mospolytech.ru/api/routes/{id-маршрута}/guides?api_key=d0090de7-f9e3-4564-9dd4-27e4d1544238';
let apiOrders = 'https://edu.std-900.ist.mospolytech.ru/api/orders?api_key=d0090de7-f9e3-4564-9dd4-27e4d1544238';

let xhr = new XMLHttpRequest();

function sendRequest (method, url, body = null) {
    return new Promise((resolve, reject) => {
        xhr.open(method, url)
        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response)
            } else {  
                resolve(xhr.response)
            }
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }

        if (body && typeof body === 'object') {
            let encodedData = Object.keys(body)
                .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key]))
                .join('&');
            xhr.send(encodedData);
        } else {
            xhr.send();
        }
    })
}

let rowsOnPage = 4;
let curList = 1;
let infoRoutes = [];

function displayDataOnPage(page) {
    let startIndex = (page - 1) * rowsOnPage;
    let endIndex = startIndex + rowsOnPage;
    let dataToDisplay = infoRoutes.slice(startIndex, endIndex);

    let listTable = document.getElementById('listTable');
    while (listTable.rows.length > 1) {
        listTable.deleteRow(1);
    }

    dataToDisplay.forEach(route => {
        let row = listTable.insertRow(-1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        cell1.innerHTML = route.name;
        cell2.innerHTML = route.description.length > 150 ? `${route.description.substring(0, 150)} <a href="#" class="tooltip-wide" data-bs-toggle="tooltip" title="${route.description}">читать полностью</a>` : route.description;
        cell3.innerHTML = route.mainObject.length > 150 ? `${route.mainObject.substring(0, 150)} <a href="#" class="tooltip-wide" data-bs-toggle="tooltip" title="${route.mainObject}">читать полностью</a>` : route.mainObject;
        cell4.innerHTML = `<button class="btn btn-light" id="selectButton" onclick="selectRoute(event, '${route.name}', '${route.id}')">Выбрать</button>`;
    });

    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
}

function createPaginationButtons(totalPages) {
    let paginationContainer = document.getElementById('paginationButtons');
    paginationContainer.innerHTML = '';

    let ul = document.createElement('ul');
    ul.classList.add('pagination');
    ul.className += ' justify-content-center';
  
    for (let i = 1; i <= totalPages; i++) {
        let li = document.createElement('li');
        li.classList.add('page-item');
        let button = document.createElement('button');
        button.textContent = i;
        button.classList.add('page-link');
        button.onclick = function() {
            curList = i;
            displayDataOnPage(curList);
        };
        li.appendChild(button); 
        ul.appendChild(li);
    }

    paginationContainer.appendChild(ul);
}

function loadDataAndDisplay() {
    sendRequest('GET', apiRoutes)
    .then(data => {
        infoRoutes = data;
        let totalPages = Math.ceil(infoRoutes.length / rowsOnPage);
        createPaginationButtons(totalPages);
        displayDataOnPage(curList);
    }) 
}

function nextPage() {
    if (curList < Math.ceil(infoRoutes.length / rowsOnPage)) {
        curList++;
        displayDataOnPage(curList);
    }
}

function prevPage() {
    if (curList > 1) {
        curList--;
        displayDataOnPage(curList);
    }
}

loadDataAndDisplay();

function selectRoute(event, name, id) {
    let tableRows1 = document.querySelectorAll('#listTable td');
    tableRows1.forEach(row => {
        row.style.backgroundColor = '';
    });

    let tableRows2 = document.querySelectorAll('#listTable button');
    tableRows2.forEach(row => {
        row.style.backgroundColor = '';
    });

    let tableRows3 = document.querySelectorAll('#listTable a');
    tableRows3.forEach(row => {
        row.style.backgroundColor = '';
    });

    let selectedEl = event.target.parentElement.parentElement;
    selectedEl.querySelectorAll('*').forEach(child => {
        child.style.backgroundColor = '#ecc253';
    });

    let orderBtn = document.getElementById('orderBtn');
    orderBtn.classList.add('disabled');

    let active = document.querySelector('.guides');
    active.classList.add('active');
    document.querySelector('#routeName').innerText = `${name}`;

    let modifiedURL2 = apiGuides.replace('{id-маршрута}', `${id}`);
    sendRequest('GET', modifiedURL2)

    .then(data => {
        let guidesTable = document.getElementById('guidesTable');
        while (guidesTable.rows.length > 1) {
            guidesTable.deleteRow(1);
        }   
        data.forEach(guide => {
            let row = guidesTable.insertRow(-1);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);
            let cell5 = row.insertCell(4);
            let cell6 = row.insertCell(5);

            cell1.innerHTML = `<img src="img/person-square.svg" width="25px">`;
            cell2.innerHTML = guide.name;
            cell3.innerHTML = guide.language;
            cell4.innerHTML = guide.workExperience;
            cell5.innerHTML = `${guide.pricePerHour} руб.`;
            cell6.innerHTML = `<button class="btn btn-light" id="selectButton" onclick="selectGuide(event, '${name}', '${guide.name}', '${id}', '${guide.id}', '${guide.pricePerHour}')">Выбрать</button>`;
        });
    })
}

let body = {};
let guide1 = 0;
let selectedRouteId = 0;
let selectedGuideId = 0;
let input = document.getElementById("quantity");
let check = document.getElementById("check");
let check2 = document.getElementById("check2");
let select = document.getElementById("duration");
let time = document.getElementById("time");
let date = document.getElementById("date");
let output = document.getElementById("summa");

function selectGuide(event, routeName, guideName, routeId, guideId, price) {
    let tableRows1 = document.querySelectorAll('#guidesTable td');
    tableRows1.forEach(row => {
        row.style.backgroundColor = '';
    });

    let tableRows2 = document.querySelectorAll('#guidesTable button');
    tableRows2.forEach(row => {
        row.style.backgroundColor = '';
    });

    let tableRows3 = document.querySelectorAll('#guidesTable a');
    tableRows3.forEach(row => {
        row.style.backgroundColor = '';
    });

    let tableRows4 = document.querySelectorAll('#guidesTable img');
    tableRows4.forEach(row => {
        row.style.backgroundColor = '';
    });

    let selectedEl = event.target.parentElement.parentElement;
    selectedEl.querySelectorAll('*').forEach(child => {
        child.style.backgroundColor = '#ecc253';
    });

    let orderBtn = document.getElementById('orderBtn');
    orderBtn.classList.remove('disabled');
    document.querySelector('#guideName').innerText = `${guideName}`;
    document.querySelector('#routeName1').innerText = `${routeName}`;
    
    guide1 = price
    calculateAndStore();
    selectedRouteId = parseInt(routeId);
    selectedGuideId = parseInt(guideId);
}

function sendOrder(event) {
    event.preventDefault();
    body.guide_id = selectedGuideId;
    body.route_id = selectedRouteId;
    sendRequest('POST', apiOrders, body)
    .then(response => {
        console.log('Order placed successfully:', response);
        let alert = document.getElementById('alert');
        alert.classList.add('active');
        setTimeout(() => {
            alert.classList.remove('active');
        }, 5000);
    })
    .catch(error => {
        console.error('Error placing order:', error);
    });
    console.log(body);
}

let sendButton = document.getElementById('send');
sendButton.addEventListener('submit', sendOrder);

input.addEventListener('input', calculateAndStore);
date.addEventListener('input', calculateAndStore);
time.addEventListener('input', calculateAndStore);
check.addEventListener('change', calculateAndStore);
check2.addEventListener('change', calculateAndStore);
select.addEventListener('change', calculateAndStore);

function calculateAndStore() {
    body = calculate(guide1);
    body.optionFirst = check.checked;
    body.optionSecond = check2.checked;
}

function calculate(guideCost) {
    let inputValue = parseInt(input.value);
    let increase = 0;

    if (inputValue > 5 && inputValue <= 10) {
        increase = 1000;
    } else if (inputValue>10 && inputValue<=20) {
        increase = 1500;
    }

    let selectValue = select.value;
    let selectedDate = new Date(date.value);
    let selectedTime = new Date(`1970-01-01T${time.value}:00`);

    let totalValue = guideCost * selectValue + increase;

    let optionFirst_value = check.checked;
    if (optionFirst_value) {
        totalValue *= 0.75;
    }

    let optionSecond_value = check2.checked;
    if (optionSecond_value && inputValue <= 5) {
        totalValue *= 1.15;
    } else if (optionSecond_value && inputValue > 5 && inputValue <= 10) {
        totalValue *= 1.25;
    } else if (inputValue > 10) {
        check2.setAttribute("disabled", "disabled");
    }

    let dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 6 || dayOfWeek === 0) {
        totalValue = (1.5 * guideCost * selectValue) + increase;
    }

    let hours = ('0' + selectedTime.getHours()).slice(-2);
    let minutes = ('0' + selectedTime.getMinutes()).slice(-2);

    if (selectedTime.getHours() >= 9 && selectedTime.getHours() < 12) {
        totalValue += 400;
    }

    let date_value = selectedDate.toISOString().split('T')[0];
    let time_value = `${hours}:${minutes}`;

    let duration_value = parseInt(selectValue);
    let persons_value = parseInt(inputValue);
    let price_value = parseInt(totalValue);

    output.innerHTML = `${parseInt(totalValue)} руб.`;

    let object = {
        guide_id: 0,
        route_id: 0,
        date: date_value,
        time: time_value,
        duration: duration_value,
        persons: persons_value,
        price: price_value,
        optionFirst: optionFirst_value,
        optionSecond: optionSecond_value,
        student_id: 10800
    }; 
  return object;
}