'use strict';

var productNames = [
  ['bag', 'images/bag.jpg'],
  ['banana', 'images/banana.jpg'],
  ['bathroom', 'images/bathroom.jpg'],
  ['boots', 'images/boots.jpg'],
  ['breakfast', 'images/breakfast.jpg'],
  ['bubblegum', 'images/bubblegum.jpg'],
  ['chair', 'images/chair.jpg'],
  ['cthulhu', 'images/cthulhu.jpg'],
  ['dog-duck', 'images/dog-duck.jpg'],
  ['dragon', 'images/dragon.jpg'],
  ['pen', 'images/pen.jpg'],
  ['pet-sweep', 'images/pet-sweep.jpg'],
  ['scissors', 'images/scissors.jpg'],
  ['shark', 'images/shark.jpg'],
  ['sweep', 'images/sweep.png'],
  ['tauntaun', 'images/tauntaun.jpg'],
  ['unicorn', 'images/unicorn.jpg'],
  ['usb', 'images/usb.gif'],
  ['water-can', 'images/water-can.jpg'],
  ['wine-glass', 'images/wine-glass.jpg']
];

//Gamestate variables
var gameState = {
  currentQuestion: 0,
  currentItems: [],
  restrictedItems: [],
  productList: [],
  productMap: {}
};

//Non game-state variables
var choiceImages = [];
var totalQuestions = 25;
var selectionItems = document.getElementById('selectionItems');
var results = document.getElementById('results');

main();

function main () {
  var previousGameState = getGameState();
  if (!previousGameState) {
    createProducts();
    createProductMap();
  } else {
    gameState = previousGameState;
  }
  initializeSelectionWindow();
  createOrUpdateGameState();
  askQuestion();
}

function askQuestion () {
  selectChoices();
  displayChoices();
}

function registerVote (e) {
  var selectedItem = gameState.productMap[e.target.getAttribute('src')];
  selectedItem.numberOfClicks++;
  for (var i = 0; i < gameState.currentItems.length; i++) {
    console.log(gameState.currentItems.length);
    gameState.currentItems[i].numberOfShows++;
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
        label: 'Popularity',
        data: getPopularity(),
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
  clearGameState();
}

function getNames () {
  var result = [];
  for (var i = 0; i < gameState.productList.length; i++) {
    result.push(gameState.productList[i].name);
  }
  return result;
}

function getPopularity () {
  var result = [];
  for (var i = 0; i < gameState.productList.length; i++) {
    try {
      var percent = gameState.productList[i].numberOfClicks / gameState.productList[i].numberOfShows;
      result.push(percent);
    } catch (err) {
      result.push(0);
    }
  }
  return result;
}

function displayNothing () {
  for (var i = 2; i >= 0; i--) {
    selectionItems.removeChild(choiceImages[i]);
  }
}

function displayChoices () {
  var tempList = [];
  for (var i = 0; i < 3; i++) {
    var item = randomItem(gameState.currentItems);
    tempList.push(gameState.currentItems.splice(gameState.currentItems.indexOf(item), 1)[0]);
    choiceImages[i].setAttribute('src', item.imageURL);
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

function createProducts () {
  for (var i in productNames) {
    gameState.productList.push(new Product(productNames[i]));
  }
}

function createProductMap () {
  for (var i = 0; i < gameState.productList.length; i++) {
    gameState.productMap[gameState.productList[i].imageURL] = gameState.productList[i];
  }
}

function initializeSelectionWindow () {
  for (var i = 0; i < 3; i++) {
    choiceImages[i] = document.createElement('img');
    selectionItems.appendChild(choiceImages[i]);
  }
}

function selectValidItem () {
  var selection = randomItem(gameState.productList);
  while (gameState.restrictedItems.includes(selection)) {
    selection = randomItem(gameState.productList);
  }
  return selection;
}

function randomItem (itemList) {
  var returnIndex = Math.floor(Math.random() * itemList.length);
  return itemList[returnIndex];
}

function Product (info) {
  this.name = info[0];
  this.imageURL = info[1];
  this.numberOfClicks = 0;
  this.numberOfShows = 0;
}

function createOrUpdateGameState () {
  var stringifiedGameState = JSON.stringify(gameState);
  localStorage.setItem('gameState', stringifiedGameState);
  return getGameState();
}

function getGameState() {
  return JSON.parse(localStorage.getItem('gameState'));
}

function clearGameState() {
  localStorage.removeItem('gameState');
  return getGameState();
}
