import { apiFetch } from '../api/client';

export const imageService = {
    // Upload image for a patient
    uploadImage: (patientId, file, token) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('patientId', patientId);

        return apiFetch('/images/upload', {
            method: 'POST',
            body: formData
        }, token);
    },

    // Get all images for a patient
    getPatientImages: (patientId, token) =>
        apiFetch(`/images/patient/${patientId}`, {}, token),

    // Get a specific image
    getImage: (imageId, token) =>
        apiFetch(`/images/${imageId}`, {}, token),

    // Update image (after editing)
    updateImage: (imageId, imageData, token) =>
        apiFetch(`/images/${imageId}`, {
            method: 'PUT',
            body: JSON.stringify(imageData)
        }, token),

    // Delete image
    deleteImage: (imageId, token) =>
        apiFetch(`/images/${imageId}`, {
            method: 'DELETE'
        }, token)
};
