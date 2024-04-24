import { useState } from "react";

export function useEditCheckboxInput(options, initialValues = []) {
  const [checkedValues, setCheckedValues] = useState(initialValues);

  function handleChange(e) {
    const value = e.target.value;
    setCheckedValues((current) =>
      e.target.checked
        ? [...current, value]
        : current.filter((v) => v !== value)
    );
  }

  function getSortedCheckedValues() {
    return options.filter((option) => checkedValues.includes(option));
  }

  return {
    checkedValues,
    setCheckedValues,
    onChange: handleChange,
    getSortedCheckedValues,
  };
}
