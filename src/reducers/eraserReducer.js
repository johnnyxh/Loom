const eraserReducer = (state, action) => {
	switch(action.type) {
		case 'SET_ERASER_SIZE':
			return {
				...state,
				size: action.data.size
			}
		default:
			return state || {
				size: 2
			}
	}
};

export default eraserReducer;