const canvasPropsReducer = (state, action) => {
	switch(action.type) {
		case 'SET_CURRENT_TOOL':
			return {
				...state,
				currentTool: action.data.tool
			}
		case 'SET_ACTIVE_COLOR':
			return {
				...state,
				activeColor: action.data.color
			}
		default:
			return state || {
				currentTool: null,
		        activeColor: '#000000',
		        zoom: 1
			}
	}
};

export default canvasPropsReducer;