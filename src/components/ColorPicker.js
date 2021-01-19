import React, { useState } from 'react';
import { GithubPicker, ChromePicker } from 'react-color';

const ColorPicker = ({color, colors, onChangeComplete}) => {
	const [chromePickerVisibile, setChromePickerVisible] = useState(false);
	const [internalColor, setInternalColor] = useState(color);

	const popover = {
		right: '10px',
		position: 'absolute',
		zIndex: '2'
	};

	const selectedColor = {
		backgroundColor: internalColor
	};

	const onClickSelector = (e) => {
		e.stopPropagation();
		setChromePickerVisible(!chromePickerVisibile);
	}

	const onClickOutside = (e) => {
		e.stopPropagation();
		setChromePickerVisible(false);
		window.removeEventListener('click', onClickOutside);
	};

	if (chromePickerVisibile) {
		window.addEventListener('click', onClickOutside, false);
	}

	return (
		<div className="color-picker">
			<div
				className="color-picker-selected"
				style={selectedColor}
				onClick={onClickSelector}
			/>
				{
					chromePickerVisibile ?
						<div style={popover} onClick={e => e.stopPropagation() }><ChromePicker color={internalColor} onChange={e => setInternalColor(e.hex)} onChangeComplete={onChangeComplete}/></div>
						: null
				}
			<GithubPicker
				width="150px"
				triangle="hide"
				color={internalColor}
				onChangeComplete={e => {
				setInternalColor(e.hex);
				onChangeComplete(e);
			}}/>
		</div>
	);
};

export default ColorPicker;