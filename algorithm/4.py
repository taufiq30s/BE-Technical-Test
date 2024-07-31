n = int(input())
matrix = [0] * n
num_1 = 0
num_2 = 0
for i in range(n):
    matrix[i] = input().split()
    num_1 += int(matrix[i][i])
    num_2 += int(matrix[i][n-i-1])
print(num_1, "-", num_2, "=", num_1 - num_2)
