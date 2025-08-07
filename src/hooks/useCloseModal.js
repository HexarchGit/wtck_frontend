import { useEffect } from "react";

export function useCloseModal(onClose) {
  useEffect(() => {
    const handleEscClose = (event) => {
      if (event.key === "Escape") onClose();
    };
    const handleMouseClose = (event) => {
      if (event.target.classList.contains("modal")) onClose();
    };
    document.addEventListener("keydown", handleEscClose);
    document.addEventListener("mousedown", handleMouseClose);
    return () => {
      document.removeEventListener("mousedown", handleMouseClose);
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [onClose]);
}
