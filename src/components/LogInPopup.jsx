import InfoPopup from "./InfoPopup";

const LoginPopup = ({ infoText, onClose, onConfirm }) => {
  const handleSignIn = () => {
    onConfirm();
    onClose();
  };
  return (
    <InfoPopup infoText={infoText} onClose={onClose}>
      <button
        className="info__button info__button_type_login"
        onClick={handleSignIn}
      >
        Log in?
      </button>
    </InfoPopup>
  );
};

export default LoginPopup;
