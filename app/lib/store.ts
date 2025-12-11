import { configureStore, createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { isAddOpen: false, searchTerm: '' },
  reducers: {
    toggleAddModal: (state, action) => { state.isAddOpen = action.payload; },
    setSearch: (state, action) => { state.searchTerm = action.payload; },
  },
});

export const { toggleAddModal, setSearch } = uiSlice.actions;
export const store = configureStore({ reducer: { ui: uiSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;