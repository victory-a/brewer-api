interface IPick {
  object: Record<string, any>;
  keys: string[];
}

const pick = (object: IPick['object'], keys: IPick['keys']) => {
  return keys.reduce((obj: IPick['object'], key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export default pick;
