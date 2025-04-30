import { Complex } from './Complex.js';

export class ComplexMath {

    // Prevent instatiation
    constructor() {
        if (new.target === ComplexMath) {
            throw new Error("ComplexMath cannot be instantiated!");
        }
    }

    static add(num1, num2, isImaginary = false) {
        if (num1 instanceof Complex && num2 instanceof Complex) {
            // (a+ib) + (c+id) → Standard Complex Addition
            return new Complex(num1.getReal() + num2.getReal(), num1.getImag() + num2.getImag());
        }

        else if (num1 instanceof Complex && typeof num2 === "number") {
            if (isImaginary) {
                // (a+ib) + ic → Adding an imaginary number to a complex number
                return new Complex(num1.getReal(), num1.getImag() + num2);
            }
            // (a+ib) + c → Adding a real number to a complex number
            return new Complex(num1.getReal() + num2, num1.getImag());
        }

        else if (typeof num1 === "number" && num2 instanceof Complex) {
            if (isImaginary) {
                // ib + (c+id) → Adding an imaginary number to a complex number
                return new Complex(num2.getReal(), num2.getImag() + num1);
            }
            // b + (c+id) → Adding a real number to a complex number
            return new Complex(num2.getReal() + num1, num2.getImag());
        }

        else if (typeof num1 === "number" && typeof num2 === "number") {
            if (isImaginary) {
                // ic + ib → Adding an imaginary number to an imaginary number
                return new Complex(0, num1 + num2);
            }
            // a + b → Adding a real number to a real number
            return new Complex(num1 + num2, 0);
        }
    }

    static subtract(num1, num2, isImaginary = false) {
        if (num1 instanceof Complex && num2 instanceof Complex) {
            // (a+ib) - (c+id) → Standard Complex Subtraction
            return new Complex(num1.getReal() - num2.getReal(), num1.getImag() - num2.getImag());
        }

        else if (num1 instanceof Complex && typeof num2 === "number") {
            if (isImaginary) {
                // (a+ib) - ic → Subtracting an imaginary number from a complex number
                return new Complex(num1.getReal(), num1.getImag() - num2);
            }
            // (a+ib) - c → Subtracting a real number from a complex number
            return new Complex(num1.getReal() - num2, num1.getImag());
        }

        else if (typeof num1 === "number" && num2 instanceof Complex) {
            if (isImaginary) {
                // ib - (c+id) → Subtracting a complex number from an imaginary number
                return new Complex(num2.getReal(), num1 - num2.getImag());
            }
            // b - (c+id) → Subtracting a complex number from a real number
            return new Complex(num1 - num2.getReal(), num2.getImag());
        }

        else if (typeof num1 === "number" && typeof num2 === "number") {
            if (isImaginary) {
                // ic - ib → Subtracting an imaginary number from an imaginary number
                return new Complex(0, num1 - num2);
            }
            // a - b → Subtracting a real number from a real number
            return new Complex(num1 - num2, 0);
        }
    }

    static multiply(num1, num2, isImaginary = false) {
        // Direct number * number multiplication
        if (typeof num1 === "number" && typeof num2 === "number") {
            return isImaginary ? new Complex(0, num1 * num2) : new Complex(num1 * num2, 0);
        }

        // Complex * Complex multiplication
        if (num1 instanceof Complex && num2 instanceof Complex) {
            let a = num1.real, b = num1.imag;
            let c = num2.real, d = num2.imag;

            return new Complex((a * c) - (b * d), (a * d) + (b * c));
        }

        // Number * Complex multiplication
        if (typeof num1 === "number" && num2 instanceof Complex) {
            return isImaginary
                ? new Complex(-num1 * num2.imag, num1 * num2.real) // (ia) * (c+id) = - (ad) + i(ac)
                : new Complex(num1 * num2.real, num1 * num2.imag); // a * (c+id) = (ac) + i(ad)
        }

        // Complex * Number multiplication
        if (num1 instanceof Complex && typeof num2 === "number") {
            return isImaginary
                ? new Complex(-num2 * num1.imag, num2 * num1.real) // (c+id) * (ia) = - (ad) + i(ac)
                : new Complex(num2 * num1.real, num2 * num1.imag); // (c+id) * a = (ac) + i(ad)
        }

        throw new Error("Invalid arguments for multiplication");
    }

    static divide(num1, num2, isImaginary = false) {

        let div = function (numerator, denominator) {
            if (!(numerator instanceof Complex) || !(denominator instanceof Complex)) {
                throw new Error("Both numerator and denominator must be Complex numbers");
            }
            if (denominator.isZero()) {
                throw new Error("Division by zero is undefined");
            }

            let conjugate = denominator.getConjugate();
            let numeratorModified = ComplexMath.multiply(numerator, conjugate);
            let denom = denominator.getModSquared
                ? denominator.getModSquared()
                : (denominator.real * denominator.real) + (denominator.imag * denominator.imag);

            return new Complex(numeratorModified.real / denom, numeratorModified.imag / denom);
        };


        if (num1 instanceof Complex && num2 instanceof Complex) {
            // (a+ib) / (c+id)
            return div(num1, num2);
        }

        else if (num1 instanceof Complex && typeof num2 === "number") {
            if (Math.abs(num2) < Complex.EPSILON) {
                throw new Error("Division by zero is undefined");
            }
            if (isImaginary) {
                // (a+ib) / id
                return div(num1, new Complex(0, num2));
            }
            // (a+ib) / c
            return div(num1, new Complex(num2, 0));
        }

        else if (typeof num1 === "number" && num2 instanceof Complex) {
            if (isImaginary) {
                // (ib) / (c+id)
                return div(new Complex(0, num1), num2);
            }
            // (a) / (c+id)
            return div(new Complex(num1, 0), num2);
        }

        else if (typeof num1 === "number" && typeof num2 === "number") {
            if (Math.abs(num2) < Complex.EPSILON) {
                throw new Error("Division by zero is undefined");
            }
            if (isImaginary) {
                // (ib) / (id) → becomes real division
                return num1 / num2;
            }
            // (a) / (c) → real division
            return num1 / num2;
        }

        throw new Error("Invalid arguments for division");
    }
}

// Prevent inheritance
Object.seal(ComplexMath);