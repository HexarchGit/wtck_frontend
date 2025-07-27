import Modal from "./Modal";
import "./styles/ModalWithForm.css";
import { AppContext } from "../contexts/AppContext.js";
import { useContext, useState, useEffect } from "react";
import { useCloseModal } from "../hooks/useCloseModal.js";

export default function ModalWithForm({
  children,
  modalName,
  title,
  buttonText,
  onSubmit,
  isValid,
  alternativeButton = null,
}) {
  const { handleCloseModal } = useContext(AppContext);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(true);
  }, []);

  useCloseModal(handleCloseModal);
  return (
    <Modal isActive={isActive}>
      <div className={`modal_type_${modalName}`}>
        <button
          className="modal__button modal__button_type_close"
          type="button"
          onClick={handleCloseModal}
        />
        <form onSubmit={onSubmit} className="modal__form" name={modalName}>
          <h2 className="modal__title">{title}</h2>
          {children}
          <div className="modal__buttons">
            <button
              type="submit"
              className={`modal__button modal__button_type_submit ${
                !isValid && "modal__button_disabled"
              }`}
              disabled={!isValid}
            >
              {buttonText}
            </button>
            {alternativeButton && alternativeButton()}
          </div>
        </form>
      </div>
    </Modal>
  );
}
