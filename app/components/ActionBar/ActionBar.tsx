import Button from "../Button/Button";
import { FaPause, FaVolumeXmark, FaVolumeHigh, FaVolumeLow, FaArrowsSpin, FaClock, FaPlay } from "react-icons/fa6";
import { RiGogglesLine } from "react-icons/ri";
import "./ActionBar.scss";
import { useState } from "react";
import ButtonSelector, { type ButtonSelectorOption, type ButtonSelectorProps } from "../ButtonSelector/ButtonSelector";

export type ActionBarProps = {
  primaryActions?: React.ReactNode;
}

export default function ActionBar({ primaryActions }: ActionBarProps) {

  return (
    <div className="action-bar">
      <div className="secondary-actions">
        <ButtonSelector
          key="audio"
          options={[
            { value: "audio_on", label: "Audio", presented: "All audio on", icon: <FaVolumeHigh /> },
            { value: "audio_only_lap", label: "Audio", presented: "Only lap times", icon: <FaVolumeLow /> },
            { value: "audio_off", label: "Audio", presented: "All audio off", icon: <FaVolumeXmark /> }]} 
          selectedOptionIndex={0}
          onOptionChange={(option) => console.log(option)} 
        />
        <ButtonSelector
          key="mode"
          options={[
            { value: "time_trial", label: "Time Trial", presented: "Time trial", icon: <FaClock /> },
            { value: "race", label: "Race", presented: "Race", icon: <FaArrowsSpin  /> }]} 
          selectedOptionIndex={0}
          onOptionChange={(option) => console.log(option)} 
        />
        <ButtonSelector
          key="pilot"
          options={[
            { value: "pilot", label: "Pilot", presented: "Default pilot", icon: <RiGogglesLine /> },
            { value: "exium", label: "exium", presented: "exium", icon: <RiGogglesLine /> },
            { value: "ocales", label: "ocales", presented: "ocales", icon: <RiGogglesLine /> }]} 
          selectedOptionIndex={0}
          onOptionChange={(option) => console.log(option)} 
        />
      </div>
      <div className="primary-actions">{primaryActions}</div>
    </div>
  );
}