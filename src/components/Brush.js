import React, { useContext, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush } from '@fortawesome/free-solid-svg-icons';
import {
	LoomBrushContext,
	LoomCanvasPropsContext,
	LoomToolHandlersContext
} from '../context/LoomContext';

import toolTypes from '../data/toolTypes';
import { createPattern } from '../utils/patterns';

const Brush = () => {
	const { brushProperties } = useContext(LoomBrushContext);
	const { activeColor, currentTool, setCurrentTool } = useContext(LoomCanvasPropsContext);
	const { setToolHandlers } = useContext(LoomToolHandlersContext);

	const onToolSelect = () => {
		setCurrentTool(toolTypes.brush);
	};

	//TODO: Remove useEffect its not required
	useEffect(() => {
		if (currentTool === toolTypes.brush) {

			const BrushFn = (ctx, tmpCtx, prevMove, currentMove, origMove) => {
				ctx.beginPath();
			    ctx.moveTo(prevMove.x, prevMove.y);
			    ctx.strokeStyle = createPattern(ctx, brushProperties.pattern, activeColor);
			    ctx.lineWidth = brushProperties.size;
			    ctx.lineCap = "round";
			    ctx.lineJoin = "round";
			    ctx.lineTo(currentMove.x, currentMove.y);
			    ctx.globalCompositeOperation = 'source-over';
			    ctx.stroke();

			    const brushOffset = Math.ceil((brushProperties.size + 1) / 2);
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
				onToolMove: BrushFn,
				onToolUp: () => {},
			});
		}
	}, [currentTool, brushProperties, setToolHandlers, activeColor]);

	return (
		<div
			className={`tools-itm ${currentTool === toolTypes.brush ? 'tools-itm-selected' : ''}`}
			onClick={onToolSelect}>
			<FontAwesomeIcon icon={ faPaintBrush } size="4x" />
		</div>
	);
};

export default Brush;