import React, { useEffect, useContext, useRef } from 'react';

import {
	LoomCanvasPropsContext
} from '../context/LoomContext';
import PT from '../data/patternTypes';
import { createPattern } from '../utils/patterns';

const PatternIcon = ({ pattern, color, onClick, isSelected }) => {
	const iconRef = useRef(null);

	const onPatternClick = () => {
		onClick(pattern);
	};

	const selectedStyle = {
		borderStyle: isSelected ? 'solid' : 'none',
		borderColor: 'blue',
		borderRadius: '5px',
		transition: 'all 0.25s ease' 
	};

	useEffect(() => {
		const icon = iconRef.current;
		const ctx = icon.getContext('2d');

		ctx.clearRect(0, 0, 25, 25);
		ctx.fillStyle = createPattern(ctx, pattern, color);
		ctx.fillRect(0, 0, 25, 25);
	}, [color, pattern]);

	return (
		<div className="pattern-button" style={selectedStyle} onClick={onPatternClick}>
			<canvas height="25" width="25" ref={iconRef} />
		</div>
	);
};

const PatternPicker = ({value, onChangeComplete}) => {
	const { activeColor } = useContext(LoomCanvasPropsContext);

	return (
		<div className="pattern-buttons-container">
			{Object.values(PT).map(pattern => <PatternIcon isSelected={pattern === value} key={pattern} pattern={pattern} color={activeColor} onClick={onChangeComplete} />)}
		</div>
	);
};

export default PatternPicker;