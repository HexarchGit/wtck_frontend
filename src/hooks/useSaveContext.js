import { useContext, useEffect } from "react";
import { FormContext } from "../contexts/FormContext";

export function useSaveContext(
  modalName,
  inputsNames,
  { refValues, refErrors, refIsValid, setInputs }
) {
  const { formContext, setFormContext } = useContext(FormContext);
  useEffect(() => {
    const inputs = {};
    const errors = {};
    const currentValues = refValues.current;
    const currentErrors = refErrors.current;
    const currentIsValid = refIsValid.current;
    if (formContext?.[modalName]) {
      for (const inputName in inputsNames) {
        inputs[inputName] = formContext[modalName]?.values[inputName] || "";
        errors[inputName] = formContext[modalName]?.errors[inputName] || "";
      }
      setInputs(inputs, errors, formContext[modalName]?.valid);
    }
    return () => {
      setFormContext({
        [modalName]: {
          values: currentValues,
          errors: currentErrors,
          valid: currentIsValid,
        },
      });
    };
  }, [
    refValues,
    refErrors,
    refIsValid,
    formContext,
    modalName,
    inputsNames,
    setInputs,
    setFormContext,
  ]);
}
