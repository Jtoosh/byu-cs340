
// 1. What design principle(s) does this code violate?
/*
 It might violate SRP because it deals directly with the database. This creates 2 responsibilities: creating and handling Course objects, and updating the database
 This also maximizes the dependency that Course has on the database, making them tightly coupled, which we don't want.

*/ 
// 2. Explain how you would refactor this code to improve its design.
/*
I would create a separate service class for data access, to separate the creation of internal Course objects and updating them according to input, and accessing/updating
those objects in the database.
*/


export class Course {

	name: string;
	credits: number;

	constructor(name: string, credits: number) {
		this.name = name;
		this.credits = credits;
	}

	static async create(name: string, credits: number): Promise<Course> {

		// ... Code to insert a new Course object into the database ...

	}

	static async find(name: string): Promise<Course | undefined> {

		// ... Code to find a Course object in the database ...

	}

	async update(): Promise<void> {

		// ... Code to update a Course object in the database ...

	}

}
