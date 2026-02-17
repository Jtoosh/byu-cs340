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
exports.Cat = void 0;
var Animal_1 = require("./abstract/Animal");
// import { AnimalEntity } from "./abstract/AnimalEntity";
var Cat = /** @class */ (function (_super) {
    __extends(Cat, _super);
    function Cat(name, trainingPriority, purrs, climbsFurniture) {
        var _this = _super.call(this, name, trainingPriority) || this;
        _this.purrs = purrs;
        _this.climbsFurniture = climbsFurniture;
        return _this;
    }
    Cat.getCatsSummary = function (catListNotSorted) {
        var catList = Animal_1.Animal.getPetSorted(catListNotSorted);
        var easiestCat = catList[0];
        var mostDifficultCat = catList[catList.length - 1];
        var easiestCatString = easiestCat.name +
            " needs the least training" +
            (easiestCat.purrs
                ? ", and purrs a lot."
                : ", although it rarely purrs.") +
            (easiestCat.climbsFurniture
                ? " It unfortunately climbs furniture a lot, leaving scratches."
                : " It fortunately does not climb furniture.");
        var mostDifficultCatString = mostDifficultCat.name +
            " needs the most training." +
            (easiestCat.purrs
                ? "It is friendly and purrs a lot"
                : " It is grumpy and rarely purrs.") +
            (easiestCat.climbsFurniture
                ? " It unfortunately climbs furniture a lot, leaving scratches."
                : " It fortunately does not climb furniture.");
        var catTrainingPriorities = Animal_1.Animal.getPetsPriorityList(catList);
        return (catTrainingPriorities +
            "\n" +
            easiestCatString +
            "\n" +
            mostDifficultCatString);
    };
    return Cat;
}(Animal_1.Animal));
exports.Cat = Cat;
