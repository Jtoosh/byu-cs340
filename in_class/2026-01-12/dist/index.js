"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Position {
    file;
    rank;
    constructor(file, rank) {
        this.file = file;
        this.rank = rank;
    }
}
function findDistance(position1, position2) {
    return {
        rankDistance: Math.abs(position1['rank'] - position2['rank']),
        fileDistance: Math.abs(position1['file'].charCodeAt(0) - position2['file'].charCodeAt(0))
    };
}
const findDistance1 = function (position1, position2) {
    return {
        rankDistance: Math.abs(position1['rank'] - position2['rank']),
        fileDistance: Math.abs(position1['file'].charCodeAt(0) - position2['file'].charCodeAt(0))
    };
};
const findDistanceArrow = (position1, position2) => {
    return {
        rankDistance: Math.abs(position1['rank'] - position2['rank']),
        fileDistance: Math.abs(position1['file'].charCodeAt(0) - position2['file'].charCodeAt(0))
    };
};
const findDistanceShorthand = (position1, position2) => ({ rankDistance: Math.abs(position1['rank'] - position2['rank']), fileDistance: Math.abs(position1['file'].charCodeAt(0) - position2['file'].charCodeAt(0)) });
function main() {
    const pos1 = new Position('A', 1);
    const pos2 = new Position('C', 4);
    console.log(findDistance(pos1, pos2));
    console.log(findDistance1(pos1, pos2));
    console.log(findDistanceArrow(pos1, pos2));
    console.log(findDistanceShorthand(pos1, pos2));
}
main();
//# sourceMappingURL=index.js.map