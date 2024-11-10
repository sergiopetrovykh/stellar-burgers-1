import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { RootState } from '../../services/rootReducer';
import { setSelectedIngredient } from '../../services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { TIngredient } from '@utils-types'; // Импортируем тип TIngredient

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>(); // Получаем id ингредиента из параметров маршрута

  // Получаем данные о выбранном ингредиенте из Redux
  const ingredientData = useSelector(
    (state: RootState) => state.ingredients.selectedIngredient
  );

  // Получаем все ингредиенты из состояния
  const allIngredients = [
    ...useSelector((state: RootState) => state.ingredients.buns),
    ...useSelector((state: RootState) => state.ingredients.mains),
    ...useSelector((state: RootState) => state.ingredients.sauces)
  ];

  useEffect(() => {
    // Если ingredientData пусто, загружаем выбранный ингредиент
    if (!ingredientData && id) {
      const selectedIngredient = allIngredients.find(
        (ingredient) => ingredient._id === id
      );
      if (selectedIngredient) {
        dispatch(setSelectedIngredient(selectedIngredient)); // Выбираем ингредиент
      }
    }
  }, [id, ingredientData, allIngredients, dispatch]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
