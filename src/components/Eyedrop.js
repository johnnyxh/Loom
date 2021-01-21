import React, { useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeDropper } from '@fortawesome/free-solid-svg-icons';
import {
	LoomCanvasPropsContext,
	LoomToolHandlersContext,
	LoomLayerDataContext,
	LoomLayersContext
} from '../context/LoomContext';

import toolTypes from '../data/toolTypes';
import { rgbToHex } from '../utils/color';

const Eyedrop = () => {
	const { setActiveColor, currentTool, setCurrentTool } = useContext(LoomCanvasPropsContext);
	const { setToolHandlers } = useContext(LoomToolHandlersContext);
	const { layerData } = useContext(LoomLayerDataContext);
	const { layerProperties } = useContext(LoomLayersContext);

	const onToolSelect = () => {
		setCurrentTool(toolTypes.eyedrop);
	}

	useEffect(() => {
		if (currentTool === toolTypes.eyedrop) {
			
			const EyedropFn = (ctx, tmpCtx, x, y) => {
				for (let i = layerProperties.length - 1; i >= 0; i--) {
					const layerKey = layerProperties[i].key;
					const currentCtx = layerData.get(layerKey).getContext('2d');
					const imgData = currentCtx.getImageData(x, y, 1, 1);
					if (imgData.data[3] !== 0 && layerProperties[i].visible) {
						setActiveColor(rgbToHex(imgData.data[0], imgData.data[1], imgData.data[2]));
						return;
					}
				}
			};

			setToolHandlers({
				onToolDown: () => {},
				onToolMove: () => {},
				onToolUp: EyedropFn,
			});
		}

	}, [currentTool, setToolHandlers, setActiveColor, layerData, layerProperties]);

	return (
		<div
			className={`tools-itm ${currentTool === toolTypes.eyedrop ? 'tools-itm-selected' : ''}`}
			onClick={onToolSelect}>
			<FontAwesomeIcon icon={ faEyeDropper } size="4x" />
		</div>
	);
};

export default Eyedrop;