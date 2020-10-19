const getTypeOf = (value) => Object.prototype.toString.call(value).slice(8, -1);

export default getTypeOf;
