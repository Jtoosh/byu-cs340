
// This program violates the principles of High-Quality Abstraction, Primitive Obsession, and Information Hiding.
// 
// 1. Explain why/how this program violates the above principles.
/*
It violates the High-Quality Abstraction principle by using primitives like string[] and number for board and position, respectively. These two are prime areas to use
separate classes to help make the code more cohesive and validate inputs.

That violation of HQA and using primitives bleeds into information hiding. If classes were made for fields like board, the details of how board works could be kept from
Game class.

Also, none of the methods or fields are labeled with access modifiers. In TypeScript, default access level when no modifier is provided is public, which violates the 
Information Hiding principle.
*/
// 2. Explain how you would refactor the code to improve its design.
/*
I would start by making a separate board class, and most likely moving the move method into that class.
Next I would review all of the fields and methods in that board class and the Game class, and add `private` access modifiers to all of them expect those that other 
modules need access to.
*/

export class Game {

	board: string[];

	constructor(board: string[], position: number = -1, player: string = '') {
		this.board = [...board];
		
		if (position >= 0 && player !== "") {
			this.board[position] = player;
		}
	}

	move(player: string): number {
		for (let i = 0; i < 9; i++) {
			if (this.board[i] == "-") {
				let game = this.play(i, player);
				if (game.winner() == player) {
					return i;
				}
			}
		}

		for (let i = 0; i < 9; i++) {
			if (this.board[i] == "-") {
				return i;
			}
		}
		return -1;
	}

	play(position: number, player: string): Game {
		return new Game(this.board, position, player);
	}

	winner(): string {
		if (this.board[0] != "-" &&
			this.board[0] == this.board[1] &&
			this.board[1] == this.board[2]) {

			return this.board[0]
		}
		if (this.board[3] != "-" &&
			this.board[3] == this.board[4] &&
			this.board[4] == this.board[5]) {

			return this.board[3]
		}
		if (this.board[6] != "-" &&
			this.board[6] == this.board[7] &&
			this.board[7] == this.board[8]) {
			return this.board[6]
		}

		return "-";
	}
}

export class GameTest {

	testDefaultMove() {
		let game = new Game(this.stringToCharArray("XOXOX-OXO"));
		this.assertEquals(5, game.move('X'));

		game = new Game(this.stringToCharArray("XOXOXOOX-"));
		this.assertEquals(8, game.move('O'));

		game = new Game(this.stringToCharArray("---------"));
		this.assertEquals(0, game.move('X'));

		game = new Game(this.stringToCharArray("XXXXXXXXX"));
		this.assertEquals(-1, game.move('X'));
	}

	testFindWinningMove() {
		let game = new Game(this.stringToCharArray("XO-XX-OOX"));
		this.assertEquals(5, game.move('X'));
	}
	
	testWinConditions() {
		let game = new Game(this.stringToCharArray("---XXX---"));
		this.assertEquals('X', game.winner());
	}

	private assertEquals(expected: string | number, actual: string | number){
		if (expected !== actual) {
			console.error(`${expected} != ${actual}`);
		}
	}

	private stringToCharArray(str: string): string[] {
		let result: string[] = [];
		for (const char of str) {
			result.push(char);
		}
		return result;
	}
}

// Test Driver

let gameTest = new GameTest();
gameTest.testDefaultMove();
gameTest.testFindWinningMove();
gameTest.testWinConditions();
