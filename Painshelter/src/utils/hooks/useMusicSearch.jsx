import { useState, useEffect } from "react";
import { useLyric } from "../zustand";

export function useMusicSearch(initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const setSearchTerm = useLyric((state) => state.setSearchTerm);

  useEffect(() => {
    setSearchTerm(value);
  }, [value, setSearchTerm]);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value,
    onChange: handleChange,
  };

  return inputProps;
}
