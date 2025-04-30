import { ComplexEval } from './ComplexLibrary/ComplexEval.js';

const display1 = document.getElementById("inputBox1");
const display2 = document.getElementById("inputBox2");
const buttons = document.querySelectorAll(".button");
const openBracketBtn = document.getElementById("openBracket");

const MAX_LENGTH = 70;  // Set max length for the input
let bracketCount = 0;
let equalFlag = true;
let toggleState = 0; // 0: normal, 1: -(), 2: ()

document.addEventListener("keydown", (event) => {
    const key = event.key;
    
    if ((display1.value.length >= MAX_LENGTH) && !["Backspace", "Escape"].includes(event.key)) {
        alert("Maximum input length reached");
        return;  // Prevent adding more characters
    }
    if (/^[0-9]$/.test(key)) {
        numVal(key);
    }

    switch(key){
        case "i": iota();
        break;
        case "+": basicOps("add");
        break;
        case "-": basicOps("subtract");
        break;
        case "*": basicOps("multiply");
        break;
        case "/": basicOps("divide");
        break; 
        case "m": modulus();
        break;
        case "r": reciprocal();
        break;
        case "a": args();
        break;
        case "d": toggleDegRad();
        break;
        case ".": decimal();
        break; 
        case "(": leftBracket();
        break; 
        case ")": rightBracket();
        break; 
        case "Backspace": backspace();
        break; 
        case "Enter": equals();
        break; 
        case "Escape": clearAll();
        break; 
    }

    // Prevent default for Enter and Backspace to avoid side effects
    if (["Enter", "Backspace"].includes(key)) {
        event.preventDefault();
    }
});

buttons.forEach(button => {
    button.addEventListener("click", () => {

        if (display1.value.length >= MAX_LENGTH && button.id !== "backspace" && button.id !== "clear-all") {
            alert("Maximum input length reached");
            return;  // Prevent adding more characters
        }
        const val = button.id;

        if (val.startsWith("num")) {
            let numValue = val.replace("num", "");
            numVal(numValue);
        }

        switch(val){
            case "Brackets": Brackets();
            break;
            case "mod": modulus();
            break;
            case "clear-all": clearAll();
            break;
            case "backspace": backspace();
            break;
            case "reciprocal": reciprocal();
            break;
            case "theta": args();
            break;
            case "degOrRad": toggleDegRad();
            break;
            case "iota": iota();
            break;
            case "add": basicOps("add");
            break;
            case "subtract": basicOps("subtract");
            break;
            case "multiply": basicOps("multiply");
            break;
            case "divide": basicOps("divide");
            break;
            case "dot": decimal();
            break;
            case "plusOrMinus": togglePlusMinus();
            break;
            case "equals": equals();
            break;
        }
    });
});

function countDigits(str) {
    return (str.match(/\d/g) || []).length;
}

function updateDisplay() {
    if (display1.value !== "" && !["+", "-", "*", "/", "("].some(op => display1.value.endsWith(op))) {
        if (equalFlag === false && display2.value !== "") {
            display1.value = display2.value;
            display2.value = "";
            equalFlag = true;
        }
        return;
    }
    else if (display2 !== "") {
        display1.value += display2.value;
        display2.value = "";
        equalFlag = true;
    }
}

function toggleDegRad() {
    const degOrRadButton = document.getElementById("degOrRad"); // Get the button
    const currentText = degOrRadButton.innerText.trim();
    // Toggle between "DEG" and "RAD"
    if (currentText === "DEG") {
        degOrRadButton.innerText = "RAD";
        ComplexEval.isDeg = false;
    }
    else {
        degOrRadButton.innerText = "DEG";
        ComplexEval.isDeg = true;
    }
}

function Brackets() {
    if (display1.value.endsWith("=")) {
        if((display2.value === "") || (display2.value === "Invalid")){
            return;
        }
        else{
            display1.value = "(";
            bracketCount++;
            updateBracketDisplay();
            return;
        }
    }
    if (display2.value === "") {
        if (display1.value === "" || ["+", "-", "*", "/", "("].some(op => display1.value.endsWith(op))) {
            updateDisplay();
            display1.value += "(";
            bracketCount++;
            updateBracketDisplay();
        }
        else if (display1.value.endsWith(".")) { return; }
        else {
            if (bracketCount > 0) {
                updateDisplay();
                display1.value += ")";
                bracketCount--;
                updateBracketDisplay();
            }
            else {
                updateDisplay();
                display1.value += "*(";
                bracketCount++;
                updateBracketDisplay();
            }
        }
    }
    else {
        if (display2.value.endsWith(".")) { return; }
        else if (bracketCount > 0) {
            updateDisplay();
            display1.value += ")";
            bracketCount--;
            updateBracketDisplay();
        }
        else {
            updateDisplay();
            display1.value += "*(";
            bracketCount++;
            updateBracketDisplay();
        }
    }
}

function leftBracket() {
    if (display1.value.endsWith("=")) {
        if((display2.value === "") || (display2.value === "Invalid")){
            return;
        }
        else{
            display1.value = "(";
            bracketCount++;
            updateBracketDisplay();
            return;
        }
    }
    if (display2.value === "") {
        if (display1.value === "" || ["+", "-", "*", "/", "("].some(op => display1.value.endsWith(op))) {
            updateDisplay();
            display1.value += "(";
            bracketCount++;
            updateBracketDisplay();
        }
        else if (display1.value.endsWith(".")) { return; }
        else {
            updateDisplay();
            display1.value += "*(";
            bracketCount++;
            updateBracketDisplay();
        }
    }
    else {
        if (display2.value.endsWith(".")) { }
        else {
            updateDisplay();
            display1.value += "*(";
            bracketCount++;
            updateBracketDisplay();
        }
    }
}

