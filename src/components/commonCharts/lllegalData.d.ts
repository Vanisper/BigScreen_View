export interface ILllegalDataTitle {
    text: string;
    isVertical?: boolean;
    top?: string;
    left?: string;
    textStyle?: {
        color?: string;
        fontSize?: number;
    };
}
export interface ILllegalDataData {
    name: string;
    max: number;
    value: number;
    [ke: string]: any
}