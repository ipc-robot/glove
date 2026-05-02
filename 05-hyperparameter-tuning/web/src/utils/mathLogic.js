export function pressure_fn(v) {
    return (7.78 * v) / (0.98 - v);
}

export function calc_v_true(v_val, r_ref, vcc_mv = 5000.0) {
    return (vcc_mv * (r_ref - v_val)) / (r_ref * (vcc_mv - v_val));
}

export function angle_fn(v_true, gain = 1.0) {
    let v_corr = v_true * gain;
    let e = 0.53 * Math.pow(v_corr, 3) - 3.43 * Math.pow(v_corr, 2) + 27.74 * v_corr;
    return e * (90.0 / 85.0) * 100;
}

export function medianArr(arr) {
    if (arr.length === 0) return 0;
    let sorted = [...arr].sort((a, b) => a - b);
    let half = Math.floor(sorted.length / 2);
    if (sorted.length % 2) return sorted[half];
    return (sorted[half - 1] + sorted[half]) / 2.0;
}

export function voltage_baseline_correction(y_arr) {
    const n = y_arr.length;
    if (n < 50) {
        let median = medianArr(y_arr);
        return { v_corrected: y_arr.map(v => v - median), v_drift: new Array(n).fill(median) };
    }
    
    let v_start = medianArr(y_arr.slice(0, 20));
    let v_end = medianArr(y_arr.slice(n - 20));
    
    let v_drift = new Array(n);
    for(let i=0; i<n; i++) {
        v_drift[i] = v_start + (v_end - v_start) * (i / (n - 1));
    }
    
    let v_corrected = new Array(n);
    for(let i=0; i<n; i++) {
        v_corrected[i] = y_arr[i] - (v_drift[i] - v_start);
    }
    
    return { v_corrected, v_drift };
}
