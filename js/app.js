'use strict';

var productNames = [
  'bag',
  'banana',
  'bathroom',
  'boots',
  'breakfast',
  'bubblegum',
  'chair',
  'cthulhu',
  'dog-duck',
  'dragon',
  'pen',
  'pet-sweep',
  'scissors',
  'shark',
  'sweep',
  'tauntaun',
  'unicorn',
  'usb',
  'water-can',
  'wine-glass'
];

var productMap = {};
var productList = [];
//var message = document.getElementById('message');
var selectionItems = document.getElementById('selectionItems');
//var results = document.getElementById('results');
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

selectionItems.addEventListener('click', function (e) {
  var selectedItem = productMap[e.target.getAttribute('src')];
  selectedItem.numberOfClicks++;
  currentQuestion++;
  if (currentQuestion < totalQuestions) {
    askQuestion();
  } else {
    displayNothing();
  }
});

function displayNothing() {
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
  for (var i in productList) {
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

function Product (name) {
  this.name = name;
  this.imageURL = 'images/' + name + '.jpg';
  this.numberOfClicks = 0;
  this.numberOfShows = 0;
}
