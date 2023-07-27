
export interface ICrabInfos {
    crab_types: string,
    crab_seedlings_types: string,
    expected_survival_rate: number,
    expected_production_volume: number,
    expected_time_to_market: string,
    crab_seedlings_infos: {
        size: number,
        seedlings_planted_number: number,
        seedlings_planted_time: string,
        survival_rate: number,
        expected_time_to_market: string
    }[],
    water_grass: string[]
}