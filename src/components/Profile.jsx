import "./styles/Profile.css";
import SideBar from "./SideBar";
import FavoriteSection from "./FavoritesSection";

const Profile = ({ onLogOut, onOpen, favorites }) => {
  return (
    <section className="profile">
      <SideBar onLogOut={onLogOut} />
      <FavoriteSection onOpen={onOpen} favorites={favorites} />
    </section>
  );
};

export default Profile;
