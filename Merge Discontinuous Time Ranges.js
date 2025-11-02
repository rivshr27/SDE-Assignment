'use strict';

/**
 * Merges discontinuous time ranges within a given threshold.
 *
 * @param {Array<[number, number]>} ranges - Array of [start, end] ranges (unsorted, may overlap)
 * @param {number} threshold - Max gap (in ms) allowed between ranges to still be merged
 * @returns {Array<[number, number]>} - Sorted, non-overlapping merged ranges
 */
function mergeTimeRanges(ranges, threshold) {
  if (!Array.isArray(ranges) || ranges.length === 0) return [];

  const thr = Number.isFinite(threshold) ? Math.max(0, threshold) : 0;

  const arr = [];
  for (let i = 0; i < ranges.length; i++) {
    const r = ranges[i];
    if (!Array.isArray(r) || r.length < 2) continue;

    let s = Number(r[0]);
    let e = Number(r[1]);
    if (!Number.isFinite(s) || !Number.isFinite(e)) continue;
    if (s > e) { const t = s; s = e; e = t; } 

    arr.push([s, e]);
  }
  if (arr.length === 0) return [];


  arr.sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

  const result = [];
  let [curS, curE] = arr[0];

  for (let i = 1; i < arr.length; i++) {
    const [s, e] = arr[i];

   
    if (s <= curE || (s - curE) < thr) {
      if (e > curE) curE = e;
    } else {
      result.push([curS, curE]);
      curS = s;
      curE = e;
    }
  }

  result.push([curS, curE]);
  return result;
}

module.exports = { mergeTimeRanges };