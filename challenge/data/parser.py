#!/usr/bin/python
import json
import re


def parser(filename):
    split = re.split(r"\W+", filename)
    print(split)


    with open(filename) as f:
        jsonData = json.load(f)
        # print(data['results'][0]['geometry']['location']['lat'])
    

    dataF = open(split[0] + "/heatdata.js", "a")
    dataF.write('\'' + str(split[1])+ '\': ')
    for entry in jsonData["results"]:
        vals = str([entry["geometry"]["location"]["lat"], entry["geometry"]["location"]["lng"], 1])
        heatVals = re.sub(r"\[(-?\d*\.\d*), (-?\d*\.\d*), (\d)\]", r"{lat: \1, lng: \2, count: \3},", vals)
        # print(heatVals)
        dataF.write(heatVals + "\n")
    

    dataF.close()




if __name__== "__main__":
    parser("default/googlefood.json")