import { useContext, useState } from "react";
import { useCloseModal } from "../hooks/useCloseModal.js";
import "./styles/RecipeModal.css";
import Modal from "./Modal";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function RecipeModal({ meal, onClose, onFavorite }) {
  const { isLoggedIn } = useContext(CurrentUserContext);
  const [isInFavorites, setIsInFavorites] = useState(meal?.isFavorite);
  const [isButtonActive, setIsButtonActive] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useCloseModal(onClose);

  const handleFavorites = async () => {
    setIsButtonActive(false);
    try {
      if (await onFavorite(meal, isInFavorites)) {
        setIsInFavorites(!isInFavorites);
      }
    } finally {
      setIsButtonActive(true);
    }
  };

  return (
    <Modal isActive={true}>
      <div className="modal_type_card">
        <button
          type="button"
          className="modal__button modal__button_type_close"
          onClick={onClose}
        ></button>
        <img
          src={meal.mealImage}
          alt={meal.mealName}
          className={`modal__image ${isLoaded ? "modal__image_loaded" : ""}`}
          onLoad={() => setIsLoaded(true)}
        />
        <div className="modal__info">
          <h2 className="modal__recipe-title">{meal.mealName}</h2>
          <div className="modal__details">
            <h3 className="modal__recipe-title">
              {meal.mealCategory}, {meal.mealArea}
            </h3>
            {isLoggedIn && (
              <button
                className={`modal__button modal__button_favorite ${
                  isInFavorites
                    ? "modal__button_favorite_true"
                    : "modal__button_favorite_false"
                }`}
                type="button"
                onClick={handleFavorites}
                disabled={!isButtonActive}
              />
            )}
          </div>

          <ul className="modal__list">
            {meal.mealingredients.map((ingredient, index) => (
              <li key={index} className="modal__text">
                {`${ingredient.name} ${ingredient.measure}`}
              </li>
            ))}
          </ul>
        </div>
        <p className="modal__recipe">{meal.mealInstructions}</p>
      </div>
    </Modal>
  );
}

export default RecipeModal;
