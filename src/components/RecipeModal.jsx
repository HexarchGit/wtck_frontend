import { useContext, useEffect, useMemo, useState } from "react";
import { useCloseModal } from "../hooks/useCloseModal.js";
import "./styles/RecipeModal.css";
import Modal from "./Modal";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function RecipeModal({ meal, onClose, onFavorite }) {
  const [isActive, setIsActive] = useState(false);
  const { userData, isLoggedIn } = useContext(CurrentUserContext);
  const [isInFavorites, setIsInFavorites] = useState(
    userData?.favorites?.some((item) => meal.idMeal === item.mealId)
  );

  useEffect(() => {
    setIsActive(true);
  }, []);

  useCloseModal(onClose);

  const handleFavorites = () => {
    onFavorite(meal, isInFavorites);
    setIsInFavorites(!isInFavorites);
  };

  return (
    <Modal isActive={isActive}>
      <div className="modal_type_card">
        <button
          type="button"
          className="modal__button modal__button_type_close"
          onClick={onClose}
        ></button>
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="modal__image"
        />
        <div className="modal__info">
          <h2 className="modal__recipe-title">{meal.strMeal}</h2>
          <div className="modal__details">
            <h3 className="modal__recipe-title">
              {meal.strCategory}, {meal.strArea}
            </h3>
            {isLoggedIn && (
              <button
                className={`modal__button modal__button_favorite ${
                  isInFavorites
                    ? "modal__button_favorite_active"
                    : "modal__button_favorite_inactive"
                }`}
                type="button"
                onClick={handleFavorites}
              />
            )}
          </div>

          <ul className="modal__list">
            {meal.ingridients.map((ingridient, index) => (
              <li key={index} className="modal__text">
                {ingridient}
              </li>
            ))}
          </ul>
        </div>
        <p className="modal__recipe">{meal.strInstructions}</p>
      </div>
    </Modal>
  );
}

export default RecipeModal;
