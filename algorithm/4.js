const data = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]
var res = [0, 0];
for (let i = 0; i < data[0].length; i++) {
    res[0] += data[i][i];
    res[1] += data[i][data[0].length - i - 1];
}
console.log(`${res[0]} - ${res[1]} = ${res[0] - res[1]}`);
