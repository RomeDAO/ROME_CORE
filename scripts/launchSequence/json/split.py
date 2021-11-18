import json
import math

publicWhitelist = json.loads(open('publicWhitelist.json').read())

def chunkify (lst,chunk_size):
    for i in range(0, len(lst), chunk_size):
        yield lst[i:i + chunk_size]
output = list(chunkify(publicWhitelist,500))

def writeOut (chunks):
    for i in range(0, len(chunks)):
        writeToJSONFile('./','whitelist_' + str(i),output[i])

def writeToJSONFile(path, fileName, data):
    filePathNameWExt = './' + path + '/' + fileName + '.json'
    with open(filePathNameWExt, 'w') as fp:
        json.dump(data, fp)

def check(addr,chunk):
    for i in range(0,len(chunk)):
        if (addr == chunk[i]):
            print('Is in whitelist')


print('==========================')
print('publicWhitelist: ' + str(len(publicWhitelist)))
print('==========================')
print('number of chunks: ' + str(math.ceil(len(publicWhitelist)/len(output[0]))))
print('==========================')
print('outputSize: ' + str(len(output[0])))
print('==========================')
writeOut(output)
