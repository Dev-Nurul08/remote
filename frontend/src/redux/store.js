const initialState = {
  theme: 'dark',
  activeCategory: 'All'
};

let state = { ...initialState };
const listeners = new Set();

export const getState = () => state;

export const dispatch = (action) => {
  if (action.type === 'SET_CATEGORY') {
    state = { ...state, activeCategory: action.payload };
  } else if (action.type === 'TOGGLE_THEME') {
    state = { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
  }
  listeners.forEach((listener) => listener(state));
};

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
