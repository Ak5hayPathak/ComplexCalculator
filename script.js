import { Complex, ComplexMath } from "./Complex.js";

const display1 = document.getElementById("inputBox1");
const display2 = document.getElementById("inputBox2");
const buttons = document.querySelectorAll(".button");
const openBracketBtn = document.getElementById("openBracket");

const MAX_LENGTH = 50;  // Set max length for the input
let bracketCount = 0;
let isDeg = true;
let equalFlag = true;


buttons.forEach(button => {
    button.addEventListener("click", () => {

        if (display1.value.length >= MAX_LENGTH && button.id !== "backspace" && button.id !== "clear-all") {
            alert("Maximum input length reached");
            return;  // Prevent adding more characters
        }
        const val = button.id;

        if (val === "leftBracket") {
            leftBracket(display1, display2);
            equalFlag = true;
        }
        else if (val === "rightBracket") {
            rightBracket(display1, display2);
            equalFlag = true;
        }
        else if (val.startsWith("num")) {
            let numValue = val.replace("num", "");
            numVal(display2, numValue);
        }
        else if (val === "mod") {
            modulus(display1, display2);
            equalFlag = true;
        }
        else if (val === "clear-all") {
            clearAll(display1, display2);
            equalFlag = true;
        }
        else if (val === "backspace") {
            backspace(display1, display2);

        }
        else if (val === "reciprocal") {
            reciprocal(display1, display2);
            equalFlag = true;
        }
        else if (val === "theta") {
            args(display1, display2);
            equalFlag = true;
        }
        else if (val === "degOrRad") {
            toggleDegRad();
        }
        else if (val === "iota") {
            iota(display1, display2);
            equalFlag = true;
        }
        else if (val === "add" || val === "subtract" || val === "multiply" || val === "divide") {
            basicOps(display1, display2, val);
            equalFlag = true;
        }
        else if (val === "dot") {
            decimal(display1, display2);
        }
        else if (val === "plusOrMinus") {
            togglePlusMinus(display1, display2);
            equalFlag = true;
        }
        else if (val === "equals") {
            equals(display1, display2);
        }
    });
});

function countDigits(str) {
    return (str.match(/\d/g) || []).length;
}

function updateDisplay(display1, display2) {
    if (display1.value !== "" && !["+", "-", "*", "/", "("].some(op => display1.value.endsWith(op))) {
        if (equalFlag === false && display2.value !== "") {
            display1.value = display2.value;
            display2.value = "";
        }
        return;
    }
    else if (display2 !== "") {
        display1.value += display2.value;
        display2.value = "";
    }
}

