import { useState } from "react";

export function useCheckboxInput(options: string[]) {
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setCheckedValues((array) =>
      e.target.checked
        ? [...array, value]
        : array.filter((item) => item !== value)
    );
  }

  function getSortedCheckedValues() {
    return options.filter((option) => checkedValues.includes(option));
  }

  return { checkedValues, onChange: handleChange, getSortedCheckedValues };
}
