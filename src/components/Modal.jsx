import "./styles/Modal.css";

function Modal({ isActive, children }) {
  return (
    <div className={`modal ${isActive && "modal_opened"}`}>{children}</div>
  );
}

export default Modal;
