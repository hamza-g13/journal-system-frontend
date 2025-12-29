import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import './ImageEditor.css';

export const ImageEditor = ({ image, onSave, onClose }) => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const [tool, setTool] = useState('select');
    const [color, setColor] = useState('#ff0000');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize Fabric canvas
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 600,
            backgroundColor: '#ffffff'
        });

        fabricCanvasRef.current = canvas;

        // Load the image
        const imgData = `data:image/${image.format};base64,${image.imageData}`;
        fabric.Image.fromURL(imgData, (img) => {
            // Scale image to fit canvas
            const scale = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
            );
            img.scale(scale);
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        });

        return () => {
            canvas.dispose();
        };
    }, [image]);

    useEffect(() => {
        if (!fabricCanvasRef.current) return;
        const canvas = fabricCanvasRef.current;

        // Reset drawing mode
        canvas.isDrawingMode = false;
        canvas.selection = tool === 'select';

        if (tool === 'pen') {
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.color = color;
            canvas.freeDrawingBrush.width = 3;
        }
    }, [tool, color]);

    const addText = () => {
        if (!fabricCanvasRef.current) return;
        const canvas = fabricCanvasRef.current;

        const text = new fabric.IText('Add text...', {
            left: canvas.width / 2 - 50,
            top: canvas.height / 2,
            fill: color,
            fontSize: 20
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const addRectangle = () => {
        if (!fabricCanvasRef.current) return;
        const canvas = fabricCanvasRef.current;

        const rect = new fabric.Rect({
            left: canvas.width / 2 - 50,
            top: canvas.height / 2 - 50,
            fill: 'transparent',
            stroke: color,
            strokeWidth: 2,
            width: 100,
            height: 100
        });

        canvas.add(rect);
        canvas.setActiveObject(rect);
        canvas.renderAll();
    };

    const addCircle = () => {
        if (!fabricCanvasRef.current) return;
        const canvas = fabricCanvasRef.current;

        const circle = new fabric.Circle({
            left: canvas.width / 2 - 50,
            top: canvas.height / 2 - 50,
            fill: 'transparent',
            stroke: color,
            strokeWidth: 2,
            radius: 50
        });

        canvas.add(circle);
        canvas.setActiveObject(circle);
        canvas.renderAll();
    };

    const handleSave = async () => {
        if (!fabricCanvasRef.current) return;

        setSaving(true);
        try {
            const canvas = fabricCanvasRef.current;
            const dataURL = canvas.toDataURL({
                format: image.format || 'png',
                quality: 1
            });

            // Extract base64 data
            const base64Data = dataURL.split(',')[1];

            await onSave({
                imageData: base64Data,
                format: image.format
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="image-editor-modal" onClick={onClose}>
            <div className="image-editor-content" onClick={(e) => e.stopPropagation()}>
                <div className="image-editor-header">
                    <h3>Edit Medical Image</h3>
                    <button className="btn-secondary" onClick={onClose}>✕</button>
                </div>

                <div className="editor-toolbar">
                    <button
                        className={`tool-btn ${tool === 'select' ? 'active' : ''}`}
                        onClick={() => setTool('select')}
                    >
                        <span>👆</span> Select
                    </button>
                    <button
                        className={`tool-btn ${tool === 'pen' ? 'active' : ''}`}
                        onClick={() => setTool('pen')}
                    >
                        <span>✏️</span> Draw
                    </button>
                    <button className="tool-btn" onClick={addText}>
                        <span>📝</span> Text
                    </button>
                    <button className="tool-btn" onClick={addRectangle}>
                        <span>⬜</span> Rectangle
                    </button>
                    <button className="tool-btn" onClick={addCircle}>
                        <span>⭕</span> Circle
                    </button>
                    <div className="color-picker-wrapper">
                        <label>Color:</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="color-picker"
                        />
                    </div>
                </div>

                <div className="canvas-container">
                    <div className="canvas-wrapper">
                        <canvas ref={canvasRef} />
                    </div>
                </div>

                <div className="editor-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};
