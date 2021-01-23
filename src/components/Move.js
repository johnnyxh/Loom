import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import {
	LoomCanvasPropsContext,
	LoomToolHandlersContext
} from '../context/LoomContext';

import toolTypes from '../data/toolTypes';

const Move = () => {
	const { currentTool, setCurrentTool } = useContext(LoomCanvasPropsContext);
	const { setToolHandlers } = useContext(LoomToolHandlersContext);

	const onToolSelect = () => {
		setCurrentTool(toolTypes.move);

		const MoveFn = (ctx, tmpCtx, prevMove, currentMove, origMove) => {
			const imageData = tmpCtx.getImageData(0, 0, 650, 450); // TODO: Remove hardcoded width/height
			ctx.clearRect(0, 0, 650, 450);
			ctx.putImageData(imageData, currentMove.x - origMove.x, currentMove.y - origMove.y);
			return {
				topLeft: {x: 0, y: 0},
				bottomRight: {x: 650, y: 450}
			};
		};

		setToolHandlers({
			onToolDown: () => {},
			onToolMove: MoveFn,
			onToolUp: () => {},
		});
	};

	return (
		<div
			className={`tools-itm ${currentTool === toolTypes.move ? 'tools-itm-selected' : ''}`}
			onClick={onToolSelect}>
			<FontAwesomeIcon icon={ faArrowsAlt } size="3x" />
		</div>
	);
};

export default Move;