function leftBracket(display1, display2) {
    if((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid"){
        return;
    }
    if (display1.value === "" && display2.value === "") {

        updateDisplay(display1, display2);
        display1.value += "(";
        bracketCount++;
        updateBracketDisplay();
    }
    else if (["+", "-", "*", "/", "("].some(op => display1.value.endsWith(op))) {

        updateDisplay(display1, display2);
        display1.value += "(";
        bracketCount++;
        updateBracketDisplay();
    } else if (display2.value.endsWith(".") || display1.value.endsWith(".")) { }
    else {

        updateDisplay(display1, display2);
        display1.value += "*(";
        bracketCount++;
        updateBracketDisplay();
    }
}

function rightBracket(display1, display2) {
    if (bracketCount !== 0) {

        updateDisplay(display1, display2);
        if (bracketCount > 0 && !["+", "-", "*", "/", "(", "."].some(op => display1.value.endsWith(op))) {
            display1.value += ")";
            bracketCount--;
            updateBracketDisplay();

        }
    }
}

function numVal(display2, numValue) {
    
    if((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid"){
        return;
    }
    if (countDigits(display2.value + numValue) > 16) {
        return;
    }

    if (numValue === "0" && (display2.value === "" || display2.value === "0")) {
        return;
    }

    if (display2.value === "") {
        display2.value = numValue;

    }
    else if (!["+", "-", "*", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "("].some(op => display2.value.endsWith(op))) {
        display2.value += "*" + numValue;

    }
    else {
        display2.value += numValue;

    }
}

function modulus(display1, display2) {
    if((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid"){
        return;
    }
    if (display2.value.endsWith(".") || display1.value.endsWith(".")) { }
    else if (display1.value.endsWith(")")) {
        display1.value += "*mod(";

        bracketCount++;
        updateBracketDisplay();
    }
    else if (display2.value === "" || ["+", "-", "*", "/", "("].some(op => display2.value.endsWith(op))) {

        updateDisplay(display1, display2);
        display1.value += "mod(";
        bracketCount++;
        updateBracketDisplay();
    }
    else {

        updateDisplay(display1, display2);
        display1.value += "*mod(";
        bracketCount++;
        updateBracketDisplay();
    }
}

function clearAll(display1, display2) {
    display1.value = display2.value = "";
    bracketCount = 0;
    updateBracketDisplay();
}

function backspace(display1, display2) {
    if (display2.value === "") {
        if (display1.value !== "") {
            const val = display1.value;
            const len = val.length;

            // Check for special functions like "mod(", "arg(", or "rec("
            const suffix = val.slice(-4);

            if (suffix === "mod(" || suffix === "arg(" || suffix === "rec(") {
                display1.value = val.slice(0, -4);
                bracketCount--;
                updateBracketDisplay();

            } else {
                const lastChar = val[len - 1];
                if (lastChar === "(") {
                    bracketCount--;
                    updateBracketDisplay();

                } else if (lastChar === ")") {
                    bracketCount++;
                    updateBracketDisplay();

                }
                display1.value = val.slice(0, -1);

            }
        }
    } else {
        if(display2.value === "Invalid"){
            display2.value = "";
        }
        display2.value = display2.value.slice(0, -1);
    }
}

function reciprocal(display1, display2) {
    if((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid"){
        return;
    }
    if (display2.value.endsWith(".") || display1.value.endsWith(".")) { }
    else if (display2.value === "") {

        if (display1.value === "") {
            display1.value += "rec(";
            bracketCount++;
            updateBracketDisplay();
        }
        else {
            if (["+", "-", "*", "/", "("].some(op => display1.value.endsWith(op))) {
                display1.value += "rec(";  // Wrap the existing value in modulus
                bracketCount++;
                updateBracketDisplay();
            }
            else {
                display1.value += "*rec(";
                bracketCount++;
                updateBracketDisplay();
            }
        }
    }
    else {
        updateDisplay(display1, display2);
        display1.value += "*rec(";
        bracketCount++;
        updateBracketDisplay();
    }
}

function args(display1, display2) {
    if((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid"){
        return;
    }
    if (display2.value.endsWith(".") || display1.value.endsWith(".")) { }

    else if (display2.value === "") {
        if (display1.value === "") {

            display1.value += "arg(";
            bracketCount++;
            updateBracketDisplay();
        }
        else {
            if (["+", "-", "*", "/", "("].some(op => display1.value.endsWith(op))) {

                display1.value += "arg(";  // Wrap the existing value in modulus
                bracketCount++;
                updateBracketDisplay();
            }
            else {

                display1.value += "*arg(";
                bracketCount++;
                updateBracketDisplay();
            }
        }
    }
    else {

        updateDisplay(display1, display2);
        display1.value += "*arg(";
        bracketCount++;
        updateBracketDisplay();
    }
}

function toggleDegRad() {
    const degOrRadButton = document.getElementById("degOrRad"); // Get the button
    const currentText = degOrRadButton.innerText.trim();
    // Toggle between "DEG" and "RAD"
    if (currentText === "DEG") {
        degOrRadButton.innerText = "RAD";
        isDeg = false;
    }
    else {
        degOrRadButton.innerText = "DEG";
        isDeg = true;
    }
}

function iota(display1, display2) {
    if((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid"){
        return;
    }
    if (display2.value.endsWith(".") || display1.value.endsWith(".")) { }
    else if (!display2.value.endsWith(".")) {
        if (display2.value.endsWith("i")) {

            updateDisplay(display1, display2);
            display1.value += "*i";
        }
        else {

            display2.value += "i";
        }
    }
}

function basicOps(display1, display2, val) {
    if((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid"){
        return;
    }
    if (display1.value.endsWith("(") && display2.value === "") {
        if (val === "subtract") {

            updateDisplay(display1, display2);
            display1.value += "-";
        }
        else { }
    }
    else {
        if (display2.value.endsWith(".") || display1.value.endsWith(".")) { }
        else if (display2.value === "") {
            if (display1.value === "") {
                switch (val) {
                    case "add": display1.value = "0+";
                        break;
                    case "subtract": display1.value = "0-";
                        break;
                    case "multiply": display1.value = "0*";
                        break;
                    case "divide": display1.value = "0/";
                        break;
                }
            }
            else {
                if (display1.value[display1.value.length - 2] !== "(" && display2.value === "") {
                    if (["+", "-", "*", "/"].some(op => display1.value.endsWith(op))) {
                        display1.value = display1.value.slice(0, -1);
                    }
                    switch (val) {
                        case "add":
                            updateDisplay(display1, display2);
                            display1.value += "+";
                            break;
                        case "subtract":
                            updateDisplay(display1, display2);
                            display1.value += "-";
                            break;
                        case "multiply":
                            updateDisplay(display1, display2);
                            display1.value += "*";
                            break;
                        case "divide":
                            updateDisplay(display1, display2);
                            display1.value += "/";
                            break;
                    }
                }
            }
        }
        else {

            updateDisplay(display1, display2);
            switch (val) {
                case "add": display1.value += "+";
                    break;
                case "subtract": display1.value += "-";
                    break;
                case "multiply": display1.value += "*";
                    break;
                case "divide": display1.value += "/";
                    break;
            }
        }
    }
}

function decimal(display1, display2) {
    if((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid"){
        return;
    }
    let lastNum1 = display1.value.split(/[\+\-\*\/\(\)]/).pop(); // Extract last number
    let lastNum2 = display2.value.split(/[\+\-\*\/\(\)]/).pop(); // Extract last number

    if (["+", "-", "*", "/", "("].some(op => display2.value.endsWith(op))) {
        display2.value += "0.";  // Start a new number with "0."
    }
    else if (display2.value === "") {
        display2.value = "0.";  // Prevent leading "."
    }
    else if ([")", "i"].some(op => display2.value.endsWith(op))) {
        display2.value += "*0.";  // Implicit multiplication
    }
    else if (display2.value.endsWith(".")) {
        return;  // Prevent multiple consecutive dots
    }
    else if (lastNum1.includes(".") || lastNum2.includes(".")) {
        return;  // Prevent multiple dots in the same number
    }
    else {
        display2.value += ".";
    }

}

function togglePlusMinus(display1, display2) {
    if((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid"){
        return;
    }
    if (display1.value !== "") {
        if ((bracketCount !== 0) || (["+", "-", "*", "/", "("].some(op => display1.value.endsWith(op)))) { }
        else if (display2.value.endsWith(".") || display1.value.endsWith(".")) { }

        else if (display1.value.startsWith("-")) {
            display1.value = display1.value.slice(2,-1);

        }
        else {
            display1.value = `-(${display1.value})`;

        }
    }
}

function updateBracketDisplay() {
    openBracketBtn.innerText = bracketCount === 0 ? "" : `${bracketCount}`;
}

function equals(display1, display2) {
    if((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid"){
        return;
    }
    if (equalFlag) {
        if (display1.value !== "" || display2.value !== "") {
            const expression = display1.value + display2.value;

            // Prevent evaluation if expression ends with an operator, open bracket, or dot
            if (/[+\-*/(.]$/.test(expression)) {
                // Invalid ending; don't evaluate
                return;
            }

            try {
                if(display1.value.endsWith("i") && display2.value.startsWith("i")){
                    return;
                }
                const result = ComplexEval(expression).toString();
                display1.value += display2.value + "=";
                display2.value = result;
            } catch (e) {
                display1.value += "=";
                display2.value = "Invalid";
            }
        }
    }
    equalFlag = false;
}

// ComplexEval.js
function ComplexEval(input) {
    input = input.replace(/mod/gi, "MOD")
        .replace(/arg/gi, "ARG")
        .replace(/rec/gi, "REC");

    const tokens = tokenize(input);
    const postfix = infixToPostfix(tokens);
    return evaluatePostfix(postfix);
}

function tokenize(expr) {
    const regex = /\d+(\.\d+)?i?|\+|\-|\*|\/|\(|\)|MOD|ARG|REC|i/g;
    const rawTokens = expr.match(regex);
    if (!rawTokens) return [];

    const tokens = [];
    for (let i = 0; i < rawTokens.length; i++) {
        const token = rawTokens[i];
        if (token === '-' && (i === 0 || ["+", "-", "*", "/", "(", "MOD", "ARG", "REC"].includes(rawTokens[i - 1]))) {
            tokens.push('u-'); // unary minus
        } else {
            tokens.push(token);
        }
    }
    return tokens;
}


function infixToPostfix(tokens) {
    const precedence = { 'u-': 3, '+': 1, '-': 1, '*': 2, '/': 2 };
    const output = [];
    const stack = [];

    for (const token of tokens) {
        if (isNumber(token) || token === 'i') {
            output.push(token);
        } else if (["MOD", "ARG", "REC"].includes(token)) {
            stack.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                output.push(stack.pop());
            }
            stack.pop(); // pop '('
            if (["MOD", "ARG", "REC"].includes(stack[stack.length - 1])) {
                output.push(stack.pop());
            }
        } else if (["+", "-", "*", "/", "u-"].includes(token)) {
            while (
                stack.length &&
                precedence[stack[stack.length - 1]] >= precedence[token]
            ) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
    }

    while (stack.length) {
        output.push(stack.pop());
    }

    return output;
}


function evaluatePostfix(postfix) {
    const stack = [];

    for (const token of postfix) {
        if (isNumber(token)) {
            stack.push(parseComplex(token));
        } else if (token === 'i') {
            stack.push(new Complex(0, 1));
        } else if (["+", "-", "*", "/"].includes(token)) {
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case '+': stack.push(ComplexMath.add(a, b)); break;
                case '-': stack.push(ComplexMath.subtract(a, b)); break;
                case '*': stack.push(ComplexMath.multiply(a, b)); break;
                case '/': stack.push(ComplexMath.divide(a, b)); break;
            }
        } else if (token === 'u-') {
            const z = stack.pop();
            stack.push(ComplexMath.multiply(new Complex(-1, 0), z));
        } else if (["MOD", "ARG", "REC"].includes(token)) {
            const z = stack.pop();
            if (token === "MOD") stack.push(new Complex(z.getMod(), 0));
            if (token === "ARG") {
                stack.push(new Complex(
                    isDeg ? z.getStandardAngle() * (180 / Math.PI) : z.getStandardAngle(), 0
                ));
            }
            if (token === "REC") stack.push(new Complex(z.getReciprocal(), 0));
        }
    }

    return stack.pop();
}


function isNumber(token) {
    return /^[0-9.]+i?$/.test(token);
}

function parseComplex(token) {
    if (token.endsWith("i")) {
        const value = token.slice(0, -1);
        const imag = value === '' || value === '+' ? 1 : value === '-' ? -1 : parseFloat(value);
        return new Complex(0, imag);
    } else {
        return new Complex(parseFloat(token), 0);
    }
}