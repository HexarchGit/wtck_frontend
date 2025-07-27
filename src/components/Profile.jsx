import "./styles/Profile.css";
import SideBar from "./SideBar";
import FavoriteSection from "./FavoritesSection";
import { memo } from "react";

const Profile = memo(({ onLogOut, onOpen }) => {
  return (
    <section className="profile">
      <SideBar onLogOut={onLogOut} />
      <FavoriteSection onOpen={onOpen} />
    </section>
  );
});

export default Profile;
