import React, { useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import {
	LoomCanvasPropsContext,
	LoomToolHandlersContext
} from '../context/LoomContext';

import toolTypes from '../data/toolTypes';

const Scale = () => {
	const { currentTool, setCurrentTool } = useContext(LoomCanvasPropsContext);
	const { setToolHandlers } = useContext(LoomToolHandlersContext);

	const ScaleFn = (ctx, tmpCtx, prevMove, currentMove, origMove) => {
		ctx.clearRect(0, 0, 650, 450);
		ctx.save();
		ctx.scale(650/(650 + (origMove.x - currentMove.x)), 450/(450 * ((650 + (origMove.x - currentMove.x))/650)));
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(tmpCtx.canvas, 0, 0);
		ctx.restore();

	    return {
			topLeft: {x: 0, y: 0},
			bottomRight: {x: 650, y: 450}
		};
	};

	const onToolSelect = () => {
		setCurrentTool(toolTypes.scale);
	};

	useEffect(() => {
		if (currentTool === toolTypes.scale) {
			setToolHandlers({
				onToolDown: () => {},
				onToolMove: ScaleFn,
				onToolUp: () => {},
			});
		}
	}, [currentTool, setToolHandlers]);

	return (
		<div
			className={`tools-itm ${currentTool === toolTypes.scale ? 'tools-itm-selected' : ''}`}
			onClick={onToolSelect}>
			<FontAwesomeIcon icon={ faExpandArrowsAlt } size="4x" />
		</div>
	);
};

export default Scale;