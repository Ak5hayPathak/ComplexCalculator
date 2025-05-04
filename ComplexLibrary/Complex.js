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
        //const imagPart = format(Math.abs(this.imag)) + "i";
        const imagPart = (Math.abs(this.imag) === 1)? "i" :format(Math.abs(this.imag)) + "i";
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