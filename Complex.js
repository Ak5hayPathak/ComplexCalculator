export class Complex {
    constructor(a, b, c) {
        if (arguments.length === 0) {
            //If no arguments are passed
            this.real = 0;
            this.imag = 0;
        }
        else if (typeof a === "string") {
            // Remove whitespace
            a = a.trim();

            // Handle pure real numbers (e.g., "3", "-2.5")
            if (/^[-+]?\d*\.?\d+$/.test(a)) {
                this.real = parseFloat(a);
                this.imag = 0.0;
                return;
            }

            // Handle pure imaginary numbers (e.g., "4i", "-2.3i", "i", "-i")
            if (/^[-+]?(?:\d*\.?\d+)?i$/.test(a)) {
                if (a === "i") {
                    this.real = 0.0;
                    this.imag = 1.0;
                } else if (a === "-i") {
                    this.real = 0.0;
                    this.imag = -1.0;
                } else {
                    this.real = 0.0;
                    this.imag = parseFloat(a.replace("i", "")) || 1.0;
                }
                return;
            }

            // Handle full complex numbers (e.g., "3+4i", "-2-5i", "3.1+i", "4-i")
            const regex = /^([-+]?\d*\.?\d+)?([-+]\d*\.?\d*)?i$/;
            const match = a.match(regex);

            if (match) {
                // Extract real part (if exists, otherwise default to 0)
                this.real = match[1] ? parseFloat(match[1]) : 0.0;

                // Extract imaginary part (handle "+i" or "-i" as special cases)
                let imagPart = match[2];
                if (!imagPart) {
                    this.imag = 0.0; // No imaginary part means it's a real number
                } else if (imagPart === "+" || imagPart === "-") {
                    this.imag = imagPart === "+" ? 1.0 : -1.0;
                } else {
                    this.imag = parseFloat(imagPart);
                }
                return;
            }

            throw new Error("Invalid complex number format: " + a);
        }
        else if (a instanceof Complex) {
            //Copy Constructor
            this.real = a.real;
            this.imag = a.imag;
        }
        else if (c === true) {
            // Polar constructor
            this.real = a * Math.cos(b);
            this.imag = a * Math.sin(b);
        }
        else {
            // Standard real & imaginary constructor
            this.real = a ?? 0;
            this.imag = b ?? 0;
        }
    }

    isZero(tolerance = 1e-10) {
        return Math.abs(this.real) < tolerance && Math.abs(this.imag) < tolerance;
    }


    isPureReal(tolerance = 1e-10) {
        return (!this.isZero()) && (Math.abs(this.imag) < tolerance);
    }

    isPureImaginary(tolerance = 1e-10) {
        return (!this.isZero()) && (Math.abs(this.real) < tolerance);
    }

    getReal() {
        return this.real;
    }

    getImag() {
        return this.imag;
    }

    typecast(val) {
        if (val instanceof Complex) {
            return val.real; // Return only the real part as a number
        }
        return new Complex(val, 0); // Convert a real number to a Complex object
    }

    getMod() {
        return Math.sqrt((this.real * this.real) + (this.imag * this.imag));
    }

    getAngle() {
        if (this.isZero()) {
            throw new Error("Angle is undefined for the origin (0 + 0i)");
        }

        return Math.atan2(this.imag, this.real); // Automatically handles all quadrants
    }

    getStandardAngle() {
        if (this.isZero()) {
            throw new Error("Angle is undefined for the origin (0 + 0i)");
        }

        let angle = Math.atan2(this.imag, this.real); // Principal argument (-π, π]
        return (angle < 0) ? angle + 2 * Math.PI : angle; // Convert to [0, 2π)
    }

    getAngleToDegrees() {
        return this.getAngle() * (180 / Math.PI);
    }

    getStandardAngleToDegrees() {
        return this.getStandardAngle() * (180 / Math.PI);
    }

    getConjugate() {
        return new Complex(this.real, -this.imag);
    }

    getReciprocal() {
        if (this.isZero()) {
            throw new Error("Reciprocal is undefined for zero complex number.");
        }

        let modSqr = this.real * this.real + this.imag * this.imag;
        return new Complex(this.real / modSqr, -this.imag / modSqr);
    }

    equals(other, tolerance = 1e-10) {
        if (!(other instanceof Complex)) {
            return false;
        }
        return Math.abs(this.real - other.real) < tolerance &&
            Math.abs(this.imag - other.imag) < tolerance;
    }

    isGreaterThan(other) {
        return this.getMod() > other.getMod();
    }

    isLessThan(other) {
        return this.getMod() < other.getMod();
    }

    lexicographicCompare(other) {
        return this.real !== other.real ? this.real - other.real : this.imag - other.imag;
    }

    printComplex(precision = 3) {
        if (this.isZero()) {
            console.log(0);
            return;
        }
        if (this.isPureReal()) {
            console.log(this.real.toFixed(precision));
        }
        else if (this.isPureImaginary()) {
            if (Math.abs(this.imag) == 1) {
                console.log(this.imag > 0 ? "i" : "-i")
            } else {
                console.log(`${this.imag.toFixed(precision)}i`);
            }
        }
        else {
            console.log(this.real.toFixed(precision) + (this.imag > 0 ? " + " : " - ") + (Math.abs(this.imag) === 1 ? "i" : Math.abs(this.imag).toFixed(precision) + "i"));
        }
    }

    printPolar(precision = 3) {
        if (this.isZero()) {
            console.log("0");
            return;
        }

        let mod = this.getMod();
        let angle = this.getAngle();

        let formattedMod = mod.toFixed(precision);
        let formattedAngle = angle.toFixed(precision);

        console.log(`${formattedMod}(cos(${formattedAngle}) ${angle < 0 ? "- i sin(" : "+ i sin("}${Math.abs(formattedAngle)}))`);
    }

    toString(precision = 3) {
        const format = (num) => {
            const rounded = Number(num.toFixed(10));
            return (rounded === Math.floor(rounded)) ? Math.floor(rounded).toString() : num.toFixed(precision);
        };

        if (this.isZero()) {
            return "0";
        }

        if (this.isPureReal()) {
            return format(this.real);
        }

        if (this.isPureImaginary()) {
            if (Math.abs(this.imag) === 1) {
                return this.imag > 0 ? "i" : "-i";
            } else {
                return `${format(this.imag)}i`;
            }
        }

        const realPart = format(this.real);
        const imagPart = format(Math.abs(this.imag)) + "i";
        const sign = this.imag >= 0 ? "+" : "-";

        return realPart + sign + imagPart;
    }


    static get ZERO() { return Object.freeze(new Complex(0, 0)); }
    static get ONE() { return Object.freeze(new Complex(1, 0)); }
    static get NEG_ONE() { return Object.freeze(new Complex(-1, 0)); }
    static get IOTA() { return Object.freeze(new Complex(0, 1)); }
    static get NEG_IOTA() { return Object.freeze(new Complex(0, -1)); }

    static get OMEGA() { return Object.freeze(new Complex(-0.5, Math.sqrt(3) / 2.0)); }
    static get OMEGA_SQR() { return Object.freeze(new Complex(-0.5, -Math.sqrt(3) / 2.0)); }

    static get LOG_OF_NEG_UNITY() { return Object.freeze(new Complex(0, Math.PI)); }
    static get LOG_OF_IOTA() { return Object.freeze(new Complex(0, Math.PI / 2.0)); }
    static get LOG_OF_OMEGA() { return Object.freeze(new Complex(0, 2 * Math.PI / 3.0)); }
}

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

