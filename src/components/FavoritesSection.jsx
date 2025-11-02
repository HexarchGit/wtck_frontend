import "./styles/FavoritesSection.css";
import CardList from "./CardList";

const FavoritesSection = ({ onOpen, favorites }) => {
  return (
    <section className="favorites">
      <div className="favorites__header">
        <p className="favorites__text">Your favorites meals</p>
      </div>
      <CardList list={favorites} onOpen={onOpen} />
    </section>
  );
};

export default FavoritesSection;
