import { memo } from "react";
import "./styles/RecipeCard.css";
import Preloader from "./Preloader";

const RecipeCard = memo(({ card, handleCardClick }) => {
  const handleClick = () => {
    handleCardClick(card);
  };

  return (
    <li className="card">
      <p className="card__title">{card?.strMeal}</p>
      <img
        src={`${card?.strMealThumb}/medium`}
        alt={card?.strMeal}
        className="card__image"
        onClick={handleClick}
      />
    </li>
  );
});

export default RecipeCard;
