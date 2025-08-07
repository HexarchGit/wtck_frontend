import { memo } from "react";
import "./styles/Main.css";
import AutocompleteSearch from "./AutocompleteSearch";
import RecipeCard from "./RecipeCard";

const Main = memo(
  ({ searshList, onChose, recipeList, onOpen, onButton, searchElement }) => {
    const handleOpenModal = (card) => {
      onOpen(card);
    };
    const handleMainButton = () => {
      onButton();
    };
    return (
      <section className="main">
        {!recipeList && (
          <h1 className="main__text">
            Look at your kitchen and pick an ingridient
          </h1>
        )}
        <div className="main__searcharea">
          <AutocompleteSearch
            searshList={searshList}
            onChose={onChose}
            searchElement={searchElement}
          />
          <button
            className={`main__button ${
              recipeList
                ? "main__button__type_forget"
                : "main__button__type_random"
            }`}
            type="button"
            onClick={handleMainButton}
          >
            {recipeList ? "Forget" : "Random meal"}
          </button>
        </div>

        {recipeList && <h1 className="main__text">You can cook:</h1>}
        <ul className="main__list">
          {recipeList?.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              card={recipe}
              handleCardClick={handleOpenModal}
            />
          ))}
        </ul>
      </section>
    );
  }
);

export default Main;
