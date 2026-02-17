"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cat_1 = require("./entity/Cat");
var Dog_1 = require("./entity/Dog");
console.log();
var catList = [
    new Cat_1.Cat("Calvin", 10, true, false),
    new Cat_1.Cat("Jordan", 3, false, false),
    new Cat_1.Cat("Clara", 9, true, true),
];
console.log(Cat_1.Cat.getCatsSummary(catList));
console.log("\n");
var dogList = [
    new Dog_1.Dog("Clifford", 2, true, false),
    new Dog_1.Dog("Lily", 7, false, false),
    new Dog_1.Dog("Corinne", 3, true, true),
];
console.log(Dog_1.Dog.getDogsSummary(dogList));
