import { useState } from "react";

export const usePasswordToggle = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const inputType = isVisible ? "text" : "password";

  return { isVisible, toggleVisibility, inputType };
};
