"""
根据当前目录下的`RegionalTownship.json`文件预置的乡镇名
构建`ValueData.json`
"""
import json
import chardet

data = []
def extract(json_data):
    for item in json_data:
        data.append({
            "name": item,
            "value": 0
        })
            

# 检测文件编码
with open('RegionalTownship.json', 'rb') as f:
    result = chardet.detect(f.read())
    encoding = result['encoding']

# 读取JSON文件
with open('RegionalTownship.json', 'r', encoding=encoding) as f:
    json_data = json.load(f)

# 提取操作
extract(json_data)


# 写入文件
with open('ValueData.json', 'w',encoding=encoding) as outfile:
    outfile.write(json.dumps(data,ensure_ascii=False,indent=4))
