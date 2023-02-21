import { Action, StateInit } from "../models";
export const logger = (reducer: Function) => {
  return (state: StateInit, action: Action) => {
    console.group("Action: " + action.type);
    console.group("Current state");
    console.info(state);
    console.groupEnd();
    const newState = reducer(state, action);
    console.group("Next state");
    console.info(newState);
    console.groupEnd();
    console.groupEnd();
    return newState;
  };
};