class ComplexLog {

    // Prevent instatiation
    constructor() {
        if (new.target === ComplexLog) {
            throw new Error("ComplexLog cannot be instantiated");
        }
    }

    static ln(num, isImaginary = false) {

        let logE = (complex) => {
            if (complex.isZero()) {
                throw new Error("Log of zero is undefined");
            }
            return new Complex(Math.log(complex.getMod()), complex.getAngle());
        };

        if (num instanceof Complex) {
            return logE(num);
        }

        if (typeof num === "number") {
            return logE(isImaginary ? new Complex(0, num) : new Complex(num, 0));
        }

        throw new Error("Invalid argument: ln expects a Complex number or a real/imaginary number.");
    }

    static log10(num, isImaginary = false) {
        let logBase10 = (complex) => Complex.divide(Complex.ln(complex), Math.log(10));

        if (num instanceof Complex) {
            return logBase10(num);
        }

        if (typeof num === "number") {
            return logBase10(isImaginary ? new Complex(0, num) : new Complex(num, 0));
        }

        throw new Error("Invalid argument: log10 expects a Complex number or a real/imaginary number.");
    }

    static log(base, value, isBaseImaginary = false, isValueImaginary = false, areBothImaginary = false) {
        let logE = (num) => {
            if (num.isZero()) {
                throw new Error("Log of zero is undefined");
            }
            return new Complex(Math.log(num.getMod()), num.getAngle());
        };

        let logDivide = (b, v) => ComplexMath.divide(logE(v), logE(b));

        // Handle Complex base and Complex value
        if (base instanceof Complex && value instanceof Complex) {
            if (base.isZero() || value.isZero()) {
                throw new Error("Log with zero base or value is undefined.");
            }
            if (base.equals(Complex.ONE)) {
                throw new Error("Logarithm base 1 is undefined.");
            }
            if (base.equals(Complex.NEG_ONE)) {
                return ComplexMath.divide(logE(value), new Complex(0.0, Math.PI));
            }
            return logDivide(base, value);
        }

        // Handle Complex base and real/imaginary value
        if (base instanceof Complex && typeof value === "number") {
            return logDivide(base, isValueImaginary ? new Complex(0, value) : new Complex(value, 0));
        }

        // Handle real/imaginary base and Complex value
        if (typeof base === "number" && value instanceof Complex) {
            return logDivide(isBaseImaginary ? new Complex(0, base) : new Complex(base, 0), value);
        }

        // Handle real/imaginary base and real/imaginary value
        if (typeof base === "number" && typeof value === "number") {
            if (areBothImaginary) {
                return logDivide(new Complex(0, base), new Complex(0, value));
            }
            return logDivide(isBaseImaginary ? new Complex(0, base) : new Complex(base, 0), isValueImaginary ? new Complex(0, value) : new Complex(value, 0));
        }

        throw new Error("Invalid arguments for logarithm.");
    }

