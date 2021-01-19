import React, {
    useContext,
    useState,
    useEffect,
    useRef,
} from 'react';

import ScrollContainer from 'react-indiana-drag-scroll';

import {
    LoomActiveLayerContext,
    LoomLayersContext,
    LoomLayerDataContext,
    LoomToolHandlersContext,
    LoomCanvasPropsContext
} from '../context/LoomContext';
import LoomHistory from './history/LoomHistory';
import LoomRegionUpdatedCommand from './history/LoomRegionUpdatedCommand';

const LoomCanvas = () => {
    const { toolHandlers } = useContext(LoomToolHandlersContext);

    const { layerProperties } = useContext(LoomLayersContext);

    const { setLayerData, setLayerDirty } = useContext(LoomLayerDataContext);

    const { activeLayer } = useContext(LoomActiveLayerContext);

    const { zoom } = useContext(LoomCanvasPropsContext);

    const [dragEnabled, setDragEnabled] = useState(false);

    const history = useRef(new LoomHistory());
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const workspaceAreaRef = useRef(null);

    useEffect(() => {
        const workspaceArea = workspaceAreaRef.current;

        const canvasContainer = canvasContainerRef.current;

        const canvas = canvasRef.current;
        const tmpCanvas = canvas.cloneNode();

        const ctx = canvas.getContext('2d');
        const tmpCtx = tmpCanvas.getContext('2d');

        const activeLayerProperties = layerProperties.find(layer => layer.key === activeLayer);

        tmpCtx.drawImage(canvas, 0, 0);

        if (!history.current.containsLayerHistory(activeLayer)) {
            history.current.addLayerHistory(activeLayer, ctx);
        }

        setLayerData(activeLayer, canvas);

        let canvasRect; // Retrieving this on tool use

        let usingTool = false;
        let pointerIn = false;
        let previousEvt = null;
        let originalEvt = null;

        let isAffected = false;
        let upperLeftCoord = {x: null, y: null};
        let lowerRightCoord = {x: null, y: null};

        // Handle Mouse Events
        const onMouseMove = (e) => {
            if (toolHandlers && toolHandlers.onToolMove && usingTool) {

                if (!pointerIn) {
                    pointerIn = true;
                    previousEvt = e;
                }

                const previousOffsetX = Math.trunc(previousEvt.offsetX / zoom);
                const previousOffsetY = Math.trunc(previousEvt.offsetY / zoom);
                const offsetX = Math.trunc(e.offsetX / zoom);
                const offsetY = Math.trunc(e.offsetY / zoom);
                const originalOffsetX = Math.trunc(originalEvt.offsetX / zoom);
                const originalOffsetY = Math.trunc(originalEvt.offsetY / zoom);

                const affectedPixels = toolHandlers.onToolMove(
                    ctx,
                    tmpCtx,
                    {x: previousOffsetX, y: previousOffsetY}, 
                    {x: offsetX, y: offsetY},
                    {x: originalOffsetX, y: originalOffsetY}
                );

                if (affectedPixels) {
                    isAffected = true;
                    upperLeftCoord.x = Math.min(upperLeftCoord.x, affectedPixels.topLeft.x);
                    upperLeftCoord.y = Math.min(upperLeftCoord.y, affectedPixels.topLeft.y);
                    lowerRightCoord.x = Math.max(lowerRightCoord.x, affectedPixels.bottomRight.x);
                    lowerRightCoord.y = Math.max(lowerRightCoord.y, affectedPixels.bottomRight.y);
                }

                previousEvt = e;
            } 
        };

        const onMouseUp = (e) => {
            if (e.button === 4) {
                setDragEnabled(false);
            }

            if (toolHandlers && toolHandlers.onToolUp && usingTool) {
                usingTool = false;
                const offsetX = Math.trunc(e.offsetX / zoom);
                const offsetY = Math.trunc(e.offsetY / zoom);

                const affectedPixels = toolHandlers.onToolUp(ctx, tmpCtx, offsetX, offsetY);

                if (affectedPixels) {
                    isAffected = true;
                    upperLeftCoord.x = Math.min(upperLeftCoord.x, affectedPixels.topLeft.x);
                    upperLeftCoord.y = Math.min(upperLeftCoord.y, affectedPixels.topLeft.y);
                    lowerRightCoord.x = Math.max(lowerRightCoord.x, affectedPixels.bottomRight.x);
                    lowerRightCoord.y = Math.max(lowerRightCoord.y, affectedPixels.bottomRight.y);
                }

                if (isAffected) {
                    history.current.push(new LoomRegionUpdatedCommand(
                        activeLayer,
                        upperLeftCoord,
                        tmpCtx.getImageData(upperLeftCoord.x, upperLeftCoord.y, lowerRightCoord.x - upperLeftCoord.x, lowerRightCoord.y - upperLeftCoord.y),
                        ctx.getImageData(upperLeftCoord.x, upperLeftCoord.y, lowerRightCoord.x - upperLeftCoord.x, lowerRightCoord.y - upperLeftCoord.y)));
                
                    tmpCtx.clearRect(0, 0, 650, 450); // TODO: Remove hardcoded width/height
                    tmpCtx.drawImage(canvas, 0, 0);

                    setLayerDirty(activeLayer, true);
                }

                isAffected = false;
                upperLeftCoord = {x: null, y: null};
                lowerRightCoord = {x: null, y: null};
                
                canvasContainer.removeEventListener('mousemove', onMouseMove);
                canvasContainer.removeEventListener('mouseout', onMouseOut);
                workspaceArea.removeEventListener('mouseup', onMouseUp);
            }
        };

        const onMouseOut = (e) => { pointerIn = false; };

        const onMouseDown = (e) => {
            if (e.button === 4) {
                setDragEnabled(true);
            }
            else if (toolHandlers && toolHandlers.onToolDown && !activeLayerProperties.locked) {
                if (toolHandlers.onToolMove) {
                    usingTool = true;
                    canvasContainer.addEventListener('mousemove', onMouseMove, false);
                    canvasContainer.addEventListener('mouseout', onMouseOut, false);
                    workspaceArea.addEventListener('mouseup', onMouseUp, false);
                }

                const offsetX = Math.trunc(e.offsetX / zoom);
                const offsetY = Math.trunc(e.offsetY / zoom);

                upperLeftCoord.x = offsetX;
                upperLeftCoord.y = offsetY;
                lowerRightCoord.x = offsetX;
                lowerRightCoord.y = offsetY;

                previousEvt = e;
                originalEvt = e;
                toolHandlers.onToolDown(ctx, tmpCtx, e.offsetX, e.offsetY);
            }
        };

        // Handle TouchEvents
        const onTouchMove = (e) => {
            e.preventDefault();
            if (e.touches.length === 1 && toolHandlers && toolHandlers.onToolMove && usingTool) {
                const fromOffsetX = Math.trunc((previousEvt.touches[0].clientX - canvasRect.left) / zoom);
                const fromOffsetY = Math.trunc((previousEvt.touches[0].clientY - canvasRect.top) / zoom);
                const toOffsetX = Math.trunc((e.touches[0].pageX - canvasRect.left) / zoom);
                const toOffsetY = Math.trunc((e.touches[0].pageY - canvasRect.top) / zoom);
                const originalOffsetX = Math.trunc((originalEvt.touches[0].pageX - canvasRect.left) / zoom);
                const originalOffsetY = Math.trunc((originalEvt.touches[0].pageY - canvasRect.top) / zoom);
                
                const affectedPixels = toolHandlers.onToolMove(
                    ctx,
                    tmpCtx,
                    {x: fromOffsetX, y: fromOffsetY},
                    {x: toOffsetX, y: toOffsetY},
                    {x: originalOffsetX, y: originalOffsetY}
                );

                if (affectedPixels) {
                    isAffected = true;
                    upperLeftCoord.x = Math.min(upperLeftCoord.x, affectedPixels.topLeft.x);
                    upperLeftCoord.y = Math.min(upperLeftCoord.y, affectedPixels.topLeft.y);
                    lowerRightCoord.x = Math.max(lowerRightCoord.x, affectedPixels.bottomRight.x);
                    lowerRightCoord.y = Math.max(lowerRightCoord.y, affectedPixels.bottomRight.y);
                }
                
                previousEvt = e;
            }
        };

        const onTouchEnd = (e) => {
            e.preventDefault();
            setDragEnabled(false);

            if (toolHandlers && toolHandlers.onToolUp && usingTool) {
                const offsetX = Math.trunc((previousEvt.touches[0].pageX - canvasRect.left) / zoom);
                const offsetY = Math.trunc((previousEvt.touches[0].pageY - canvasRect.top) / zoom);
                
                usingTool = false;
                const affectedPixels = toolHandlers.onToolUp(ctx, tmpCtx, offsetX, offsetY);

                if (affectedPixels) {
                    isAffected = true;
                    upperLeftCoord.x = Math.min(upperLeftCoord.x, affectedPixels.topLeft.x);
                    upperLeftCoord.y = Math.min(upperLeftCoord.y, affectedPixels.topLeft.y);
                    lowerRightCoord.x = Math.max(lowerRightCoord.x, affectedPixels.bottomRight.x);
                    lowerRightCoord.y = Math.max(lowerRightCoord.y, affectedPixels.bottomRight.y);
                }

                if (isAffected) {
                    history.current.push(new LoomRegionUpdatedCommand(
                        activeLayer,
                        upperLeftCoord,
                        tmpCtx.getImageData(upperLeftCoord.x, upperLeftCoord.y, lowerRightCoord.x - upperLeftCoord.x, lowerRightCoord.y - upperLeftCoord.y),
                        ctx.getImageData(upperLeftCoord.x, upperLeftCoord.y, lowerRightCoord.x - upperLeftCoord.x, lowerRightCoord.y - upperLeftCoord.y)));
                
                    tmpCtx.clearRect(0, 0, 650, 450); // TODO: Remove hardcoded width/height
                    tmpCtx.drawImage(canvas, 0, 0);

                    setLayerDirty(activeLayer, true);
                }

                isAffected = false;
                upperLeftCoord = {x: null, y: null};
                lowerRightCoord = {x: null, y: null};
                
                canvasContainer.removeEventListener('touchmove', onTouchMove);
                canvasContainer.removeEventListener('touchend', onTouchEnd);
            }
        };

        const onTouchStart = (e) => {
            e.preventDefault();
            if (e.touches.length === 2) {
                setDragEnabled(true);
            }

            else if (toolHandlers && toolHandlers.onToolDown && !activeLayerProperties.locked) {
                canvasRect = canvasContainer.getBoundingClientRect()

                if (toolHandlers.onToolMove) {
                    usingTool = true;
                    canvasContainer.addEventListener('touchmove', onTouchMove, false);
                    canvasContainer.addEventListener('touchend', onTouchEnd, false);
                }
                previousEvt = e;
                originalEvt = e;

                const offsetX = Math.trunc((e.touches[0].pageX - canvasRect.left) / zoom);
                const offsetY = Math.trunc((e.touches[0].pageY - canvasRect.top) / zoom);

                upperLeftCoord.x = offsetX;
                upperLeftCoord.y = offsetY;
                lowerRightCoord.x = offsetX;
                lowerRightCoord.y = offsetY;

                toolHandlers.onToolDown(ctx, tmpCtx, offsetX, offsetY);
            }
        };

        // Keyboard shortcuts
        const onKeyDown = (e) => {
            // Undo
            if (e.keyCode === 90 && e.ctrlKey) {
                const layerChanged = history.current.undo();
                if (layerChanged) {
                    tmpCtx.clearRect(0, 0, 650, 450); // TODO: Remove hardcoded width/height
                    tmpCtx.drawImage(canvas, 0, 0);
                    setLayerDirty(layerChanged, true);
                }
            }

            // Redo
            else if (e.keyCode === 89 && e.ctrlKey) {
                const layerChanged = history.current.redo();
                if (layerChanged) {
                    tmpCtx.clearRect(0, 0, 650, 450); // TODO: Remove hardcoded width/height
                    tmpCtx.drawImage(canvas, 0, 0);
                    setLayerDirty(layerChanged, true);
                }
            }
        };

        workspaceArea.addEventListener('mousedown', onMouseDown, false);
        canvasContainer.addEventListener('touchstart', onTouchStart, false);
        window.addEventListener('keydown', onKeyDown, false);

        return () => {
            workspaceArea.removeEventListener('mousedown', onMouseDown);
            canvasContainer.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('keydown', onKeyDown);
        }

        // eslint-disable-next-line
    }, [toolHandlers, layerProperties, activeLayer, zoom]);

    return (
        <ScrollContainer
        innerRef={workspaceAreaRef}
        className="workspace-area"
        vertical={dragEnabled}
        horizontal={dragEnabled} >
            <div className="canvas-container"
            style={{
                width: 650 * zoom,
                height: 450 * zoom
            }}
            ref={canvasContainerRef} >
                {layerProperties.map((layer) => {
                    return (<canvas
                        className='canvas'
                        style={{
                            visibility: layer.visible ? 'visible' : 'hidden',
                            width: 650 * zoom,
                            height: 450 * zoom
                        }}
                        ref={activeLayer === layer.key ? canvasRef : null}
                        key={layer.key}
                        width={650}
                        height={450}
                    />);
                })}
            </div>
        </ScrollContainer>
    );
};

export default LoomCanvas;