function rightBracket() {
    if (bracketCount !== 0) {
        updateDisplay();
        if (bracketCount > 0 && !["+", "-", "*", "/", "(", "."].some(op => display1.value.endsWith(op))) {
            display1.value += ")";
            bracketCount--;
            updateBracketDisplay();
        }
    }
}

function updateBracketDisplay() {
    openBracketBtn.innerText = bracketCount === 0 ? "" : `${bracketCount}`;
}

function modulus() {
    if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
        return;
    }
    if (display2.value.endsWith(".") || display1.value.endsWith(".")) { }
    else if (display1.value.endsWith(")")) {
        display1.value += "*mod(";
        bracketCount++;
        updateBracketDisplay();
    }
    else if (display2.value === "" || ["+", "-", "*", "/", "("].some(op => display2.value.endsWith(op))) {
        updateDisplay();
        display1.value += "mod(";
        bracketCount++;
        updateBracketDisplay();
    }
    else {
        updateDisplay();
        display1.value += "*mod(";
        bracketCount++;
        updateBracketDisplay();
    }
}

function clearAll() {
    display1.value = display2.value = "";
    bracketCount = 0;
    updateBracketDisplay();
}

function backspace() {
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
        if (display2.value === "Invalid") {
            display2.value = "";
        }
        else if(display1.value.endsWith("=")){
            display1.value = display1.value.slice(0, -1);
            display2.value = "";
            equalFlag = true;
        }
        else{
            display2.value = display2.value.slice(0, -1);
        }
    }
}

function reciprocal() {
    if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
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
        updateDisplay();
        display1.value += "*rec(";
        bracketCount++;
        updateBracketDisplay();
    }
}

function args() {
    if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
        return;
    }
    if (display2.value.endsWith(".") || display1.value.endsWith(".")) { 
        return;
    }

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
        updateDisplay();
        display1.value += "*arg(";
        bracketCount++;
        updateBracketDisplay();
    }
}

function iota() {
    if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
        return;
    }
    if (display2.value.endsWith(".") || display1.value.endsWith(".")) { }
    else if (!display2.value.endsWith(".")) {
        if(display1.value.endsWith("=")){
            display1.value = "";
            if(display2.value.endsWith("i")){
                display2.value += "*i";
            }
            else{
                display2.value += "i";
            }
        }
        else if (display2.value.endsWith("i")) {
            updateDisplay();
            display1.value += "*i";
            equalFlag = true;
        }
        else {
            display2.value += "i";
            equalFlag = true;
        }
    }
}

function numVal(numValue) {

    if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
        return;
    }
    if (countDigits(display2.value + numValue) > 32) {
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
        updateDisplay();
    }
    else {
        if(display1.value.endsWith("=")){
            display1.value = "";
        }
        display2.value += numValue;
    }
}

function basicOps(val) {
    if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
        return;
    }

    // Helper: get operator character
    const getOperator = (val) => {
        switch (val) {
            case "add": return "+";
            case "subtract": return "-";
            case "multiply": return "*";
            case "divide": return "/";
            default: return "";
        }
    };

    const operator = getOperator(val);

    // If display1 ends with '(', allow only '-' for negative numbers
    if (display1.value.endsWith("(") && display2.value === "") {
        if (val === "subtract") {
            updateDisplay();
            display1.value += "-";
        }
        return;
    }

    // If nothing in display2 (pending number), and display1 is also empty
    if (display2.value === "") {
        if (display1.value === "") {
            display1.value = "0" + operator;
            equalFlag = true;
            return;
        }

        // Prevent multiple operators in a row
        if (["+", "-", "*", "/"].includes(display1.value.at(-1))) {
            display1.value = display1.value.slice(0, -1) + operator;
            return;
        }

        // Don't allow operator after a dot (incomplete number)
        if (display1.value.endsWith(".")) {
            return;
        }

        // Add operator if valid
        display1.value += operator;
        equalFlag = true;
        return;
    }

    // If display2 has a value, append it to display1 and then operator
    if (!(display2.value.endsWith(".") || display1.value.endsWith("."))) {
        updateDisplay();
        display1.value += operator;
    }
}

function decimal() {
    if ((display1.value.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
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

function togglePlusMinus() {

    let expr = display1.value;

    if ((expr.endsWith("=") && display2.value === "") || display2.value === "Invalid") {
        return;
    }
    if (expr !== "" && !expr.endsWith("=")) {

        if ((["+", "-", "*", "/", "(", "."].some(op => expr.endsWith(op)))) {
            return;
        }

        if (toggleState === 0) {
            display1.value = `-(${expr})`;
            toggleState = 1;
        } else if (toggleState === 1) {
            if (expr.startsWith("-(") && expr.endsWith(")")) {
                display1.value = `(${expr.slice(2, -1)})`;
                toggleState = 2;
            }
        } else if (toggleState === 2) {
            if (expr.startsWith("(") && expr.endsWith(")")) {
                display1.value = expr.slice(1, -1);
                toggleState = 0;
            }
        }
    }
}

function equals() {
    if (!equalFlag) return;

    if (display1.value !== "" || display2.value !== "") {
        const expression = display1.value + display2.value;

        if (/[+\-*/(.]$/.test(expression)) return;

        try {
            console.log("Evaluating expression:", expression);
            const output = ComplexEval.eval(expression);
            console.log("Eval result:", output);
        
            const result = output.toString(6);
            display1.value += display2.value + "=";
            display2.value = result;
        } catch (e) {
            console.error("Evaluation Error:", e);
            display1.value += "=";
            display2.value = "Invalid";
        }        
    }
    equalFlag = false;
}