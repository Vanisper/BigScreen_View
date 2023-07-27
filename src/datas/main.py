import json
import chardet
import random
import datetime
import os

# 获取脚本所在的位置
script_dir = os.path.dirname(os.path.abspath(__file__))

# 切换到脚本所在的位置
os.chdir(script_dir)

is_intercept = False  # 是否截取指定数量数据
fake_data = False  # 是否添加伪造数据
number = 3000


def generate_array(value, t):
    array = []

    # 生成 t-1 个随机小数
    for _ in range(t - 1):
        random_num = random.uniform(0, value)
        array.append(random_num)
        value -= random_num

    # 最后一个元素为剩余的 value
    array.append(value)

    return array


def extract_address(json_data):
    for item in json_data:
        # 获取 address_detail 字段值
        address = item["address_detail"]
        # 查找街道/镇
        street = None  # 初始化为空值
        for suffix in ["街道", "镇"]:
            pos = address.find(suffix)
            if pos != -1:
                street = address[: pos + len(suffix)]
                break
        # 构建新的元数据
        if street is not None:
            item["street"] = (
                street.replace("街道", "镇").replace("投保组织者：地址：", "").replace("高淳区", "")
            )
        else:
            if address.find("国家现代农业产业园") != -1:
                item["street"] = "砖墙镇"
            else:
                print(item)
                item["street"] = ""

        # 处理None的值：pond_area、pond_num
        item["pond_area"] = item["pond_area"] if item["pond_area"] != None else 0
        item["pond_num"] = item["pond_num"] if item["pond_num"] != None else 0

        # """添加假数据
        # """
        if fake_data:
            # 保险信息 insure
            item["insure"] = {
                "area": (0 if (item["pond_area"] == None) else item["pond_area"]) * 0.8,
                "certificate": "/保单证明样例.jpg",
            }
            # 养殖模式 breeding_mode
            crab_types = ["成蟹", "蟹苗", "六月黄"]  # 螃蟹种类
            crab_seedlings_types = ["长江1号", "长江2号", "诺亚1号", "诺亚2号"]  # 蟹苗种类
            water_grass_types = ["轮叶黑藻", "苦草", "扁担草", "其他"]  # 水草种类
            intensive_types = ["鳜鱼", "鲈鱼", "青虾", "翘嘴白鱼", "呆子鱼", "花鲢"]  # 套养种类
            times_to_market = ["8月下旬", "9月上旬", "9月中旬", "9月下旬"]  # 上市时间
            temp_breeding_mode = []
            index = 0
            # 生成规定总和的指定个数的数组
            test_arr = generate_array(
                item["pond_area"] if (item["pond_area"] != None) else 0,
                (len(crab_types) * len(crab_seedlings_types)),
            )

            for crab in crab_types:
                for crab_seedling in crab_seedlings_types:
                    index = index + 1
                    time_to_market = random.choice(times_to_market)
                    temp_breeding_mode.append(
                        {
                            "name": "养殖规模" + str(index),
                            "pond_num": (
                                item["pond_num"] if (item["pond_num"] != None) else 0
                            )
                            / (len(crab_types) * len(crab_seedlings_types)),
                            "pond_area": test_arr[index - 1],
                            "crab_infos": {
                                "crab_types": crab,
                                "crab_seedlings_types": crab_seedling,
                                "is_all_female": False,
                                "expected_survival_rate": 0.65,
                                "expected_production_volume": 165,
                                "expected_time_to_market": time_to_market,
                                "crab_seedlings_infos": [
                                    {
                                        "size": 30,
                                        "seedlings_planted_number": 1200,
                                        "seedlings_planted_time": datetime.datetime.now().strftime(
                                            "%Y/%m/%d"
                                        ),
                                        "survival_rate": 0.65,
                                        "expected_time_to_market": time_to_market,
                                    }
                                ],
                                "water_grass": water_grass_types,
                            },
                            "main_large_scale": [4, 4.5, 5, 5.5],
                            "main_little_scale": [3.5, 3, 2.5, 2],
                            "intensive": list(
                                map(
                                    lambda value: {
                                        "type": value,
                                        "number": 300,
                                        "expected_survival_rate": 0.68,
                                    },
                                    intensive_types,
                                )
                            ),
                        }
                    )
            item["breeding_mode"] = temp_breeding_mode


# 检测文件编码
with open("eb_crab_farmer.json", "rb") as f:
    result = chardet.detect(f.read())
    encoding = result["encoding"]

# 读取JSON文件
with open("eb_crab_farmer.json", "r", encoding=encoding) as f:
    json_data = json.load(f)

# 执行街道/镇提取操作
extract_address(json_data)

out_name = "data_out"
if is_intercept:
    out_name = out_name + str(number)
else:
    number = len(json_data)

