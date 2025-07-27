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
import EditProfileModal from "./EditProfileModal.jsx";
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

export default function App() {
  const [recipeList, setRecipeList] = useState();
  const [activeRecipe, setActiveRecipe] = useState();
  const [ingridientsList, setIngridientsList] = useState([]);
  const [activeModal, setActiveModal] = useState();
  const [formContext, setFormContext] = useState({});
  const cleanFormContext = useFormContextCleaner(setFormContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const apiDb = useMemo(() => getApiDb(), []);

  useEffect(() => {
    const jwt = getToken();
    if (!jwt) {
      setIsAuthChecked(true);
      return;
    }
    checkAuth(jwt)
      .then((response) => {
        setIsLoggedIn(true);
        setUserData(response);
        setIsAuthChecked(true);
      })
      .catch((error) => {
        console.error(`Initial auth check failed: ${error}`);
        removeToken();
        setIsAuthChecked(true);
      });
  }, []);

  useEffect(() => {
    apiDb.getIngridients().then((response) => {
      const names = response.meals.map((item) => item.strIngredient);
      setIngridientsList(names);
    });
  }, []);

  const handleChosing = useCallback(async (choose) => {
    setIsLoading(true);
    try {
      const response = await apiDb.getRecipesByIngridient(choose);
      setRecipeList(response.meals);
    } catch (error) {
      console.error(`Failed to get random meal: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearRecipeList = useCallback(() => {
    setRecipeList();
  }, []);

  const parseMealIngridients = (meal) => {
    const mealIngridients = [];
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`] && meal[`strMeasure${i}`])
        mealIngridients.push(
          `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`
        );
    }
    meal.ingridients = mealIngridients;
    return meal;
  };

  const handleOpenMealModal = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const mealData = await apiDb.getRecipeByID(data.idMeal);
      const meal = parseMealIngridients(mealData.meals[0]);
      setActiveRecipe(meal);
    } catch (error) {
      console.error(`Failed to get random meal: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCloseMealModal = () => {
    setActiveRecipe();
  };

  const handleMainButton = useCallback(async () => {
    if (!recipeList) {
      setIsLoading(true);
      try {
        const response = await apiDb.getRandomRecipe();
        setRecipeList(response.meals);
      } catch (error) {
        console.error(`Failed to get random meal: ${error}`);
      } finally {
        setIsLoading(false);
      }
    } else setRecipeList();
  }, [recipeList]);

  const handleCloseModal = useCallback(() => {
    setActiveModal();
  }, []);

  const handleOpenModal = (modalData) => {
    setActiveModal(modalData);
  };

  const handleSignIn = useCallback(
    async ({ email, password }) => {
      const { token } = await signin({
        email,
        password,
      });
      setToken(token);
      setIsLoggedIn(true);
      const user = await checkAuth(token);
      setUserData(user);
      handleCloseModal();
    },
    [handleCloseModal]
  );

  const handleRegisterSubmit = useCallback(
    async (submitData) => {
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
        await handleSignIn(signupData);
      } catch (error) {
        console.error(`Failed to register and/or signin after: ${error}`);
      } finally {
        setIsLoading(false);
      }
    },
    [handleSignIn]
  );

  const handleLoginSubmit = useCallback(
    async (submitData) => {
      cleanFormContext("user-signin");
      setIsLoading(true);
      const signinData = {
        email: submitData["signinUserEmail"],
        password: submitData["signinUserPassword"],
      };
      try {
        await handleSignIn(signinData);
      } catch (error) {
        console.error(`Failed to sign in: ${error}`);
      } finally {
        setIsLoading(false);
      }
    },
    [handleSignIn]
  );

  const handleLogOut = () => {
    removeToken();
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
  };

  const handleEditSubmit = useCallback(async (submitData) => {
    cleanFormContext("profile-edit");
    setIsLoading(true);
    const editData = {
      name: submitData["editUserName"] || user.name,
      avatar: submitData["editUserAvatar"] || user.avatar,
    };
    try {
      const user = await apiDb.updateUserProfile(getToken(), editData);
      setUserData(user);
      handleCloseModal();
    } catch (error) {
      console.error(`Failed to update user profile: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFavorites = useCallback(async (mealCard, isInFavorites) => {
    setIsLoading(true);
    const mealData = {
      mealName: mealCard.strMeal,
      mealId: mealCard.idMeal,
      imageUrl: mealCard.strMealThumb,
    };
    try {
      const token = getToken();
      const newFavorites = isInFavorites
        ? await apiDb.removeFavorite(token, { mealId: mealData.mealId })
        : await apiDb.addFavorite(token, mealData);
      console.log(newFavorites);
      setUserData((prev) => ({
        ...prev,
        favorites: [...newFavorites],
      }));
    } catch (error) {
      console.error(
        `Failed to ${isInFavorites ? "remove" : "add"} favorite:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

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
            <Header onOpen={handleOpenModal} />
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    searshList={ingridientsList}
                    onChose={handleChosing}
                    recipeList={recipeList}
                    onOpen={handleOpenMealModal}
                    onClear={handleClearRecipeList}
                    onButton={handleMainButton}
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
                <EditProfileModal onSubmit={handleEditSubmit} />
              )}
            </FormContext.Provider>
          </CurrentUserContext.Provider>
        </AppContext.Provider>
        <Footer />
      </div>
    </main>
  );
}
