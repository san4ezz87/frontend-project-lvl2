const genDiff = (first, second) => {
    
  const firstObj = JSON.parse(first);
  const firstKeys = Object.keys(firstObj);

  const secondObj = JSON.parse(second);
  const secondKeys = Object.keys(secondObj);

  const commonObj = Object.assign({}, firstObj, secondObj);
  const commonKeys = Object.keys(commonObj).sort();

  const diff = commonKeys.reduce((acc, key) => {
    const firstValue = firstObj[key];
    const secondValue = secondObj[key];

    const firstHas = firstKeys.includes(key);
    const secondHas = secondKeys.includes(key);

    if (firstHas && secondHas && firstValue === secondValue) {
      return [...acc, ['', `${key}:`, firstValue]];
    }
    
    if (firstHas && secondHas && firstValue !== secondValue) {
      return [...acc, ['-', `${key}:`, firstValue], ['+', `${key}:`, secondValue]];
    }

    if (!firstHas && secondHas) {
      return [...acc, ['+', `${key}:`, secondValue]];
    }

    if (firstHas && !secondHas) {
      return [...acc, ['-', `${key}:`, firstValue]];
    }

  },  []);

  const diffString = diff.map(field => {
    return field.join(' ');
  })

  const res = `{\n${diffString.join('\n')}\n}`;

  console.log(res)
}


export default genDiff;