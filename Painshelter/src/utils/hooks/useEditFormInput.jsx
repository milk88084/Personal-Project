import { useState } from "react";
export function useEditFormInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return {
    value,
    setValue,
    onChange: handleChange,
  };
}
