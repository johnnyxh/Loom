import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPlus,
	faMinus,
} from '@fortawesome/free-solid-svg-icons';

import ColorPicker from './ColorPicker';
import { LoomCanvasPropsContext } from '../context/LoomContext';


const GlobalControls = () => {
	const {
		activeColor,
		setActiveColor,
		zoom,
		setZoom
	} = useContext(LoomCanvasPropsContext);

	const onZoomIn = () => {
		if (zoom < 4) {
			setZoom(zoom + 1);
		}
	};

	const onZoomOut = () => {
		if (zoom > 1) {
			setZoom(zoom - 1);
		}
	};

	return (
		<div className="global-controls-area">
			<div>
				<ColorPicker color={activeColor} onChangeComplete={(e) => setActiveColor(e.hex)} />
			</div>
			<div className="zoom-area">
				<div className="layer-controls-button" onClick={onZoomIn}>
					<FontAwesomeIcon icon={ faPlus } size="2x" />
				</div>
				<div className="layer-controls-button" onClick={onZoomOut}>
					<FontAwesomeIcon icon={ faMinus } size="2x" />
				</div>
				<h2 className="zoom-display">
					{zoom}x
				</h2>
			</div>

		</div>
	);
};

export default GlobalControls;