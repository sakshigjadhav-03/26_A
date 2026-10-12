const API = "http://localhost:5000/api/assignments";

const request = async (url, options = {}) => {
    const token = localStorage.getItem("tasktrack_token");

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok)
        throw new Error(data.message || "Request failed.");

    return data;
};

export const signup = data =>
    request(`${API}/signup`, {
        method: "POST",
        body: JSON.stringify(data)
    });

export const login = data =>
    request(`${API}/login`, {
        method: "POST",
        body: JSON.stringify(data)
    });

export const getStudents = () => request(`${API}/students`);

export const getAssignments = () => request(API);

export const createAssignment = data =>
    request(API, {
        method: "POST",
        body: JSON.stringify(data)
    });

export const updateAssignmentStatus = (id, status, submissionLink = "") =>
    request(`${API}/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, submissionLink })
    });

export const deleteAssignment = id =>
    request(`${API}/${id}`, { method: "DELETE" });