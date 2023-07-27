/**
 * 取整至指定进制。
 * 例如：传参112、1结果为110
 * @param num 需要向下取整的数字
 * @param digit 需要取整的位数
 * @returns 取整之后的结果
 */
export const floorTo = (num: number, digit: number) => {
    const factor = Math.pow(10, digit);
    return Math.floor(num / factor) * factor;
}
/**
 * 向上取整至指定进制
 * @param num 需要向上取整的数字
 * @param digit 需要取整的位数：0则是个位、1是十位、-1是小数后一位，依次推类
 * @returns 向上取整之后的结果
 */
export const cellTo = (num: number, digit: number) => {
    const factor = Math.pow(10, digit);
    return Math.ceil(num / factor) * factor;
}

/**
 * 数组去重
 */
export const uniqueArray = (arr: string[]) => {
    return [...new Set(arr)];
}

/**
 * 数组求交集
 */

export const arrayIntersection = (arr: string[][]) => {
    const sets = arr.map(subArr => new Set(subArr));
    const intersection = [...sets.reduce((acc, set) => new Set([...acc].filter(item => set.has(item))))];
    return intersection;
}

/**
 * 数组求并集
 */
export const arrayUnion = (arr: string[][]) => {
    const set = new Set(arr.flat());
    return [...set];
}

/**
 * 保留指定小数位数
 */
export function roundToDecimal(number: number, decimalPlaces: number): number {
    const factor = 10 ** decimalPlaces;
    const roundedNumber = Math.round(number * factor) / factor;
    return roundedNumber;
}

