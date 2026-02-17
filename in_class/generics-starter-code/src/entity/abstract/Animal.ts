export abstract class Animal {
  name: string;
  trainingPriority: number;

  constructor(name: string, trainingPriority: number) {
    this.trainingPriority = trainingPriority;
    this.name = name;
  }

  static getPetSorted<T extends Animal>(petList: T[]) {
    return petList.sort((pet1, pet2) =>
      pet1.trainingPriority < pet2.trainingPriority ? -1 : 1
    );
  }
  static getPetsPriorityList<T extends Animal>(petList: T[]): string {
    return petList
      .map(
        (pet) =>
          pet.name + "'s training priority: " + pet.trainingPriority + "\n"
      )
      .join("");
  }
}
