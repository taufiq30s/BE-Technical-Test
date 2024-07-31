const input = ['xc', 'dz', 'bbb', 'dz'];
const querier = ['bbb', 'ac', 'dz'];

let res = Array(querier.length).fill(0).map((data, idx) => {
    return input.filter(data => data == querier[idx]).length;
});

console.log(res);
