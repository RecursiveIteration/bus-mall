'use strict';

var productNames = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

//Gamestate variables
var gameState = {
  currentQuestion: 0,
  currentItems: [],
  restrictedItems: [],
  productMap: {}
};

//Non game-state variables
var choiceImages = [];
var totalQuestions = 25;
var introText = document.getElementById('intro');
var closeText = document.getElementById('close');
var selectionItems = document.getElementById('selectionItems');
var results = document.getElementById('results');

main(); //Start the game

function main () {
  var previousGameState = getGameState(); //attempt to load previous game state
  //If there was no preivous state saved, start a new game
  if (!previousGameState) {
    createProductMap();
  //Otherwise set the current game state to the state that was loaded
  } else {
    gameState = previousGameState;
  }
  initializeSelectionWindow(); //create window elements
  askQuestion(); //Ask the first question for this session
}

function askQuestion () {
  selectChoices(); //Select 3 random items
  displayChoices(); //Show the 3 selected items
}

//Click event handler
function registerVote (e) {
  try {
    var selectedItemKey = e.target.getAttribute('id');
    gameState.productMap[selectedItemKey].numberOfClicks++;
    for (var i = 0; i < gameState.currentItems.length; i++) {
      gameState.productMap[gameState.currentItems[i]].numberOfShows++;
    }
    gameState.currentQuestion++;
    createOrUpdateGameState();
    if (gameState.currentQuestion < totalQuestions) {
      askQuestion();
    } else {
      selectionItems.removeEventListener('click', registerVote);
      displayNothing();
      printReport();
    }
  } catch (err) {
    alert('Please click on an image.');
  }
}

selectionItems.addEventListener('click', registerVote);

function printReport() {
  var canvas = document.createElement('canvas');
  results.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: getNames(),
      datasets: [{
        label: 'Times Clicked',
        data: getPopularity()[0],
        backgroundColor: '#8f1386',
        borderColor: '#8f1386',
        borderWidth: 1
      },
      {
        label: 'Times Shown',
        data: getPopularity()[1],
        backgroundColor: '#333',
        borderColor: '#333',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
  resetGame();
}

function getNames () {
  var result = [];
  for (var i in gameState.productMap) {
    result.push(gameState.productMap[i].name);
  }
  return result;
}

function getPopularity () {
  var numClicks = [];
  var numShows = [];
  for (var i in gameState.productMap) {
    numClicks.push(gameState.productMap[i].numberOfClicks);
    numShows.push(gameState.productMap[i].numberOfShows);
  }
  return [numClicks, numShows];
}

function displayNothing () {
  for (var i = 2; i >= 0; i--) {
    selectionItems.removeChild(selectionItems.firstChild);
  }
  introText.style.display = 'none';
  closeText.style.display = 'block';
}

function displayChoices () {
  var tempList = [];
  for (var i = 0; i < 3; i++) {
    var item = randomItem(gameState.currentItems);
    tempList.push(gameState.currentItems.splice(gameState.currentItems.indexOf(item), 1)[0]);
    choiceImages[i].setAttribute('src', gameState.productMap[item].imageURL);
    choiceImages[i].setAttribute('id', item);
  }
  gameState.currentItems = tempList;
}

function selectChoices () {
  gameState.currentItems = [];
  if (gameState.restrictedItems.length > 3) {
    gameState.restrictedItems.splice(0, gameState.restrictedItems.length - 3);
  }
  for (var i = 0; i < 3; i++) {
    var nextItem = selectValidItem();
    gameState.currentItems.push(nextItem);
    gameState.restrictedItems.push(nextItem);
  }
}

function createProductMap () {
  for (var i = 0; i < productNames.length; i++) {
    gameState.productMap[productNames[i]] = new Product(productNames[i]);
    setURL(gameState.productMap[productNames[i]]);
  }
}

function initializeSelectionWindow () {
  for (var i = 0; i < 3; i++) {
    var imageBox = document.createElement('div');
    choiceImages[i] = document.createElement('img');
    imageBox.appendChild(choiceImages[i]);
    selectionItems.appendChild(imageBox);
  }
}

function selectValidItem () {
  var selection = randomItem(productNames);
  while (gameState.restrictedItems.includes(selection)) {
    selection = randomItem(productNames);
  }
  return selection;
}

function randomItem (list) {
  var returnIndex = Math.floor(Math.random() * list.length);
  return list[returnIndex];
}

function Product (name) {
  this.name = name;
  this.numberOfClicks = 0;
  this.numberOfShows = 0;
}

function setURL (obj) {
  var ext;
  if (obj.name === 'sweep') ext = '.png';
  else if (obj.name === 'usb') ext = '.gif';
  else ext = '.jpg';
  obj.imageURL = 'images/' + obj.name + ext;
}

function createOrUpdateGameState () {
  var stringifiedGameState = JSON.stringify(gameState);
  localStorage.setItem('gameState', stringifiedGameState);
  return getGameState();
}

function getGameState() {
  return JSON.parse(localStorage.getItem('gameState'));
}

function resetGame() {
  gameState.currentItems = 0;
  createOrUpdateGameState();
}
