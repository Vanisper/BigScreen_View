import { floorTo } from "./Math";

export function generateColors(numColors: number) {
    var colors = [];
    var hueStep = floorTo(360 / numColors, 0); // 计算每个颜色的色相步长
    var hue = 0;
    for (var i = 0; i < numColors; i++) {
        // 将 HSL 颜色转换为 RGB 颜色
        var hslColor = 'hsl(' + hue + ', 100%, 50%)';
        var rgbColor = hslToRgb(hslColor);
        colors.push(rgbColor);
        hue += hueStep;
    }
    return colors;
}

// 将 HSL 颜色转换为 RGB 颜色
function hslToRgb(hslColor: string) {
    var hsl = hslColor.match(/^hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)$/);
    var h = parseInt(hsl![1]) / 360;
    var s = parseInt(hsl![2]) / 100;
    var l = parseInt(hsl![3]) / 100;
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    var r = Math.round(hueToRgb(p, q, h + 1 / 3) * 255);
    var g = Math.round(hueToRgb(p, q, h) * 255);
    var b = Math.round(hueToRgb(p, q, h - 1 / 3) * 255);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

// 将 HSL 颜色的色相、饱和度和亮度转换为 RGB 颜色的红、绿、蓝分量
function hueToRgb(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

export function convertColorsToHash(colors: string[], alpha?: number): string[] {
    return colors.map((color) => {
        const rgbaColor = colorToRGBA(color, alpha);
        return rgbaColorToHash(rgbaColor);
    });
}

// 将颜色转换为 RGBA 格式
export function colorToRGBA(color: string, alpha?: number): string {
    const tempElem = document.createElement('div');
    tempElem.style.color = color;
    const computedColor = tempElem.style.color;
    const rgbaArray = computedColor.match(/\d+/g)!;

    const r = rgbaArray[0];
    const g = rgbaArray[1];
    const b = rgbaArray[2];
    const a = alpha !== undefined ? alpha.toFixed(2) : rgbaArray[3];
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function opacityToHex(opacity: number) {
    const alpha = Math.round(opacity * 255);
    return alpha.toString(16).padStart(2, '0');
}

function colorItemToHex(color: string) {
    return parseInt(color).toString(16).padStart(2, '0')
}

/**
 * 将 RGBA 颜色转换为哈希色值
 * @param rgbaColor 包含分割的rgb或者rgba的字符串：rgb(255,255,255)、甚至是"255,255,255,0.25"
 * @returns 颜色hex值
 */
export function rgbaColorToHash(rgbaColor: string): string {
    const rgba = rgbaColor.match(/\d+/g)!;
    const alpha = +(rgba.slice(3, 5).join(".") + rgba.slice(5).join(""));
    const hexColor = `#${colorItemToHex(rgba[0])}${colorItemToHex(rgba[1])}${colorItemToHex(rgba[2])}`;
    return alpha ? `${hexColor}${opacityToHex(alpha)}` : hexColor;
}
