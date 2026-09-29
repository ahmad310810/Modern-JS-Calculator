// ========================================
// DOM ELEMENTS
// ========================================

const currentValue = document.getElementById("currentValue");
const previousValue = document.getElementById("previousValue");

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const actionButtons = document.querySelectorAll("[data-action]");


// ========================================
// CALCULATOR VARIABLES
// ========================================

let currentNumber = "";
let previousNumber = "";
let operation = null;
let shouldResetScreen = false;


// ========================================
// UPDATE DISPLAY
// ========================================

function updateDisplay() {

    currentValue.textContent =
        currentNumber === "" ? "0" : currentNumber;

    if (previousNumber !== "" && operation !== null) {

        previousValue.textContent =
            `${previousNumber} ${operation}`;

    } else {

        previousValue.textContent = "";
    }
}


// ========================================
// ADD NUMBER
// ========================================

function appendNumber(number) {

    if (shouldResetScreen) {

        currentNumber = "";

        shouldResetScreen = false;
    }


    // Prevent multiple decimal points

    if (number === "." && currentNumber.includes(".")) {
        return;
    }


    // Prevent unnecessary leading zero

    if (currentNumber === "0" && number !== ".") {

        currentNumber = number;

    } else {

        currentNumber += number;
    }


    updateDisplay();
}


// ========================================
// CHOOSE OPERATION
// ========================================

function chooseOperation(selectedOperation) {

    if (currentNumber === "" && previousNumber === "") {
        return;
    }


    if (currentNumber === "" && previousNumber !== "") {

        operation = selectedOperation;

        updateDisplay();

        return;
    }


    if (previousNumber !== "" && operation !== null) {

        calculate();
    }


    previousNumber = currentNumber;

    currentNumber = "";

    operation = selectedOperation;

    updateDisplay();
}


// ========================================
// CALCULATE
// ========================================

function calculate() {

    if (
        previousNumber === "" ||
        currentNumber === "" ||
        operation === null
    ) {
        return;
    }


    const firstNumber = parseFloat(previousNumber);
    const secondNumber = parseFloat(currentNumber);

    let result;


    switch (operation) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "×":
            result = firstNumber * secondNumber;
            break;

        case "÷":

            if (secondNumber === 0) {

                currentNumber = "Error";
                previousNumber = "";
                operation = null;

                updateDisplay();

                shouldResetScreen = true;

                return;
            }

            result = firstNumber / secondNumber;

            break;
    }


    // Remove unnecessary decimal digits

    if (Number.isFinite(result)) {

        result = parseFloat(result.toFixed(10));
    }


    currentNumber = result.toString();

    previousNumber = "";

    operation = null;

    shouldResetScreen = true;

    updateDisplay();
}


// ========================================
// CLEAR
// ========================================

function clearCalculator() {

    currentNumber = "";
    previousNumber = "";
    operation = null;

    shouldResetScreen = false;

    updateDisplay();
}


// ========================================
// DELETE LAST CHARACTER
// ========================================

function deleteNumber() {

    if (shouldResetScreen) {

        return;
    }

    currentNumber = currentNumber.slice(0, -1);

    updateDisplay();
}


// ========================================
// PERCENTAGE
// ========================================

function calculatePercentage() {

    if (currentNumber === "") {
        return;
    }

    currentNumber =
        (parseFloat(currentNumber) / 100).toString();

    updateDisplay();
}


// ========================================
// NUMBER BUTTON EVENTS
// ========================================

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        appendNumber(button.dataset.number);

    });

});


// ========================================
// OPERATION BUTTON EVENTS
// ========================================

operationButtons.forEach(button => {

    button.addEventListener("click", () => {

        chooseOperation(button.dataset.operation);

    });

});


// ========================================
// ACTION BUTTON EVENTS
// ========================================

actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;


        if (action === "clear") {

            clearCalculator();

        }


        if (action === "delete") {

            deleteNumber();

        }


        if (action === "percent") {

            calculatePercentage();

        }


        if (action === "calculate") {

            calculate();

        }

    });

});


// ========================================
// KEYBOARD SUPPORT
// ========================================

document.addEventListener("keydown", event => {

    const key = event.key;


    // Numbers

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {

        appendNumber(key);

        return;
    }


    // Operators

    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        let selectedOperation = key;


        if (key === "*") {
            selectedOperation = "×";
        }

        if (key === "/") {
            selectedOperation = "÷";
        }


        chooseOperation(selectedOperation);

        return;
    }


    // Enter / Equal

    if (
        key === "Enter" ||
        key === "="
    ) {

        event.preventDefault();

        calculate();

        return;
    }


    // Backspace

    if (key === "Backspace") {

        deleteNumber();

        return;
    }


    // Escape

    if (key === "Escape") {

        clearCalculator();

        return;
    }


    // Percentage

    if (key === "%") {

        calculatePercentage();

    }

});


// ========================================
// INITIAL DISPLAY
// ========================================

updateDisplay();