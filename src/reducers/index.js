import { combineReducers } from 'redux';

import brush from './brushReducer';
import eraser from './eraserReducer';
import fill from './fillReducer';
import layers from './layersReducer';
import layerData from './layerDataReducer';
import activeLayer from './activeLayerReducer';
import canvasProps from './canvasPropsReducer';
import toolHandlers from './toolHandlersReducer';

export default combineReducers({
	brush,
	eraser,
	fill,
	layers,
	layerData,
	activeLayer,
	canvasProps,
	toolHandlers
});