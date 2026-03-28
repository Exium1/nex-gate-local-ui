import "./ButtonSelector.scss";
import { useState } from "react";

type option = {
    value: string, // Must be unique
    label: string,
    presented?: string,
    icon?: React.ReactNode,
}

export type ButtonSelectorProps = {
  options: option[],
  selectedOptionIndex: number,
  onOptionChange: (option: string) => void,
}

export default function ButtonSelector({ options, selectedOptionIndex, onOptionChange }: ButtonSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<option>(options[selectedOptionIndex]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = options.find((o) => o.value === event.target.value);
    setSelectedOption(option || options[selectedOptionIndex]);
  };

  return (
    <div className="button-selector">
      <span>
        {selectedOption?.icon}
        {selectedOption?.label}
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
