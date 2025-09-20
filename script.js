import { Button } from '../ComplexUtils/Buttons.js';
import { operatorState, operatorStateTrigono } from '../ComplexUtils/ComplexEval.js';

const display1 = document.getElementById("inputBox1");
const display2 = document.getElementById("inputBox2");
const buttons = document.querySelectorAll(".buttons");

const expressionHistory = document.getElementById("expression");
const expressionValueHistory = document.getElementById("expressionValue");

const MAX_LENGTH = 1000;  // Set max length for the input

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if ((display1.value.length >= MAX_LENGTH) && !["Backspace", "Escape"].includes(event.key)) {
        alert("Maximum input length reached");
        return;  // Prevent adding more characters
    }
    if (/^[0-9]$/.test(key)) {
        Button.numVal(key, display1, display2);
    }

    switch (key) {
        case "i": Button.iota(display1, display2);
            break;
        case "+": Button.basicOps("add", display1, display2);
            break;
        case "-": Button.basicOps("subtract", display1, display2);
            break;
        case "*": Button.basicOps("multiply", display1, display2);
            break;
        case "/": Button.basicOps("divide", display1, display2);
            break;
        case "^": Button.basicOps("power", display1, display2);
            break;
        case "m": Button.modulus(display1, display2);
            break;
        case "r": Button.reciprocal(display1, display2);
            break;
        case "a": Button.args(display1, display2);
            break;
        case "d": Button.toggleDegRad();
            break;
        case "x": Button.conj(display1, display2);
            break;
        case "e": Button.e(display1, display2);
            break;
        case "p": Button.pi(display1, display2);
            break;
        case ".": Button.decimal(display1, display2);
            break;
        case "(": Button.leftBracket(display1, display2);
            break;
        case ")": Button.rightBracket(display1, display2);
            break;
        case "Backspace": Button.backspace(display1, display2);
            break;
        case "Enter": Button.equals(display1, display2, 12);
            break;
        case "Escape": Button.clearAll(display1, display2);
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
            Button.numVal(numValue, display1, display2);
        }

        switch (val) {
            case "Brackets": Button.Brackets(display1, display2);
                break;
            case "mod": Button.modulus(display1, display2);
                break;
            case "clear-all": Button.clearAll(display1, display2);
                break;
            case "backspace": Button.backspace(display1, display2);
                break;
            case "reciprocal": Button.reciprocal(display1, display2);
                break;
            case "theta": Button.args(display1, display2);
                break;
            case "degOrRad": Button.toggleDegRad();
                break;
            case "iota": Button.iota(display1, display2);
                break;
            case "add": Button.basicOps("add", display1, display2);
                break;
            case "subtract": Button.basicOps("subtract", display1, display2);
                break;
            case "multiply": Button.basicOps("multiply", display1, display2);
                break;
            case "divide": Button.basicOps("divide", display1, display2);
                break;
            case "dot": Button.decimal(display1, display2);
                break;
            case "plusOrMinus": Button.togglePlusMinus(display1, display2);
                break;
            case "sqrOrCube":
                operatorState.isBool ? Button.square(display1, display2) : Button.cube(display1, display2);
                break;
            case "sqrtOrCbrt":
                operatorState.isBool ? Button.squareRoot(display1, display2) : Button.cubeRoot(display1, display2);
                break;
            case "powerOrRoot":
                operatorState.isBool ? Button.basicOps("power", display1, display2) : Button.basicOps("root", display1, display2);
                break;
            case "tenPowerOrTwoPower":
                operatorState.isBool ? Button.tenToPow(display1, display2) : Button.twoToPow(display1, display2);
                break;
            case "log10OrLog":
                operatorState.isBool ? Button.log10(display1, display2) : Button.basicOps("log", display1, display2);
                break;
            case "lnOrE":
                operatorState.isBool ? Button.ln(display1, display2) : Button.eToZ(display1, display2);
                break;
            case "conj": Button.conj(display1, display2);
                break;
            case "power": Button.basicOps("power", display1, display2);
                break;
            case "exp": Button.exp(display1, display2);
                break;
            case "toggleOperators": Button.toggleOperators();
                break;
            case "e": Button.e(display1, display2);
                break;
            case "pi": Button.pi(display1, display2);
                break;
            case "equals": Button.equals(display1, display2, 15);
                break;
        }
    });
});

Button.toggleWithOutsideClick('#trigono', '#trigonoOps', 'flex', "#202020", "transparent");

Button.toggleInverseTrigono();
Button.toggleHyperTrigono();

Button.toggleWithOutsideClick('#constants', '#consts', 'flex', "#202020", "transparent");


const trigButtons = document.querySelectorAll(".trigButton");

trigButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const val = button.id;

        const isInverse = operatorStateTrigono.isInverse;
        const isHyper = operatorStateTrigono.isHyper;

        switch (val) {
            case "sin":
                isHyper
                    ? isInverse ? Button.arcsinh(display1, display2) : Button.sinh(display1, display2)
                    : isInverse ? Button.arcsin(display1, display2) : Button.sin(display1, display2);
                break;

            case "cos":
                isHyper
                    ? isInverse ? Button.arccosh(display1, display2) : Button.cosh(display1, display2)
                    : isInverse ? Button.arccos(display1, display2) : Button.cos(display1, display2);
                break;

            case "tan":
                isHyper
                    ? isInverse ? Button.arctanh(display1, display2) : Button.tanh(display1, display2)
                    : isInverse ? Button.arctan(display1, display2) : Button.tan(display1, display2);
                break;

            case "csc":
                isHyper
                    ? isInverse ? Button.arccsch(display1, display2) : Button.csch(display1, display2)
                    : isInverse ? Button.arccsc(display1, display2) : Button.csc(display1, display2);
                break;

            case "sec":
                isHyper
                    ? isInverse ? Button.arcsech(display1, display2) : Button.sech(display1, display2)
                    : isInverse ? Button.arcsec(display1, display2) : Button.sec(display1, display2);
                break;

            case "cot":
                isHyper
                    ? isInverse ? Button.arccoth(display1, display2) : Button.coth(display1, display2)
                    : isInverse ? Button.arccot(display1, display2) : Button.cot(display1, display2);
                break;
        }
    });
});

const constButtons = document.querySelectorAll(".constButton");

constButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const val = button.id;

        switch (val) {
            case "omega":
                Button.omega(display1, display2);
                break;
            case "omega_sqr":
                Button.omega_sqr(display1, display2);
                break;
            case "piConst":
                Button.pi(display1, display2);
                break;
            case "eConst":
                Button.e(display1, display2);
                break;
            case "i":
                Button.iota(display1, display2);
                break;
            case "EulerMascheroni":
                Button.EulerMascheroni(display1, display2);
                break;
            case "GoldenRatio":
                Button.Golden_ratio(display1, display2);
                break;
            case "Catalan":
                Button.Catalan(display1, display2);
                break;
            case "Apery":
                Button.Apery(display1, display2);
                break;
            case "Feigenbaum1":
                Button.Feigenbaum1(display1, display2);
                break;
            case "Feigenbaum2":
                Button.Feigenbaum2(display1, display2);
                break;
            case "Khinchin":
                Button.Khinchin(display1, display2);
                break;
            case "Liouville":
                Button.Liouville(display1, display2);
                break;
            case "PlasticNumber":
                Button.PlasticNumber(display1, display2);
                break;
            case "lnNegOne":
                Button.lnNegOne(display1, display2);
                break;
        }
    });
});

