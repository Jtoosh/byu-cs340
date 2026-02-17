"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dog = void 0;
var Animal_1 = require("./abstract/Animal");
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog(name, trainingPriority, chasesCats, jumpsOnPeople) {
        var _this = _super.call(this, name, trainingPriority) || this;
        _this.chasesCats = chasesCats;
        _this.jumpsOnPeople = jumpsOnPeople;
        return _this;
    }
    Dog.getDogsSummary = function (dogListNotSorted) {
        var dogList = Animal_1.Animal.getPetSorted(dogListNotSorted);
        var easiestDog = dogList[0];
        var mostDifficultDog = dogList[dogList.length - 1];
        var easiestDogString = easiestDog.name +
            " needs the least training" +
            (easiestDog.chasesCats
                ? ", but will need to be watched closely since it likes to chase cats."
                : ", and does not even chase cats") +
            (easiestDog.jumpsOnPeople
                ? " It is friendly and enjoys jumping on people."
                : " It is well behaved and does not jump on people.");
        var mostDifficultDogString = mostDifficultDog.name +
            " needs the most training." +
            (easiestDog.chasesCats
                ? " It chases cats and must be watched closely."
                : " Surprisingly, it does not chase cats.") +
            (easiestDog.jumpsOnPeople
                ? " It jumps at people and sometimes bites."
                : " It does not jump on people but is mean in more subtle ways.");
        var dogTrainingPriorities = Animal_1.Animal.getPetsPriorityList(dogList);
        return (dogTrainingPriorities +
            "\n" +
            easiestDogString +
            "\n" +
            mostDifficultDogString);
    };
    return Dog;
}(Animal_1.Animal));
exports.Dog = Dog;
