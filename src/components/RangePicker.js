import React, { useState } from 'react';

const RangePicker = ({value, onChangeComplete}) => {
	const [val, setVal] = useState(value);

	return (
		<div>
			<input
				type="range"
				min="1"
				max="100"
				defaultValue={ val }
				onChange={ e => setVal(parseInt(e.target.value)) }
				onMouseUp={ e => onChangeComplete(val) }
				onTouchEnd={ e => onChangeComplete(val) }
			/>
			<input
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