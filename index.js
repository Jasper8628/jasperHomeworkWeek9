const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util=require("util");

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
inquirer
  .prompt(questions)
  .then(function (username) {
    console.log(username);
    queryUrl = `https://api.github.com/users/${username.username}`;
    axios
      .get(queryUrl)
      .then(function (res) {
        //console.log(res.data);
        console.log("user name: " + res.data.login);
        console.log("website: " + res.data.url);
        console.log("blog: " + res.data.blog);
        console.log("user bio: " + res.data.bio);
        console.log("Public repos: " + res.data.public_repos);
        console.log("Number of followers: " + res.data.followers);
        console.log("Number of following: " + res.data.following);
        location = res.data.location;
        console.log("Location: " + res.data.location);
        console.log(res.data.avatar_url);

        googleMapsClient.geocode({ address: location })
          .asPromise()
          .then((response) => {
            console.log(response.json.results[0]);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  });



