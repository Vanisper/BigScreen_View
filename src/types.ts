export interface IFeature {
    type: "Feature",
    properties: {
        name: string,
        [key: string]: any
    },
    geometry: {
        type: "Polygon",
        coordinates: number[][][]
    }
}

export interface IGeoJSON {
    type: "FeatureCollection",
    features: IFeature[]
}

// 保单
interface Insure {
    area: number
    certificate: string
}
// 蟹苗信息
interface Crab_seedlings_infos {
    size: number
    seedlings_planted_number: number
    seedlings_planted_time: string
    survival_rate: number
    expected_time_to_market: string
}
// 螃蟹信息
interface Crab_infos {
    crab_types: string
    crab_seedlings_types: string
    is_all_female: boolean
    expected_survival_rate: number
    expected_production_volume: number
    expected_time_to_market: string
    crab_seedlings_infos: Array<Crab_seedlings_infos>
    water_grass: Array<string>
}
// 套养
interface Intensive {
    type: string
    number: number
    expected_survival_rate: number
}
// 养殖模式
interface Breeding_mode {
    name: string
    pond_num: number
    pond_area: number
    crab_infos: Crab_infos
    main_large_scale: Array<number>
    main_little_scale: Array<number>
    intensive: Array<Intensive>
}
// 用户完整信息
export interface IFarmerData {
    id: number
    entity: string
    brand: string
    pond_area: number
    pond_num: number
    exp: number
    contact_man: string
    phone: number
    entity_type: string
    address_province: string
    address_city: string
    address_city_id: number
    address_district: string
    address_detail: string
    street: string
    insure: Insure
    breeding_mode: Array<Breeding_mode>
}