    static logModulus(num) {
        return Math.log(num.getMod());
    }

}

class ComplexPower {

    // Prevent instatiation
    constructor() {
        if (new.target === ComplexPower) {
            throw new Error("ComplexPower cannot be instantiated");
        }
    }

    // e^(x + iy) = e^x * (cos(y) + i*sin(y))
    static expComplex(pow, isImaginary = false) {
        if (pow instanceof Complex) {
            let expReal = Math.exp(pow.real);
            return new Complex(expReal * Math.cos(pow.imag), expReal * Math.sin(pow.imag));
        }

        else if (typeof pow === "number" && isImaginary) {
            return new Complex(Math.cos(pow), Math.sin(pow));
        }

        else if (typeof pow === "number" && !isImaginary) {
            return new Complex(Math.exp(pow), 0);
        }

        throw new Error("Invalid arguments for exponent!");
    }

    static eulersFormula(pow, isImaginary = false) {
        if (pow instanceof Complex) {
            let temp = ComplexMath.multiply(Complex.IOTA, pow);
            return this.expComplex(temp);
        }

        else if (typeof pow === "number" && !isImaginary) {
            return new Complex(Math.cos(pow), Math.sin(pow));
        }

        else if (typeof pow === "number" && isImaginary) {
            return new Complex(Math.exp(-pow), 0);
        }

        throw new Error("Invalid arguments for euler's formula!");
    }

    static power(base, exponent, isBaseImaginary = false, isExponentImaginary = false) {
        if (!(base instanceof Complex) && typeof base !== "number") {
            throw new Error("Base must be a number or a Complex instance.");
        }
        if (!(exponent instanceof Complex) && typeof exponent !== "number") {
            throw new Error("Exponent must be a number or a Complex instance.");
        }

        let powComplex;

        if (base instanceof Complex && exponent instanceof Complex) {
            // (a+ib)^(c+id)
            powComplex = exponent;
        }
        else if (typeof base === "number" && exponent instanceof Complex) {
            // a^(c+id) or (ia)^(c+id)
            base = isBaseImaginary ? new Complex(0, base) : new Complex(base, 0);
            powComplex = exponent;
        }
        else if (base instanceof Complex && typeof exponent === "number") {
            // (a+ib)^c or (a+ib)^(ic)
            powComplex = isExponentImaginary ? new Complex(0, exponent) : new Complex(exponent, 0);
        }
        else if (typeof base === "number" && typeof exponent === "number") {
            // a^c, a^(ic), (ia)^c, or (ia)^(ic)
            base = isBaseImaginary ? new Complex(0, base) : new Complex(base, 0);
            powComplex = isExponentImaginary ? new Complex(0, exponent) : new Complex(exponent, 0);
        }
        else {
            throw new Error("Invalid arguments for power function.");
        }

        if (base.isZero() && powComplex.isZero()) {
            throw new Error("0 raised to the power 0 is undefined.");
        }
        else if (base.isZero()) {
            return new Complex();
        }

        return ComplexPower.expComplex(ComplexMath.multiply(powComplex, ComplexLog.ln(base)));
    }

