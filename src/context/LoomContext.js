import React, {
    createContext,
    useState,
} from 'react';

import PT from '../data/patternTypes';

export const LoomBrushContext = createContext([]);

export const LoomFillContext = createContext([]);

export const LoomEraserContext = createContext([]);

export const LoomActiveLayerContext = createContext([]);

export const LoomCanvasPropsContext = createContext([]);

export const LoomLayersContext = createContext([]);

export const LoomToolHandlersContext = createContext([]);

export const LoomLayerDataContext = createContext([]);

const LoomBrushProvider = ({ children }) => {
    const [brushProperties, setBrushProperties] = useState({
        size: 2,
        pattern: PT.solid
    });

    return (
        <LoomBrushContext.Provider
            value={{brushProperties, setBrushProperties}}
        >
            {children}
        </LoomBrushContext.Provider>
    )
};

const LoomFillProvider = ({ children }) => {
    const [fillProperties, setFillProperties] = useState({
        tolerance: 20,
        step: 1
    });

    return (
        <LoomFillContext.Provider
            value={{fillProperties, setFillProperties}}
        >
            {children}
        </LoomFillContext.Provider>
    )
};

const LoomEraserProvider = ({ children }) => {
    const [eraserProperties, setEraserProperties] = useState({
        size: 2,
        pattern: PT.solid
    });

    return (
        <LoomEraserContext.Provider
            value={{eraserProperties, setEraserProperties}}
        >
            {children}
        </LoomEraserContext.Provider>
    )
};

const LoomCanvasPropsProvider = ({ children } ) => {
    const [activeColor, setActiveColor] = useState('#000000');
    const [currentTool, setCurrentTool] = useState(null);
    const [zoom, setZoom] = useState(1);

    return (
        <LoomCanvasPropsContext.Provider
            value={{
                activeColor,
                setActiveColor,
                currentTool,
                setCurrentTool,
                zoom,
                setZoom
            }}
        >
            {children}
        </LoomCanvasPropsContext.Provider>
    )
};

const LoomToolHandlersProvider = ({ children }) => {
    const [toolHandlers, setToolHandlers] = useState(null);

    return (
        <LoomToolHandlersContext.Provider
            value={{toolHandlers, setToolHandlers}}
        >
            {children}
        </LoomToolHandlersContext.Provider>
    )
};

const LoomActiveLayerProvider = ({ children, initialLayerKey }) => {
    const [activeLayer, setActiveLayer] = useState(initialLayerKey);

    return (
        <LoomActiveLayerContext.Provider
            value={{activeLayer, setActiveLayer}}
        >
            {children}
        </LoomActiveLayerContext.Provider>
    );
};

const LoomLayersProvider = ({ children, initialLayerKey }) => {
    const [layerProperties, setLayerProperties] = useState([{
        name: 'Layer 1',
        key: initialLayerKey,
        visible: true,
        locked: false
    }]);

    return (
        <LoomLayersContext.Provider
            value={{layerProperties, setLayerProperties}}
        >
            {children}
        </LoomLayersContext.Provider>
    )
};

const LoomLayerDataProvider = ({ children, initialLayerKey }) => {
    const initialLayerData = new Map();
    initialLayerData.set(initialLayerKey, null);

    const initialLayerDirty = new Map();
    initialLayerDirty.set(initialLayerKey, false);

    const [layerDirty, _setLayerDirty] = useState(initialLayerDirty);
    const setLayerDirty = (k,v) => {
        _setLayerDirty(new Map(layerDirty.set(k,v)));
    }
    
    const [layerData, _setLayerData] = useState(initialLayerData);
    const setLayerData = (k,v) => {
        _setLayerData(new Map(layerData.set(k,v)));
    }

    return (
        <LoomLayerDataContext.Provider
            value={{layerDirty, setLayerDirty, layerData, setLayerData}}
        >
            {children}
        </LoomLayerDataContext.Provider>
    )
};

export const LoomContextProvider = ({ children }) => {
    const initialLayerKey = Date.now();

    return (
        <LoomLayerDataProvider initialLayerKey={initialLayerKey}>
            <LoomLayersProvider initialLayerKey={initialLayerKey}>
                <LoomActiveLayerProvider initialLayerKey={initialLayerKey}>
                    <LoomCanvasPropsProvider>
                        <LoomToolHandlersProvider>
                            <LoomEraserProvider>
                                <LoomFillProvider>
                                    <LoomBrushProvider>
                                        {children}
                                    </LoomBrushProvider>
                                </LoomFillProvider>
                            </LoomEraserProvider>
                        </LoomToolHandlersProvider>
                    </LoomCanvasPropsProvider>
                </LoomActiveLayerProvider>
            </LoomLayersProvider>
        </LoomLayerDataProvider>
    );
};