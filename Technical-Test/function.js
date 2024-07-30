function longestSameChar(strs) {
  if (strs.length === 0) return "";

  let sameChar = strs[0];

  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(sameChar) !== 0) {
      sameChar = sameChar.substring(0, sameChar.length - 1);
      if (sameChar === "") return "";
    }
  }

  return sameChar;
}

const strs1 = ["flower", "flow", "flight"];
console.log(longestSameChar(strs1));

const strs2 = ["dog", "racecar", "car"];
console.log(longestSameChar(strs2));
