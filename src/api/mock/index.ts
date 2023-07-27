import { MockMethod } from "vite-plugin-mock";
import { rules, getRuleUrl } from "../config"

import 头部数据 from "../../datas/接口数据/头部数据.json";
import 主要市场 from "../../datas/接口数据/主要市场.json";
import 主要消费品牌 from "../../datas/接口数据/主要消费品牌.json";
import 公母养殖模式 from "../../datas/接口数据/公母养殖模式.json";
import 水草种植情况_碳汇 from "../../datas/接口数据/水草种植情况(碳汇).json";
import 塘口类型 from "../../datas/接口数据/塘口类型.json";
import 投苗量 from "../../datas/接口数据/投苗量.json";
import 养殖户规模 from "../../datas/接口数据/养殖户规模.json";
import 预期产量 from "../../datas/接口数据/预期产量.json";
import 种苗养殖面积 from "../../datas/接口数据/种苗养殖面积.json";
import 养殖大户Top5 from "../../datas/接口数据/养殖大户Top5.json";
import 各规格发货量 from "../../datas/接口数据/各规格发货量.json";

import 洪蓝街道数据 from "../../datas/洪蓝街道数据/data.json";

interface MyMockMethod extends MockMethod {
    data: any
}

export default [
    {
        url: getRuleUrl("头部数据"),
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    data: 头部数据
                },
                message: "success"
            };
        },
        data: 头部数据
    }, {
        url: getRuleUrl("主要市场"),
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    data: 主要市场
                },
                message: "success"
            };
        },
        data: 主要市场
    }, {
        url: getRuleUrl("主要消费品牌"),
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    data: 主要消费品牌
                },
                message: "success"
            };
        },
        data: 主要消费品牌
    }, {
        url: getRuleUrl("公母养殖模式"),
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    data: 公母养殖模式
                },
                message: "success"
            };
        },
        data: 公母养殖模式
    }, {
        url: getRuleUrl("水草种植情况_碳汇"),
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    data: 水草种植情况_碳汇
                },
                message: "success"
            };
        },
        data: 水草种植情况_碳汇
    }, {
        url: getRuleUrl("塘口类型"),
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    data: 塘口类型
                },
                message: "success"
            };
        },
        data: 塘口类型
    }, {
        url: getRuleUrl("投苗量"),
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    data: 投苗量
                },
                message: "success"
            };
        },
        data: 投苗量
    }, {
        url: getRuleUrl("养殖户规模"),
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    data: 养殖户规模
                },
                message: "success"
            };
        },
        data: 养殖户规模
    }, {
        url: getRuleUrl("养殖大户Top5"),
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    data: 养殖大户Top5
                },
                message: "success"
            };
        },
        data: 养殖大户Top5
    }, {
        url: getRuleUrl("预期产量"),
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    data: 预期产量
                },
                message: "success"
            };
        },
        data: 预期产量
    }, {
        url: getRuleUrl("种苗养殖面积"),
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    data: 种苗养殖面积
                },
                message: "success"
            };
        },
        data: 种苗养殖面积
    }, {
        url: getRuleUrl("各规格发货量"),
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    data: 各规格发货量
                },
                message: "success"
            };
        },
        data: 各规格发货量
    }, {
        url: getRuleUrl("洪蓝街道数据"),
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    data: 洪蓝街道数据
                },
                message: "success"
            };
        },
        data: 洪蓝街道数据
    }
] as MyMockMethod[];
