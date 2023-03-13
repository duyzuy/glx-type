import { useEffect, useState, useRef } from "react";

type DateTime = string[];

type DateTimeValueType = {
  dateTime: DateTime;
  isTimeout: boolean;
};

const useCountdown = ({
  targetDate,
  currentDate,
}: {
  targetDate: number;
  currentDate: number;
}): DateTimeValueType => {
  const targetDateCount = new Date(targetDate).getTime();
  const currentDateCount = new Date(currentDate).getTime();
  const [countDown, setCountDown] = useState(
    targetDateCount > currentDateCount ? targetDateCount - currentDateCount : 0
  );
  const [days, hours, minutes, seconds] = getReturnValues(countDown);
  let initCountdownDate = {
    isTimeout: false,
    dateTime: [days, hours, minutes, seconds],
  };
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isCounterStart = useRef(false);
  const isExpired = targetDateCount < currentDateCount;

  useEffect(() => {
    if (targetDateCount < currentDateCount) return;
    isCounterStart.current = true;
    timeoutRef.current = setTimeout(() => {
      setCountDown(targetDateCount - currentDateCount);
    }, 1000);

    return () => clearTimeout(timeoutRef.current);
  }, [currentDateCount]);

  switch (isCounterStart.current) {
    case true: {
      if (isExpired) {
        clearTimeout(timeoutRef.current);
        isCounterStart.current = false;
        initCountdownDate = {
          ...initCountdownDate,
          isTimeout: true,
        };
      } else {
        initCountdownDate = {
          ...initCountdownDate,
          isTimeout: false,
        };
      }
      break;
    }
    case false: {
      if (isExpired) {
        clearTimeout(timeoutRef.current);
        isCounterStart.current = false;
        initCountdownDate = {
          ...initCountdownDate,
          isTimeout: false,
        };
      } else {
        initCountdownDate = {
          ...initCountdownDate,
          isTimeout: false,
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
