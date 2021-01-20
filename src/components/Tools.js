import React from 'react';

import Move from './Move';
import Scale from './Scale';
import Rotate from './Rotate';
import Brush from './Brush';
import Eraser from './Eraser';
import FloodFill from './FloodFill';
import Eyedrop from './Eyedrop';

const Tools = () => {
	return (
		<div className="tools-area">
			<Move />
			<Scale />
			<Rotate />
			<Brush />
			<Eraser />
			<FloodFill />
			<Eyedrop />
		</div>
	);
};

export default Tools;