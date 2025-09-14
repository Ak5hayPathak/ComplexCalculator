import { Complex } from '../ComplexLibrary/Complex.js';
import { ComplexMath } from '../ComplexLibrary/ComplexMath.js';
import { ComplexPower } from '../ComplexLibrary/ComplexPower.js';
import { ComplexLog } from '../ComplexLibrary/ComplexLog.js';
import { ComplexTrigono } from '../ComplexLibrary/ComplexTrigono.js';
import { ComplexHyperbolic } from '../ComplexLibrary/ComplexHyperbolic.js';

export let state = {
    isDeg: true
}

export let operatorState = {
    isBool: true
}

export let operatorStateTrigono = {
    isInverse: false,   // Controlled by the arrow button
    isHyper: false      // Controlled by the hyp button
};

export function Eval(input) {
    input = input.replace(/arcsinh/gi, "ARCSINH")
        .replace(/arccosh/gi, "ARCCOSH")
        .replace(/arctanh/gi, "ARCTANH")
        .replace(/arccsch/gi, "ARCCSCH")
        .replace(/arcsech/gi, "ARCSECH")
        .replace(/arccoth/gi, "ARCCOTH")
        .replace(/arcsin/gi, "ARCSIN")
        .replace(/arccos/gi, "ARCCOS")
        .replace(/arctan/gi, "ARCTAN")
        .replace(/arccsc/gi, "ARCCSC")
        .replace(/arcsec/gi, "ARCSEC")
        .replace(/arccot/gi, "ARCCOT")
        .replace(/sinh/gi, "SINH")
        .replace(/cosh/gi, "COSH")
        .replace(/tanh/gi, "TANH")
        .replace(/csch/gi, "CSCH")
        .replace(/sech/gi, "SECH")
        .replace(/coth/gi, "COTH")
        .replace(/sin/gi, "SIN")
        .replace(/cos/gi, "COS")
        .replace(/tan/gi, "TAN")
        .replace(/csc/gi, "CSC")
        .replace(/sec/gi, "SEC")
        .replace(/cot/gi, "COT")
        .replace(/sqrt/gi, "SQRT")
        .replace(/root/gi, "ROOT")
        .replace(/cube/gi, "CUBE")
        .replace(/cbrt/gi, "CBRT")
        .replace(/conj/gi, "CONJ")
        .replace(/mod/gi, "MOD")
        .replace(/arg/gi, "ARG")
        .replace(/rec/gi, "REC")
        .replace(/log10/gi, "LOG10")
        .replace(/ln/gi, "LN")
        .replace(/sqr/gi, "SQR")
        .replace(/log/gi, "LOG");

    const tokens = tokenize(input);
    const postfix = infixToPostfix(tokens);
    return evaluatePostfix(postfix);
}

