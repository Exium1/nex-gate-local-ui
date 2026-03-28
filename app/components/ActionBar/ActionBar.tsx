import Button from "../Button/Button";
import { FaPause, FaVolumeXmark, FaVolumeHigh, FaVolumeLow, FaArrowsSpin, FaClock } from "react-icons/fa6";
import { RiGogglesLine } from "react-icons/ri";
import "./ActionBar.scss";
import { useState } from "react";
import ButtonSelector from "../ButtonSelector/ButtonSelector";

export default function ActionBar() {
  return (
    <div className="action-bar">
      <div className="secondary-actions">
        <ButtonSelector
          options={[
            { value: "audio_on", label: "Audio", presented: "All audio on", icon: <FaVolumeHigh /> },
            { value: "audio_only_lap", label: "Audio", presented: "Only lap times", icon: <FaVolumeLow /> },
            { value: "audio_off", label: "Audio", presented: "All audio off", icon: <FaVolumeXmark /> }]} 
          selectedOptionIndex={0}
          onOptionChange={(option) => console.log(option)} 
        />
        <ButtonSelector
          options={[
            { value: "time_trial", label: "Time Trial", presented: "Time trial", icon: <FaClock /> },
            { value: "race", label: "Race", presented: "Race", icon: <FaArrowsSpin  /> }]} 
          selectedOptionIndex={0}
          onOptionChange={(option) => console.log(option)} 
        />
        <ButtonSelector
          options={[
            { value: "pilot", label: "Pilot", presented: "Default pilot", icon: <RiGogglesLine /> },
            { value: "exium", label: "exium", presented: "exium", icon: <RiGogglesLine /> },
            { value: "ocales", label: "ocales", presented: "ocales", icon: <RiGogglesLine /> }]} 
          selectedOptionIndex={0}
          onOptionChange={(option) => console.log(option)} 
        />
      </div>
      <div className="primary-actions">
        <Button variant="solid" color="danger" size="md">End</Button>
        <Button variant="plain" color="neutral" size="md"><FaPause />Pause</Button>
      </div>
    </div>
  );
}