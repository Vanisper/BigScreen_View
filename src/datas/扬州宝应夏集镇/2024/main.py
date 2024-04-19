import os
import re
import pprint
import json
import pandas as pd
import math

# 初始化脚本运行位置
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

data_path = "夏集镇水产养殖调查表2024.04.12.xlsx"

# 读取excel文件
df_header = pd.read_excel(open(data_path, "rb"), sheet_name="水产养殖表", header=2)
# 将表头转换为MultiIndex对象
header = df_header.columns

multi_index = pd.MultiIndex.from_tuples([header])

# 将MultiIndex对象转换为列表
header_list = multi_index.tolist()[0]

# 遍历元组列表，整理成结构化的表头
new_header = []
header_flat = []
header = []
for i in header_list:
    name = re.sub(r"\s+", "", i)
    name = re.sub(r"（", "(", name)
    name = re.sub(r"）", ")", name)
    
    new_header.append({"name": name, "sub": None})
    header_flat.append(name)
    header.append(name)


# 必须加上一行表头  否则获取到的表格行数会少一行  他默认第一行是表头
df_main = pd.read_excel(open(data_path, "rb"), skiprows=2)
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
地址列表 = list(set(map(lambda x: x[3], dataset)))
地址列表 = [item for item in 地址列表 if item != ''] # 去除空字符串

def split_address(address):
    # 初始化结果列表
    result = [''] * 3
    # 分割 "镇"
    parts = re.split('镇', address, maxsplit=1)
    if len(parts) > 1:
        result[0] = parts[0].strip() + '镇'
        address = parts[1]
    else:
        result[0] = '夏集镇'  # 如果没有找到 "镇"，则添加一个默认的镇
    # 分割 "村" 或 "社区"
    parts = re.split('村|社区', address, maxsplit=1)
    if len(parts) > 1:
        result[1] = parts[0].strip() + ('村' if '村' in parts[0] else '社区')
        address = parts[1]
    # 分割 "组" 和 "、"
    parts = re.split('组|、', address)
    parts = [part.strip() + '组' for part in parts if part.strip() != '']
    if parts:
        result[2] = parts
    return result

地址 = [split_address(item) for item in 地址列表]

from collections import defaultdict
地址结构 = defaultdict(lambda: defaultdict(list)) # 初始化字典

# 遍历地址列表
for 镇, 村社区, 组 in 地址:
    # 将村社区添加到镇下
    if 村社区 not in 地址结构[镇]:
        地址结构[镇][村社区] = []
    # 将组添加到村社区下
    for g in 组:
        if g not in 地址结构[镇][村社区]:
            地址结构[镇][村社区].append(g)

地址结构列表 = {}
for 镇, 村社区字典 in 地址结构.items():
    地址结构列表[镇] = {}
    for 村社区, 组列表 in 村社区字典.items():
        地址结构列表[镇][村社区] = 组列表

# 养殖类型
养殖类型 = list(set(map(lambda x: x[5], dataset)))
养殖类型 = [item for item in 养殖类型 if item != ''] # 去除空字符串
print("养殖类型", 养殖类型)

# 养殖品种
养殖品种 = list(set(map(lambda x: x[6], dataset)))
养殖品种 = [item for item in 养殖品种 if item != ''] # 去除空字符串
print("养殖品种", 养殖品种)

# { name, value }
养殖品种_养殖面积 = []
for 品种 in 养殖品种:
    temp = list(filter(lambda x: x[6] == 品种, dataset))
    area = round(sum(list(map(lambda x: float(re.sub(r"[\u4e00-\u9fa5]+", "", str(x[4]))), temp)), 1))
    养殖品种_养殖面积.append({
        "name": 品种,
        "value": area
    })

养殖类型_养殖面积 = []
for 类型 in 养殖类型:
    temp = list(filter(lambda x: x[5] == 类型, dataset))
    area = round(sum(list(map(lambda x: float(re.sub(r"[\u4e00-\u9fa5]+", "", str(x[4]))), temp)), 1))
    养殖类型_养殖面积.append({
        "name": 类型,
        "value": area
    })

def all_in_array(array, elements):
    return all(element in array for element in elements)

# 养殖基地面积、农户数
养殖基地_组级别 = []
for 镇, 村社区字典 in 地址结构.items():
    for 村社区, 组列表 in 村社区字典.items():
        for 组 in 组列表:
            temp = list(filter(lambda x: all_in_array(split_address(x[3]), [镇, 村社区]) and 组 in split_address(x[3])[2] , dataset))
            area = round(sum(list(map(lambda x: float(re.sub(r"[\u4e00-\u9fa5]+", "", str(x[4]))), temp)), 1))
            养殖基地_组级别.append({
                "name": 组,
                "datas": [
                    {
                        "type": "养殖面积(亩)",
                        "value": area
                    },
                    {
                        "type": "养殖户数",
                        "value": len(temp)
                    }
                ],
                "value": area
            })

# print("养殖基地", 养殖基地_组级别)
养殖基地_村社区级别 = []
for 镇, 村社区字典 in 地址结构.items():
    for 村社区, 组列表 in 村社区字典.items():
        temp = list(filter(lambda x: all_in_array(split_address(x[3]), [镇, 村社区]), dataset))
        area = round(sum(list(map(lambda x: float(re.sub(r"[\u4e00-\u9fa5]+", "", str(x[4]))), temp)), 1))
        养殖基地_村社区级别.append({
            "name": 村社区,
            "datas": [
                {
                    "type": "养殖面积(亩)",
                    "value": area
                },
                {
                    "type": "养殖户数",
                    "value": len(temp)
                }
            ],
            "value": area
        })

print("养殖基地", 养殖基地_村社区级别)

养殖面积 = round(sum(list(map(lambda x: x[4], dataset)), 1))
养殖户数 = len(dataset)

# 头部数据
data_0 = {
    "概览": {
        "color": "#21c958",
        "datas": [
            {
                "name": "养殖面积(亩)",
                "value": str(养殖面积),
                "color": "#21c958",
            },
            {"name": "养殖户数", "value": str(养殖户数), "color": "#21c958"},
        ],
    },
}

with open("./data.json", "w", encoding="utf-8") as outfile:
    outfile.write(json.dumps({
        "头部数据": data_0,
        "养殖基地": 养殖基地_村社区级别,
        "养殖品种": 养殖品种_养殖面积,
        "养殖类型": 养殖类型_养殖面积,
    }, ensure_ascii=False, indent=4))