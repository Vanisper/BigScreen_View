interface IPieceMinMax {
    min?: number,
    max?: number,
    label?: string,
    color?: string
}

interface IPieceValue {
    value?: number,
    label?: string,
    color?: string
}
// ()
interface IPieceGtLt {
    gt?: number,
    lt?: number,
    label?: string,
    color?: string
}
// (]
interface IPieceGtLte {
    gt?: number,
    lte?: number,
    label?: string,
    color?: string
}
// [)
interface IPieceGteLt {
    gte?: number,
    lt?: number,
    label?: string,
    color?: string
}
// []
interface IPieceGteLte {
    gte?: number,
    lte?: number,
    label?: string,
    color?: string
}

export type PieceType = (IPieceMinMax & IPieceValue & IPieceGtLt & IPieceGtLte & IPieceGteLt & IPieceGteLte);