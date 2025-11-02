import { useEffect, useState, useCallback, useMemo } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import "./styles/App.css";
import Header from "./Header";
import Main from "./Main";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./Profile";
import RecipeModal from "./RecipeModal";
import SignupFormModal from "./SignupFormModal";
import SigninFormModal from "./SigninFormModal";
import EditProfileFormModal from "./EditProfileFormModal.jsx";
import Footer from "./Footer";
import About from "./About.jsx";
import Preloader from "./Preloader.jsx";
import { AppContext } from "../contexts/AppContext.js";
import { FormContext } from "../contexts/FormContext.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { useFormContextCleaner } from "../hooks/useCleanFormContext.js";
import { getApiDb } from "../utils/apiDb.js";
import { getToken, setToken, removeToken } from "../utils/token.js";
import { checkAuth, signin, signup } from "../utils/auth.js";
import LoginPopup from "./LogInPopup.jsx";
import InfoPopup from "./InfoPopup.jsx";

export default function App() {
  const [recipeList, setRecipeList] = useState();
  const [activeRecipe, setActiveRecipe] = useState();
  const [ingredientsList, setIngredientsList] = useState([]);
  const [activeModal, setActiveModal] = useState();
  const [formContext, setFormContext] = useState({});
  const cleanFormContext = useFormContextCleaner(setFormContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [inputQuery, setInputQuery] = useState("");
  const [notification, setNotification] = useState();
  const [favoritesList, setFavoritesList] = useState([]);

  const apiDb = useMemo(() => getApiDb(), []);

  const handleCloseNotification = () => {
    setNotification();
  };

  const handleError = (error, errorText) => {
    console.error(`${errorText}: ${error}`);
    setNotification({ text: errorText });
  };

  useEffect(() => {
    const jwt = getToken();
    if (!jwt) {
      setIsAuthChecked(true);
      return;
    }
    checkAuth(jwt)
      .then((responseAuth) => {
        setIsLoggedIn(true);
        setUserData(responseAuth);
        setIsAuthChecked(true);
      })
      .catch((error) => {
        handleError(error, "Authentication error");
        removeToken();
        setIsAuthChecked(true);
      });
  }, []);

  useEffect(() => {
    apiDb
      .getIngredients()
      .then((responseIngredients) => setIngredientsList(responseIngredients));
  }, [apiDb]);

  useEffect(() => {
    if (isLoggedIn) {
      const token = getToken();
      apiDb
        .getFavorites(token)
        .then((list) => {
          setFavoritesList(list);
        })
        .catch((error) => handleError(error, "Cannot load favorite meals"));
    }
  }, [apiDb, isLoggedIn]);

  const handleChosing = useCallback(
    async (choose) => {
      setIsLoading(true);
      try {
        const response = await apiDb.getRecipesByIngredient(choose);
        setRecipeList(response);
      } catch (error) {
        handleError(error, "Error while getting meals list");
      } finally {
        setIsLoading(false);
      }
    },
    [apiDb]
  );

  const handleClearRecipeList = () => {
    setRecipeList();
  };

  const handleOpenMealModal = useCallback(
    async (data) => {
      setIsLoading(true);
      try {
        const mealData = await apiDb.getRecipeByID(data.mealId);
        favoritesList.some((meal) => meal.mealId === mealData.mealId)
          ? (mealData.isFavorite = true)
          : (mealData.isFavorite = false);
        setActiveRecipe(mealData);
      } catch (error) {
        handleError(error, "Error gaining recipe details");
      } finally {
        setIsLoading(false);
      }
    },
    [apiDb, favoritesList]
  );

  const handleCloseMealModal = () => {
    setActiveRecipe();
  };

  const handleMainButton = useCallback(async () => {
    if (!recipeList) {
      setIsLoading(true);
      try {
        const responseRandom = await apiDb.getRandomRecipe();
        setRecipeList(responseRandom);
      } catch (error) {
        handleError(error, "Interactive button error");
      } finally {
        setIsLoading(false);
      }
    } else {
      setRecipeList();
      setInputQuery("");
    }
  }, [recipeList, apiDb]);

  const handleCloseModal = () => {
    setActiveModal();
  };

  const handleOpenModal = (modalData) => {
    setActiveModal(modalData);
  };

  const handleSignIn = async ({ email, password }) => {
    try {
      const { token } = await signin({
        email,
        password,
      });
      setToken(token);
      setIsLoggedIn(true);
      const user = await checkAuth(token);
      setUserData(user);
      handleCloseModal();
    } catch (error) {
      handleError(error, "Failed to sign in");
    }
  };

  const handleRegisterSubmit = async (submitData) => {
    cleanFormContext("user-signup");
    setIsLoading(true);
    const signupData = {
      name: submitData["userName"],
      email: submitData["userEmail"],
      password: submitData["userPassword"],
      avatar: submitData["userAvatar"],
    };
    try {
      await signup(signupData);
      const handleConfirmLogin = async () => {
        return await handleSignIn(signupData);
      };
      setNotification({
        text: "Registration succesful",
        isNewUser: true,
        handleConfirmLogin,
      });
      handleCloseModal();
    } catch (error) {
      handleError(error, "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (submitData) => {
    cleanFormContext("user-signin");
    setIsLoading(true);
    const signinData = {
      email: submitData["signinUserEmail"],
      password: submitData["signinUserPassword"],
    };
    await handleSignIn(signinData);
    setIsLoading(false);
  };

  const handleLogOut = () => {
    removeToken();
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
  };

  const handleEditSubmit = async (submitData) => {
    cleanFormContext("profile-edit");
    setIsLoading(true);
    const editData = {
      name: submitData["editUserName"] || userData.name,
      avatar: submitData["editUserAvatar"] || userData.avatar,
    };
    try {
      const user = await apiDb.updateUserProfile(getToken(), editData);
      setUserData(user);
      handleCloseModal();
    } catch (error) {
      handleError(error, "Failed to update user profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorites = async ({ mealId }, isInFavorites) => {
    try {
      const token = getToken();
      const apiMeal = isInFavorites
        ? await apiDb.removeFavorite(token, { mealId: mealId })
        : await apiDb.addFavorite(token, { mealId: mealId });
      setFavoritesList((prev) =>
        isInFavorites
          ? prev.filter((meal) => meal.mealId !== apiMeal.mealId)
          : [...prev, apiMeal]
      );
      return true;
    } catch (error) {
      handleError(
        error,
        `Failed to ${isInFavorites ? "remove" : "add"} favorite`
      );
      return false;
    }
  };

  const searchElement = useMemo(
    () => ({ inputQuery, setInputQuery }),
    [inputQuery]
  );

  return (
    <main className="page">
      <div className="page__content">
        {isLoading && <Preloader />}
        <AppContext.Provider
          value={{ handleCloseModal, handleOpenModal, isLoading }}
        >
          <CurrentUserContext.Provider
            value={{ userData, isLoggedIn, isAuthChecked }}
          >
            <Header onLogOut={handleLogOut} />
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    searshList={ingredientsList}
                    onChose={handleChosing}
                    recipeList={recipeList}
                    onOpen={handleOpenMealModal}
                    onClear={handleClearRecipeList}
                    onButton={handleMainButton}
                    searchElement={searchElement}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile
                      onLogOut={handleLogOut}
                      onOpen={handleOpenMealModal}
                      favorites={favoritesList}
                    />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {activeRecipe && (
              <RecipeModal
                meal={activeRecipe}
                onClose={handleCloseMealModal}
                onFavorite={handleFavorites}
              />
            )}
            <FormContext.Provider value={{ formContext, setFormContext }}>
              {activeModal?.modalName === "user-signup" && (
                <SignupFormModal onSubmit={handleRegisterSubmit} />
              )}
              {activeModal?.modalName === "user-signin" && (
                <SigninFormModal onSubmit={handleLoginSubmit} />
              )}
              {activeModal?.modalName === "profile-edit" && (
                <EditProfileFormModal onSubmit={handleEditSubmit} />
              )}
            </FormContext.Provider>
            {notification &&
              (notification.isNewUser ? (
                <LoginPopup
                  infoText={notification?.text}
                  onClose={handleCloseNotification}
                  onConfirm={notification.handleConfirmLogin}
                />
              ) : (
                <InfoPopup
                  onClose={handleCloseNotification}
                  infoText={notification?.text}
                />
              ))}
          </CurrentUserContext.Provider>
        </AppContext.Provider>
        <Footer />
      </div>
    </main>
  );
}
