import React, { useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import {
	LoomEraserContext,
	LoomCanvasPropsContext,
	LoomToolHandlersContext
} from '../context/LoomContext';

import toolTypes from '../data/toolTypes';
import { createPattern } from '../utils/patterns';

const Eraser = () => {
	const { eraserProperties } = useContext(LoomEraserContext);
	const { currentTool, setCurrentTool } = useContext(LoomCanvasPropsContext);
	const { setToolHandlers } = useContext(LoomToolHandlersContext);

	const onToolSelect = () => {
		setCurrentTool(toolTypes.eraser);
	};

	//TODO: Hacky way of updating toolfn for properties. Fix
	useEffect(() => {
		if (currentTool === toolTypes.eraser) {

			const EraserFn = (ctx, tmpCtx, prevMove, currentMove, origMove) => {
				ctx.beginPath();
			    ctx.moveTo(prevMove.x, prevMove.y);
			    ctx.strokeStyle = createPattern(ctx, eraserProperties.pattern, '#000000');
			    ctx.lineWidth = eraserProperties.size;
			    ctx.lineCap = "round";
			    ctx.lineJoin = "round";
			    ctx.lineTo(currentMove.x, currentMove.y);
			    ctx.globalCompositeOperation = 'destination-out';
			    ctx.stroke();

			   	const brushOffset = Math.ceil((eraserProperties.size + 1) / 2);
			    return {
			    	topLeft: {
			    		x: Math.min(prevMove.x, currentMove.x) - brushOffset,
			    		y: Math.min(prevMove.y, currentMove.y) - brushOffset
			    	},
			    	bottomRight: {
			    		x: Math.max(prevMove.x, currentMove.x) + brushOffset,
			    		y: Math.max(prevMove.y, currentMove.y) + brushOffset
			    	}
			    };
			};

			setToolHandlers({
				onToolDown: () => {},
				onToolMove: EraserFn,
				onToolUp: () => {},
			});
		}
	}, [currentTool, eraserProperties, setToolHandlers]);


	return (
		<div
			className={`tools-itm ${currentTool === toolTypes.eraser ? 'tools-itm-selected' : ''}`}
			onClick={onToolSelect}>
			<FontAwesomeIcon icon={ faEraser } size="3x" />
		</div>
	);
};

export default Eraser;