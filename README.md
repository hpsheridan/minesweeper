# Minesweeper

## How to play: 
The object of the game is to reveal all the squares that are not mines. Click on any of the grey squares to start the game. A timer will appear and the square you selected will reveal a mine (thereby loosing the game) or an open square/number. Use CTRL+Click to set a flag in a square that represents a guess at where a mine is located. The number on the squares indicate the number of mines that are adjacent or diagonal to the numbered square. Click restart at any time to restart the timer and the game.

## Project Description
This project uses D3 to re-create the popular game Minesweeper. 
This project was created with the intent to deepen my knowledge of the powerful visualization open source JavaScript Library, D3, and to act as a code sample. 


## How to Install and Run the Project

1. Download or Clone repository to your local device. 
Download by clicking the green
```
< > Code
```
 button near the top right hand quadrant of the screen and then selecting the Download Zip option. 
 
Instructions for cloning can be found: 
https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository?platform=windows


2. Ensure that Node.js and NPM are locally accessible by navigating via terminal/command prompt (or similar) to the appropriate folder containing the cloned/downloaded project, then input:

```
node -v
```

```
npm -v
```


If no version number is returned, follow instructions for installing Node and npm 
https://nodejs.org/en/download (pick the option that is most appropriate for your OS).
After downloading, repeat step 2 to make sure that node and npm are installed. Windows: You may have to restart command prompt and open Node.js command prompt.

A more in-depth description of how to install Node.js and npm on Windows. https://phoenixnap.com/kb/install-node-js-npm-on-windows


Ensure that d3 is installed: 
```
npm d3 -v
``` 
if no version number is returned,  https://www.npmjs.com/package/d3. Note: d3 should be installed with Node.js

Install server-lite:  
```
npm i lite-server
```

3. If all above dependencies are installed, and while in project directory, input: 
```
npm start
```
A locally hosted webpage displaying the UI of the minesweeper project will launch. 

To terminate, input:
```
CTRL + C
```
in terminal/command prompt. 
