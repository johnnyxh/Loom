import React, { useContext, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPlus,
	faMinus,
	faCaretUp,
	faCaretDown,
	faLevelDownAlt,
	faEye,
	faEyeSlash,
	faLock,
	faUnlock
} from '@fortawesome/free-solid-svg-icons';
import {
	LoomLayersContext,
	LoomLayerDataContext,
	LoomActiveLayerContext
} from '../context/LoomContext';

const LayerItem = ({ name, layer, isDirty, isVisible, isLocked, isActive, setActiveLayer }) => {
	const {
		layerProperties,
		setLayerProperties
	} = useContext(LoomLayersContext);

	const {
		layerData,
		setLayerDirty
	} = useContext(LoomLayerDataContext);

	const previewRef = useRef(null);

	const onSelectLayer = (e) => {
		setActiveLayer(layer);
	};

	const onToggleVisibility = (e) => {
		e.stopPropagation();
        const layers = [...layerProperties]
        const layerIndex = layers.findIndex(item => item.key === layer);
        layers[layerIndex] = {...layers[layerIndex], visible: !layers[layerIndex].visible};
        setLayerProperties(layers);
	};

	const onToggleLock= (e) => {
		e.stopPropagation();
        const layers = [...layerProperties]
        const layerIndex = layers.findIndex(item => item.key === layer);
        layers[layerIndex] = {...layers[layerIndex], locked: !layers[layerIndex].locked};
        setLayerProperties(layers);
	};

	const previewStyle = {
		background: 'white',
		borderStyle: isActive ? 'solid' : 'none',
		borderColor: 'blue',
		borderRadius: '5px',
		transition: 'all 0.25s ease' 
	};

	useEffect(() => {
		const preview = previewRef.current.getContext('2d');

		if (isDirty) {
			preview.clearRect(0, 0, 92, 64);
			preview.drawImage((layerData.get(layer)), 0, 0, 92, 64);

			setLayerDirty(layer, false);
		}
	}, [layerProperties, layer, isDirty, layerData, setLayerDirty]);
	return (
		<div className="layer-item" onClick={onSelectLayer}>
			<div className="layer-controls-button" onClick={onToggleVisibility}>
				<FontAwesomeIcon icon={ isVisible ? faEye : faEyeSlash } />
			</div>
			<div className="layer-controls-button" onClick={onToggleLock}>
				<FontAwesomeIcon icon= { isLocked ? faLock : faUnlock } />
			</div>
			<canvas style={previewStyle} width="92px" height="64px" ref={previewRef} />
			<span>{name}</span>
		</div>
	);
};

const LayerControls = () => {
	const { activeLayer, setActiveLayer } = useContext(LoomActiveLayerContext);
	const { layerProperties, setLayerProperties } = useContext(LoomLayersContext);
	const { layerData, setLayerData, layerDirty, setLayerDirty } = useContext(LoomLayerDataContext);

	const onAddNewLayer = (e) => {
		setLayerProperties(layerProperties.concat({
			name: `Layer ${layerProperties.length + 1}`,
			key: Date.now(),
			visible: true,
			locked: false
		}));
	};

	const onDeleteActiveLayer = (e) => {
		const deleteIndex = layerProperties.findIndex(layer => layer.key === activeLayer);
		if (deleteIndex > -1 && layerProperties.length > 1) {
			const newActiveIndex = deleteIndex === layerProperties.length - 1 ? deleteIndex - 1 : deleteIndex; 
			layerProperties.splice(deleteIndex, 1);
			setLayerProperties(layerProperties);

			layerData.delete(activeLayer);
			setLayerData(layerData);

			setActiveLayer(layerProperties[newActiveIndex].key);
		}
	}

	const onMoveActiveLayerUp = (e) => {
		const activeIndex = layerProperties.findIndex(layer => layer.key === activeLayer);
		if (layerProperties.length > 1 && activeIndex < layerProperties.length - 1) {
			[layerProperties[activeIndex], layerProperties[activeIndex+1]] = [layerProperties[activeIndex+1], layerProperties[activeIndex]];
			setLayerProperties([...layerProperties]);
		}
	};

	const onMoveActiveLayerDown = (e) => {
		const activeIndex = layerProperties.findIndex(layer => layer.key === activeLayer);
		if (layerProperties.length > 1 && activeIndex > 0) {
			[layerProperties[activeIndex-1], layerProperties[activeIndex]] = [layerProperties[activeIndex], layerProperties[activeIndex-1]];
			setLayerProperties([...layerProperties]);
		}
	};

	const onMergeLayer = (e) => {
		const activeIndex = layerProperties.findIndex(layer => layer.key === activeLayer);
		if (activeIndex > 0) {
			const activeCanvas = layerData.get(activeLayer);
			const targetMergeKey = layerProperties[activeIndex-1].key;
			const targetMergeCanvas = layerData.get(targetMergeKey);

			const targetCtx = targetMergeCanvas.getContext('2d');

			targetCtx.drawImage(activeCanvas, 0, 0);

			layerProperties.splice(activeIndex, 1);
			setLayerProperties(layerProperties);

			layerData.delete(activeLayer);
			setLayerData(layerData);

			setActiveLayer(targetMergeKey);

			setLayerDirty(targetMergeKey, true);
		}
	};

	return (
		<div className="layer-controls">
			<div className="layer-controls-title">Layers</div>
			<div className="layer-items-container">
				{layerProperties.map((layer) => {
					return <LayerItem
						name={layer.name}
						key={layer.key}
						layer={layer.key}
						isDirty={layerDirty.get(layer.key)}
						isVisible={layer.visible}
						isLocked={layer.locked}
						isActive={layer.key === activeLayer}
						setActiveLayer={setActiveLayer}
					/>
				})}
			</div>
			<div className="layer-controls-button-container">
				<div className="layer-controls-button" onClick={onAddNewLayer}>
					<FontAwesomeIcon icon={ faPlus } />
				</div>
				<div className="layer-controls-button" onClick={onDeleteActiveLayer}>
					<FontAwesomeIcon icon={ faMinus } />
				</div>
				<div className="layer-controls-button" onClick={onMergeLayer}>
					<FontAwesomeIcon icon={ faLevelDownAlt } />
				</div>
				<div className="layer-controls-button" onClick={onMoveActiveLayerUp}>
					<FontAwesomeIcon icon={ faCaretUp } />
				</div>
				<div className="layer-controls-button" onClick={onMoveActiveLayerDown}>
					<FontAwesomeIcon icon={ faCaretDown } />
				</div>
			</div>
		</div>
	);
};

export default LayerControls;