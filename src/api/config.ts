// 按道理来讲这里无需配置，但是由于mockjs的bug，导致无法使用import.meta.env.VITE_API_BASE，所以这里需要手动配置一下
export const VITE_API_BASE = "/mock/api";
export const isBaseURL = true; // 自定义的axios会根据这个flag来判断是否使用baseURL：自定义的axios的行为和mock的行为为互补关系
export const rules = [
    {
        label: "头部数据",
        url: `${VITE_API_BASE}/getHeaderData`
    },
    {
        label: "主要市场",
        url: `${VITE_API_BASE}/mainMarkets`
    },
    {
        label: "主要消费品牌",
        url: `${VITE_API_BASE}/mainConsumptionBrands`
    },
    {
        label: "公母养殖模式",
        url: `${VITE_API_BASE}/breedingMode`
    },
    {
        label: "水草种植情况_碳汇",
        url: `${VITE_API_BASE}/plantingSituation`
    },
    {
        label: "塘口类型",
        url: `${VITE_API_BASE}/pondType`
    },
    {
        label: "投苗量",
        url: `${VITE_API_BASE}/seedlingAmount`
    },
    {
        label: "养殖户规模",
        url: `${VITE_API_BASE}/farmerScale`
    },
    {
        label: "养殖大户Top5",
        url: `${VITE_API_BASE}/farmerTop5`
    },
    {
        label: "预期产量",
        url: `${VITE_API_BASE}/expectedOutput`
    },
    {
        label: "种苗养殖面积",
        url: `${VITE_API_BASE}/seedlingArea`
    }, {
        label: "各规格发货量",
        url: `${VITE_API_BASE}/specificationDelivery`
    }, {
        label: "洪蓝街道数据",
        url: `${VITE_API_BASE}/HongLanStreetData`
    }, {
        label: "扬州宝应县数据",
        url: `${VITE_API_BASE}/YZBaoYinStreetData`
    },
]

// 根据以上规则列表，指定label，获取对应的url  给mock插件使用
export const getRuleUrl = (label: string) => {
    const rule = rules.find(item => item.label === label)
    return rule?.url
}

// 指定label，获取对应去除mock前缀的url  给前端调用使用
export const getRealUrl = (label: string) => {
    const rule = rules.find(item => item.label === label)
    return isBaseURL ? rule?.url : rule?.url.replace(VITE_API_BASE, "")
}