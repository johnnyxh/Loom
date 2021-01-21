import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import {
	LoomCanvasPropsContext,
	LoomToolHandlersContext
} from '../context/LoomContext';

import toolTypes from '../data/toolTypes';

const Rotate = () => {
	const { currentTool, setCurrentTool } = useContext(LoomCanvasPropsContext);
	const { setToolHandlers } = useContext(LoomToolHandlersContext);

	const onToolSelect = () => {
		setCurrentTool(toolTypes.rotate);

		const RotateFn = (ctx, tmpCtx, prevMove, currentMove, origMove) => {
			ctx.clearRect(0, 0, 650, 450); //TODO: Remove hardcoded
			ctx.setTransform(1, 0, 0, 1, origMove.x, origMove.y);
			ctx.rotate((currentMove.x - origMove.x) * Math.PI / 180);
			ctx.drawImage(tmpCtx.canvas, -origMove.x, -origMove.y);
			ctx.setTransform(1, 0, 0, 1, 0, 0);

			return {
				topLeft: {x: 0, y: 0},
				bottomRight: {x: 650, y: 450}
			};
		};

		setToolHandlers({
			onToolDown: () => {},
			onToolMove: RotateFn,
			onToolUp: () => {},
		});
	};

	return (
		<div
			className={`tools-itm ${currentTool === toolTypes.rotate ? 'tools-itm-selected' : ''}`}
			onClick={onToolSelect}>
			<FontAwesomeIcon icon={ faSyncAlt } size="4x" />
		</div>
	);
};

export default Rotate;