// // export const server = "http://10.54.4.220:8000/api/v2";

// // export const backend_url = "http://10.54.4.220:8000/";
// const host="localhost"
// export const server = `http://${host}:8000/api/v2`;

// export const backend_url = `http://${host}:8000/`;
// import dotenv from 'dotenv';
// dotenv.config();

const host = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'
export const server = `${host}/api/v2`;

export const backend_url = `${host}/`;