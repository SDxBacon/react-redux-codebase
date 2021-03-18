import { useSelector } from "react-redux";
import { selectWindowOrientation } from "redux/selectors/windowOrientation";
import Title from "components/Title";

const WindowOrientatino = () => {
  const windowOrientation = useSelector(selectWindowOrientation);

  return (
    <div>
      <Title>Redux-Saga: WindowOrientationWatcher</Title>
      <p>current orientation: {windowOrientation}</p>
    </div>
  );
};

export default WindowOrientatino;
