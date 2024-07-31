const words = "Saya sangat senang mengerjakan soal algoritma".split(" ");
max_length = -1
pos = -1
words.map((word, i) => {
    if (word.length > max_length) {
        max_length = word.length;
        pos = i;
    }
});
console.log(`${words[pos]} : ${max_length} character`);
