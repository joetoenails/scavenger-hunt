<p align='center'>
  <img src="https://icons.iconarchive.com/icons/babasse/old-school/256/recherche-icon.png" width="80" height="80"/>
</p>
 <h2 align='center' border-bottom='none'>The Magic Webcam Scavenger Hunt</h2>

## What this project is
The Magic Webcam Scavenger Hunt pits you against another player (right now, they should be on the same wifi network lol) in a machine-learning driven scavenger hunt  to find 1 of 4 random items in your own home. Machine learning allows your webcam to recognize common household items like coffee mugs, corkscrews, envelopes, flowerpots, and more. The first player to hold the correct item up to the webcam wins! This game is meant to be a simple proof of concept for a type of video/remote based mini-game that could be integrated into a video chat client like Zoom or Google Hangouts.

## ScreenShots
Welcome Screen
![Image](https://i.imgur.com/VJADMmc.jpg)

Game Page
![Image](https://i.imgur.com/dxgAeQ8.jpg)

## Tech Stack

<b>Built with</b>
- [Socket.io](http://socket.io/)
- [WebRTC](https://webrtc.org/)
- [TensorFlow & ImageNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet)
- [React](https://reactjs.org/)
- NodeJS
- Express

## Features
- Ability of your webcam to recognize items in your video stream
- State changes are communicated to all players (for instance, when one player hits start game, all other player countdowns are triggered, game state dynamically shows if you or the other player is the winner)
- Ability to play multiple rounds with different objects

## Installation
Fork and clone this repo, and then make sure to run npm install. I recommend using npm run start-dev for fast webpack compilation times and to get you up and running on the browser.

## More
This project was built over the course of 3 days for Fullstack Academy's "Stackathon." It's most definitely still a work in progress, but I'm hoping to soon add the ability to play with more than two players, have different game rooms available, and improve the reliability of the video connection.

