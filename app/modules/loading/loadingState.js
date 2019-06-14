const initialState = {
  data: {},
  isLoading: false,
  error: false,
};


const loadingState = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default loadingState;