    static sqrt(num) {
        if (num instanceof Complex) {
            return ComplexPower.power(num, 0.5);
        } else if (typeof num === "number") {
            return ComplexPower.power(new Complex(0, num), 0.5);
        }
        throw new Error("Invalid argument: sqrt expects a Complex number or a real number.");
    }

    static cbrt(num) {
        if (num instanceof Complex) {
            return ComplexPower.power(num, 1 / 3);
        } else if (typeof num === "number") {
            return ComplexPower.power(new Complex(0, num), 1 / 3);
        }
        throw new Error("Invalid argument: cbrt expects a Complex number or a real number.");
    }

    static nthRt(base, root, isBaseImaginary = false, isRootImaginary = false) {

        let getRoot = function (a, b) {
            if (b.isZero()) {
                throw new Error("Undefined root (division by zero)");
            }
            return ComplexPower.power(a, b.getReciprocal());
        }

        if (base instanceof Complex && root instanceof Complex) {
            return getRoot(base, root);
        }

        else if (base instanceof Complex && typeof root === "number") {
            return getRoot(base, new Complex(root, 0));
        }

        else if (base instanceof Complex && typeof root === "number", !isBaseImaginary, isRootImaginary) {
            return getRoot(base, new Complex(0, root));
        }

        else if (typeof base === "number" && root instanceof Complex, isBaseImaginary, !isRootImaginary) {
            return getRoot(new Complex(0, base), root);
        }

        else if (typeof base === "number" && typeof root === "number", isBaseImaginary, !isRootImaginary) {
            return getRoot(new Complex(0, base), new Complex(root, 0));
        }

        else if (typeof base === "number" && typeof root === "number", isBaseImaginary, isRootImaginary) {
            return getRoot(new Complex(0, base), new Complex(0, root));
        }

        else if (typeof base === "number" && root instanceof Complex) {
            return getRoot(new Complex(base, 0), root);
        }

        else if (typeof base === "number" && typeof root === "number", !isBaseImaginary, isRootImaginary) {
            return getRoot(new Complex(base, 0), new Complex(0, root));
        }

        else if (typeof base === "number" && typeof root === "number") {
            return getRoot(new Complex(base, 0), new Complex(root, 0));
        }

        throw new Error("Invalid arguments: nthRt expects combinations of Complex, Real, and Imaginary values.");
    }

    static sqrtAll(num, isImaginary = false) {
        let base;

        if (num instanceof Complex) {
            base = num;
        }
        else if (typeof num === "number") {
            base = isImaginary ? new Complex(0, num) : new Complex(num, 0);
        }
        else {
            throw new Error("Input must be an instance of Complex.");
        }

        let r = Math.sqrt(base.getMod()); // Square root of modulus
        let theta = base.getAngle(); // Argument (angle)

        let roots = [];
        for (let k = 0; k < 2; k++) {
            let angle = (theta + k * Math.PI) / 2.0; // Roots are π apart
            roots.push(new Complex(r * Math.cos(angle), r * Math.sin(angle)));
        }

        return roots;
    }

    static cbrtAll(num, isImaginary = false) {
        let base;

        if (num instanceof Complex) {
            base = num;
        } else if (typeof num === "number") {
            base = isImaginary ? new Complex(0, num) : new Complex(num, 0);
        } else {
            throw new Error("Input must be a Complex instance or a number.");
        }

        let r = Math.cbrt(base.getMod()); // Cube root of modulus
        let theta = base.getAngle(); // Argument (angle)

        let roots = [];
        for (let k = 0; k < 3; k++) {
            let angle = (theta + (2 * Math.PI * k)) / 3.0; // Roots are 120° apart
            roots.push(new Complex(r * Math.cos(angle), r * Math.sin(angle)));
        }

        return roots;
    }

