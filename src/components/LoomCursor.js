import React, { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import {
	LoomCanvasPropsContext,
	LoomBrushContext,
	LoomEraserContext
} from '../context/LoomContext';
import toolTypes from '../data/toolTypes';

const getCursorStyle = (toolType, size) => {
	switch(toolType) {
		case toolTypes.brush:
		case toolTypes.eraser:
			return 	{
				width: `${size}px`,
				height: `${size}px`,
				border: '2px solid #fefefe',
				borderRadius: '100%',
				position: 'fixed',
				transform: 'translate(-50%, -50%)',
				pointerEvents: 'none',
				zIndex: 9999,
				mixBlendMode: 'difference',
			};
		default:
			return {};
	}
};

const LoomCursor = ({ container, isDisabled }) => {
	const { currentTool } = useContext(LoomCanvasPropsContext);
	const { brushProperties } = useContext(LoomBrushContext);
	const { eraserProperties } = useContext(LoomEraserContext);

	const [position, setPosition] = useState({x: 0, y: 0});
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const containerRef = container.current;

		const addEventListeners = () => {
			containerRef.addEventListener('mousemove', onMouseMove, false);
			containerRef.addEventListener('touchmove', onTouchMove, false);
			containerRef.addEventListener('mouseenter', onEnter, false);
			containerRef.addEventListener('mouseleave', onLeave, false);
			//TODO: Replicate enter/leave for touch events
		};

		const removeEventListeners = () => {
			containerRef.removeEventListener('mousemove', onMouseMove);
			containerRef.removeEventListener('touchmove', onTouchMove);
			containerRef.removeEventListener('mouseenter', onEnter);
			containerRef.removeEventListener('mouseleave', onLeave);
		};

		const onEnter = () => {
			setVisible(true);
		};

		const onLeave = () => {
			setVisible(false);
		}

		const onMouseMove = (e) => {
			setPosition({x: e.clientX, y: e.clientY});
		};

		const onTouchMove = (e) => {
		    setPosition({x: e.touches[0].clientX, y: e.touches[0].clientY});
		};

		if (containerRef) {
			addEventListeners();
			return removeEventListeners;
		}
	}, []);

	let cursorSize = 0;
	if (currentTool === toolTypes.brush) {
		cursorSize = brushProperties.size;
	} else if (currentTool === toolTypes.eraser) {
		cursorSize = eraserProperties.size;
	}

	const cursorStyle = {
		left: `${position.x}px`,
		top: `${position.y}px`,
		opacity: visible ? 100 : 0,
		visibility: isDisabled ? 'hidden' : 'visible',
		...getCursorStyle(currentTool, cursorSize),
	};

	return (
		<div
			style={cursorStyle}
		/>
	)
};

export default LoomCursor;