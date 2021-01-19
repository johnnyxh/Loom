export default class LoomHistory {
	constructor() {
		this.init();
	};

	init() {
		this.maxHistoryLength = 50;
		this.layerMap = new Map();
		this.history = [];
		this.currentPosition = -1;
	};

	containsLayerHistory(layerId) {
		return this.layerMap.has(layerId);
	};

	addLayerHistory(layerId, ctx) {
		this.layerMap.set(layerId, ctx);
	};

	removeLayerHistory(layerId) {
		this.history = this.history.filter(command => command.layerId !== layerId);
		this.layerMap.remove(layerId);
	};

	push(command) {
		if (this.history.length === this.maxHistoryLength) {
			this.history.shift();
			this.currentPosition--;
		}
		this.history = this.history.slice(0, this.currentPosition + 1);
		this.history.push(command);
		this.currentPosition++;
	};

	undo() {
	    if (this.currentPosition >= 0) {
	    	const command = this.history[this.currentPosition];
	    	const layerCtx = this.layerMap.get(command.layerId);
	    	command.undo(layerCtx);
	    	this.currentPosition--;
	      return command.layerId;
	    }
	    return null;
	};

	redo() {
	    if (this.currentPosition + 1 < this.history.length) {
	    	const command = this.history[this.currentPosition + 1];
	    	const layerCtx = this.layerMap.get(command.layerId);
	    	command.redo(layerCtx);
	    	this.currentPosition++;
	      return command.layerId;
	    }
	    return null;
	}
};