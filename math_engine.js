/**
 * Casio fx-570 Scientific Calculator Engine
 * Handles core mathematical parsing, evaluation, modes, constants, and unit conversions.
 */

class MathEngine {
  constructor() {
    this.angleMode = 'DEG'; // DEG, RAD, GRAD
    this.calcMode = 'COMP'; // COMP, CMPLX, STAT, BASE_N, EQN, MATRIX, VECTOR, TABLE
    this.memoryVars = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, X: 0, Y: 0, M: 0, Ans: 0 };
    this.history = [];
    this.statData = []; // [{x, y, freq}]

    // 40 Scientific Constants (CODATA values)
    this.constants = [
      { id: 1, name: "mp (Masa Proton)", symbol: "m_p", value: 1.67262192e-27, unit: "kg" },
      { id: 2, name: "mn (Masa Neutron)", symbol: "m_n", value: 1.67492749e-27, unit: "kg" },
      { id: 3, name: "me (Masa Elektron)", symbol: "m_e", value: 9.10938370e-31, unit: "kg" },
      { id: 4, name: "mμ (Masa Muon)", symbol: "m_μ", value: 1.88353162e-28, unit: "kg" },
      { id: 5, name: "a0 (Jejari Bohr)", symbol: "a_0", value: 5.29177210e-11, unit: "m" },
      { id: 6, name: "h (Pemalar Planck)", symbol: "h", value: 6.62607015e-34, unit: "J·s" },
      { id: 7, name: "μN (Magneton Nuklear)", symbol: "μ_N", value: 5.05078374e-27, unit: "J/T" },
      { id: 8, name: "μB (Magneton Bohr)", symbol: "μ_B", value: 9.27401007e-24, unit: "J/T" },
      { id: 9, name: "ħ (Pemalar Dirac / Reduced Planck)", symbol: "ħ", value: 1.05457181e-34, unit: "J·s" },
      { id: 10, name: "α (Pemalar Struktur Halus)", symbol: "α", value: 7.29735256e-3, unit: "" },
      { id: 11, name: "re (Jejari Elektron Klasik)", symbol: "r_e", value: 2.81794032e-15, unit: "m" },
      { id: 12, name: "λc (Panjang Gelombang Compton)", symbol: "λ_c", value: 2.42631023e-12, unit: "m" },
      { id: 13, name: "γp (Nisbah Giromagnetik Proton)", symbol: "γ_p", value: 2.67522187e8, unit: "s⁻¹T⁻¹" },
      { id: 14, name: "λcp (Panjang Gelombang Compton Proton)", symbol: "λ_cp", value: 1.32140985e-15, unit: "m" },
      { id: 15, name: "λcn (Panjang Gelombang Compton Neutron)", symbol: "λ_cn", value: 1.31959090e-15, unit: "m" },
      { id: 16, name: "R∞ (Pemalar Rydberg)", symbol: "R_∞", value: 10973731.56, unit: "m⁻¹" },
      { id: 17, name: "u (Unit Jisim Atom)", symbol: "u", value: 1.660539066e-27, unit: "kg" },
      { id: 18, name: "μp (Momen Magnetik Proton)", symbol: "μ_p", value: 1.410606797e-26, unit: "J/T" },
      { id: 19, name: "μe (Momen Magnetik Elektron)", symbol: "μ_e", value: -9.28476470e-24, unit: "J/T" },
      { id: 20, name: "μn (Momen Magnetik Neutron)", symbol: "μ_n", value: -9.6623651e-27, unit: "J/T" },
      { id: 21, name: "μ_μ (Momen Magnetik Muon)", symbol: "μ_μ", value: -4.49044830e-26, unit: "J/T" },
      { id: 22, name: "F (Pemalar Faraday)", symbol: "F", value: 96485.3321, unit: "C/mol" },
      { id: 23, name: "e (Caj Elemen)", symbol: "e", value: 1.602176634e-19, unit: "C" },
      { id: 24, name: "NA (Pemalar Avogadro)", symbol: "N_A", value: 6.02214076e23, unit: "mol⁻¹" },
      { id: 25, name: "k (Pemalar Boltzmann)", symbol: "k", value: 1.380649e-23, unit: "J/K" },
      { id: 26, name: "Vm (Isipadu Molar Gas Ideal)", symbol: "V_m", value: 0.0224139695, unit: "m³/mol" },
      { id: 27, name: "R (Pemalar Gas Molar)", symbol: "R", value: 8.314462618, unit: "J/(mol·K)" },
      { id: 28, name: "c0 (Laju Cahaya dalam Vakum)", symbol: "c_0", value: 299792458, unit: "m/s" },
      { id: 29, name: "C1 (Pemalar Radiasi Pertama)", symbol: "c_1", value: 3.74177185e-16, unit: "W·m²" },
      { id: 30, name: "C2 (Pemalar Radiasi Kedua)", symbol: "c_2", value: 0.0143877687, unit: "m·K" },
      { id: 31, name: "σ (Pemalar Stefan-Boltzmann)", symbol: "σ", value: 5.670374419e-8, unit: "W/(m²·K⁴)" },
      { id: 32, name: "ε0 (Kebenaran Vakum)", symbol: "ε_0", value: 8.8541878128e-12, unit: "F/m" },
      { id: 33, name: "μ0 (Kebolehtelapan Vakum)", symbol: "μ_0", value: 1.25663706212e-6, unit: "N/A²" },
      { id: 34, name: "Φ0 (Kuantum Fluks Magnetik)", symbol: "Φ_0", value: 2.067833848e-15, unit: "Wb" },
      { id: 35, name: "g (Pecutan Graviti Standard)", symbol: "g", value: 9.80665, unit: "m/s²" },
      { id: 36, name: "G0 (Kuantum Konduktans)", symbol: "G_0", value: 7.748091729e-5, unit: "S" },
      { id: 37, name: "Z0 (Impedans Vakum)", symbol: "Z_0", value: 376.730313668, unit: "Ω" },
      { id: 38, name: "t (Suhu Celsius)", symbol: "t", value: 273.15, unit: "K" },
      { id: 39, name: "G (Pemalar Graviti)", symbol: "G", value: 6.67430e-11, unit: "m³/(kg·s²)" },
      { id: 40, name: "atm (Tekanan Atmosfera Standard)", symbol: "atm", value: 101325, unit: "Pa" }
    ];

