import { Normalize } from "styled-normalize";
import VisibilityLog from "containers/VisibilityLog";
import WindowOrientation from "containers/WindowOrientation";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <Normalize />

      <h1>My React Redux Codebase</h1>
      <VisibilityLog />
      <WindowOrientation />
    </div>
  );
}
