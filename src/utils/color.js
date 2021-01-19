export const hexToRgb = (hex, opacity) => {
	opacity = Math.round(opacity * 255) || 255;
	hex = hex.replace('#', '');
	const rgb = [], re = new RegExp('(.{' + hex.length/3 + '})', 'g');
	hex.match(re).forEach((l) => {
		rgb.push(parseInt(hex.length % 2 ? l+l : l, 16));
	});
	return rgb.concat(opacity);
};

export const rgbToHex = (r, g, b) => {
	return `#${('000000' + (((r << 16) | (g << 8) | b).toString(16))).slice(-6)}`;
};