const activeLayerReducer = (state, action) => {
	switch(action.type) {
		case 'SET_ACTIVE_LAYER':
			return {
				...state,
				activeLayer: action.data.key
			}
		default:
			return state || {
		        activeLayer: -1 
			}
	}
};

export default activeLayerReducer;