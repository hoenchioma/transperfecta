# Transperfecta Backend

This is the backend server for the tranperfecta website. It is a REST API that runs on NodeJS, it's written in Typescript.

In order to run the backend server run the following commands
```
npm install
npm build
npm start
```

The port and address can be set using the `PORT` and `ADDR` environment variables respectively.

The dictionary data is contained in the `data/dict.json` file. A hashed version of it is in the `data/hashed-dict.json` file. 
If you edit the `dict.json` file (or replace it) you will have to rehash (perfect hash) and generate the `hashed-dict.json` file using the command (after running `npm install` ofcourse):
```
npm run hash
```
