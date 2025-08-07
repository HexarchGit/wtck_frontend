import ModalWithForm from "./ModalWithForm";
import { useFormValidation } from "../hooks/useFormValidation";
import { useSaveContext } from "../hooks/useSaveContext";
import "./styles/SigninFormModal.css";
import { useContext } from "react";
import { AppContext } from "../contexts/AppContext.js";
import { signInPopupConfig, signUpPopupConfig } from "../utils/constants.js";

export default function SigninFormModal({ onSubmit }) {
  const { handleOpenModal } = useContext(AppContext);
  const { modalName } = signInPopupConfig;
  const inputsNames = {
    signinUserEmail: "",
    signinUserPassword: "",
  };
  const validator = useFormValidation(inputsNames);
  const { values, errors, isValid, handleInputChange, setInputs } = validator;

  useSaveContext(modalName, inputsNames, validator);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
    setInputs(inputsNames);
  };

  const handleSignUp = () => {
    handleOpenModal(signUpPopupConfig);
  };

  const alternativeButton = () => {
    return (
      <button
        type="button"
        className="modal__button modal__button_type_alternative"
        onClick={handleSignUp}
      >
        or Sign Up
      </button>
    );
  };

  return (
    <ModalWithForm
      {...signInPopupConfig}
      isValid={isValid}
      onSubmit={handleSubmit}
      alternativeButton={alternativeButton}
    >
      <label className="modal__label">
        Email
        {errors?.["signinUserEmail"] && (
          <span className="modal__error">{` (${errors["signinUserEmail"]})`}</span>
        )}
        <input
          type="email"
          className="modal__input"
          id="signinUserEmail"
          name="signinUserEmail"
          value={values["signinUserEmail"]}
          onChange={handleInputChange}
          placeholder="Email"
          minLength="2"
          maxLength="30"
          required
        />
      </label>
      <label className="modal__label">
        Password
        {errors?.["signinUserPassword"] && (
          <span className="modal__error">{` (${errors["signinUserPassword"]})`}</span>
        )}
        <input
          type="password"
          className="modal__input"
          id="signinUserPassword"
          name="signinUserPassword"
          value={values["signinUserPassword"]}
          onChange={handleInputChange}
          placeholder="Password"
        />
      </label>
    </ModalWithForm>
  );
}
