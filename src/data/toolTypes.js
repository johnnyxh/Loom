import AT from './attributeTypes';

const toolTypes = {
	move: 'move',
	scale: 'scale',
	brush: 'brush',
	eraser: 'eraser',
	fill: 'fill',
	eyedrop: 'eyedrop'
};

// Houses properties for tool state in the context
export const toolProperties = {
	move: {},
	scale: {},
	eyedrop: {},
	brush: {
		get: 'brushProperties',
		set: 'setBrushProperties'
	},
	eraser: {
		get: 'eraserProperties',
		set: 'setEraserProperties'
	},
	fill: {
		get: 'fillProperties',
		set: 'setFillProperties'
	}
};

export const toolAttributes = {
	move: {},
	scale: {},
	eyedrop: {},
	brush: {
		size: AT.range,
		pattern: AT.pattern
	},
	eraser: {
		size: AT.range
	},
	fill: {
		tolerance: AT.range,
		step: AT.number
	}
};

export default toolTypes;