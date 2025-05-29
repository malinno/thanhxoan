import moment from 'moment';
import 'react-native-get-random-values';
import {v4} from 'uuid';

export enum TOPIC_NAME {
  MILLISECOND = 'MILLISECOND',
  SECOND = 'SECOND',
}

const topics: {
  [key: string]: {
    [key: string]: Function | null;
  };
} = {};

let intervalMilliSecondId: ReturnType<typeof setInterval> | null = null;
let intervalId: ReturnType<typeof setInterval> | null = null;
let currentTime = moment().valueOf();

const startMilliSecondTimer = () => {
  console.log(`start app millisecond timer`);
  intervalMilliSecondId = setInterval(() => {
    publish(TOPIC_NAME.MILLISECOND, currentTime);
    currentTime++;
  }, 130);
};

const startTimer = () => {
  console.log(`start app sec timer`);
  intervalId = setInterval(() => {
    publish(TOPIC_NAME.SECOND, currentTime);
    currentTime++;
  }, 1000);
};

export const subscribe = (topicName: TOPIC_NAME, fn: (args: any) => void) => {
  const id = v4();
  topics[topicName] = {
    ...topics[topicName],
    [id]: fn,
  };

  if (Object.keys(topics[topicName]).length !== 0) {
    switch (topicName) {
      case TOPIC_NAME.MILLISECOND: {
        if (!intervalMilliSecondId) startMilliSecondTimer();
        break;
      }
      case TOPIC_NAME.SECOND:
      default: {
        if (!intervalId) startTimer();
        break;
      }
    }
  }

  return () => {
    topics[topicName][id] = null;
    delete topics[topicName][id];
    if (Object.keys(topics[topicName]).length === 0) {
      switch (topicName) {
        case TOPIC_NAME.MILLISECOND: {
          if (intervalMilliSecondId) {
            console.log(`clear app milisecs timer`);
            clearInterval(intervalMilliSecondId);
            intervalMilliSecondId = null;
          }
          break;
        }
        case TOPIC_NAME.SECOND:
        default: {
          if (intervalId) {
            console.log(`clear app sec timer`);
            clearInterval(intervalId);
            intervalId = null;
          }
          break;
        }
      }
    }
  };
};

export const publish = (topicName: TOPIC_NAME, args: any) => {
  if (!topics || !topics[topicName]) return;
  Object.values(topics[topicName]).forEach(fn => {
    if (fn) fn(args);
  });
};

export default {
  publish,
  subscribe,
};
