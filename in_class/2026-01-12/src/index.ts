type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type File = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

class Position {
  constructor(
    private file: File,
    private rank: Rank
  ) {}
}

function findDistance(position1: Position, position2: Position): {rankDistance: number, fileDistance: number} {
  return {
    rankDistance: Math.abs(position1['rank'] - position2['rank']),
    fileDistance: Math.abs(position1['file'].charCodeAt(0) - position2['file'].charCodeAt(0))
  }
  
}

const findDistanceExpression = function(position1: Position, position2: Position): {rankDistance: number, fileDistance: number} {
  return {
    rankDistance: Math.abs(position1['rank'] - position2['rank']),
    fileDistance: Math.abs(position1['file'].charCodeAt(0) - position2['file'].charCodeAt(0))
  }
  
}

const findDistanceArrow = (position1: Position, position2: Position): {rankDistance: number, fileDistance: number} => {
  return {
    rankDistance: Math.abs(position1['rank'] - position2['rank']),
    fileDistance: Math.abs(position1['file'].charCodeAt(0) - position2['file'].charCodeAt(0))
  }
  
}

const findDistanceShorthand = (position1: Position, position2: Position): {rankDistance: number, fileDistance: number} =>
 ({ rankDistance: Math.abs(position1['rank'] - position2['rank']), fileDistance: Math.abs(position1['file'].charCodeAt(0) - position2['file'].charCodeAt(0))}) 

function main() {
  const pos1 = new Position('A', 1);
  const pos2 = new Position('C', 4);

  console.log(findDistance(pos1, pos2));
  console.log(findDistanceExpression(pos1, pos2));
  console.log(findDistanceArrow(pos1, pos2));
  console.log(findDistanceShorthand(pos1, pos2));
}

main();