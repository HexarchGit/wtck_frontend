import ModalWithForm from "./ModalWithForm";
import { useFormValidation } from "../hooks/useFormValidation";
import { useSaveContext } from "../hooks/useSaveContext";
import { editProfilePopupConfig } from "../utils/constants";
import "./styles/EditProfileModal.css";
import { useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function EditProfileModal({ onSubmit }) {
  const { modalName } = editProfilePopupConfig;
  const inputsNames = {
    editUserName: "",
    editUserAvatar: "",
  };
  const validator = useFormValidation(inputsNames);
  const { values, errors, isValid, handleInputChange, setInputs } = validator;
  const { userData } = useContext(CurrentUserContext);

  useEffect(() => {
    setInputs({
      editUserName: userData.name,
      editUserAvatar: userData.avatar,
    });
  }, [userData, setInputs]);

  useSaveContext(modalName, inputsNames, validator);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <ModalWithForm
      {...editProfilePopupConfig}
      isValid={isValid}
      onSubmit={handleSubmit}
    >
      <label className="modal__label">
        Name*
        {errors?.["editUserName"] && (
          <span className="modal__error">{` (${errors["editUserName"]})`}</span>
        )}
        <input
          type="text"
          className="modal__input"
          id="editUserName"
          name="editUserName"
          value={values["editUserName"]}
          onChange={handleInputChange}
          placeholder="Name"
          minLength="2"
          maxLength="30"
          required
        />
      </label>
      <label className="modal__label">
        Avatar URL*
        {errors?.["editUserAvatar"] && (
          <span className="modal__error">{` (${errors["editUserAvatar"]})`}</span>
        )}
        <input
          type="url"
          className="modal__input"
          id="editUserAvatar"
          name="editUserAvatar"
          value={values["editUserAvatar"]}
          onChange={handleInputChange}
          placeholder="Avatar URL"
          required
        />
      </label>
    </ModalWithForm>
  );
}
