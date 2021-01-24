import React, { useState } from 'react';

const RangePicker = ({value, onChangeComplete}) => {
	const [val, setVal] = useState(value);

	return (
		<div className="range-picker" >
			<input
				className="range-picker-slider"
				type="range"
				min="1"
				max="100"
				value={ val }
				onChange={ e => setVal(parseInt(e.target.value)) }
				onMouseUp={ e => onChangeComplete(val) }
				onTouchEnd={ e => onChangeComplete(val) }
			/>
			<input
				className="range-picker-input"
				type="number"
				value={ val }
				onChange={ (e) => {
					const newVal = parseInt(e.target.value);
					setVal(newVal);
					onChangeComplete(newVal);
				}}
			/>
		</div>
	);
};

export default RangePicker;