    static nthRtAll(num, root, isImaginary = false) {
        if (!Number.isInteger(root) || root <= 0) {
            throw new Error("Root must be a positive integer.");
        }

        let base;

        if (num instanceof Complex) {
            base = num;
        } else if (typeof num === "number") {
            base = isImaginary ? new Complex(0, num) : new Complex(num, 0);
        } else {
            throw new Error("Input must be a Complex instance or a number.");
        }

        let r = Math.pow(base.getMod(), 1.0 / root); // Compute nth root of modulus
        let theta = base.getAngle(); // Compute argument (angle)

        let roots = [];
        for (let k = 0; k < root; k++) {
            let angle = (theta + (2 * Math.PI * k)) / root; // Correct nth root formula
            roots.push(new Complex(r * Math.cos(angle), r * Math.sin(angle)));
        }

        return roots;
    }

}

class ComplexTrigono {

    // Prevent instatiation
    constructor() {
        if (new.target === ComplexTrigono) {
            throw new Error("ComplexTrigono cannot be instantiated");
        }
    }

    static toDegrees(radians) {
        if (radians instanceof Complex) {
            return ComplexMath.divide(
                ComplexMath.multiply(radians, new Complex(180, 0)),
                new Complex(Math.PI, 0)
            );
        }
        else if (typeof radians === "number") {
            return (radians * 180.0) / Math.PI;
        }

        throw new Error("Input must be a number or an instance of Complex.");
    }

    static toRadian(degrees) {
        if (degrees instanceof Complex) {
            return ComplexMath.divide(
                ComplexMath.multiply(degrees, new Complex(Math.PI, 0)),
                new Complex(180, 0)
            );
        }
        else if (typeof degrees === "number") {
            return (degrees * Math.PI) / 180.0;
        }

        throw new Error("Input must be a number or an instance of Complex.");
    }

    static sin(num, isImaginary = false) {
        if (num instanceof Complex) {
            let expIZ = ComplexPower.expComplex(ComplexMath.multiply(Complex.IOTA, num));
            let expNegIZ = ComplexPower.expComplex(ComplexMath.multiply(Complex.NEG_IOTA, num));
            return ComplexMath.divide(ComplexMath.subtract(expIZ, expNegIZ), new Complex(0, 2));
        }
        else if (typeof num === "number") {
            return isImaginary ? this.sin(new Complex(0, num)) : new Complex(Math.sin(num), 0);
        }

        throw new Error("Input must be a number or an instance of Complex.");

    }

    static sinDegrees(num, isImaginary = false) {
        return this.sin(this.toRadian(num), isImaginary);
    }

    static cos(num, isImaginary = false) {
        if (num instanceof Complex) {
            let expIZ = ComplexPower.expComplex(ComplexMath.multiply(Complex.IOTA, num));
            let expNegIZ = ComplexPower.expComplex(ComplexMath.multiply(Complex.NEG_IOTA, num));
            return ComplexMath.divide(ComplexMath.add(expIZ, expNegIZ), 2.0);
        }
        else if (typeof num === "number") {
            return isImaginary ? this.cos(new Complex(0, num)) : new Complex(Math.cos(num), 0.0);
        }

        throw new Error("Invalid input: must be a Complex instance or a number.");
    }

    static cosDegrees(num, isImaginary = false) {
        return this.cos(this.toRadian(num), isImaginary);
    }

    static tan(num, isImaginary = false) {
        return ComplexMath.divide(this.sin(num, isImaginary), this.cos(num, isImaginary));
    }

    static tanDegrees(num, isImaginary = false) {
        return this.tan(this.toRadian(num), isImaginary);
    }

    static cot(num, isImaginary = false) {
        let tanValue = this.tan(num, isImaginary);
        if (tanValue.isZero()) {
            throw new Error("Cotangent is undefined for tan(z) = 0");
        }
        return ComplexMath.divide(Complex.ONE, tanValue);
    }

    static cotDegrees(num, isImaginary = false) {
        return this.cot(this.toRadian(num), isImaginary);
    }

    static sec(num, isImaginary = false) {
        let cosValue = this.cos(num, isImaginary);
        if (cosValue.isZero()) {
            throw new Error("Sec is undefined for cos(z) = 0");
        }
        return ComplexMath.divide(Complex.ONE, cosValue);
    }

    static secDegrees(num, isImaginary = false) {
        return this.sec(this.toRadian(num), isImaginary);
    }

    static cosec(num, isImaginary = false) {
        let sinValue = this.sin(num, isImaginary);
        if (sinValue.isZero()) {
            throw new Error("Cosecant is undefined for sin(z) = 0");
        }
        return ComplexMath.divide(Complex.ONE, sinValue);
    }

