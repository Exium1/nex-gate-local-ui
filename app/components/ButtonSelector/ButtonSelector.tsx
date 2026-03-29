import "./ButtonSelector.scss";
import { useState } from "react";

export type ButtonSelectorOption = {
  value: string, // Must be unique
  label: string,
  presented?: string,
  icon?: React.ReactNode,
}

export type ButtonSelectorProps = {
  key?: string;
  options: ButtonSelectorOption[],
  selectedOptionIndex: number,
  onOptionChange?: (option: ButtonSelectorOption) => void,
  iconPosition?: "left" | "right",
  className?: string;
}

export default function ButtonSelector({ options, selectedOptionIndex, onOptionChange, iconPosition = "left", className = "" }: ButtonSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<ButtonSelectorOption>(options[selectedOptionIndex] || options[0]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = options.find((o) => o.value === event.target.value);
    setSelectedOption(option || options[0]);
    if (option && onOptionChange) {
      onOptionChange(option);
    }
  };

  return (
    <div className={`button-selector ${className}`}>
      <span>
        {iconPosition === "left" && selectedOption?.icon}
        {selectedOption?.label}
        {iconPosition === "right" && selectedOption?.icon}
      </span>
      <select value={selectedOption?.value} onChange={handleOptionChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.presented}
          </option>
        ))}
      </select>
    </div>
  )
}
