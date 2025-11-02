import { memo } from "react";
import "./styles/Main.css";
import AutocompleteSearch from "./AutocompleteSearch";
import CardList from "./CardList";

const Main = memo(
  ({ searshList, onChose, recipeList, onOpen, onButton, searchElement }) => {
    const handleMainButton = () => {
      onButton();
    };
    return (
      <section className="main">
        {!recipeList && (
          <h1 className="main__text">
            Look at your kitchen and pick an ingredient
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
        <CardList
          list={recipeList}
          onOpen={onOpen}
          modifier={"position_center"}
        />
      </section>
    );
  }
);

export default Main;
