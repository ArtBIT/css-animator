import { useState } from "react";

export function useFormFields(initialState) {
  const [values, setValues] = useState(initialState);
  const [state, setState] = useState({ isDirty: false });

  return {
    state,
    values,
    setValue: (name, value) => {
      setState({ ...state, isDirty: true });
      setValues({
        ...values,
        [name]: value,
      });
    },
  };
}

export default useFormFields;
