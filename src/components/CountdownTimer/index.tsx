import { memo } from "react";
import { useCountdown } from "../../hooks/useCountdown";
import DateTimeDisplay from "./DateTimeDisplay";
import "./style.scss";
type PropsType = {
  children?: JSX.Element;
  targetDate?: any;
  onExpire?: () => void;
};
const CountdownTimer: React.FC<PropsType> = ({ targetDate, onExpire }) => {
  const currentDate = new Date().getTime();

  const {
    dateTime: [days, hours, minutes, seconds],
    isTimeout,
  } = useCountdown({
    targetDate,
    currentDate,
  });

  if (isTimeout) {
    if (onExpire && typeof onExpire === "function") {
      onExpire();
    }
  }
  return (
    <>
      <p className="time-title">Thời gian còn lại</p>
      <div className="show-counter">
        <DateTimeDisplay value={hours} isDanger={false} type="giờ" />
        <p className="space">:</p>
        <DateTimeDisplay value={minutes} isDanger={false} type="phút" />
        <p className="space">:</p>
        <DateTimeDisplay
          value={seconds}
          isDanger={parseFloat(days) < 10}
          type="giây"
        />
      </div>
    </>
  );
};

export default memo(CountdownTimer);
