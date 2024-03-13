// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.
// ----------------------------------------------------------------------------
 
function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}
 
// Проверка, является ли строка str числом.
// ----------------------------------------------------------------------------
// Checking if the string "str" contains a number.
 
function isNumeric(str) {
    return /^-?\d+(.\d+){0,1}$/.test(str);
}
 
// Проверка, является ли строка str цифрой.
// ----------------------------------------------------------------------------
// Checking if the string "str" contains a digit.
 
function isDigit(str) {
    return /^\d{1}$/.test(str);
}
 
// Проверка, является ли строка str оператором.
// ----------------------------------------------------------------------------
// Checking if the string "str" contains an operator.
 
function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}
 
// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.
// ----------------------------------------------------------------------------

 
function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    let isUnaryMinus = false;
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push((isUnaryMinus ? "-" : "") + lastNumber);
                isUnaryMinus = false;
                lastNumber = '';
            }
        } 
        if (isOperation(char)) {
            if (char == '-' && (tokens.length == 0 ||
                 tokens[tokens.length - 1] == '(')) {
                isUnaryMinus = true;
            } else {
                tokens.push(char);
            }
        }
        if (char == '(' || char == ')') {
            tokens.push(char);
        }
    }
    if (lastNumber.length > 0) {
        tokens.push((isUnaryMinus ? "-" : "") + lastNumber);
    }
    return tokens;
}
 
// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной 
// нотации, и преобразует это выражение в обратную 
// польскую нотацию (ОПН). Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции 
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_станции).
// ----------------------------------------------------------------------------

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && 
                   isOperation(stack[stack.length - 1]) && 
                   priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
 
    return out.join(' ');
}
 
// Функция evaluate принимает один аргумент -- строку 
// с арифметическим выражением, записанным в обратной 
// польской нотации. Возвращаемое значение -- результат 
// вычисления выражения. Выражение может включать 
// действительные числа и операторы +, -, *, /.
// Вам нужно реализовать эту функцию
// (https://ru.wikipedia.org/wiki/Обратная_польская_запись#Вычисления_на_стеке).
// ----------------------------------------------------------------------------

 
function evaluate(str) {
    let stack = [];
    compile(str).split(" ").forEach((item) => {
        if (isNumeric(item)) {
            stack.push(parseFloat(item));
        } else {
            let secondOperand = stack.pop();
            let firstOperand = stack.pop();
            if (item == "+") {
                stack.push(secondOperand + firstOperand);
            } else if (item == "-") {
                stack.push(firstOperand - secondOperand);
            } else if (item == "/") {
                stack.push(firstOperand / secondOperand);
            } else {
                stack.push(firstOperand * secondOperand);
            }
        }
    });
    return stack.pop();
}
 
// Функция clickHandler предназначена для обработки 
// событий клика по кнопкам калькулятора. 
// По нажатию на кнопки с классами digit, operation и bracket
// на экране (элемент с классом screen) должны появляться 
// соответствующие нажатой кнопке символы.
// По нажатию на кнопку с классом clear содержимое экрана 
// должно очищаться.
// По нажатию на кнопку с классом result на экране 
// должен появиться результат вычисления введённого выражения 
// с точностью до двух знаков после десятичного разделителя (точки).
// Реализуйте эту функцию. Воспользуйтесь механизмом делегирования 
// событий (https://learn.javascript.ru/event-delegation), чтобы 
// не назначать обработчик для каждой кнопки в отдельности.
// ----------------------------------------------------------------------------

 
function clickHandler(event) {
    if (event.target.classList.contains("clear")) {
        document.querySelector('.screen').value = "";
    } else if (event.target.classList.contains("result")) {
        let result = evaluate(document.querySelector('.screen').value);
        document.querySelector('.screen').value = 
        Math.round(parseFloat(result) * 100) / 100;
    } else {
        document.querySelector('.screen').value += event.target.value;
    }
}
 
// Назначьте нужные обработчики событий.
// ----------------------------------------------------------------------------
 
window.onload = function () {
    document.querySelector(".buttons").onclick = clickHandler;
};