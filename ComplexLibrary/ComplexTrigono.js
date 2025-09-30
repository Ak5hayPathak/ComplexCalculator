import { Complex } from "./Complex.js";
import { ComplexMath } from "./ComplexMath.js";
import { ComplexPower } from "./ComplexPower.js";
import { ComplexLog } from "./ComplexLog.js";

export class ComplexTrigono {
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
    } else if (typeof radians === "number") {
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
    } else if (typeof degrees === "number") {
      return (degrees * Math.PI) / 180.0;
    }

    throw new Error("Input must be a number or an instance of Complex.");
  }

  static sin(num, isImaginary = false) {
    if (num instanceof Complex) {
      let expIZ = ComplexPower.expComplex(
        ComplexMath.multiply(Complex.IOTA, num)
      );
      let expNegIZ = ComplexPower.expComplex(
        ComplexMath.multiply(Complex.NEG_IOTA, num)
      );
      return ComplexMath.divide(
        ComplexMath.subtract(expIZ, expNegIZ),
        new Complex(0, 2)
      );
    } else if (typeof num === "number") {
      return isImaginary
        ? this.sin(new Complex(0, num))
        : new Complex(Math.sin(num), 0);
    }

    throw new Error("Input must be a number or an instance of Complex.");
  }

  static sinDegrees(num, isImaginary = false) {
    return this.sin(this.toRadian(num), isImaginary);
  }

  static cos(num, isImaginary = false) {
    if (num instanceof Complex) {
      let expIZ = ComplexPower.expComplex(
        ComplexMath.multiply(Complex.IOTA, num)
      );
      let expNegIZ = ComplexPower.expComplex(
        ComplexMath.multiply(Complex.NEG_IOTA, num)
      );
      return ComplexMath.divide(ComplexMath.add(expIZ, expNegIZ), 2.0);
    } else if (typeof num === "number") {
      return isImaginary
        ? this.cos(new Complex(0, num))
        : new Complex(Math.cos(num), 0.0);
    }

    throw new Error("Invalid input: must be a Complex instance or a number.");
  }

  static cosDegrees(num, isImaginary = false) {
    return this.cos(this.toRadian(num), isImaginary);
  }

  static tan(num, isImaginary = false) {
    return ComplexMath.divide(
      this.sin(num, isImaginary),
      this.cos(num, isImaginary)
    );
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

   // ------------------ arcSin ------------------
    static arcSin(value, isValueImaginary = false) {
        let z = isValueImaginary ? new Complex(0, value) : new Complex(value, 0);

        // arcsin(z) = -i * ln(i z + sqrt(1 - z^2))
        let zz = ComplexMath.multiply(z, z);
        let oneMinusZZ = ComplexMath.subtract(Complex.ONE, zz);
        let sqrtTerm = ComplexPower.sqrt(oneMinusZZ);
        let inside = ComplexMath.add(ComplexMath.multiply(Complex.IOTA, z), sqrtTerm);
        let lnVal = ComplexLog.ln(inside);
        let result = ComplexMath.multiply(Complex.NEG_IOTA, lnVal);

        // Branch correction: real part ∈ [-π/2, π/2]
        while (result.real < -Math.PI / 2) result = ComplexMath.add(result, new Complex(Math.PI, 0));
        while (result.real > Math.PI / 2) result = ComplexMath.subtract(result, new Complex(Math.PI, 0));

        // If input was real in [-1,1], imaginary noise → 0
        if (z.imag === 0 && z.real >= -1 && z.real <= 1) result.imag = 0;

        return result;
    }

    static arcSinDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcSin(value, isValueImaginary));
    }

    // ------------------ arcCos ------------------
    static arcCos(value, isValueImaginary = false) {
        let z = isValueImaginary ? new Complex(0, value) : new Complex(value, 0);

        // arccos(z) = π/2 - arcsin(z)
        let asin = this.arcSin(z);
        let result = ComplexMath.subtract(new Complex(Math.PI / 2, 0), asin);

        // Branch correction: real part ∈ [0, π]
        while (result.real < 0) result = ComplexMath.add(result, new Complex(Math.PI, 0));
        while (result.real > Math.PI) result = ComplexMath.subtract(result, new Complex(Math.PI, 0));

        // If input was real in [-1,1], imaginary noise → 0
        if (z.imag === 0 && z.real >= -1 && z.real <= 1) result.imag = 0;

        return result;
    }

    static arcCosDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcCos(value, isValueImaginary));
    }

    // ------------------ arcTan ------------------
    static arcTan(value, isValueImaginary = false) {
        let z = isValueImaginary ? new Complex(0, value) : new Complex(value, 0);

        // arctan(z) = (i/2) * ln( (1 - i z) / (1 + i z) )
        let numerator = ComplexMath.subtract(Complex.ONE, ComplexMath.multiply(Complex.IOTA, z));
        let denominator = ComplexMath.add(Complex.ONE, ComplexMath.multiply(Complex.IOTA, z));
        let frac = ComplexMath.divide(numerator, denominator);
        let lnVal = ComplexLog.ln(frac);
        let result = ComplexMath.multiply(ComplexMath.divide(Complex.IOTA, 2), lnVal);

        // Branch correction: real part ∈ (-π/2, π/2)
        while (result.real <= -Math.PI / 2) result = ComplexMath.add(result, new Complex(Math.PI, 0));
        while (result.real > Math.PI / 2) result = ComplexMath.subtract(result, new Complex(Math.PI, 0));

        return result;
    }

    static arcTanDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcTan(value, isValueImaginary));
    }

    // ------------------ arcCot ------------------
    static arcCot(value, isValueImaginary = false) {
        let z = isValueImaginary ? new Complex(0, value) : new Complex(value, 0);

        // arccot(z) = π/2 - arctan(z)
        let atan = this.arcTan(z);
        let result = ComplexMath.subtract(new Complex(Math.PI / 2, 0), atan);

        // Branch correction: real part ∈ (0, π)
        while (result.real <= 0) result = ComplexMath.add(result, new Complex(Math.PI, 0));
        while (result.real > Math.PI) result = ComplexMath.subtract(result, new Complex(Math.PI, 0));

        return result;
    }

    static arcCotDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcCot(value, isValueImaginary));
    }

    // ------------------ arcSec ------------------
    static arcSec(value, isValueImaginary = false) {
        let z = isValueImaginary ? new Complex(0, value) : new Complex(value, 0);

        // arcsec(z) = arccos(1 / z)
        let invZ = ComplexMath.divide(Complex.ONE, z);
        return this.arcCos(invZ);
    }

    static arcSecDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcSec(value, isValueImaginary));
    }

    // ------------------ arcCosec ------------------
    static arcCosec(value, isValueImaginary = false) {
        let z = isValueImaginary ? new Complex(0, value) : new Complex(value, 0);

        // arccsc(z) = arcsin(1 / z)
        let invZ = ComplexMath.divide(Complex.ONE, z);
        return this.arcSin(invZ);
    }

    static arcCosecDegrees(value, isValueImaginary = false) {
        return this.toDegrees(this.arcCosec(value, isValueImaginary));
    }

    // ------------------ helper: degrees ------------------
    static toDegrees(complexVal) {
        return new Complex(
            complexVal.real * 180 / Math.PI,
            complexVal.imag * 180 / Math.PI
        );
    }
}

// console.log(ComplexTrigono.arcCos(0.5).toString());

Object.seal(ComplexTrigono);
