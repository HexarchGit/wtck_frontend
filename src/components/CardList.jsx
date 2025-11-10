import "./styles/CardList.css";
import RecipeCard from "./RecipeCard";

const CardList = ({ list, onOpen, modifier }) => {
  const handleOpenModal = (card) => {
    onOpen(card);
  };
  return (
    <ul className={`card__list ${modifier ? `card__list_${modifier}` : ""}`}>
      {list?.map((data) => (
        <RecipeCard
          key={data.mealId}
          card={data}
          handleCardClick={handleOpenModal}
        />
      ))}
    </ul>
  );
};

export default CardList;
