<h1 align="center" id="title">BogoSort Leaderboard</h1>
<p align="center" >A small mini project to prove that BogoSort is the best sorting algorithm.</p>
<p align="center" >"Theory will only take you so far." - Robert J. Oppenheimer</p>

<h4 align="center" > <span> · </span> <a href="https://github.com/Chriskim2273/BogoSortLeaderboard/blob/master/README.md"> Documentation </a> <span> · </span> <a href="https://github.com/Chriskim2273/BogoSortLeaderboard/issues"> Report Bug </a> <span> · </span> <a href="https://github.com/Chriskim2273/BogoSortLeaderboard/issues"> Request Feature </a> </h4>


<p align="center"><img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&amp;logo=python&amp;logoColor=white" alt="shields">     <img src="https://img.shields.io/badge/React-61DBFB?style=for-the-badge&logo=react&logoColor=61DBFB&labelColor=black" alt="shields">     <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&amp;logo=html5&amp;logoColor=white" alt="shields">     <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&amp;logo=javascript&amp;logoColor=black" alt="shields">     <img src="https://img.shields.io/website?url=https%3A%2F%2Fmain--magenta-moxie-66d7f2.netlify.app%2F" alt="shields"></p>

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
- [Roadmap](#compass-roadmap)
- [FAQ](#grey_question-faq)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)


## :star2: About the Project

### :camera: Screenshots
<div align="center"> <a href=""><img src="https://i.ibb.co/42h7b3H/Screenshot-98.jpg" alt='image' width='800'/></a> </div>



### :dart: Features
- Upload Bogosort Scores
- Change Amount of Elements Being Sorted
- View Personal Scores
- Log-In and Log-Out
- View Global Leaderboard

### :key: Environment Variables
To run this project, you will need to add the following environment variables to your .env file (in backend directory)

`MYSQL_HOST`

`MYSQL_USER`

`MYSQL_PASS`

`MYSQL_DB`

`MYSQL_CA_LOCATION`

`MYSQL_SSH_PASS`

`MYSQL_SSH_USER`



## :toolbox: Getting Started

### :bangbang: Prerequisites

- Install Node JS<a href="https://nodejs.org/en/"> Here</a>
- Install MySQL or have a Hosted MySQL Database
- Sign Up for Firebase<a href="https://firebase.google.com/"> Here</a>
- Install Python 3.10+<a href="https://www.python.org/downloads/"> Here</a>


### :running: Run Locally

Clone the project

```bash
https://github.com/chriskim2273/BogoSortLeaderboard
```
Go to backend directory
```bash
cd backend
```
Get a serviceAccountKey.json from Firebase and Paste into backend directory

Source into VirtualEnv
```bash
source venv/bin/activate
```
Run Backend API
```bash
flask run
```
Go back to main directory (which holds both backend and frontend directories)
```bash
cd ..
```
Go to frontend directory
```bash
cd frontend
```
Install all npm packages
```bash
npm install
```
In src directory, paste in firebase.js from Firebase

Run the front-end application
```bash
npm start
```


### :triangular_flag_on_post: Deployment

Front-End Deployment Using Netlify
Back-End Deployment using PythonAnywhere
MySQL Database from PythonAnywhere


## :compass: Roadmap

* [x] Account Creation
* [x] Account Log-in
* [x] Account Log-out
* [x] Global Leaderboard
* [x] Uploading of Scores
* [ ] Search Scores
* [ ] Change size and color of bars
* [ ] Profile Page
* [ ] Global Average Runtime


## :wave: Contributing

Contributions are always welcome!

see `contributing.md` for ways to get started

## :grey_question: FAQ

- Why did you make this?
- I wanted to see with my very own eyes, someone getting a very lucky one run sort with BogoSort. It's theoretically possible, but theory can only take you so far...


## :warning: License

Distributed under the no License.

## :handshake: Contact

Christopher Kim - - Christopherkim2273@gmail.com

Project Link: [https://github.com/chriskim2273/BogoSortLeaderboard](https://github.com/chriskim2273/BogoSortLeaderboard)

## :gem: Acknowledgements

- [How I connected to PythonAnywhere's MySQL database](https://help.pythonanywhere.com/pages/AccessingMySQLFromOutsidePythonAnywhere/)


