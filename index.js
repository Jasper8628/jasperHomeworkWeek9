const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
const appendFileAsync = util.promisify(fs.appendFile);

const pdf = require("pdf-creator-node");

let queryUrl;
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyC64aNkKnCmu7MgUJ60TaZlzarYnFQinYQ',
  Promise: Promise
});
const questions = [{
  message: "Enter your GitHub username",
  name: "username"
},
{
  message: "What is your favorite color?",
  name: "color"
}
]
let location;
let color;
inquirer
  .prompt(questions)
  .then(function (answers) {
    console.log(answers);
    queryUrl = `https://api.github.com/users/${answers.username}`;
    color=answers.color;
    axios
      .get(queryUrl)
      .then(function (res) {
        //console.log(res.data);
        const username = res.data.login;
        const website = res.data.html_url;
        const blog = res.data.blog;
        const userBio = res.data.bio;
        const publicRepos = res.data.public_repos;
        const numFollowers = res.data.followers;
        const numFollowing = res.data.following;
        location = res.data.location;
        console.log("Location: " + res.data.location);
        const imgUrl = res.data.avatar_url;

        googleMapsClient.geocode({ address: location })
          .asPromise()
          .then((response) => {
            console.log(response.json.results[0]);
          })
          .catch((err) => {
            console.log(err);
          });
        const profile = `<html>

        <head>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        
        </head>
        
        <body>
            <div class="jumbotron" style="width: 50%;background-color: ${color};">
                <img class="card-img-top" src="${imgUrl}" alt="Card image cap">
                <div class="card-body">
                    <h3 class="card-title">${username}</h3>
                    <p class="card-text">${userBio}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Followers: ${numFollowers}</li>
                    <li class="list-group-item">Following: ${numFollowing}</li>
                    <li class="list-group-item">Public repos: ${publicRepos}</li>
                    <li class="list-group-item">Location: ${location}</li>
                </ul>
                <div class="card-body">
                    <a href="# ${website}" class="card-link">${website}</a>
                    <a href="#" class="card-link">${blog}</a>
                </div>
            </div>
        
        </body>
        
        </html>

          `;
        /* fs.writeFile("Profile.html", profile, function (err) {
          if (err) {
            throw err;
          }
        }); */

        //const html = fs.readFileSync('Profile.html', 'utf8');
        const options={};
        const document={
          html:profile,
          path:"./profile.pdf"
        };
        pdf.create(document, options)
          .then(res => {
            console.log(res)
          })
          .catch(error => {
            console.error(error)
          });

      });
  });



