// globalUserStore.js

let setUserRef = null;

export const setSetUser = (setterFunction) => {
  setUserRef = setterFunction;
};

export const getSetUser = () => setUserRef;
