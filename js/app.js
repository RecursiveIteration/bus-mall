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
var productList = [];
//var message = document.getElementById('message');
var selectionItems = document.getElementById('selectionItems');
//var results = document.getElementById('results');
var totalQuestions = 25;
var pic1, pic2, pic3;
var choiceImages = [pic1, pic2, pic3];
var currentItems = [];
var restrictedItems = [];

main();

function main () {
  createProducts();
  initializeSelectionWindow();
  for (var i = 0; i < totalQuestions; i++) {
    askQuestion();
  }
}

function askQuestion () {
  selectChoices();
  displayChoices();
}

function displayChoices () {
  for (var i in currentItems) {
    choiceImages[i].setAttribute('src', currentItems[i].imageURL);
  }
}

function selectChoices () {
  currentItems = [];
  for (var i = 0; i < 3; i++) {
    currentItems.push(selectValidItem());
  }
}

function createProducts () {
  for (var i in productNames) {
    productList.push(new Product(productNames[i]));
  }
}

function initializeSelectionWindow () {
  for (var i in choiceImages) {
    choiceImages[i] = document.createElement('img');
    selectionItems.appendChild(choiceImages[i]);
  }
}

function selectValidItem () {
  var selection = randomItem();
  if (selection in restrictedItems) {
    selection = randomItem;
  }
  return selection;
}

function randomItem () {
  var returnIndex = Math.floor(Math.random() * productList.length);
  return productList[returnIndex];
}

function Product (name) {
  this.name = name;
  this.imageURL = 'images/' + name + '.jpg';
  this.numberOfClicks = 0;
  this.numberOfShows = 0;
}
