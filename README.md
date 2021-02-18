<p align='center'>
  <img src="https://icons.iconarchive.com/icons/babasse/old-school/256/recherche-icon.png" width="80" height="80"/>
</p>
 <h2 align='center' border-bottom='none'>The Magic Webcam Scavenger Hunt</h2>

## What this project is
The Magic Webcam Scavenger Hunt pits you against another player (right now, they should be on the same wifi network lol) in a machine-learning driven scavenger hunt  to find 1 of 4 random items in your own home. Machine learning allows your webcam to recognize common household items like coffee mugs, corkscrews, envelopes, flowerpots, and more. The first player to hold the correct item up to the webcam wins! This game is meant to be a simple proof of concept for a type of video/remote based mini-game that could be integrated into a video chat client like Zoom or Google Hangouts.

## ScreenShots
Welcome Screen
<img src="https://lh3.googleusercontent.com/ZsDCHzPXrqrC-9shaZJbJ-yfkCUxQwINMmMWtSyfGo5YlOyxgXIkYYpKfe7mpUILhT08IR-qAf0K42rYYoro4YnIt1ch_sR-vvoN3O6aK0XSjJhDQi1f6fbVrtKSoc5JHBwjr-ZOkxa4S8GhkjRupdpGVftYn-7l0YhnBGC0M0f1xW-KAbVLfFu_RjA5fjgZvF4VuSY8AnWI06U6eZ2DrsFWbIlY_rYPyxtx7RGYjVaOusJKQ5FCAXoGmzj7FuFe-_Sp42iK4CNLBsth-4GLfjuXOlAQGKaJeb6KLosdr3ckpVC9BwSNSnf-d8A7JZclPSlhBsQbOVPWwKOjF2ZWQvqRG-P3NIfB3bMs2Qa-umbfl4HggJSrUZOaXB4WHk0ANCq9QADaM7Kmw2axz-WbG0zkvpHmOMznnwvBk09gUMRbN4vQHTABPvx64zJJrgiqSn1HXZ3XikIl30NF9REBHVVf9eeaNh7THIw4aOpYCGqTVLObTb8meVhmslcJzMCn5RTOLmJmwh-pQz8YvxyJj4AmoojjF-XXdSbZlpLK6sCUOO1RWzEj9Qfj5kzuPBKEz4tQy1Uemqsrno96tJIErJ9RRzGUd5ouWWUpb_RWBcY9G0zT9hOH0_kngIXxEdxU2seS045zBmoLiCTcf91L4t2jD2Ml8vQmDLt8AXwUKgzU1ysjZw-O3OKMxqrUj4o=w1280-h720-no?authuser=0"/>

Game Page
<img src="https://lh3.googleusercontent.com/aeNwN9k683Qd5jMwrSFum3OR0uuQvBY7zSa4l-FqqsBUHbHiVXD0wdjOB2briy9TVo-kG7KMH5GFXubMiy48grc3n_L3hffSLBcTQwoUWWr5pmPi7Jny4iq6ISH9_Qn2EE-6-t5AlR5ZfVAa79K0ORBCjYJKV-nPf-ohPaUzVDjwSPy35YxqFYji9KlrmSeMjbjcXXdW7jXNpvO88GbqV9OCKG9DJ-hXh3XeSGwW8V8bLzbzMxXD9bbZSLD9k5Y2Xo1FgUufp0nISgyoy-j3a4JpuhmWPI4VzRCbPXb41rq7LWR8cnD8AzXqVf2N6KEbiftXsvoikvCHCBoUUHgPR34tE6LnsyDgEY622DNBjpSg0QQK19V_HDMGsyf9cNDZ8gplnd33h0nj-Cm6CCg4tZ-sLLoRSpEZ837q5Ajs0ldkh4GCK-eV0aP1PtaoqNvVA7iokLpDvSWqFEXxa9XNiCMEP2BJia3TjlEHLZa-z-EmIo2umQmDo9sA9g_ZIvJmha5xah4v6Mly0G1rCH4uj3w3C7zmoyYTyh_xwyhUbfKx2XRYUuvpAQtbdINxqnZhZ3dWpBBAJv62RKzlJv3EoEyhMWDZC3KQWaugF8PqaTS7i2tqzFaZ7l_2LhdyhEdQWuPHYxzgc3GVAY9nNmfzcIQI2JWSnirljQJb-vagLtREDWICal-psDdpJtt-EkM=w1280-h694-no?authuser=0"/>

## Tech Stack

<b>Built with</b>
- [Socket.io](http://socket.io/)
- [WebRTC](https://webrtc.org/)
- [TensorFlow & ImageNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet)
- [React](https://reactjs.org/)

## Features
- Ability of your webcam to recognize items in your video stream
- State changes are communicated to all players (for instance, when one player hits start game, all other player countdowns are triggered, game state dynamically shows if you or the other player is the winner)
- Ability to play multiple rounds with different objects

## Installation
Fork and clone this repo, and then make sure to run npm install. I recommend using npm run start-dev for fast webpack compilation times and to get you up and running on the browser.

## More
This project was built over the course of 3 days for Fullstack Academy's "Stackathon." It's most definitely still a work in progress, but I'm hoping to soon add the ability to play with more than two players, have different game rooms available, and improve the reliability of the video connection.

