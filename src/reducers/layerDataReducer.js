const layerDataReducer = (state, action) => {
	switch(action.type) {
		case 'ADD_LAYER_DATA':
			return {
				...state,
				[action.data.key]: {
					canvas: action.data.canvas,
					dirty: false
				}
			};
		case 'DELETE_LAYER_DATA':
			delete state[action.data.key];
			return {
				...state
			};
		case 'SET_LAYER_DATA_DIRTY':
			return {
				...state,
				[action.data.key]: {
					...state[action.data.key],
					dirty: action.data.dirty
				}
			};
		default:
			return state || {};
	}
};

export default layerDataReducer;