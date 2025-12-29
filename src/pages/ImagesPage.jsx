import React, { useState, useEffect } from 'react';
import { imageService } from '../services/imageService';
import { patientService } from '../services/patientService';
import { ImageGallery } from '../components/images/ImageGallery';
import { ImageEditor } from '../components/images/ImageEditor';
import './ImagesPage.css';

export default function ImagesPage({ token, userId, role }) {
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [patients, setPatients] = useState([]);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load patients for doctors/staff
    useEffect(() => {
        const loadPatients = async () => {
            if (role === 'patient') {
                // Patients can only see their own images
                setSelectedPatientId(userId);
                loadImages(userId);
            } else if (role === 'doctor' || role === 'staff' || role === 'admin') {
                try {
                    const data = await patientService.getAll(token);
                    setPatients(data);
                    if (data.length > 0) {
                        setSelectedPatientId(data[0].id);
                    }
                } catch (err) {
                    setError('Failed to load patients: ' + err.message);
                }
            }
        };

        loadPatients();
    }, [token, userId, role]);

    // Load images when patient selection changes
    useEffect(() => {
        if (selectedPatientId) {
            loadImages(selectedPatientId);
        }
    }, [selectedPatientId]);

    const loadImages = async (patientId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await imageService.getPatientImages(patientId, token);
            setImages(data);
        } catch (err) {
            setError('Failed to load images: ' + err.message);
            setImages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file) => {
        try {
            await imageService.uploadImage(selectedPatientId, file, token);
            await loadImages(selectedPatientId);
        } catch (err) {
            setError('Failed to upload image: ' + err.message);
        }
    };

    const handleImageClick = (image) => {
        if (role !== 'patient') {
            // Only doctors/staff can edit
            setSelectedImage(image);
        }
    };

    const handleSaveEdit = async (imageData) => {
        try {
            await imageService.updateImage(selectedImage.id, imageData, token);
            setSelectedImage(null);
            await loadImages(selectedPatientId);
        } catch (err) {
            setError('Failed to save changes: ' + err.message);
        }
    };

    const handleDelete = async (imageId) => {
        try {
            await imageService.deleteImage(imageId, token);
            await loadImages(selectedPatientId);
        } catch (err) {
            setError('Failed to delete image: ' + err.message);
        }
    };

    return (
        <div className="images-page">
            <div className="images-header">
                <h1>Medical Images</h1>
                <p>Upload, view, and edit medical images</p>
            </div>

            {role !== 'patient' && patients.length > 0 && (
                <div className="patient-selector">
                    <label>Select Patient</label>
                    <select
                        value={selectedPatientId || ''}
                        onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                    >
                        {patients.map(patient => (
                            <option key={patient.id} value={patient.id}>
                                {patient.firstName} {patient.lastName} (SSN: {patient.socialSecurityNumber})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {error && (
                <div className="error-message" role="alert">
                    {error}
                </div>
            )}

            <div className="images-content">
                <ImageGallery
                    images={images}
                    onImageClick={handleImageClick}
                    onUpload={handleUpload}
                    onDelete={handleDelete}
                    loading={loading}
                />
            </div>

            {selectedImage && (
                <ImageEditor
                    image={selectedImage}
                    onSave={handleSaveEdit}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
};
