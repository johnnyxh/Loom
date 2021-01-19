const fillReducer = (state, action) => {
	switch(action.type) {
		case 'SET_FILL_TOLERANCE':
			return {
				...state,
				tolerance: action.data.tolerance
			}
		case 'SET_FILL_PATTERN':
			return {
				...state,
				step: action.data.step
			}
		default:
			return state || {
		        tolerance: 20,
		        step: 1
			}
	}
};

export default fillReducer;