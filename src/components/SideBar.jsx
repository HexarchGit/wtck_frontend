import "./styles/SideBar.css";
import { editProfilePopupConfig } from "../utils/constants";
import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function SideBar({ onLogOut }) {
  const { userData } = useContext(CurrentUserContext);
  const { handleOpenModal } = useContext(AppContext);
  const handleEditProfile = () => {
    handleOpenModal(editProfilePopupConfig);
  };
  const handleLogOut = () => {
    onLogOut();
  };
  return (
    <aside className="sidebar">
      <div className="sidebar__userbar">
        {userData.avatar ? (
          <img
            className="sidebar__avatar sidebar__avatar_image"
            src={userData.avatar}
            alt="Avatar"
          />
        ) : (
          <div className="sidebar__avatar sidebar__avatar_default">
            {userData.name?.[0]?.toUpperCase()}
          </div>
        )}

        <p className="sidebar__name">{userData.name}</p>
      </div>
      <button
        className="sidebar__button sidebar__button_type_edit"
        onClick={handleEditProfile}
      >
        Change profile data
      </button>
      <button
        className="sidebar__button sidebar__button_type_logout"
        onClick={handleLogOut}
      >
        Log out
      </button>
    </aside>
  );
}
