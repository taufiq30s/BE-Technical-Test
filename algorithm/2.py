words = input().split()
max_length = -1
pos = -1
for i in range(len(words)):
    if len(words[i]) > max_length:
        max_length = len(words[i])
        pos = i
print(words[pos], ":", max_length, "character")
