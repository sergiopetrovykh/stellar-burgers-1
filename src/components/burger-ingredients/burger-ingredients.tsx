import { useState, useRef, useEffect, FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useInView } from 'react-intersection-observer';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();

  // Получаем состояние ингредиентов, загрузки и ошибки из Redux
  const { buns, mains, sauces, loading, error } = useSelector(
    (state) => state.ingredients
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // Запуск fetchIngredients при монтировании компонента
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  // Обработка отображения текущей вкладки при прокрутке
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Переход по клику на вкладку
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Отображение лоадера и ошибки
  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns as TIngredient[]}
      mains={mains as TIngredient[]}
      sauces={sauces as TIngredient[]}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
