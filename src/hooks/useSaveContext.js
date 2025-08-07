import { useContext, useEffect, useRef } from "react";
import { FormContext } from "../contexts/FormContext";

export function useSaveContext(
  modalName,
  { values, errors, isValid, setInputs }
) {
  const { formContext, setFormContext } = useContext(FormContext);
  const currentRefs = useRef(values, errors, isValid);
  const initialized = useRef(false);

  useEffect(() => {
    currentRefs.current = { values, errors, isValid };
  }, [values, errors, isValid]);

  useEffect(() => {
    if (!initialized.current) {
      const modalContext = formContext?.[modalName];
      if (modalContext) {
        setInputs(
          modalContext.values || {},
          modalContext.errors || {},
          modalContext.valid
        );
      }
      initialized.current = true;
    }
  }, [modalName, formContext, setInputs]);

  useEffect(() => {
    return () => {
      const { values, errors, isValid } = currentRefs.current;
      setFormContext((prev) => ({
        ...prev,
        [modalName]: {
          values: values,
          errors: errors,
          valid: isValid,
        },
      }));
    };
  }, [setFormContext, modalName]);
}
