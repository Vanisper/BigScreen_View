import os
import json

# 获取脚本所在的位置
script_dir = os.path.dirname(os.path.abspath(__file__))

# 切换到脚本所在的位置
os.chdir(script_dir)

# 遍历当前目录下的所有文件
output_name = "Historical_Prices_of_Crabs"
dataset_source_name = "Historical_Prices_of_Crabs_Dataset"
output = {}
for file_name in os.listdir(script_dir):
    # 检查文件扩展名是否为 .json
    if file_name.endswith(".json") and (
        os.path.splitext(file_name)[0]
        not in [
            output_name,
            dataset_source_name,
        ]
    ):
        # 构建 JSON 文件的完整路径
        file_path = os.path.join(script_dir, file_name)

        # 读取 JSON 文件内容
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        # 处理 JSON 数据
        result = []
        title = data[0]  #  标题
        types = title[1 : len(title)]  # 类别
        times = list(map(lambda line: line[0], data))
        times = times[1 : len(times)]  # 日期列表
        for index, type in enumerate(types):
            values = list(map(lambda line: line[index + 1], data))
            values.pop(0)
            result.append({"type": type, "times": times, "values": values})
        output[file_name.split(".json")[0]] = result

with open(output_name + ".json", "w", encoding="utf-8") as outfile:
    outfile.write(json.dumps(output, ensure_ascii=False, indent=4))

# 数据逆向
datas_names = list(output.keys())
output_dataset = {}
for data_index, data_name in enumerate(datas_names):
    item_data = output[data_name]
    titles = ["日期"] + list(map(lambda value: value["type"], item_data))
    times = item_data[0]["times"]
    values_length = len(times)
    values = [titles]
    for value_index in range(values_length):
        values.append(
            [times[value_index]]
            + list(map(lambda value: value["values"][value_index], item_data)),
        )
    output_dataset[data_name] = values

with open(dataset_source_name + ".json", "w", encoding="utf-8") as outfile:
    outfile.write(json.dumps(output_dataset, ensure_ascii=False, indent=4))
