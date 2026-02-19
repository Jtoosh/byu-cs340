// 1. What is the biggest design principle violation in the code below.
/*
Code duplication. The same verbose task is done 3 times with minimal changes. This can and should be avoided.
 */
// 2. Refactor the code to improve its design.

type Dictionary = {
  [index: string]: string;
};

type Times = {
  interval: number;
  duration: number;
  departure: number;
};

function getValue(key: string, props: Dictionary, interval = 0) {
  let valueString: string;
  let value: number;
  valueString = props[key];
  if (!valueString) {
    throw new Error(`missing ${key}`);
  }
  value = parseInt(valueString);
  if (value <= 0) {
    throw new Error(`${key} must be > 0`);
  }
  if (key === "duration" || key === "departure") {
    if (value % interval != 0) {
      throw new Error(`${key} % interval != 0`);
    }
  }
  return value;
}

function getTimes(props: Dictionary): Times {
  let interval = getValue("interval", props);

  let duration = getValue("duration", props, interval);

  let departure = getValue("departure", props, interval);

  return { interval, duration, departure };
}
