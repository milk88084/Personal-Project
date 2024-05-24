import { useState } from "react";

export function useCheckboxInput(options) {
  const [checkedValues, setCheckedValues] = useState([]);
  function handleChange(e) {
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
