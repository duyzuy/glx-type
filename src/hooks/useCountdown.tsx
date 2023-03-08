import { useEffect, useState, useRef } from "react";

type DateTimeValueType = string[];

const useCountdown = (targetDate = new Date().getTime()) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );
  const [days, hours, minutes, seconds] = getReturnValues(countDown);

  const timeRef = useRef<ReturnType<typeof setInterval>>();
  const isExpired =
    parseFloat(days) +
      parseFloat(hours) +
      parseFloat(minutes) +
      parseFloat(seconds) <=
    0;

  useEffect(() => {
    timeRef.current = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => {
      clearInterval(timeRef.current);
    };
  }, [countDownDate]);

  if (isExpired) {
    clearInterval(timeRef.current);
    return ["00", "00", "00", "00"];
  }
  return [days, hours, minutes, seconds];
};

const getReturnValues = (countDown: number): DateTimeValueType => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24)).toString();
  let hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  ).toString();
  let minutes = Math.floor(
    (countDown % (1000 * 60 * 60)) / (1000 * 60)
  ).toString();
  let seconds = Math.floor((countDown % (1000 * 60)) / 1000).toString();

  hours = hours.length === 1 ? "0" + hours : hours;
  minutes = minutes.length === 1 ? "0" + minutes : minutes;
  seconds = seconds.length === 1 ? "0" + seconds : seconds;

  return [days, hours, minutes, seconds];
};

export { useCountdown };
