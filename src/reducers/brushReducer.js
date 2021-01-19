const brushReducer = (state, action) => {
	switch(action.type) {
		case 'SET_BRUSH_SIZE':
			return {
				...state,
				size: action.data.size
			}
		case 'SET_BRUSH_PATTERN':
			return {
				...state,
				pattern: action.data.pattern
			}
		default:
			return state || {
				size: 2,
				pattern: 'none'
			}
	}
};

export default brushReducer;