const toolHandlersReducer = (state, action) => {
	switch(action.type) {
		case 'SET_TOOL_HANDLERS':
			return {
				...state,
				onToolDown: action.data.onToolDown,
				onToolMove: action.data.onToolMove,
				onToolUp: action.data.onToolUp
			};
		default:
			return state || {};
	}
};

export default toolHandlersReducer;