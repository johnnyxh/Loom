import React, { useContext } from 'react';
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

	const onToolSelect = () => {
		setCurrentTool(toolTypes.scale);

		const ScaleFn = (ctx, tmpCtx, prevMove, currentMove, origMove) => {
			ctx.clearRect(0, 0, 650, 450); //TODO: Remove hardcoded
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

		setToolHandlers({
			onToolDown: () => {},
			onToolMove: ScaleFn,
			onToolUp: () => {},
		});
	};

	return (
		<div
			className={`tools-itm ${currentTool === toolTypes.scale ? 'tools-itm-selected' : ''}`}
			onClick={onToolSelect}>
			<FontAwesomeIcon icon={ faExpandArrowsAlt } size="3x" />
		</div>
	);
};

export default Scale;