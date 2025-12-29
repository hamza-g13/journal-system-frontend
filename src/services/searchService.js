import { apiFetch } from '../api/client';

export const searchService = {
    // Search patients by query (name, SSN)
    searchPatients: (query, token) =>
        apiFetch(`/search/patients?q=${encodeURIComponent(query)}`, {}, token),

    // Search patients by condition
    searchPatientsByCondition: (condition, token) =>
        apiFetch(`/search/patients?condition=${encodeURIComponent(condition)}`, {}, token),

    // Get patients for a doctor
    getDoctorPatients: (doctorId, token) =>
        apiFetch(`/search/doctor/${doctorId}/patients`, {}, token),

    // Search doctors/practitioners by name
    searchDoctors: (query, token) =>
        apiFetch(`/search/practitioners?q=${encodeURIComponent(query)}`, {}, token),

    // Search encounters
    searchEncounters: (doctorId, date, token) => {
        const params = [];
        if (doctorId) params.push(`doctorId=${doctorId}`);
        if (date) params.push(`date=${date}`);
        return apiFetch(`/search/encounters?${params.join('&')}`, {}, token);
    },

    // Get patient conditions
    getPatientConditions: (patientId, token) =>
        apiFetch(`/search/patient/${patientId}/conditions`, {}, token)
};
