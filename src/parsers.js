import buildDiffAst from './buildDiffAst.js';
import buildAST from './buildAST.js';

const parse = (firstObj, secondObj) => {
  const firstAstDiff = buildAST(firstObj);
  const secondTwoAstDiff = buildAST(secondObj);
  return buildDiffAst(firstAstDiff, secondTwoAstDiff, []);
};

export default parse;
