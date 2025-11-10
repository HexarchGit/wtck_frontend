import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Header.css";
import logo from "../assets/logo.svg";
import { SIGNINPOPUP, SIGNUPPOPUP } from "../utils/constants.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { AppContext } from "../contexts/AppContext.js";
import Preloader from "./Preloader.jsx";

export default function Header({ onLogOut }) {
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);
  const { userData, isAuthChecked } = useContext(CurrentUserContext);
  const { handleOpenModal } = useContext(AppContext);

  const handleLogOut = () => {
    onLogOut();
  };

  function Userbar({ name = "", link = "" }) {
    return (
      <div className="header__userbar">
        <Link to="/profile" className="header__link">
          {name}
        </Link>
        {link ? (
          <img
            className="header__avatar header__avatar_image"
            src={link}
            alt="Avatar"
          />
        ) : (
          <div className="header__avatar header__avatar_default">
            {name?.[0]?.toUpperCase()}
          </div>
        )}
        <button className="header__button" onClick={handleLogOut}>
          Log out
        </button>
      </div>
    );
  }

  function GuestEntry() {
    return (
      <div className="header__guest">
        <button className="header__button" type="button" onClick={handleSignUp}>
          Sign up
        </button>
        <button className="header__button" type="button" onClick={handleSignIn}>
          Log in
        </button>
      </div>
    );
  }

  function About() {
    return (
      <Link to="/about" className="header__link">
        About the project
      </Link>
    );
  }

  const handleSignUp = () => {
    handleOpenModal(SIGNUPPOPUP);
  };

  const handleSignIn = () => {
    handleOpenModal(SIGNINPOPUP);
  };

  const mobileMenuHandler = () => {
    setIsMobileMenuOpened(!isMobileMenuOpened);
  };
  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="Logo" className="header__logo" />
      </Link>
      <nav className="header__nav">
        {userData ? (
          <Userbar name={userData.name} link={userData.avatar} />
        ) : isAuthChecked ? (
          GuestEntry()
        ) : (
          <Preloader />
        )}
        <About />
      </nav>
      <button
        type="button"
        className="header__button header__button_type_hamburger"
        onClick={mobileMenuHandler}
      />
      {isMobileMenuOpened && (
        <div className="header__mobile">
          <button
            type="button"
            className="header__button header__button_type_close"
            onClick={mobileMenuHandler}
          />
          {userData ? (
            <>
              <Userbar name={userData.name} link={userData.avatar} />
              <About />
            </>
          ) : (
            GuestEntry()
          )}
        </div>
      )}
    </header>
  );
}
