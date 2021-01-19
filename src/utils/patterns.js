import PT from '../data/patternTypes';

const getFlipnotePattern1 = (color) => {
	const flipnotePattern = new OffscreenCanvas(3, 3);
	const flipnoteCtx = flipnotePattern.getContext('2d');
	flipnoteCtx.fillStyle = color;
	flipnoteCtx.fillRect(0, 0, 1, 1);
	return flipnotePattern;
};

const getFlipnotePattern2 = (color) => {
	const flipnotePattern = new OffscreenCanvas(2, 2);
	const flipnoteCtx = flipnotePattern.getContext('2d');
	flipnoteCtx.fillStyle = color;
	flipnoteCtx.fillRect(0, 0, 1, 1);
	return flipnotePattern;
};

const getFlipnotePattern3 = (color) => {
	const flipnotePattern = new OffscreenCanvas(2, 2);
	const flipnoteCtx = flipnotePattern.getContext('2d');
	flipnoteCtx.fillStyle = color;
	flipnoteCtx.fillRect(0, 0, 1, 1);
	flipnoteCtx.fillRect(0, 1, 1, 1);
	return flipnotePattern;
};

const getFlipnotePattern4 = (color) => {
	const flipnotePattern = new OffscreenCanvas(2, 2);
	const flipnoteCtx = flipnotePattern.getContext('2d');
	flipnoteCtx.fillStyle = color;
	flipnoteCtx.fillRect(0, 0, 1, 1);
	flipnoteCtx.fillRect(1, 0, 1, 1);
	return flipnotePattern;
};

const getFlipnotePattern5 = (color) => {
	const flipnotePattern = new OffscreenCanvas(2, 2);
	const flipnoteCtx = flipnotePattern.getContext('2d');
	flipnoteCtx.fillStyle = color;
	flipnoteCtx.fillRect(0, 0, 1, 1);
	flipnoteCtx.fillRect(1, 1, 1, 1);
	return flipnotePattern;
};

const getFlipnotePattern6 = (color) => {
	const flipnotePattern = new OffscreenCanvas(2, 2);
	const flipnoteCtx = flipnotePattern.getContext('2d');
	flipnoteCtx.fillStyle = color;
	flipnoteCtx.fillRect(0, 0, 1, 1);
	flipnoteCtx.fillRect(0, 1, 1, 1);
	flipnoteCtx.fillRect(1, 0, 1, 1);
	return flipnotePattern;
};

const getFlipnotePattern7 = (color) => {
	const flipnotePattern = new OffscreenCanvas(3, 3);
	const flipnoteCtx = flipnotePattern.getContext('2d');
	flipnoteCtx.fillStyle = color;
	flipnoteCtx.fillRect(0, 0, 1, 1);
	flipnoteCtx.fillRect(0, 1, 1, 1);
	flipnoteCtx.fillRect(0, 2, 1, 1);
	flipnoteCtx.fillRect(1, 0, 1, 1);
	flipnoteCtx.fillRect(1, 1, 1, 1);
	flipnoteCtx.fillRect(1, 2, 1, 1);
	flipnoteCtx.fillRect(2, 0, 1, 1);
	flipnoteCtx.fillRect(2, 1, 1, 1);
	return flipnotePattern;
};

const getHeartPattern = (color) => {
	const heartPattern = new OffscreenCanvas(9, 7);
	const heartCtx = heartPattern.getContext('2d');
	heartCtx.fillStyle = color;
	heartCtx.fillRect(2, 0, 2, 1);
	heartCtx.fillRect(5, 0, 2, 1);
	heartCtx.fillRect(1, 1, 1, 1);
	heartCtx.fillRect(3, 1, 5, 1);
	heartCtx.fillRect(1, 2, 2, 1);
	heartCtx.fillRect(4, 2, 4, 1);
	heartCtx.fillRect(2, 3, 5, 1);
	heartCtx.fillRect(3, 4, 3, 1);
	heartCtx.fillRect(4, 5, 1, 1);
	return heartPattern;
}

export const createPattern = (ctx, patternType, color) => {
	let canvasPattern = null;

	switch(patternType) {
		case PT.solid:
			return color;
		case PT.flipnote1:
			canvasPattern = getFlipnotePattern1(color);
			break;
		case PT.flipnote2:
			canvasPattern = getFlipnotePattern2(color);
			break;
		case PT.flipnote3:
			canvasPattern = getFlipnotePattern3(color);
			break;
		case PT.flipnote4:
			canvasPattern = getFlipnotePattern4(color);
			break;
		case PT.flipnote5:
			canvasPattern = getFlipnotePattern5(color);
			break;
		case PT.flipnote6:
			canvasPattern = getFlipnotePattern6(color);
			break;
		case PT.flipnote7:
			canvasPattern = getFlipnotePattern7(color);
			break;
		case PT.heart:
			canvasPattern = getHeartPattern(color);
			break;
		default:
			return color;
	}

	return ctx.createPattern(canvasPattern, 'repeat');
};