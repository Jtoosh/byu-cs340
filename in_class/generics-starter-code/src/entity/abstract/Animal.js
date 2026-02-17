"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animal = void 0;
var Animal = /** @class */ (function () {
    function Animal(name, trainingPriority) {
        this.trainingPriority = trainingPriority;
        this.name = name;
    }
    Animal.getPetSorted = function (petList) {
        return petList.sort(function (pet1, pet2) {
            return pet1.trainingPriority < pet2.trainingPriority ? -1 : 1;
        });
    };
    Animal.getPetsPriorityList = function (petList) {
        return petList
            .map(function (pet) {
            return pet.name + "'s training priority: " + pet.trainingPriority + "\n";
        })
            .join("");
    };
    return Animal;
}());
exports.Animal = Animal;
