import os
import re
import pprint
import json
import pandas as pd
import math

# 初始化脚本运行位置
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

data_path = "2023年洪蓝街道水产养殖生产经营主体清单.xlsx"

# 读取excel文件
df_header = pd.read_excel(open(data_path, "rb"), sheet_name="Sheet1", header=[3, 4])
# 将表头转换为MultiIndex对象
header = df_header.columns
multi_index = pd.MultiIndex.from_tuples(header)

# 将MultiIndex对象转换为列表
header_list = multi_index.tolist()

# 遍历元组列表，整理成结构化的表头
new_header = []
header_flat = []
header = []
for i in header_list:
    name = re.sub(r"\s+", "", i[0])
    name = re.sub(r"（", "(", name)
    name = re.sub(r"）", ")", name)
    sub_name = re.sub(r"\s+", "", i[1])
    flag = False
    if len(new_header) > 0:
        temp_header = list(map(lambda x: x["name"], new_header))
        flag = name in temp_header

    if "Unnamed" in i[1]:
        new_header.append({"name": name, "sub": None})
    else:
        if flag:
            for j in new_header:
                if j["name"] == name:
                    j["sub"].append(
                        {
                            "name": sub_name,
                        }
                    )

        else:
            new_header.append(
                {
                    "name": name,
                    "sub": [
                        {
                            "name": sub_name,
                        }
                    ],
                }
            )
    # 将相同的name下的sub_name合并
    header_flat.append(name + ("" if "Unnamed" in sub_name else ":" + sub_name))
    if "Unnamed" in sub_name:
        header.append(name)
    else:
        if type(header[len(header) - 1]) != str:
            if header[len(header) - 1][0] == name:
                header[len(header) - 1][1].append(sub_name)
            else:
                header.append([name, [sub_name]])
        else:
            header.append([name, [sub_name]])


# 必须加上一行表头  否则获取到的表格行数会少一行  他默认第一行是表头
df_main = pd.read_excel(open(data_path, "rb"), skiprows=4)
table_height = list(df_main.shape)[0]
table_width = list(df_main.shape)[1]
# print(table_height, table_width)
# print(df_main.iloc[2].tolist())


dataset = []
for y in range(table_height):
    line = df_main.iloc[y].tolist()
    new_arr = []

    for x in line:
        try:
            new_arr.append(float(x) if not math.isnan(float(x)) else "")
        except ValueError:
            new_arr.append(x if type(x) == str else "")
    dataset.append(new_arr)

# 将表头和数据整合成字典
data = [header_flat] + dataset