    static cosecDegrees(num, isImaginary = false) {
        return this.cosec(this.toRadian(num), isImaginary);
    }

    static arcSin(value, isValueImaginary = false) {
        let complexValue = isValueImaginary ? new Complex(0, value) : new Complex(value, 0);
        let sqrtTerm = ComplexPower.sqrt(ComplexMath.subtract(Complex.ONE, ComplexMath.multiply(complexValue, complexValue)));
        let val = ComplexMath.add(ComplexMath.multiply(Complex.IOTA, complexValue), sqrtTerm);
        return ComplexMath.multiply(Complex.NEG_IOTA, ComplexLog.ln(val));
    }

    static arcSinDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcSin(value, isValueImaginary));
    }

    static arcCos(value, isValueImaginary = false) {
        let complexValue = isValueImaginary ? new Complex(0.0, value) : new Complex(value, 0.0);
        let sqrtTerm = ComplexPower.sqrt(ComplexMath.subtract(Complex.ONE, ComplexMath.multiply(complexValue, complexValue)));
        let val = ComplexMath.add(complexValue, ComplexMath.multiply(Complex.IOTA, sqrtTerm));
        return ComplexMath.multiply(Complex.NEG_IOTA, ComplexLog.ln(val));
    }

    static arcCosDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcCos(value, isValueImaginary));
    }

    static arcTan(value, isValueImaginary = false) {
        if (value.equals(new Complex(0, 1))) {
            throw new Error("arcTan is undefined for sqrt(-1)");
        }
        let val = ComplexMath.divide(
            ComplexMath.subtract(Complex.ONE, ComplexMath.multiply(Complex.IOTA, value)),
            ComplexMath.add(Complex.ONE, ComplexMath.multiply(Complex.IOTA, value))
        );
        return ComplexMath.multiply(ComplexMath.divide(Complex.IOTA, 2.0), ComplexLog.ln(val));
    }

    static arcTanDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcTan(value, isValueImaginary));
    }

    static arcSec(value, isValueImaginary = false) {
        let z = isValueImaginary ? new Complex(0, value) : value;
        if (z.getMod() < 1) {
            throw new Error("arcSec is undefined for |z| < 1");
        }
        let invZ = ComplexMath.divide(Complex.ONE, z);
        let sqrtTerm = ComplexPower.sqrt(ComplexMath.subtract(Complex.ONE, ComplexMath.multiply(invZ, invZ)));
        let val = ComplexMath.add(invZ, ComplexMath.multiply(Complex.IOTA, sqrtTerm));
        return ComplexMath.multiply(Complex.NEG_IOTA, ComplexLog.ln(val));
    }

    static arcSecDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcSec(value, isValueImaginary));
    }

    static arcCosec(value, isValueImaginary = false) {
        let complexValue = isValueImaginary ? new Complex(0.0, value) : new Complex(value, 0.0);
        if (complexValue.getMod() < 1) {
            throw new Error("arcCsc is undefined for |z| < 1");
        }
        let invZ = ComplexMath.divide(Complex.ONE, complexValue);
        let sqrtTerm = ComplexPower.sqrt(ComplexMath.subtract(Complex.ONE, ComplexMath.multiply(invZ, invZ)));
        let val = ComplexMath.add(Complex.IOTA, ComplexMath.multiply(invZ, sqrtTerm));
        return ComplexMath.multiply(Complex.NEG_IOTA, ComplexLog.ln(val));
    }

    static arcCosecDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcCosec(value, isValueImaginary));
    }

    static arcCot(value, isValueImaginary = false) {
        if (value instanceof Complex && value.isZero()) {
            throw new Error("arcCot is undefined for z = 0");
        }

        let complexValue = isValueImaginary ? new Complex(0, value) : value;
        let iZ = ComplexMath.multiply(Complex.IOTA, complexValue);
        let lnTerm = ComplexLog.ln(ComplexMath.divide(ComplexMath.add(Complex.ONE, iZ), ComplexMath.subtract(Complex.ONE, iZ)));

        return ComplexMath.multiply(new Complex(0, -0.5), lnTerm);
    }

    static arcCotDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcCot(value, isValueImaginary));
    }
}

// Prevent inheritance
Object.seal(ComplexMath);
Object.seal(ComplexLog);
Object.seal(ComplexPower);
Object.seal(ComplexTrigono);