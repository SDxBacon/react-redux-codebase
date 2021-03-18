import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { selectVisibility } from "redux/selectors/visibility";
import Title from "components/Title";
import { Wrapper } from "./Styled";

const DAY_FORMAT = "YYYY-MM-DD hh:mm:ss";

const VisibilityLog = () => {
  const visibility = useSelector(selectVisibility);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const t = dayjs().format(DAY_FORMAT);
    setLogs((prev) => [...prev, { t: t, v: visibility }]);
  }, [visibility]);

  return (
    <Wrapper>
      <Title>Redux-Saga: VisibilityWatcher</Title>

      <div className="content">
        {logs.map(({ t, v }, i) => (
          <li key={i}>
            [{t}] visibility change to: {v}
          </li>
        ))}
      </div>
    </Wrapper>
  );
};

export default VisibilityLog;
