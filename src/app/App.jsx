import { Experience } from "../features/experience/Experience.jsx";
import { ReleaseGate } from "../features/release-gate/ReleaseGate.jsx";

export default function App() {
  return <ReleaseGate><Experience /></ReleaseGate>;
}