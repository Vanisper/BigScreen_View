from geopandas import *
import copy

shpdata = GeoDataFrame.from_file("./高淳区.shp")
features = [shpdata.__geo_interface__]

properties_ignores = ["name","center"]
# 修正Json
for index,item in enumerate(features[0]["features"]):
    if "乡" in item["properties"].keys():
       features[0]["features"][index]["properties"]["name"] = item["properties"]["乡"]

    # 计算多边形质心
    from shapely.geometry import Polygon
    polygon = Polygon(features[0]["features"][index]["geometry"]["coordinates"][0])
    features[0]["features"][index]["properties"]["center"] = [polygon.centroid.x, polygon.centroid.y]
    # print(features[0]["features"][index]["properties"])
    # 删除多余 ==> 将遍历条件改为列表 解决遍历过程中无法修改字典的问题
    for key in list(features[0]["features"][index]["properties"].keys()):
        if not key in properties_ignores:
            features[0]["features"][index]["properties"].pop(key)

from json import dumps
geojson = open("demo.json", "w",encoding="utf-8")
geojson.write(dumps(features[0], indent=4,ensure_ascii=False) + "")
geojson.close()

