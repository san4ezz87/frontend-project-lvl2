import parse from './parsers.js';

const genDiff = (first, second) => {
  const firstObj = parse(first);
  const firstKeys = Object.keys(firstObj);

  const secondObj = parse(second);
  const secondKeys = Object.keys(secondObj);

  const commonObj = { ...firstObj, ...secondObj };
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

    return acc;
  }, []);

  const diffString = diff.map((field) => field.join(' '));

  const res = `{\n${diffString.join('\n')}\n}`;
  return res;
};

export default genDiff;
