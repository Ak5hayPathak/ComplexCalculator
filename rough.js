function tgamma(z) {
    const p = [
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    ];

    const PI = Math.PI;
    const SQRT2PI = Math.sqrt(2 * PI);

    if (z < 0.5) {
        // Reflection formula
        return PI / (Math.sin(PI * z) * tgamma(1 - z));
    }

    z -= 1;
    let x = 0.99999999999980993;

    for (let i = 0; i < p.length; i++) {
        x += p[i] / (z + i + 1);
    }

    const t = z + p.length - 0.5;
    return SQRT2PI * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

// // Test
// for (let i = 1; i <= 5; i++) {
//     console.log(`Gamma(${i}) = ${tgamma(i).toFixed(6)}`);
// }

console.log(tgamma(6+1));