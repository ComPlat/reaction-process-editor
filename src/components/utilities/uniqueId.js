let nextId = 0;

const uniqueId = (prefix = "") => {
  nextId += 1;
  return `${prefix}${nextId}`;
};

export default uniqueId;
