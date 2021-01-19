import React, { useContext } from 'react';
import {
	LoomCanvasPropsContext,
	LoomBrushContext,
	LoomFillContext,
	LoomEraserContext
} from '../context/LoomContext';

import LayerControls from './LayerControls';
import GlobalControls from './GlobalControls';
import ColorPicker from './ColorPicker';
import RangePicker from './RangePicker';
import PatternPicker from './PatternPicker';
import { toolAttributes, toolProperties } from '../data/toolTypes';
import AT from '../data/attributeTypes';

let attributes = { };
for(const key in toolAttributes) {
  attributes[key] = Object.keys(toolAttributes[key]).filter(x => x !== 'name');
}

const AttributeInput = ({ type, value, onChange }) => {
	switch(type) {
		case AT.color:
			return <ColorPicker
				color={value}
				onChangeComplete={ newVal => onChange(newVal.hex) }
			/>
		case AT.range:
			return <RangePicker
				value={ value }
				onChangeComplete={ newVal => onChange(newVal) }
			/>
		case AT.number:
			return <input
				type="number"
				min="0"
				max="100"
				defaultValue={ value }
				onChange={ e => onChange(parseInt(e.target.value)) }
			/>
		case AT.pattern:
			return <PatternPicker
				value={ value }
				onChangeComplete={ newVal => onChange(newVal) }
			/>
		default:
			return <div></div>
	}
}

const ToolControlItem = ({tool, type, attribute, onChange, value}) => {
	return (
		<div className="controls-item">
			<div className="controls-item-title">{`${tool} ${attribute}`}</div>
			<AttributeInput
				type={type}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};

const Controls = () => {
	const context = { 
		...useContext(LoomCanvasPropsContext),
		...useContext(LoomFillContext),
		...useContext(LoomBrushContext),
		...useContext(LoomEraserContext)
	};

	return (
		<div className="controls-area">
			<GlobalControls />
			<div>
				{context.currentTool ? attributes[context.currentTool].map(attribute => {
					return <ToolControlItem
						key={`${context.currentTool}${attribute}`}
						attribute={attribute}
						type={toolAttributes[context.currentTool][attribute]}
						tool={context.currentTool}
						onChange={(newVal) => {
							context[toolProperties[context.currentTool].set]({
								...context[toolProperties[context.currentTool].get],
								[attribute]: newVal
							});
						}}
						value={context[toolProperties[context.currentTool].get][attribute]}
					/>
				}) : null}
			</div>
			<LayerControls />
		</div>
	)
};

export default Controls;