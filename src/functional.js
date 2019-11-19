const reduce = (reducer, initial, arr) => {
  // shared stuff
  let acc = initial;
  for (let i = 0, { length } = arr; i < length; i++) {
    // unique stuff in reducer() call
    acc = reducer(acc, arr[i]);
  // more shared stuff
  }
  return acc;
};
const filter = (fn, arr) =>
                reduce((acc, curr) => fn(curr) ? acc.concat([curr]) : acc
                  , [], arr
);
const censor = words => filter(
  word => word.length !== 4,
  words
);
const startsWithS = words => filter(
  word => word.startsWith('s'),
  words
);

////////////////////////////////////////////

const highpass = cutoff => n => n >= cutoff;
const gt3 = highpass(3);
[1, 2, 3, 4].filter(gt3); // [3, 4];

////////////////////////////////////////////

const map = (fn, arr) => arr.reduce((acc, item, index, arr) => {
  return acc.concat(fn(item, index, arr));
}, []);

const filter = (fn, arr) => arr.reduce((newArr, item) => {
  return fn(item) ? newArr.concat([item]) : newArr;
}, []);

