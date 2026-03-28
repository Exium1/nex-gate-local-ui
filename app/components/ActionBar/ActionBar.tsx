import Button from "../Button/Button"
import { FaPause } from "react-icons/fa6";
import "./ActionBar.scss";

export default function ActionBar() {
  return (
    <div className="action-bar">
      <div className="secondary-actions">
        <Button variant="solid" color="neutral" size="md">End</Button>
        <Button variant="solid" color="neutral" size="md">End</Button>
        <Button variant="solid" color="neutral" size="md">End</Button>
      </div>
      <div className="primary-actions">
        <Button variant="solid" color="danger" size="md">End</Button>
        <Button variant="plain" color="neutral" size="md"><FaPause/>Pause</Button>
      </div>
    </div>
  )
}