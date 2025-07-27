import { useState, useCallback, useRef } from "react";

export function useFormValidation(fields) {
  const [values, setValues] = useState(fields);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const refValues = useRef(fields);
  const refErrors = useRef({});
  const refIsValid = useRef(false);

  const handleInputChange = (event) => {
    const { name, value, validity, validationMessage } = event.target;
    setValues((values) => {
      const change = { ...values, [name]: value };
      refValues.current = change;
      return change;
    });

    setErrors((errors) => {
      const change = {
        ...errors,
        [name]: !validity.valid ? validationMessage : "",
      };
      refErrors.current = change;
      return change;
    });

    const isFormValid = event.target.closest("form").checkValidity();
    setIsValid(isFormValid);
    refIsValid.current = isFormValid;
  };

  const setInputs = useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
      refValues.current = newValues;
      refErrors.current = newErrors;
      refIsValid.current = newIsValid;
    },
    []
  );

  return {
    values,
    errors,
    isValid,
    refValues,
    refErrors,
    refIsValid,
    handleInputChange,
    setInputs,
  };
}
