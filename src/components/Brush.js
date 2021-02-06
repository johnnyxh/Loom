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

	//TODO: Hacky way of updating toolfn for properties. Fix
	useEffect(() => {
		if (currentTool === toolTypes.brush) {

			let pattern = '#000000';

			const BrushInitFn = (ctx, tmpCtx, x, y) => {
				console.log('init');
				pattern = createPattern(ctx, brushProperties.pattern, activeColor);
				ctx.strokeStyle = pattern;
			}

			const BrushFn = (ctx, tmpCtx, prevMove, currentMove, origMove) => {
				ctx.beginPath();
			    ctx.moveTo(prevMove.x, prevMove.y);
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
				onToolDown: BrushInitFn,
				onToolMove: BrushFn,
				onToolUp: () => {},
			});
		}
	}, [currentTool, brushProperties, setToolHandlers, activeColor]);

	return (
		<div
			className={`tools-itm ${currentTool === toolTypes.brush ? 'tools-itm-selected' : ''}`}
			onClick={onToolSelect}>
			<FontAwesomeIcon icon={ faPaintBrush } size="3x" />
		</div>
	);
};

export default Brush;