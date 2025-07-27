import "./styles/FavoritesSection.css";
import RecipeCard from "./RecipeCard.jsx";
import { useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

const FavoritesSection = ({ onOpen }) => {
  const { userData } = useContext(CurrentUserContext);
  const parseFavorites = (data) => {
    return {
      strMeal: data.mealName,
      idMeal: data.mealId,
      strMealThumb: data.imageUrl,
    };
  };

  return (
    <section className="favorites">
      <div className="favorites__header">
        <p className="favorites__text">Your favorites meals</p>
      </div>
      <ul className="favorites__list">
        {userData?.favorites.map((card) => {
          return (
            <RecipeCard
              key={card.mealId}
              card={parseFavorites(card)}
              handleCardClick={onOpen}
            />
          );
        })}
      </ul>
    </section>
  );
};

export default FavoritesSection;
