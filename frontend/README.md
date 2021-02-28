# Transperfecta Frontend

This is the frontend (SPA) of the transperfecta service. It is written in ReactJS (Typescript). It requires the backend (REST API) to function.

## Running the Application

Before running the application one must set the `REACT_APP_BACKEND_URL` environement variable containing the url to the backend.
For example, if the backend is hosted at `localhost:5000`, `REACT_APP_BACKEND_URL` will be `https://localhost:5000/dict`. For convinience you can save the environment variable in a `.env` file in the project root (`/frontend`).

You can start the frontend server by simply running,
```
yarn start
```