with open(out_name + ".json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(json_data[:number], ensure_ascii=False, indent=4))


### 需要的数据
乡镇类型 = list(set(list(map(lambda item: item["street"], json_data))))
# 头部概览数据
养殖面积 = list(
    map(
        lambda value: value["pond_area"],
        json_data,
    )
)
塘口数 = list(
    map(
        lambda value: value["pond_num"],
        json_data,
    )
)

data_0 = {
    "概览": {
        "color": "#f74d52",
        "datas": [
            {
                "name": "养殖面积(亩)",
                "value": "21.2万" or str(round(sum(养殖面积), 2)),
                "color": "#ffff43",
            },
            {"name": "养殖户数", "value": "102314" or str(number), "color": "#ffff43"},
            {"name": "塘口数", "value": str(sum(塘口数)), "color": "#24f2e4"},
        ],
    },
    "产量": {
        "color": "#ffff43",
        "datas": [
            {"name": "总产量(斤)", "value": "3600万", "color": "#f74d52"},
            {"name": "平均亩产(斤)", "value": "170", "color": "#24f2e4"},
            {"name": "精品率", "value": "31%", "color": "#24f2e4"},
        ],
    },
    "景气指数": {
        "color": "#24f3e5",
        "datas": [
            {"name": "养殖面积跟同比增减", "value": "+0.7万亩"},
            {"name": "产能同比增减", "value": "+100万斤"},
        ],
    },
}
with open("./接口数据/头部数据.json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(data_0, ensure_ascii=False, indent=4))

# 公母养殖模式
data_1 = {
    "title": ["养殖面积"],
    "datas": [
        {"pic": "", "name": "♀️纯母养殖", "values": [str(16180) + "亩"]},
        {"pic": "", "name": "♂️纯公养殖", "values": [str(9700) + "亩"]},
        {"pic": "", "name": "♂️♀️混合养殖", "values": [str(212000 - 16180 - 9700) + "亩"]},
    ],
}
with open("./接口数据/公母养殖模式.json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(data_1, ensure_ascii=False, indent=4))

# 水草种植情况(碳汇)
data_2 = {
    # "title": ["选择种植的农户", "养殖面积(亩)", "塘口数"],
    "title": ["百分比"],
    "datas": {
        "其他": [round(5, 2)],
        "轮叶黑藻": [round(5, 2)],
        "苦草": [round(20, 2)],
        "扁担草": [round(40, 2)],
        "伊乐藻": [round(20, 2)],
        "节节草": [round(10, 2)],
        # "其他": [round(number / 4, 0), round(sum(养殖面积) / 4, 2), round(sum(塘口数) / 4, 0)],
        # "轮叶黑藻": [round(number / 4, 0), round(sum(养殖面积) / 4, 2), round(sum(塘口数) / 4, 0)],
        # "苦草": [round(number / 4, 0), round(sum(养殖面积) / 4, 2), round(sum(塘口数) / 4, 0)],
        # "扁担草": [round(number / 4, 0), round(sum(养殖面积) / 4, 2), round(sum(塘口数) / 4, 0)],
    },
}
with open("./接口数据/水草种植情况(碳汇).json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(data_2, ensure_ascii=False, indent=4))

# 塘口类型  40 20 13 10 8 9
data_3 = [
    {"name": "环沟", "value": round(sum(塘口数) * 0.40, 0)},
    {"name": "平底", "value": round(sum(塘口数) * 0.20, 0)},
    {"name": "鱼塘", "value": round(sum(塘口数) * 0.13, 0)},
    {"name": "沟叉", "value": round(sum(塘口数) * 0.10, 0)},
    {"name": "湖面", "value": round(sum(塘口数) * 0.08, 0)},
    {"name": "其他", "value": round(sum(塘口数) * 0.09, 0)},
]
with open("./接口数据/塘口类型.json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(data_3, ensure_ascii=False, indent=4))

# 投苗量（每亩投苗量达xxx的数量）
data_4 = [
    {"name": "精养(1500只)", "value": 200},
    {"name": "良品(2000只)", "value": 230},
    {"name": "普通(2500只)", "value": 400},
    {"name": "高产(3000只)", "value": 500},
]
with open("./接口数据/投苗量.json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(data_4, ensure_ascii=False, indent=4))

# 养殖户规模
## 规模企业：500亩以上
## 养殖大户：200-500亩
## 中户：50-200亩
## 散户：50亩以下
data_5 = [
    {
        "name": "规模企业",
        "value": "20"
        or str(len(list(filter(lambda f: f["pond_area"] >= 500, json_data)))),
    },
    {
        "name": "养殖大户",
        "value": str(
            len(
                list(
                    filter(
                        lambda f: (f["pond_area"] < 500 and f["pond_area"] >= 200),
                        json_data,
                    )
                )
            )
        ),
    },
    {
        "name": "中户",
        "value": str(
            len(
                list(
                    filter(
                        lambda f: (f["pond_area"] >= 50 and f["pond_area"] < 200),
                        json_data,
                    )
                )
            )
        ),
    },
    {
        "name": "散户",
        "value": str(len(list(filter(lambda f: f["pond_area"] < 50, json_data)))),
    },
]
with open("./接口数据/养殖户规模.json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(data_5, ensure_ascii=False, indent=4))

# 种苗养殖面积
data_6 = [
    {"name": "长江1号", "value": "100"},
    {"name": "长江2号", "value": "200"},
    {"name": "诺亚1号", "value": "600"},
    {"name": "诺亚2号", "value": "400"},
]
with open("./接口数据/种苗养殖面积.json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(data_6, ensure_ascii=False, indent=4))

# 主要市场
data_7 = [
    {"name": "北京新发地批发市场", "image": "/images/主要市场/北京新发地.png"},
    {"name": "上海嘉燕水产市场", "image": "/images/主要市场/上海嘉燕.png"},
    {"name": "上海江阳水产市场", "image": "/images/主要市场/江阳水产市场.png"},
    {"name": "湖北潜江中国龙虾交易中心", "image": "/images/主要市场/潜江龙虾.png"},
]
with open("./接口数据/主要市场.json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(data_7, ensure_ascii=False, indent=4))

# 主要消费品牌
data_8 = [
    {
        "name": "王氏大闸蟹",
        "image": "/images/消费品牌/王氏大闸蟹.png",
        "url": "https://www.wangshi.com.cn/",
    },
    {
        "name": "阳澄股份",
        "image": "/images/消费品牌/阳澄股份.png",
        "url": "http://www.yangchenghu88.com/",
    },
    {
        "name": "文和友",
        "image": "/images/消费品牌/文和友.webp",
        "url": "https://baike.baidu.com/item/%E6%96%87%E5%92%8C%E5%8F%8B",
    },
]
with open("./接口数据/主要消费品牌.json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(data_8, ensure_ascii=False, indent=4))


# 预期产量
data_9 = []
for street in 乡镇类型:
    curr_datas = list(
        filter(lambda value: value["street"] == street, json_data)
    )  # 当前街道的数据列表
    curr_areas = list(map(lambda value: value["pond_area"], curr_datas))  # 当前街道的面积列表
    data_9.append(
        {
            "street": street,
            "farmer_number": len(curr_datas),
            "production": 0 if sum(curr_areas) == 0 else (len(curr_datas) * 3727),
            "area": round(sum(curr_areas), 2),
            "every_farmer_production": 0 if sum(curr_areas) == 0 else 3727,
            "per_acre_production": 0
            if sum(curr_areas) == 0
            else round((len(curr_datas) * 3727 / sum(curr_areas)), 2),
        }
    )
with open("./接口数据/预期产量.json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(data_9, ensure_ascii=False, indent=4))

# 养殖大户Top5（多指标）
json_data.sort(key=lambda x: x["pond_area"], reverse=True)
top5 = json_data[:5]
data_10 = {
    "titles": list(map(lambda x: x["entity"], top5)),
    "datas": [
        {
            "name": "养殖面积(亩)",
            "values": list(map(lambda x: x["pond_area"], top5)),
            "type": "bar",
            "label": "面积",
        },
        {
            "name": "塘口数量(个)",
            "values": list(map(lambda x: x["pond_num"], top5)),
            "type": "bar",
            "label": "塘口数",
        },
        {
            "name": "养殖经验(年)",
            "values": list(map(lambda x: x["exp"], top5)),
            "type": "line",
            "label": "经验",
        },
    ],
}

with open("./接口数据/养殖大户Top5_柱状折线混合图.json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(data_10, ensure_ascii=False, indent=4))


# 养殖大户Top5（单指标）
top5 = json_data[:5]
data_11 = list(
    map(
        lambda x: {
            "name": x["entity"],
            "value": x["pond_area"],
        },
        top5,
    )
)

with open("./接口数据/养殖大户Top5.json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(data_11, ensure_ascii=False, indent=4))

# 各规格发货量
data_12 = [
    {"name": "1.2以上", "value": "70.5"},
    {"name": "1两以上", "value": "65.0"},
    {"name": "1.4母", "value": "10.0"},
    {"name": "1.5上炮头", "value": "25.0"},
    {"name": "35虾", "value": "180.0"},
    {"name": "中青（46虾）", "value": "339.0"},
    {"name": "单6", "value": "462.0"},
    {"name": "79虾", "value": "213.4"},
    {"name": "45起炮头", "value": "555.1"},
]
# 逆序一下
data_12.reverse()
with open("./接口数据/各规格发货量.json", "w", encoding=encoding) as outfile:
    outfile.write(json.dumps(data_12, ensure_ascii=False, indent=4))
