import React, { useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFill } from '@fortawesome/free-solid-svg-icons';

import {
	LoomFillContext,
	LoomCanvasPropsContext,
	LoomToolHandlersContext
} from '../context/LoomContext';

import toolTypes from '../data/toolTypes';
import { hexToRgb } from '../utils/color';

const _withinTolerance = (array1, offset, array2, tolerance) => {
	var length = array2.length,
		start = offset + length;
	tolerance = tolerance || 0;

	// Iterate (in reverse) the items being compared in each array, checking their values are
	// within tolerance of each other
	while(start-- && length--) {
		if(Math.abs(array1[start] - array2[length]) > tolerance) {
			return false;
		}
	}

	return true;
};

const _fillOperation = (imageData, getPointOffsetFn, point, color, target, tolerance, width, height, step) => {
	let directions = [[step, 0], [0, step], [0, -step], [-step, 0]],
			points = [point],
			seen = {},
			key,
			x,
			y,
			offset,
			i,
			x2,
			y2,
			minX = -1,
			maxX = -1,
			minY = -1,
			maxY = -1,
			resultData = new ImageData(new Uint8ClampedArray(imageData), width, height),
			topLeft = {x: width, y: height},
			bottomRight = {x: 0, y: 0};

	// Keep going while we have points to walk
	while (!!(point = points.pop())) {
		x = point.x;
		y = point.y;
		offset = getPointOffsetFn(x, y);

		// Move to next point if this pixel isn't within tolerance of the color being filled
		if (!_withinTolerance(resultData.data, offset, target, tolerance)) {
			continue;
		}

		if (x > maxX) { maxX = x; }
		if (y > maxY) { maxY = y; }
		if (x < minX || minX === -1) { minX = x; }
		if (y < minY || minY === -1) { minY = y; }

		// Update the pixel to the fill color and add neighbours onto stack to traverse
		// the fill area
		i = directions.length;
		while (i--) {
			// Use the same loop for setting RGBA as for checking the neighbouring pixels
			if (i < 4) {
				resultData.data[offset + i] = color[i];
				topLeft.x = Math.min(topLeft.x, x);
                topLeft.y = Math.min(topLeft.y, y);
                bottomRight.x = Math.max(bottomRight.x, x + 1);
                bottomRight.y = Math.max(bottomRight.y, y + 1);
			}

			// Get the new coordinate by adjusting x and y based on current step
			x2 = x + directions[i][0];
			y2 = y + directions[i][1];
			key = x2 + ',' + y2;

			// If new coordinate is out of bounds, or we've already added it, then skip to
			// trying the next neighbour without adding this one
			if (x2 < 0 || y2 < 0 || x2 >= width || y2 >= height || seen[key]) {
				continue;
			}

			// Push neighbour onto points array to be processed, and tag as seen
			points.push({ x: x2, y: y2 });
			seen[key] = true;
		}
	}

	return {
		data: resultData,
		affectedPixels: {
			topLeft,
			bottomRight
		}
	};
};

const FloodFill = () => {
	const { fillProperties } = useContext(LoomFillContext);
	const { activeColor, currentTool, setCurrentTool } = useContext(LoomCanvasPropsContext);
	const { setToolHandlers } = useContext(LoomToolHandlersContext);

	const onToolSelect = () => {
		setCurrentTool(toolTypes.fill);
	};

	//TODO: Hacky way of updating toolfn for properties. Fix
	useEffect(() => {
		if (currentTool === toolTypes.fill) {

			const FillFn = (ctx, tmpCtx, x, y) => {
				// Hack to get around touch events returning float
				x = Math.trunc(x);
				y = Math.trunc(y);
				const parsedColor = hexToRgb(activeColor);
				const imageData = ctx.getImageData(0, 0, 650, 450); //TODO: Remove hardcoded width/height
				const getPointOffset = function(x,y) {
					return 4 * (y * imageData.width + x)
				};
				const targetOffset = getPointOffset(x, y);
				const target = imageData.data.slice(targetOffset, targetOffset + 4);

				if (_withinTolerance(target, 0, parsedColor, fillProperties.tolerance)) {
					return;
				}

				const fill = _fillOperation(imageData.data, getPointOffset, {x, y}, parsedColor, target, fillProperties.tolerance, imageData.width, imageData.height, fillProperties.step);

				ctx.putImageData(fill.data, 0, 0);

				return fill.affectedPixels;
			};

			setToolHandlers({
				onToolDown: () => {},
				onToolMove: () => {},
				onToolUp: FillFn,
			});
		}
	}, [currentTool, fillProperties, setToolHandlers, activeColor]);

	return (
		<div
			className={`tools-itm ${currentTool === toolTypes.fill ? 'tools-itm-selected' : ''}`}
			onClick={onToolSelect}>
			<FontAwesomeIcon icon={ faFill } size="3x" />
		</div>
	);
};

export default FloodFill;