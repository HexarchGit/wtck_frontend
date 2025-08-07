export function useFormContextCleaner(setFormContext) {
  return function cleanFormContext(formName) {
    setFormContext((oldContext) => {
      const { [formName]: _, ...rest } = oldContext;
      return rest;
    });
  };
}
