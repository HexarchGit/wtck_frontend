import "./styles/Profile.css";
import SideBar from "./SideBar";
import FavoriteSection from "./FavoritesSection";

const Profile = ({ onLogOut, onOpen }) => {
  return (
    <section className="profile">
      <SideBar onLogOut={onLogOut} />
      <FavoriteSection onOpen={onOpen} />
    </section>
  );
};

export default Profile;
