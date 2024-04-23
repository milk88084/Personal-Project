import { useState } from "react";

export function useFormInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value,
    setValue,
    onChange: handleChange,
  };

  return inputProps;
}
