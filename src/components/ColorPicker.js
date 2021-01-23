import React, { useState } from 'react';
import { CirclePicker, ChromePicker } from 'react-color';

const ColorPicker = ({color, colors, onChangeComplete}) => {
	const [chromePickerVisibile, setChromePickerVisible] = useState(false);
	const [palette, setPalette] = useState(['#000000', '#FFFFFF', '#B80000', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#5300EB', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5']);
	const [internalColor, setInternalColor] = useState(color);

	let currentColorIdx = palette.findIndex(colorItem => colorItem.toUpperCase() === color.toUpperCase());

	let popover = {
		top: '10px',
		position: 'absolute',
		zIndex: '2'
	};

	const onClickSelectedColor = (e) => {
		setChromePickerVisible(!chromePickerVisibile);
	};

	const updatePalette = (newColor) => {
		const newPalette = [...palette];
		newPalette[currentColorIdx] = newColor;
		setPalette(newPalette);
	};

	const onClickOutside = (e) => {
		e.stopPropagation();
		setChromePickerVisible(false);
		window.removeEventListener('click', onClickOutside);
		window.removeEventListener('touchstart', onClickOutside);
	};

	if (chromePickerVisibile) {
		window.addEventListener('click', onClickOutside, false);
		window.addEventListener('touchstart', onClickOutside, false);
	}

	return (
		<div className="color-picker">
			{
				chromePickerVisibile ?
					<div style={popover} onTouchStart={e => e.stopPropagation()} onClick={e => e.stopPropagation() }>
						<ChromePicker
							color={internalColor}
							onChange={e => setInternalColor(e.hex) }
							onChangeComplete={e => {
								updatePalette(e.hex);
								onChangeComplete(e);
							}} />
					</div>
					: null
			}
			<CirclePicker
				width="650px"
				triangle="hide"
				color={color}
				colors={palette}
				onChangeComplete={e => {
					if (color === e.hex) {
						onClickSelectedColor();
					} else {
						setInternalColor(e.hex);
						onChangeComplete(e);
					}
			}}/>
		</div>
	);
};

export default ColorPicker;