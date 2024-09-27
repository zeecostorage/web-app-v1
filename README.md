# Simple Web App

This is a simple web application built with React for the frontend and Node.js for the backend. It allows users to submit their names and ages, which are stored in a text file. The application is containerized using Docker for easy deployment and management.

## Features

- **Frontend**: Built with React, providing a user-friendly interface to collect user data.
- **Backend**: Node.js server handles incoming requests and saves data to a text file.
- **Data Storage**: User data is saved in a `user.txt` file located in the `db` directory.
- **CORS Support**: Enables cross-origin requests for easy integration with frontend applications.
- **Testing**: Includes unit tests for the backend to ensure reliability.

## Project Structure  
## Run
cd ~/web-app
docker compose down  
docker compose build  
docker compose up -d  

## Front-end
http://localhost:9090/

## Back-end
http://localhost:6000/submit-name  

## Jenkins 
http://<ip-address>:8080

## Prometheus  
http://<ip-address>:8081

## Grafana
http://localhost:4001

## Test Backend Functionality
npm test  
curl -X POST http://localhost:6000/submit-name -H "Content-Type: application/json" -d '{"name":"test", "age":30}'


