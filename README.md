# Transperfecta

This is an English to Bangla dictionary website implemented using Perfect Hashing. 
The backend is a NodeJS server written in Typescript, while the frontend is a ReactJS application.

The data for the dictionary was collected from [here](https://github.com/MinhasKamal/BengaliDictionary).

You can view a demo of the website [here](https://transperfecta.herokuapp.com/).

### How to run locally

In order to run locally you have to first run the backend server (located in `/backend` folder) using (in the `/backend' directory)
```
npm install
npm build
npm start
```
For further instructions about backend visit the README in the `/backend` folder

Then you can run the frontend by executing the following command from the `/frontend` folder:
```
echo 'REACT_APP_BACKEND_URL=http://localhost:5000/dict' > .env
yarn start
```

For further instructions regarding frontend visit the README in the `/frontend` folder.
