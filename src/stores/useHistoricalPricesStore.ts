import { defineStore } from "pinia";
import Historical_Prices_of_Crabs from "../datas/往年价格数据/Historical_Prices_of_Crabs.json";
import Historical_Prices_of_Crabs_Dataset from "../datas/往年价格数据/Historical_Prices_of_Crabs_Dataset.json";

export const useHistoricalPricesStore = defineStore("useHistoricalPricesStore", () => {
    return {
        Historical_Prices_of_Crabs,
        Historical_Prices_of_Crabs_Dataset
    }
})