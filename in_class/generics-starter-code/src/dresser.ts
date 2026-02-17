type Socks = { style: string; color: string };
type Shirt = { style: string; size: string };
type Pants = { waist: number; length: number };

class Drawer<T> {
  clothes: T[] = [];

  isEmpty(): boolean {
    return this.clothes.length === 0;
  }
  addItem(item: T) {
    this.clothes.push(item);
  }
  removeItem(): T | undefined {
    return this.clothes.pop();
  }

  removeAll(): T[] {
    const clothesPile = this.clothes;
    this.clothes = [];
    return clothesPile;
  }
}

class Dresser<T, U, V> {
  public top: Drawer<T>;
  public middle: Drawer<U>;
  public bottom: Drawer<V>;

  public constructor() {
    this.top = new Drawer<T>();
    this.middle = new Drawer<U>();
    this.bottom = new Drawer<V>();
  }
}

function main() {
  console.log("Starting main function...");
  const drawer1 = new Drawer<Socks>();
  drawer1.addItem({ style: "crew", color: "white" });
  drawer1.addItem({ style: "no-show", color: "black" });

  const sock = drawer1.removeItem();
  console.log(`here is my sock:`, sock);
  console.log("Is drawer empty?", drawer1.isEmpty());

  const restOfSocks = drawer1.removeAll();
  console.log("After removing all, is drawer empty?", drawer1.isEmpty());

  console.log("Making a dresser...")
  const myDresser = new Dresser<Socks, Shirt, Pants>();

  myDresser.top.addItem({ style: "crew", color: "white" });
  myDresser.top.addItem({ style: "no-show", color: "black" });

  myDresser.middle.addItem({style: "crew neck", size: "L"})
  myDresser.middle.addItem({style: "crew neck", size: "L"})

  myDresser.bottom.addItem({waist: 32, length: 32})
  myDresser.bottom.addItem({waist: 34, length:32})

  console.log(`My socks: `, myDresser.top.removeAll())
  console.log(`My shirts:`, myDresser.middle.removeAll())
  console.log(`My pants: `, myDresser.bottom.removeAll())

}

main();
