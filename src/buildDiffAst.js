import compareAst from './compareAst.js';
import buildAST from './buildAST.js';

const buildDiffAst = (firstObj, secondObj) => {
  const firstAst = buildAST(firstObj);
  const secondTwoAst = buildAST(secondObj);
  return compareAst(firstAst, secondTwoAst);
};

export default buildDiffAst;
