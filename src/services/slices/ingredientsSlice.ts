// src/services/slices/ingredientsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api'; // импорт функции из api.ts

// Определение начального состояния
interface IngredientsState {
  selectedIngredient: TIngredient | null; // Выбранный ингредиент
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  buns: [],
  mains: [],
  sauces: [],
  loading: false,
  error: null,
  selectedIngredient: null // Изначально нет выбранного ингредиента
};

// Асинхронный thunk для загрузки ингредиентов, используя getIngredientsApi
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredientsApi();
      // Если данные успешно получены, возвращаем их
      return data as TIngredient[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setSelectedIngredient(state, action: PayloadAction<TIngredient | null>) {
      state.selectedIngredient = action.payload; // Устанавливаем выбранный ингредиент
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        // Распределяем ингредиенты по категориям
        state.buns = action.payload.filter((item) => item.type === 'bun');
        state.mains = action.payload.filter((item) => item.type === 'main');
        state.sauces = action.payload.filter((item) => item.type === 'sauce');
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// Экспортируем действие для выбора ингредиента
export const { setSelectedIngredient } = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
