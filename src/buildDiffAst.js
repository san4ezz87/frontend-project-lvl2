import compareAst from './compareAst.js';
import buildAST from './buildAST.js';

const buildDiffAst = (firstObj, secondObj) => {
  const firstAst = buildAST(firstObj);
  const secondTwoAst = buildAST(secondObj);
  const diff = compareAst(firstAst, secondTwoAst);
  return diff;
};

export default buildDiffAst;
