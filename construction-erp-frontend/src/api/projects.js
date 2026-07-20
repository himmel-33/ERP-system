import apiClient from './client'

export const getProjects = async () => (await apiClient.get('/projects')).data
export const getProject = async (id) => (await apiClient.get(`/projects/${id}`)).data
export const createProject = async (project) => (await apiClient.post('/projects', project)).data
export const updateProject = async (id, project) => (await apiClient.put(`/projects/${id}`, project)).data
export const deleteProject = async (id) => apiClient.delete(`/projects/${id}`)
