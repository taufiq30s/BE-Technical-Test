# Soal 1
string = "NEGIE1"
len_num = 0
for i in range(len(string)-1, -1, -1):
    if (string[i] >= '0' and string[i] <= '9'):
        len_num += 1
        continue
    print(string[i], end="")
print(string[-len_num:])
