const data = "NEGIE1";
const str = data.match(/[a-zA-Z]+|[0-9]+/g);
str[0] = str[0].split("").reverse().join("");
console.log(str.join(""))
