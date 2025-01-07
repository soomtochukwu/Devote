import { createSelector, createSlice } from '@reduxjs/toolkit';

interface alertSliceStateInferface {
  messages: messageInferface[];
}

export interface messageInferface {
  message: string;
  type: 'error' | 'info' | 'success' | 'warning';
  time?: number;
}

const initialState: alertSliceStateInferface = {
  messages: [],
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    removeMessage: (state) => {
      state.messages = state.messages.slice(1);
    },
  },
});

export const { addMessage, removeMessage } = alertSlice.actions;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const alertSelector = (state: any) => state.alertSlice;

export const messagesSelector = createSelector(
  [alertSelector],
  (state: alertSliceStateInferface) => state.messages
);

export default alertSlice.reducer;
