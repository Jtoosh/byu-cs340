
// 1. Explain why/how this program violates the Single Responsibility Principle
/*
This program is both formatting the data into CSV, but it also makes the decision of where to put the output data and in what format.
This limits the program because it can only be output in one way.
*/
// 2. Explain how you would refactor the program to improve its design.
/* 
To improve the design of the program, I'd rename it to CsvFormatter, and change the methods accordingly.
Then I would make the public function return either a string or an object, which a writer would handle separately.
*/

export class CsvWriter {

	public write(lines: string[][] ) {
		for (let i = 0; i < lines.length; i++)
			this.writeLine(lines[i]);
	}

	private writeLine(fields: string[]) {
		if (fields.length == 0)
			console.log();
		else {
			this.writeField(fields[0]);

			for (let i = 1; i < fields.length; i++) {
				console.log(",");
				this.writeField(fields[i]);
			}
			console.log();
		}
	}

	private writeField(field: string) {
		if (field.indexOf(',') != -1 || field.indexOf('\"') != -1)
			this.writeQuoted(field);
		else
			console.log(field);
	}

	private writeQuoted(field: string) {
		console.log('\"');
		for (let i = 0; i < field.length; i++) {
			let c: string = field.charAt(i);
			if (c == '\"')
				console.log("\"\"");
			else
				console.log(c);
		}
		console.log('\"');
	}
}
