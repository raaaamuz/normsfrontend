import { createStore } from 'redux';

const initialState = {
  firstDropdownValue: '',
  secondDropdownValue: '',
  radioButton: 'Percentage',
  selectedFilter: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FIRST_DROPDOWN_VALUE':
      return { ...state, firstDropdownValue: action.value };
    case 'SET_SECOND_DROPDOWN_VALUE':
      return { ...state, secondDropdownValue: action.value };
    case 'SET_RADIO_BUTTON':
      return { ...state, radioButton: action.value };
    case 'SET_SELECTED_FILTER':
      return { ...state, selectedFilter: action.value };
    default:
      return state;
  }
};

export const store = createStore(reducer);
