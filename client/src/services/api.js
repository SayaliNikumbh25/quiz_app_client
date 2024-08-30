import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
const API_URL = 'https://quiz-app-server-gw81.onrender.com/api';

export const register = async (userData) => {
  return await axios.post(`${API_URL}/users/register`, userData);
};

export const login = async (userData) => {
  return await axios.post(`${API_URL}/users/login`, userData);
};

export const createQuiz = async (quiz,token) => {
  console.log(quiz)
  return await axios.post(`${API_URL}/quizzes`, quiz,{
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateQuiz = async(id,quiz,token)=>{
  console.log(id , quiz,token)
  return await axios.patch(`${API_URL}/quizzes/${id}`, quiz,{
    headers: { Authorization: `Bearer ${token}` }
  });
}

export const getQuizzes = async (token) => {
  console.log(token)
  return await axios.get(`${API_URL}/quizzes/user/quizzes`,{
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getQuiz = async (id) => {
  return await axios.get(`${API_URL}/quizzes/${id}`);
};


export const submitQuizResult = async (data) => {
  console.log(data)
  return await axios.post(`${API_URL}/results/submit`, data); // Adjust the endpoint as needed
};

export const getQuizResult = async(id) =>{
  console.log(id);
  return await axios.get(`${API_URL}/results/${id}`)
}

export const handleDeleteQuiz = async(id, token)=>{
  console.log(id, token)
  return await axios.delete(`${API_URL}/quizzes/${id}`)
}

