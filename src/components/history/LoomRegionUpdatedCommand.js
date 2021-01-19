// Generic command history object, contains image data before/after for a given change on an html5 canvas

export default class LoomRegionUpdatedCommand {
	constructor(layerId, coords, before, after) {
		this.layerId = layerId;
		this.coords = coords;
		this.before = before;
		this.after = after;
	};

	execute(ctx) {
		ctx.putImageData(this.after, this.coords.x, this.coords.y);
	};

	undo(ctx) {
		ctx.putImageData(this.before, this.coords.x, this.coords.y);
	};

	redo(ctx) {
		this.execute(ctx);
	};
}