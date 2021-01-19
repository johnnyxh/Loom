const layersReducer = (state, action) => {
	switch(action.type) {
		case 'ADD_LAYER': {
			return state.concat({
				name: `Layer ${state.length + 1}`,
				key: action.data.key,
				visible: true,
				locked: false
			});
		}
		case 'DELETE_LAYER': {
			const delIndex = state.findIndex(layer => layer.key === action.data.key);
			if (delIndex > -1 && state.length > 1) {
				return state.splice(delIndex, 1);
			}
			return state;
		}
		case 'MOVE_LAYER_UP': {
			const index = state.findIndex(layer => layer.key === action.data.key);
			if (state.length > 1 && index < state.length - 1) {
				[state[index], state[index+1]] = [state[index+1], state[index]];
				return [...state];
			}
			return state;
		}
		case 'MOVE_LAYER_DOWN': {
			const index = state.findIndex(layer => layer.key === action.data.key);
			if (state.length > 1 && index > 0) {
				[state[index-1], state[index]] = [state[index], state[index-1]];
				return [...state];
			}
			return state;
		}
		default:
			return state || []
	}
};

export default layersReducer;