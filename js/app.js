'use strict';

var products = [
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

function Product (name) {
  this.name = name;
  this.imageURL = '../images' + name + '.jpg';
  this.numberOfClicks = 0;
  this.numberOfShows = 0;
}
