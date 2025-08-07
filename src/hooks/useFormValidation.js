import { useState, useCallback } from "react";

export function useFormValidation(fields) {
  const [values, setValues] = useState(fields);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (event) => {
    const { name, value, validity, validationMessage } = event.target;
    setValues((values) => ({ ...values, [name]: value }));
    setErrors((errors) => ({
      ...errors,
      [name]: !validity.valid ? validationMessage : "",
    }));
    const isFormValid = event.target.closest("form").checkValidity();
    setIsValid(isFormValid);
  };

  const setInputs = useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    []
  );

  return {
    values,
    errors,
    isValid,
    handleInputChange,
    setInputs,
  };
}