    // 40 Unit Conversions
    this.conversions = [
      { id: 1, name: "in ➔ cm", convert: v => v * 2.54 },
      { id: 2, name: "cm ➔ in", convert: v => v / 2.54 },
      { id: 3, name: "ft ➔ m", convert: v => v * 0.3048 },
      { id: 4, name: "m ➔ ft", convert: v => v / 0.3048 },
      { id: 5, name: "yd ➔ m", convert: v => v * 0.9144 },
      { id: 6, name: "m ➔ yd", convert: v => v / 0.9144 },
      { id: 7, name: "mile ➔ km", convert: v => v * 1.609344 },
      { id: 8, name: "km ➔ mile", convert: v => v / 1.609344 },
      { id: 9, name: "nmi ➔ m", convert: v => v * 1852 },
      { id: 10, name: "m ➔ nmi", convert: v => v / 1852 },
      { id: 11, name: "acre ➔ m²", convert: v => v * 4046.8564224 },
      { id: 12, name: "m² ➔ acre", convert: v => v / 4046.8564224 },
      { id: 13, name: "gal (US) ➔ L", convert: v => v * 3.785411784 },
      { id: 14, name: "L ➔ gal (US)", convert: v => v / 3.785411784 },
      { id: 15, name: "gal (UK) ➔ L", convert: v => v * 4.54609 },
      { id: 16, name: "L ➔ gal (UK)", convert: v => v / 4.54609 },
      { id: 17, name: "pc ➔ km", convert: v => v * 3.085677581e13 },
      { id: 18, name: "km ➔ pc", convert: v => v / 3.085677581e13 },
      { id: 19, name: "km/h ➔ m/s", convert: v => v / 3.6 },
      { id: 20, name: "m/s ➔ km/h", convert: v => v * 3.6 },
      { id: 21, name: "oz ➔ g", convert: v => v * 28.349523125 },
      { id: 22, name: "g ➔ oz", convert: v => v / 28.349523125 },
      { id: 23, name: "lb ➔ kg", convert: v => v * 0.45359237 },
      { id: 24, name: "kg ➔ lb", convert: v => v / 0.45359237 },
      { id: 25, name: "atm ➔ Pa", convert: v => v * 101325 },
      { id: 26, name: "Pa ➔ atm", convert: v => v / 101325 },
      { id: 27, name: "mmHg ➔ Pa", convert: v => v * 133.322387415 },
      { id: 28, name: "Pa ➔ mmHg", convert: v => v / 133.322387415 },
      { id: 29, name: "hp ➔ kW", convert: v => v * 0.745699872 },
      { id: 30, name: "kW ➔ hp", convert: v => v / 0.745699872 },
      { id: 31, name: "kgf/cm² ➔ Pa", convert: v => v * 98066.5 },
      { id: 32, name: "Pa ➔ kgf/cm²", convert: v => v / 98066.5 },
      { id: 33, name: "bar ➔ kPa", convert: v => v * 100 },
      { id: 34, name: "kPa ➔ bar", convert: v => v / 100 },
      { id: 35, name: "lbf/in² (psi) ➔ kPa", convert: v => v * 6.89475729 },
      { id: 36, name: "kPa ➔ lbf/in² (psi)", convert: v => v / 6.89475729 },
      { id: 37, name: "°F ➔ °C", convert: v => (v - 32) * (5 / 9) },
      { id: 38, name: "°C ➔ °F", convert: v => v * (9 / 5) + 32 },
      { id: 39, name: "J ➔ cal", convert: v => v / 4.184 },
      { id: 40, name: "cal ➔ J", convert: v => v * 4.184 }
    ];
  }

  // Factorial function
  factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  // Permutation nPr
  nPr(n, r) {
    if (n < r || n < 0 || r < 0) return NaN;
    return this.factorial(n) / this.factorial(n - r);
  }

  // Combination nCr
  nCr(n, r) {
    if (n < r || n < 0 || r < 0) return NaN;
    return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
  }

  // Angle conversion helper
  toRadians(val) {
    if (this.angleMode === 'DEG') return (val * Math.PI) / 180;
    if (this.angleMode === 'GRAD') return (val * Math.PI) / 200;
    return val; // RAD
  }

  fromRadians(val) {
    if (this.angleMode === 'DEG') return (val * 180) / Math.PI;
    if (this.angleMode === 'GRAD') return (val * 200) / Math.PI;
    return val; // RAD
  }

  // Main Expression Evaluator
  evaluateExpression(expr) {
    try {
      let sanitized = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        .replace(/Ans/g, this.memoryVars.Ans)
        .replace(/A/g, this.memoryVars.A)
        .replace(/B/g, this.memoryVars.B)
        .replace(/C/g, this.memoryVars.C)
        .replace(/D/g, this.memoryVars.D)
        .replace(/E/g, this.memoryVars.E)
        .replace(/F/g, this.memoryVars.F)
        .replace(/X/g, this.memoryVars.X)
        .replace(/Y/g, this.memoryVars.Y)
        .replace(/M/g, this.memoryVars.M);

      // Handle trigonometric functions
      sanitized = sanitized.replace(/sin\(([^)]+)\)/g, (match, arg) => `Math.sin(this.toRadians(${arg}))`);
      sanitized = sanitized.replace(/cos\(([^)]+)\)/g, (match, arg) => `Math.cos(this.toRadians(${arg}))`);
      sanitized = sanitized.replace(/tan\(([^)]+)\)/g, (match, arg) => `Math.tan(this.toRadians(${arg}))`);
      sanitized = sanitized.replace(/asin\(([^)]+)\)/g, (match, arg) => `this.fromRadians(Math.asin(${arg}))`);
      sanitized = sanitized.replace(/acos\(([^)]+)\)/g, (match, arg) => `this.fromRadians(Math.acos(${arg}))`);
      sanitized = sanitized.replace(/atan\(([^)]+)\)/g, (match, arg) => `this.fromRadians(Math.atan(${arg}))`);

      // Hyperbolic
      sanitized = sanitized.replace(/sinh\(([^)]+)\)/g, 'Math.sinh($1)');
      sanitized = sanitized.replace(/cosh\(([^)]+)\)/g, 'Math.cosh($1)');
      sanitized = sanitized.replace(/tanh\(([^)]+)\)/g, 'Math.tanh($1)');

      // Logarithms
      sanitized = sanitized.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
      sanitized = sanitized.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
      sanitized = sanitized.replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)');
      sanitized = sanitized.replace(/³√\(([^)]+)\)/g, 'Math.cbrt($1)');

      // Factorial & Powers
      sanitized = sanitized.replace(/(\d+)!/g, (match, n) => this.factorial(parseInt(n)));

      // Evaluate using Function constructor
      const func = new Function('Math', 'this', `return ${sanitized};`);
      let result = func(Math, this);

      if (typeof result === 'number' && !isNaN(result)) {
        this.memoryVars.Ans = result;
        this.history.push({ expr, result });
        return result;
      } else {
        return "Math ERROR";
      }
    } catch (e) {
      return "Syntax ERROR";
    }
  }

  // Simultaneous Equations Solver (2 unknowns: a1*x + b1*y = c1; a2*x + b2*y = c2)
  solveLinear2(a1, b1, c1, a2, b2, c2) {
    const det = a1 * b2 - a2 * b1;
    if (det === 0) return { status: "No unique solution" };
    const x = (c1 * b2 - c2 * b1) / det;
    const y = (a1 * c2 - a2 * c1) / det;
    return { x, y };
  }

  // Quadratic Equation Solver: ax^2 + bx + c = 0
  solveQuadratic(a, b, c) {
    if (a === 0) return { status: "Invalid quadratic parameter (a=0)" };
    const discriminant = b * b - 4 * a * c;
    if (discriminant > 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return { x1, x2, type: "Real & Distinct" };
    } else if (discriminant === 0) {
      const x = -b / (2 * a);
      return { x1: x, x2: x, type: "Real & Equal" };
    } else {
      const real = (-b / (2 * a)).toFixed(4);
      const imag = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
      return { x1: `${real} + ${imag}i`, x2: `${real} - ${imag}i`, type: "Complex Roots" };
    }
  }

  // Statistics 1-Var
  addStatData(val, freq = 1) {
    this.statData.push({ x: parseFloat(val), freq: parseInt(freq) });
  }

  clearStatData() {
    this.statData = [];
  }

  getStatSummary() {
    if (this.statData.length === 0) return null;
    let n = 0, sumX = 0, sumX2 = 0;
    this.statData.forEach(d => {
      n += d.freq;
      sumX += d.x * d.freq;
      sumX2 += (d.x * d.x) * d.freq;
    });
    const mean = sumX / n;
    const popVar = (sumX2 / n) - (mean * mean);
    const popStdDev = Math.sqrt(Math.max(0, popVar));
    const sampleStdDev = n > 1 ? Math.sqrt(sumX2 - (sumX * sumX) / n) / Math.sqrt(n - 1) : 0;

    return { n, mean, sumX, sumX2, popStdDev, sampleStdDev };
  }

  // Base-N Conversions
  convertBase(valStr, fromBase, toBase) {
    try {
      const num = parseInt(valStr, fromBase);
      if (isNaN(num)) return "Syntax ERROR";
      return num.toString(toBase).toUpperCase();
    } catch (e) {
      return "ERROR";
    }
  }
}

window.mathEngine = new MathEngine();
