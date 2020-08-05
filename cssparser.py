import os
entries = os.listdir('themes/')

tempDic = {}
for entry in entries: 
    if os.path.isfile(os.path.join("themes/", entry)):
        name = (entry.split(".")[0])
        with open(os.path.join("themes/", entry), 'r') as f:
            lines = f.readlines()
            tempDic[name] = {}
            for line in lines:
                if line.strip().startswith("--bg-color"):
                    tempDic[name]["main"] = line.strip().split(" ")[1][:-1]
                if line.strip().startswith("--main-color"):
                    tempDic[name]["secondary"] = line.strip().split(" ")[1][:-1]

sortedDic = {}
for i in sorted (tempDic.keys()) :  
    sortedDic[i] = tempDic[i]               
print(sortedDic)