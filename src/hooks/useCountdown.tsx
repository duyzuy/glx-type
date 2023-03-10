import { useEffect, useState, useRef } from "react";

type DateTime = string[];

type DateTimeValueType = {
  dateTime: DateTime;
  isTimeout: boolean;
};
let initCountdownDate = {
  dateTime: ["00", "00", "00", "00"],
  isTimeout: false,
};
const useCountdown = ({
  targetDate,
  currentDate,
}: {
  targetDate: number;
  currentDate: number;
}): DateTimeValueType => {
  const targetDateCount = new Date(targetDate + 999).getTime();
  const currentDateCount = new Date(currentDate).getTime();
  const [countDown, setCountDown] = useState(
    targetDateCount > currentDateCount ? targetDateCount - currentDateCount : 0
  );

  const [days, hours, minutes, seconds] = getReturnValues(countDown);

  const timeRef = useRef<ReturnType<typeof setTimeout>>();
  const isOldCounter = useRef(true);
  const isExpired = targetDateCount < currentDateCount;

  useEffect(() => {
    if (targetDateCount < currentDateCount) return;

    timeRef.current = setTimeout(() => {
      setCountDown(targetDateCount - currentDateCount);
    }, 1000);

    return () => clearInterval(timeRef.current);
  }, [currentDateCount]);

  switch (isOldCounter.current) {
    case true: {
      if (isExpired) {
        clearInterval(timeRef.current);
        isOldCounter.current = false;
        initCountdownDate = {
          ...initCountdownDate,
          isTimeout: false,
          dateTime: ["00", "00", "00", "00"],
        };
      } else {
        initCountdownDate = {
          ...initCountdownDate,
          isTimeout: false,
          dateTime: [days, hours, minutes, seconds],
        };
      }
      break;
    }
    case false: {
      if (isExpired) {
        clearInterval(timeRef.current);
        isOldCounter.current = true;
        initCountdownDate = {
          ...initCountdownDate,
          isTimeout: true,
          dateTime: ["00", "00", "00", "00"],
        };
      } else {
        initCountdownDate = {
          ...initCountdownDate,
          isTimeout: false,
          dateTime: [days, hours, minutes, seconds],
        };
      }
      break;
    }
  }

  return initCountdownDate;
};

const getReturnValues = (countDown: number): DateTime => {
  // calculate time left

  const days = Math.floor(countDown / (1000 * 60 * 60 * 24)).toString();
  let hours = Math.floor((countDown / (1000 * 60 * 60)) % 24).toString();
  let minutes = Math.floor((countDown / (1000 * 60)) % 60).toString();
  let seconds = Math.floor((countDown / 1000) % 60).toString();

  hours = hours.length === 1 ? "0" + hours : hours;
  minutes = minutes.length === 1 ? "0" + minutes : minutes;
  seconds = seconds.length === 1 ? "0" + seconds : seconds;

  return [days, hours, minutes, seconds];
};

export { useCountdown };
