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
		<div>
			<div className="controls-item">
				<div className="controls-item-title">Zoom</div>
				<div className="layer-controls-button-container">
					<div className="layer-controls-button" onClick={onZoomIn}>
						<FontAwesomeIcon icon={ faPlus } />
					</div>
					<div className="layer-controls-button" onClick={onZoomOut}>
						<FontAwesomeIcon icon={ faMinus } />
					</div>
				</div>
			</div>
			<div className="controls-item">
				<div className="controls-item-title">Color</div>
				<ColorPicker color={activeColor} onChangeComplete={(e) => setActiveColor(e.hex)} />
			</div>
		</div>
	);
};

export default GlobalControls;