with open("dataset.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)


with open("header.json", "w", encoding="utf-8") as f:
    json.dump(new_header, f, ensure_ascii=False, indent=4)


# ---------------------------------- 指标整理 ----------------------------------
# 街道类型
街道 = list(set(map(lambda x: x[1], dataset)))
print("街道", 街道)

# 基地类型
基地类型 = list(set(map(lambda x: x[2], dataset)))
print("基地", 基地类型)
# 养殖基地面积、产量、农户数
养殖基地 = []
for i in 基地类型:
    temp = list(filter(lambda x: x[2] == i, dataset))
    area = round(sum(list(map(lambda x: float(re.sub(r"[\u4e00-\u9fa5]+", "", str(x[6]))), temp))), 1)
    养殖基地.append({
        "name": i,
        "datas": [
            {
                "type": "养殖面积(亩)",
                "value": area
            },
            {
                "type": "产量(吨)",
                "value": round(sum(list(map(lambda x: x[8], temp))), 1)
            },
            {
                "type": "养殖户数",
                "value": len(temp)
            }
        ],
        "value": area
    })
print("养殖基地", 养殖基地)

# 村类型
村 = list(set(map(lambda x: x[3], dataset)))
print("村", 村)

# 养殖品种类型
养殖品种 = list(set(map(lambda x: str(x[7])+str(x[5]), dataset)))
# 修正各字段
# 去除所有标点符号
养殖品种 = list(set(map(lambda x: re.sub(r"[^\u4e00-\u9fa5]", "", x), 养殖品种)))
# 将养殖品种按照长度排序
养殖品种 = sorted(养殖品种, key=lambda x: len(x))
print("养殖品种", 养殖品种)
各养殖品种数量 = []
for i in 养殖品种:
    temp = list(filter(lambda x: i == str(x[7])+re.sub(r"[^\u4e00-\u9fa5]", "", x[5]), dataset))
    各养殖品种数量.append({
        "name": i,
        "value": sum(list(map(lambda x: float(re.sub(r"[\u4e00-\u9fa5]+", "", str(x[6]))), temp)))
    })
## 以首两个汉字排序
各养殖品种数量 = sorted(各养殖品种数量, key=lambda x: x["name"][0:2])
## 以首两个汉字拆分成两个数组:一组是混养,一组是精养
混养 = list(filter(lambda x: x["name"][0:2] == '混养', 各养殖品种数量))
精养 = list(filter(lambda x: x["name"][0:2] == '精养', 各养殖品种数量))
print("混养", 混养)
print("精养", 精养)


# 养殖模式类型
养殖模式类型 = list(set(map(lambda x: x[7], dataset)))
print("养殖模式类型", 养殖模式类型)
# 各养殖模式类型的面积（亩）、产量（吨）
养殖模式 = {
    "title":[],
    "datas":[]
}
养殖模式["title"] = ["养殖面积(亩)","产量(吨)","投饲量(吨/年)"]
for i in 养殖模式类型:
    temp = list(filter(lambda x: x[7] == i, dataset))
    area = round(sum(list(map(lambda x: float(re.sub(r"[\u4e00-\u9fa5]+", "", str(x[6]))), temp))), 1)
    _yield = round(sum(list(map(lambda x: x[8], temp))), 1)
    # 投饲量
    feed = round(sum(list(map(lambda x: (x[12] if x[12] !="" else 0), temp))), 1)
    养殖模式["datas"].append({
        "name":"⚝"+i if i=="混养" else "⭐"+i,
        "values": [area, _yield, feed/1000]
    })
print("养殖模式", 养殖模式)
# 计算精养率
精养率 = round(list(map(lambda x: x[7], dataset)).count("精养") / len(dataset) * 100, 1)

# 养殖面积
养殖面积 = sum(list(map(lambda x: float(re.sub(r"[\u4e00-\u9fa5]+", "", str(x[6]))), dataset)))
print("养殖面积(亩)", 养殖面积)

# 养殖户数
养殖户数 = len(dataset)
print("养殖户数", 养殖户数)

# 产量
产量 = round(sum(list(map(lambda x: x[8], dataset))),1)
print("产量(吨)", 产量)
# 平均亩产
平均亩产 = round(产量 * 1000 / 养殖面积 , 1)

# 主要供应区域
主要供应区域类型 = list(set(map(lambda x: x[9], dataset)))
主要供应地 = []
for i in 主要供应区域类型:
    temp = list(filter(lambda x: x[9] == i, dataset))
    主要供应地.append({
        "name": i,
        "value": str(round(sum(list(map(lambda x: x[8], temp))), 1))
    })
print("主要供应地", 主要供应地)

# 渔药品种
渔药品种 = list(set(map(lambda x: re.sub(r"[^\u4e00-\u9fa5]", "", x[10]), dataset)))
print("渔药品种", 渔药品种)

# 各渔药品种使用量
渔药品种使用量 = []
for i in 渔药品种:
    temp = list(filter(lambda x: re.sub(r"[^\u4e00-\u9fa5]", "", x[10]) == i, dataset))
    temp = list(map(lambda x: x[11], temp))
    渔药品种使用量.append({
        "name": i,
        "value": round(sum(temp), 1)
    })
print("各渔药品种使用量", 渔药品种使用量)

# 年投饲量
年投饲量 = round(sum(list(map(lambda x: (x[12] if x[12] !="" else 0), dataset))), 1)
print("年投饲量(公斤)", 年投饲量)

# 头部数据
data_0 = {
    "概览": {
        "color": "#f74d52",
        "datas": [
            {
                "name": "养殖面积(亩)",
                "value": str(养殖面积),
                "color": "#ffff43",
            },
            {"name": "养殖户数", "value": str(养殖户数), "color": "#ffff43"},
            {"name": "年投饲量(吨)", "value": str(年投饲量/1000), "color": "#ffff43"},
        ],
    },
    "产量": {
        "color": "#ffff43",
        "datas": [
            {"name": "总产量(吨)", "value": str(产量), "color": "#f74d52"},
            {"name": "平均亩产(公斤)", "value": str(平均亩产), "color": "#24f2e4"},
            {"name": "精养率", "value": str(精养率)+"%", "color": "#24f2e4"},
        ],
    },
}

data_1 = {
    "title": ["公斤"],
    "datas": {},
}
for i in 渔药品种使用量:
    data_1["datas"][i["name"]] = [i["value"]]


data_2 = {
    "混养": 混养,
    "精养": 精养,
}

data_3 = 养殖模式

with open("./data.json", "w", encoding="utf-8") as outfile:
    outfile.write(json.dumps({
        "头部数据": data_0,
        "渔药品种使用情况": data_1,
        "混养品类": data_2["混养"],
        "精养品类": data_2["精养"],
        "养殖模式": data_3,
        "养殖基地": 养殖基地,
        "主要供应区域": 主要供应地
        }, ensure_ascii=False, indent=4))