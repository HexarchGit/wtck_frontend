import "./styles/InfoPopup.css";

const InfoPopup = ({ infoText, children, onClose }) => {
  return (
    <section className="info">
      <p className="info__text">{infoText}</p>
      {children}
      <button
        className="info__button info__button_type_close"
        onClick={onClose}
      />
    </section>
  );
};

export default InfoPopup;
