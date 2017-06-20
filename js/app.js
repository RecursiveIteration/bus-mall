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

var productMap = {};
var productList = [];
var selectionItems = document.getElementById('selectionItems');
var results = document.getElementById('results');
var currentQuestion = 0;
var totalQuestions = 25;
var choiceImages = [];
var currentItems = [];
var restrictedItems = [];

main();

function main () {
  createProducts();
  createProductMap();
  initializeSelectionWindow();
  askQuestion();
}

function askQuestion () {
  selectChoices();
  displayChoices();
}

function registerVote (e) {
  var selectedItem = productMap[e.target.getAttribute('src')];
  selectedItem.numberOfClicks++;
  currentQuestion++;
  if (currentQuestion < totalQuestions) {
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
}

function getNames () {
  var result = [];
  for (var i = 0; i < productList.length; i++) {
    result.push(productList[i].name);
  }
  return result;
}

function getPopularity () {
  var result = [];
  for (var i = 0; i < productList.length; i++) {
    try {
      var percent = productList[i].numberOfClicks / productList[i].numberOfShows;
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
  for (var i = 0; i < 3; i++) {
    var item = randomItem(currentItems);
    currentItems.splice(currentItems.indexOf(item), 1);
    choiceImages[i].setAttribute('src', item.imageURL);
  }
}

function selectChoices () {
  currentItems = [];
  if (restrictedItems.length > 3) {
    restrictedItems.splice(0, restrictedItems.length - 3);
  }
  for (var i = 0; i < 3; i++) {
    var nextItem = selectValidItem();
    nextItem.numberOfShows++;
    currentItems.push(nextItem);
    restrictedItems.push(nextItem);
  }
}

function createProducts () {
  for (var i in productNames) {
    productList.push(new Product(productNames[i]));
  }
}

function createProductMap () {
  for (var i = 0; i < productList.length; i++) {
    productMap[productList[i].imageURL] = productList[i];
  }
}

function initializeSelectionWindow () {
  for (var i = 0; i < 3; i++) {
    choiceImages[i] = document.createElement('img');
    selectionItems.appendChild(choiceImages[i]);
  }
}

function selectValidItem () {
  var selection = randomItem(productList);
  while (restrictedItems.includes(selection)) {
    selection = randomItem(productList);
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
