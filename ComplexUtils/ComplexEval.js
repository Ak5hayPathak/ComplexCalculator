import { Complex } from '../ComplexLibrary/Complex.js';
import { ComplexMath } from '../ComplexLibrary/ComplexMath.js';
import { ComplexPower } from '../ComplexLibrary/ComplexPower.js';
import { ComplexLog } from '../ComplexLibrary/ComplexLog.js';
import { ComplexTrigono } from '../ComplexLibrary/ComplexTrigono.js';

export let state = {
    isDeg: true
}

export let operatorState = {
    isBool: true
}

export function Eval(input) {
    input = input.replace(/sqrt/gi, "SQRT")
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

    console.log(input)
    const tokens = tokenize(input);
    console.log("\n\n")
    console.log(tokens)
    const postfix = infixToPostfix(tokens);
    console.log("\n\n")
    console.log(postfix)
    return evaluatePostfix(postfix);
}

function tokenize(expr) {
    const regex = /(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?i?|[+\-*/^()]|SQRT|SQR|MOD|ARG|REC|LOG10|LN|CONJ|LOG|CUBE|CBRT|ROOT|i/g;
    const rawTokens = expr.match(regex);
    if (!rawTokens) return [];

    const tokens = [];
    for (let i = 0; i < rawTokens.length; i++) {
        const token = rawTokens[i];
        if (token === '-' && (i === 0 || ["+", "-", "*", "/", "(", "^", "SQRT", "MOD", "ARG", "REC", "SQR", "LOG10", "LN", "CONJ", "LOG", "CUBE", "CBRT", "ROOT"].includes(rawTokens[i - 1]))) {
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
        "LN", "CONJ", "CUBE", "CBRT"
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
        } else if (["SQRT", "MOD", "ARG", "REC", "SQR", "LOG10", "LN", "CONJ", "CUBE", "CBRT"].includes(token)) {
            const z = stack.pop();
            if (token === "MOD") stack.push(new Complex(z.getMod(), 0));
            if (token === "ARG") {
                stack.push(new Complex(
                    state.isDeg ? z.getStandardAngle() * (180 / Math.PI) : z.getStandardAngle(), 0
                ));
            }
            if (token === "REC") stack.push(new Complex(z.getReciprocal(), 0));
            if (token === "SQR") stack.push(ComplexPower.power(z, 2));
            if (token === "CUBE") stack.push(ComplexPower.power(z, 3));
            if (token === "SQRT") stack.push(ComplexPower.sqrt(z));
            if (token === "CBRT") stack.push(ComplexPower.cbrt(z));
            if (token === "LOG10") stack.push(ComplexLog.log10(z));
            if (token === "LN") stack.push(ComplexLog.ln(z));
            if (token === "CONJ") stack.push(z.getConjugate());
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

console.log(Eval("(((sqr(3+4i)-(1-2i)*(2+i))/((rec(1+i))+mod(5-12i))))+i*arg(2+2i)"));