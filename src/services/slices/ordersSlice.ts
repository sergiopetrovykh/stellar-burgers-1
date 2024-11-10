import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
  id: string;
  name: string;
  status: string;
  // Дополните другими полями заказа
}

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    fetchOrdersStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrdersSuccess(state, action: PayloadAction<Order[]>) {
      state.isLoading = false;
      state.orders = action.payload;
    },
    fetchOrdersFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchOrdersStart, fetchOrdersSuccess, fetchOrdersFailure } =
  ordersSlice.actions;
export default ordersSlice.reducer;
