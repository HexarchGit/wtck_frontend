import { memo, useState } from "react";
import "./styles/RecipeCard.css";

const RecipeCard = memo(({ card, handleCardClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleClick = () => {
    handleCardClick(card);
  };

  return (
    <li className="card">
      <p className="card__title">{card?.mealName}</p>
      <img
        src={`${card?.mealImage}/medium`}
        alt={card?.mealName}
        className={`card__image ${isLoaded ? "card__image_loaded" : ""}`}
        onClick={handleClick}
        onLoad={() => setIsLoaded(true)}
      />
    </li>
  );
});

export default RecipeCard;