function tokenize(expr) {
    const regex = /(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?i?|[+\-*/^()]|SQRT|SQR|MOD|ARG|REC|LOG10|LN|CONJ|LOG|CUBE|CBRT|ROOT|ARCSINH|ARCCOSH|ARCTANH|ARCCSCH|ARCSECH|ARCCOTH|ARCSIN|ARCCOS|ARCTAN|ARCCSC|ARCSEC|ARCCOT|SINH|COSH|TANH|CSCH|SECH|COTH|SIN|COS|TAN|CSC|SEC|COT|i/g;
    const rawTokens = expr.match(regex);
    if (!rawTokens) return [];

    const tokens = [];
    for (let i = 0; i < rawTokens.length; i++) {
        const token = rawTokens[i];
        if (token === '-' && (i === 0 || ["+", "-", "*", "/", "(", "^", "SQRT", "MOD", "ARG", "REC", "SQR", "LOG10", "LN", "CONJ", "LOG", "CUBE", "CBRT", "ROOT", "ARCSINH", "ARCCOSH", "ARCTANH", "ARCCSCH", "ARCSECH", "ARCCOTH", "ARCSIN", "ARCCOS", "ARCTAN", "ARCCSC", "ARCSEC", "ARCCOT", "SINH", "COSH", "TANH", "CSCH", "SECH", "COTH", "SIN", "COS", "TAN", "CSC", "SEC", "COT"].includes(rawTokens[i - 1]))) {
            tokens.push('u-'); // unary minus
        } else {
            tokens.push(token);
        }
    }
    return tokens;
}

function infixToPostfix(tokens) {
    const precedence = {
        'u-': 4,
        '^': 3,
        '*': 2,
        '/': 2,
        '+': 1,
        '-': 1,
        'LOG': 3,
        'ROOT': 3
    };

    const associativity = {
        'u-': 'right',
        '^': 'right',
        '*': 'left',
        '/': 'left',
        '+': 'left',
        '-': 'left',
        'LOG': 'left',
        'ROOT': 'left'
    };

    const functions = new Set([
        "SQRT", "MOD", "ARG", "REC", "SQR", "LOG10",
        "LN", "CONJ", "CUBE", "CBRT", "ARCSINH", "ARCCOSH", "ARCTANH", "ARCCSCH",
        "ARCSECH", "ARCCOTH", "ARCSIN", "ARCCOS", "ARCTAN",
        "ARCCSC", "ARCSEC", "ARCCOT", "SINH", "COSH", "TANH",
        "CSCH", "SECH", "COTH", "SIN", "COS", "TAN", "CSC", "SEC", "COT"
    ]);

    const output = [];
    const stack = [];

    for (const token of tokens) {
        if (isNumber(token) || token === 'i') {
            output.push(token);
        }
        else if (functions.has(token)) {
            stack.push(token);
        }
        else if (token === '(') {
            stack.push(token);
        }
        else if (token === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                output.push(stack.pop());
            }
            stack.pop(); // Remove '('

            if (stack.length && functions.has(stack[stack.length - 1])) {
                output.push(stack.pop());
            }
        }
        else if (token in precedence) {
            while (
                stack.length &&
                (stack[stack.length - 1] in precedence) &&
                (
                    precedence[stack[stack.length - 1]] > precedence[token] ||
                    (
                        precedence[stack[stack.length - 1]] === precedence[token] &&
                        associativity[token] === 'left'
                    )
                )
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
        } else if (["+", "-", "*", "/", "^", "LOG", "ROOT"].includes(token)) {
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case '+': stack.push(ComplexMath.add(a, b)); break;
                case '-': stack.push(ComplexMath.subtract(a, b)); break;
                case '*': stack.push(ComplexMath.multiply(a, b)); break;
                case '/': stack.push(ComplexMath.divide(a, b)); break;
                case '^': stack.push(ComplexPower.power(a, b)); break;
                case "LOG": stack.push(ComplexLog.log(a, b)); break;
                case "ROOT": stack.push(ComplexPower.nthRt(a, b)); break;
            }
        } else if (token === 'u-') {
            const z = stack.pop();
            stack.push(ComplexMath.multiply(new Complex(-1, 0), z));
        } else if (["SQRT", "MOD", "ARG", "REC", "SQR", "LOG10", "LN", "CONJ", "CUBE", "CBRT", "ARCSINH", "ARCCOSH", "ARCTANH", "ARCCSCH",
            "ARCSECH", "ARCCOTH", "ARCSIN", "ARCCOS", "ARCTAN",
            "ARCCSC", "ARCSEC", "ARCCOT", "SINH", "COSH", "TANH",
            "CSCH", "SECH", "COTH", "SIN", "COS", "TAN", "CSC", "SEC", "COT"].includes(token)) {
            const z = stack.pop();
            switch (token) {
                case "MOD":
                    stack.push(new Complex(z.getMod(), 0));
                    break;
                case "ARG":
                    stack.push(new Complex(
                        state.isDeg ? z.getStandardAngle() * (180 / Math.PI) : z.getStandardAngle()
                    ));
                    break;
                case "REC":
                    stack.push(new Complex(z.getReciprocal(), 0));
                    break;
                case "SQR":
                    stack.push(ComplexPower.power(z, 2));
                    break;
                case "CUBE":
                    stack.push(ComplexPower.power(z, 3));
                    break;
                case "SQRT":
                    stack.push(ComplexPower.sqrt(z));
                    break;
                case "CBRT":
                    stack.push(ComplexPower.cbrt(z));
                    break;
                case "LOG10":
                    stack.push(ComplexLog.log10(z));
                    break;
                case "LN":
                    stack.push(ComplexLog.ln(z));
                    break;
                case "CONJ":
                    stack.push(z.getConjugate());
                    break;
                case "SINH":
                    stack.push(ComplexHyperbolic.sinh(z));
                    break;
                case "COSH":
                    stack.push(ComplexHyperbolic.cosh(z));
                    break;
                case "TANH":
                    stack.push(ComplexHyperbolic.tanh(z));
                    break;
                case "COTH":
                    stack.push(ComplexHyperbolic.coth(z));
                    break;
                case "CSCH":
                    stack.push(ComplexHyperbolic.csch(z));
                    break;
                case "SECH":
                    stack.push(ComplexHyperbolic.sech(z));
                    break;
                case "ARCSINH":
                    stack.push(ComplexHyperbolic.arcSinh(z));
                    break;
                case "ARCCOSH":
                    stack.push(ComplexHyperbolic.arcCosh(z));
                    break;
                case "ARCTANH":
                    stack.push(ComplexHyperbolic.arcTanh(z));
                    break;
                case "ARCCOTH":
                    stack.push(ComplexHyperbolic.arcCoth(z));
                    break;
                case "ARCCSCH":
                    stack.push(ComplexHyperbolic.arcCosech(z));
                    break;
                case "ARCSECH":
                    stack.push(ComplexHyperbolic.arcSech(z));
                    break;
                case "SIN":
                    stack.push(new Complex(
                        state.isDeg ? ComplexTrigono.sinDegrees(z) : ComplexTrigono.sin(z)
                    ));
                    break;
                case "COS":
                    stack.push(new Complex(
                        state.isDeg ? ComplexTrigono.cosDegrees(z) : ComplexTrigono.cos(z)
                    ));
                    break;
                case "TAN":
                    stack.push(new Complex(
                        state.isDeg ? ComplexTrigono.tanDegrees(z) : ComplexTrigono.tan(z)
                    ));
                    break;
                case "COT":
                    stack.push(new Complex(
                        state.isDeg ? ComplexTrigono.cotDegrees(z) : ComplexTrigono.cot(z)
                    ));
                    break;
                case "CSC":
                    stack.push(new Complex(
                        state.isDeg ? ComplexTrigono.cosecDegrees(z) : ComplexTrigono.cosec(z)
                    ));
                    break;
                case "SEC":
                    stack.push(new Complex(
                        state.isDeg ? ComplexTrigono.secDegrees(z) : ComplexTrigono.sec(z)
                    ));
                    break;
                case "ARCSIN":
                    stack.push(new Complex(
                        state.isDeg ? ComplexTrigono.arcSinDegrees(z) : ComplexTrigono.arcSin(z)
                    ));
                    break;
                case "ARCCOS":
                    stack.push(new Complex(
                        state.isDeg ? ComplexTrigono.arcCosDegrees(z) : ComplexTrigono.arcCos(z)
                    ));
                    break;
                case "ARCTAN":
                    stack.push(new Complex(
                        state.isDeg ? ComplexTrigono.arcTanDegrees(z) : ComplexTrigono.arcTan(z)
                    ));
                    break;
                case "ARCCOT":
                    stack.push(new Complex(
                        state.isDeg ? ComplexTrigono.arcCotDegrees(z) : ComplexTrigono.arcCot(z)
                    ));
                    break;
                case "ARCCSC":
                    stack.push(new Complex(
                        state.isDeg ? ComplexTrigono.arcCosecDegrees(z) : ComplexTrigono.arcCosec(z)
                    ));
                    break;
                case "ARCSEC":
                    stack.push(new Complex(
                        state.isDeg ? ComplexTrigono.arcSecDegrees(z) : ComplexTrigono.arcSec(z)
                    ));
                    break;
            }

        }
    }

    return stack.pop();
}

function isNumber(token) {
    return /^((\d+\.?\d*|\.\d+)([eE][+-]?\d+)?i?)$/.test(token);
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

// console.log(new Complex("2+3i").printPolar(12));