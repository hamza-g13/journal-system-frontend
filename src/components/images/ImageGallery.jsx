import React, { useState } from 'react';
import './ImageGallery.css';

export const ImageGallery = ({ images, onImageClick, onUpload, onDelete, loading }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await onUpload(file);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteClick = (e, imageId) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this image?')) {
            onDelete(imageId);
        }
    };

    return (
        <div className="image-gallery">
            <div className="image-gallery-header">
                <h3>Medical Images</h3>
                <button
                    className="upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || loading}
                >
                    <span>📤</span>
                    {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="upload-input"
                />
            </div>

            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading images...</p>
                </div>
            ) : images.length === 0 ? (
                <div className="no-images">
                    <h4>No images yet</h4>
                    <p>Upload medical images to get started</p>
                </div>
            ) : (
                <div className="image-grid">
                    {images.map(image => (
                        <div
                            key={image.id}
                            className="image-card"
                            onClick={() => onImageClick(image)}
                        >
                            <img
                                src={`data:image/${image.format};base64,${image.imageData}`}
                                alt={`Medical image ${image.id}`}
                            />
                            <div className="image-card-info">
                                <div className="image-card-date">
                                    {new Date(image.uploadDate).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="image-card-actions">
                                <button
                                    className="image-action-btn delete"
                                    onClick={(e) => handleDeleteClick(e, image.id)}
                                    title="Delete image"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
