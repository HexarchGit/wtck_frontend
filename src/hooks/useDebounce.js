import { useState, useEffect } from "react";

export const useDebounce = (value) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), 300);
    return () => clearTimeout(handler);
  }, [value]);
  return debounced;
};
