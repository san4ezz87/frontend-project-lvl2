import buildDiffAst from './buildDiffAst.js';
import buildAST from './buildAST.js';

const parse = (firstObj, secondObj) => {
  const firstAstDiff = buildAST(firstObj);
  const secondTwoAstDiff = buildAST(secondObj);
  const diff = buildDiffAst(firstAstDiff, secondTwoAstDiff, []);
  return diff;
};

export default parse;
