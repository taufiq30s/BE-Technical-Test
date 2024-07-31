datas = input().split()
queries = input().split()

res = [0] * len(queries)
for i in range(len(queries)):
    for data in datas:
        if queries[i] == data:
            res[i] += 1
print(res)
            
