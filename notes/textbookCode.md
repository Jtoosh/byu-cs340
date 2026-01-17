# Textbook Code Examples, CS340: Software Design

## Learning React, 2nd Edition, by Alex Banks and Eve Porcello

### Chapter 1: Welcome to React

This chapter is mostly conceptual, so there is not much code to demonstrate.

One thing I did want to add was the basic commands for adding and using `yarn` if I ever want to use that instead of `npm`.

```bash
npm install -g yarn

#To add a package:
yarn add package-name

#To remove a package:
yarn remove package-name
```

### Chapter 2: JavaScript For React

#### Declaring Variables

Before ES6, JavaScript had only the `var` keyword for declaring variables. ES6 introduced `let` and `const`, which provide block scope and immutability, respectively.

```javascript
// Using var
var pizza = true;
pizza = false;
console.log(pizza); // false
```
Now, using `const`:

```javascript
const pizza = true;
pizza = false; // This will throw a TypeError
```

Without let, block scope is not enforced:

```javascript
// Block scope example - without var

var topic = "JavaScript";

if (topic) {
  var topic = "React";
  console.log("block", topic); // block React
}

console.log("global", topic); // global React
```

With let, block scope is enforced:

```javascript
var topic = "JavaScript";

if (topic) {
  let topic = "React";
  console.log("block", topic); // React
}

console.log("global", topic); // JavaScript
```
Curly braces also don't define a new scope in `for` loops when using `var`:

```javascript
var div,
  container = document.getElementById("container");

for (var i = 0; i < 5; i++) {
  div = document.createElement("div");
  div.onclick = function() {
    alert("This is box #" + i);
  };
  container.appendChild(div);
}
```

The alert will always show 5 because `i` is not block scoped.

With `let`, each iteration of the loop has its own scope:

```javascript
const container = document.getElementById("container");
let div;
for (let i = 0; i < 5; i++) {
  div = document.createElement("div");
  div.onclick = function() {
    alert("This is box #: " + i);
  };
  container.appendChild(div);
}
```
#### Declaring Functions

Function declarations are hoisted, while function expressions are not.

**Hoisted** means that the declaration of the function is moved to the top of its scope before code execution.

This function declaration will work, because of hoisting:

```javascript
// Invoking the function before it's declared
hey();
// Function Declaration
function hey() {
  alert("hey!");
}
```

For the same reason, this function expression will not work:

```javascript
// Invoking the function before it's declared
hey();
// Function Expression
const hey = function() {
  alert("hey!");
};

TypeError: hey is not a function
```

Default parameters are allowed in ES6:

```javascript
function logActivity(name = "Shane McConkey", activity = "skiing") {
  console.log(`${name} loves ${activity}`);
}
```

Arrow functions provide a shorter syntax and lexical `this` scoping:   

```javascript
const lordify = firstName => `${firstName} of Canterbury`;
console.log(lordify("Alan")); // Alan of Canterbury
```
Arrow functions with multiple parameters x:

```javascript
const lordify = (firstName, land) => `${firstName} of ${land}`;
console.log(lordify("Alan", "Canterbury")); // Alan of Canterbury
```
Arrow functions with a function body:

```javascript
const lordify = (firstName, land) => {
  if (!firstName) {
    throw new Error("A firstName is required to lordify");
  }

  if (!land) {
    throw new Error("A lord must have a land");
  }

  return `${firstName} of ${land}`;
};

console.log(lordify("Kelly", "Sonoma")); // Kelly of Sonoma
console.log(lordify("Dave")); // ! JAVASCRIPT ERROR
```

Returning object literals from arrow functions has a syntax nuance that can cause lots of bugs if overlooked:

```javascript
const person = (firstName, lastName) =>
    {
        first: firstName,
        last: lastName
    }

console.log(person("Brad", "Janson"));
```

This will throw the error `Uncaught SyntaxError: Unexpected token :` because the curly braces are interpreted as a function body, not an object literal. This can be fixed by wrapping the object literal in parentheses:

```javascript
const person = (firstName, lastName) => ({
  first: firstName,
  last: lastName
});

console.log(person("Flad", "Hanson"));
// {first: "Flad", last: "Hanson"}
```
Regular functions have their own `this` context, while arrow functions inherit `this` from their surrounding scope:

```javascript
const tahoe = {
  mountains: ["Freel", "Rose", "Tallac", "Rubicon", "Silver"],
  print: function(delay = 1000) {
    setTimeout(function() {
      console.log(this.mountains.join(", "));
    }, delay);
  }
};

tahoe.print(); // Uncaught TypeError: Cannot read property 'join' of undefined
```

And now, with an arrow function:

```javascript
const tahoe = {
  mountains: ["Freel", "Rose", "Tallac", "Rubicon", "Silver"],
  print: function(delay = 1000) {
    setTimeout(() => {
      console.log(this.mountains.join(", "));
    }, delay);
  }
};

tahoe.print(); // Freel, Rose, Tallac, Rubicon, Silver
```
#### Compiling JavaScript with Babel

When compiling newer JS syntax like this:

```javascript
const add = (x = 5, y = 10) => console.log(x + y);
```
Babel will convert it to older syntax for compatibility:

```javascript
"use strict";

var add = function add() {
  var x =
    arguments.length <= 0 || arguments[0] === undefined ? 5 : arguments[0];
  var y =
    arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];
  return console.log(x + y);
};
```

#### Objects and Arrays

#### Destructuring Objects

Object destructuring allows you to extract properties from objects into variables, and "filter" them out, if desired:

```javascript
const sandwich = {
  bread: "dutch crunch",
  meat: "tuna",
  cheese: "swiss",
  toppings: ["lettuce", "tomato", "mustard"]
};

const { bread, meat } = sandwich;

console.log(bread, meat); // dutch crunch tuna
```

Object destructuring can also be used in function parameters. Consider the following function:

```javascript
const lordify = regularPerson => {
  console.log(`${regularPerson.firstname} of Canterbury`);
};

const regularPerson = {
  firstname: "Bill",
  lastname: "Wilson"
};

lordify(regularPerson); // Bill of Canterbury
```

Now, using object destructuring in the function parameter:

```javascript
const lordify = ({ firstname }) => {
  console.log(`${firstname} of Canterbury`);
};

const regularPerson = {
  firstname: "Bill",
  lastname: "Wilson"
};

lordify(regularPerson); // Bill of Canterbury
```

Now, let's, say that the `regularPerson` object has been changed, and now we want the `firstname` of the `spouse` property, which is another object. Simply use nested destructuring:

```javascript
const lordify = ({ spouse: { firstname } }) => {
  console.log(`${firstname} of Canterbury`);
};

lordify(regularPerson); // Phil of Canterbury
```

#### Object Literal Enhancement (Need to understand better)

This is the opposite of destructuring. It allows you to create objects more concisely when the variable names match the property names:

```javascript
const name = "Tallac";
const elevation = 9738;
const print = function() {
  console.log(`Mt. ${this.name} is ${this.elevation} feet tall`);
};

const funHike = { name, elevation, print };

funHike.print(); // Mt. Tallac is 9738 feet tall
```
#### Destructuring Arrays

Array destructuring is primarily based on element position:

```javascript
const [firstAnimal] = ["Horse", "Mouse", "Cat"];

console.log(firstAnimal); // Horse
```

A common method to destructure is called *list matching*:

```javascript
const [, , thirdAnimal] = ["Horse", "Mouse", "Cat"];

console.log(thirdAnimal); // Cat
```
#### The Spread Operator (`...`)

This is one of the most powerful new features in ES6. It can do a few different things, depending on the context.

One of those is combine the contents of arrays:

```javascript
const peaks = ["Tallac", "Ralston", "Rose"];
const canyons = ["Ward", "Blackwood"];
const tahoe = [...peaks, ...canyons];

console.log(tahoe.join(", ")); // Tallac, Ralston, Rose, Ward, Blackwood
```
This creates a third array that contains *not* 2 elements that are arrays, but rather 5 string elements, the individual contents of the 2 source arrays.

The spread operator can also be used to copy arrays. The following code is problematic because it modifies the original array:

```javascript
const peaks = ["Tallac", "Ralston", "Rose"];
const [last] = peaks.reverse();

console.log(last); // Rose
console.log(peaks.join(", ")); // Rose, Ralston, Tallac

```
The spread operator can be used to create a shallow copy of the array before reversing it, preserving the original array:

```javascript
const peaks = ["Tallac", "Ralston", "Rose"];
const [last] = [...peaks].reverse();

console.log(last); // Rose
console.log(peaks.join(", ")); // Tallac, Ralston, Rose
```

It can also be used to collect function arguments into an array. When this is done, the arguments are referred to as *rest parameters*:

```javascript
function directions(...args) {
  let [start, ...remaining] = args;
  let [finish, ...stops] = remaining.reverse();

  console.log(`drive through ${args.length} towns`);
  console.log(`start in ${start}`);
  console.log(`the destination is ${finish}`);
  console.log(`stopping ${stops.length} times in between`);
}

directions("Truckee", "Tahoe City", "Sunnyside", "Homewood", "Tahoma");
```
This allows for **a dynamic number of arguments** to be passed to the function, which can then be processed as needed.

The spread operator can also be used to combine objects:

```javascript
const morning = {
  breakfast: "oatmeal",
  lunch: "peanut butter and jelly"
};

const dinner = "mac and cheese";

const backpackingMeals = {
  ...morning,
  dinner
};

console.log(backpackingMeals);

// {
//   breakfast: "oatmeal",
//   lunch: "peanut butter and jelly",
//   dinner: "mac and cheese"
// }
```
#### Asynchronous JavaScript

This is a fundamental element of the modern web.

##### Promises and `.then()`

An asynchronous operation is done with `fetch()`, which reaches out to an API endpoint and returns a Promise:

```javascript
console.log(fetch("https://api.randomuser.me/?nat=US&results=1"));
```

*Promises* help make sense of asynchronous behavior. They represent whether an operation is *pending*, *fulfilled*, or *rejected*.

To handle the result of a Promise, you can use `.then()`:

```javascript
fetch("https://api.randomuser.me/?nat=US&results=1").then(res =>
  console.log(res.json())
);
```
Multiple `.then()` calls can be chained together to process the result step-by-step. The return value of each callback in the chain is passed to the next:

```javascript
fetch("https://api.randomuser.me/?nat=US&results=1")
  .then(res => res.json())
  .then(json => json.results)
  .then(console.log)
  .catch(console.error);
```

Errors in any part of the chain can be caught with `.catch()`.

##### Async/Await

Another popular way to handle Promises is with `async`/`await` syntax. This makes asynchronous code look and behave more like synchronous code.

```javascript
const getFakePerson = async () => {
  let res = await fetch("https://api.randomuser.me/?nat=US&results=1");
  let { results } = res.json();
  console.log(results);
};

getFakePerson();
```

`async` is always used on a function declaration, and `await` is used before any "Promise call" (function that returns a Promise) to pause execution until the Promise is resolved.

##### Manually Creating Promises

Promises can also be created and handled manually:

```javascript
const getPeople = count =>
  new Promise((resolves, rejects) => {
    const api = `https://api.randomuser.me/?nat=US&results=${count}`;
    const request = new XMLHttpRequest();
    request.open("GET", api);
    request.onload = () =>
      request.status === 200
        ? resolves(JSON.parse(request.response).results)
        : reject(Error(request.statusText));
    request.onerror = err => rejects(err);
    request.send();
  });
```

#### Classes

Classes can be extended to subclasses using the `extends` keyword. The `super` keyword is used to call the parent class's constructor and methods.

```javascript
// Parent class
class Vacation {
  constructor(destination, length) {
    this.destination = destination;
    this.length = length;
  }

  print() {
    console.log(`${this.destination} will take ${this.length} days.`);
  }
}

// Subclass
class Expedition extends Vacation {
  constructor(destination, length, gear) {
    super(destination, length);
    this.gear = gear;
  }

  print() {
    super.print();
    console.log(`Bring your ${this.gear.join(" and your ")}`);
  }
}
```

#### Modules

##### ES6 Modules

A *module* is a file that contains code to be reused in other files. Modules can export variables, functions, or classes using the `export` keyword, and import them in other files using the `import` keyword.

```javascript
export const print=(message) => log(message, new Date())

export const log=(message, timestamp) =>
  console.log(`${timestamp.toString()}: ${message}`)
```

Modules can also export a single default export:

```javascript
export default new Expedition("Mt. Freel", 2, ["water", "snack"]);
```

To import named exports:

```javascript
import { print, log } from "./text-helpers";
import freel from "./mt-freel";

print("printing a message");
log("logging a message");

freel.print();
```

Note that when importing a module that has multiple exports, object destructuring syntax can be used.

Module variables can be locally scoped to different names, or imported as a whole:

```javascript
import { print as p, log as l } from "./text-helpers";

p("printing a message");
l("logging a message");
```
```javascript
import * as fns from './text-helpers`
```

##### CommonJS

Most newer versions of Node.js now support ES6 modules, but the older CommonJS module system is still widely used.

Rather than `export` and `import`, CommonJS uses `module.exports` and `require()`:

```javascript
//Exporting module (text-helpers.js)
const print(message) => log(message, new Date())

const log(message, timestamp) =>
console.log(`${timestamp.toString()}: ${message}`}

module.exports = {print, log}
```

```javascript
// Importing module
const { log, print } = require("./txt-helpers");
```

### Chapter 3: Functional Programming with JavaScript

This chapter we were just told to skim, so I'll add minimal code examples here.

#### What is Functional Programming?

Example of higher-order functions:

```javascript
const createScream = function(logger) {
  return function(message) {
    logger(message.toUpperCase() + "!!!");
  };
};

const scream = createScream(message => console.log(message));

scream("functions can be returned from other functions");
scream("createScream returns a function");
scream("scream invokes that returned function");

// FUNCTIONS CAN BE RETURNED FROM OTHER FUNCTIONS!!!
// CREATESCREAM RETURNS A FUNCTION!!!
// SCREAM INVOKES THAT RETURNED FUNCTION!!!
```

Now here is the same thing, but using arrow functions:

```javascript
const createScream = logger => message => {
  logger(message.toUpperCase() + "!!!");
};
```

#### Imperative vs Declarative Programming

Functional programming fits into the larger paradigm of *declarative programming*. The opposite of that is *imperative programming*.

Imperative programming focuses on telling the computer *how* to do things, while declarative programming focuses on telling *what* to do, and how to do it is abstracted away.

Here is an example of imperative programming used to make a string URL-friendly:

```javascript
const string = "Restaurants in Hanalei";
const urlFriendly = "";

for (var i = 0; i < string.length; i++) {
  if (string[i] === " ") {
    urlFriendly += "-";
  } else {
    urlFriendly += string[i];
  }
}

console.log(urlFriendly); // "Restaurants-in-Hanalei"
```

And here is a declarative version, with the help of some regex:

```javascript
const string = "Restaurants in Hanalei";
const urlFriendly = string.replace(/ /g, "-");

console.log(urlFriendly);
```

One of the main ideas behind declarative programming is that it requires less comments, because the code itself is more self-commenting and readable. Here is a more extensive example:

```javascript
const loadAndMapMembers = compose(
  combineWith(sessionStorage, "members"),
  save(sessionStorage, "members"),
  scopeMembers(window),
  logMemberInfoToConsole,
  logFieldsToConsole("name.first"),
  countMembersBy("location.state"),
  prepStatesForMapping,
  save(sessionStorage, "map"),
  renderUSMap
);

getFakeMembers(100).then(loadAndMapMembers);
```

#### Functional Programming Concepts

Here are some examples and explanations of core functional programming concepts.

#### Immutability

Rather than changing the original data, functional programming centers on transforming copies of the original data, keeping the original data intact.

```javascript
const rateColor = function(color, rating) {
  return Object.assign({}, color, { rating: rating });
};

console.log(rateColor(color_lawn, 5).rating); // 5
console.log(color_lawn.rating); // 0
```

Another example, this time with arrays:

```javascript
const addColor = (title, array) => array.concat({ title }); // The use of `concat` is important, as it returns a new array, while `push` would modify the original array.

console.log(addColor("Glam Green", list).length); // 4
console.log(list.length); // 3
```

A shorthand for this using the spread operator:

```javascript
const addColor = (title, array) => [...array, { title }];
```

#### Pure Functions

Pure functions always return a value or a function, and they do not alter any of the global state or variables outside of their scope.

Here is an example of an impure function:

```javascript
const frederick = {
  name: "Frederick Douglass",
  canRead: false,
  canWrite: false
};

const selfEducate = person => {
  person.canRead = true;
  person.canWrite = true;
  return person;
};

console.log(selfEducate(frederick));
console.log(frederick);

// {name: "Frederick Douglass", canRead: true, canWrite: true}
// {name: "Frederick Douglass", canRead: true, canWrite: true}
```

And here is a pure version of the same function:

```javascript
const frederick = {
  name: "Frederick Douglass",
  canRead: false,
  canWrite: false
};

const selfEducate = person => ({
  ...person,
  canRead: true,
  canWrite: true
});

console.log(selfEducate(frederick));
console.log(frederick);

// {name: "Frederick Douglass", canRead: true, canWrite: true}
// {name: "Frederick Douglass", canRead: false, canWrite: false}
```

#### Data Transformations

To do meaningful work without mutating data, functional programming relies heavily on data transformation methods like `map()`, `filter()`, and `reduce()`.

TODO: Add examples of these methods.

### Chapter 4: How React Works

#### Page Setup

2 libraries are needed to use React in a web page: `react` and `react-dom`. `react` contains the core React library used for creating views, while `react-dom` contains methods for actually renendering those views to the browser. 

Here is the basic HTML page setup for using React:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>React Samples</title>
  </head>
  <body>
    <!-- Target container -->
    <div id="root"></div>

    <!-- React library & ReactDOM (Development Version)-->
    <script
  src="https://unpkg.com/react@16/umd/react.development.js">
  </script>
    <script
  src="https://unpkg.com/react-dom@16/umd/react-dom.development.js">
  </script>

    <script>
      // Pure React and JavaScript code
    </script>
  </body>
</html>
```

#### React Elements

React elements are the smallest building blocks of React applications. They describe what should be rendered to the screen and define the ReactDOM.

The method to create a React element is `React.createElement()`, which takes at least 3 arguments: **1** the type of element to create, **2** an object containing any attributes or properties for that element, and **3+** the children of that element (if any).

```javascript
React.createElement("h1", { id: "recipe-0" }, "Baked Salmon");
```

The resulting HTML element would be:

```html
<h1 id="recipe-0">Baked Salmon</h1>
```

#### ReactDOM

Once React elements are created I need to render them to the ReactDOM. The React DOM essentially describes the structure of *how* the HTML DOM should be rendered to the browser. This is done using the `ReactDOM.render()` method. It takes 2 arguments: **1** the React element to render, and **2** the target container in the HTML DOM where the element should be rendered.

```javascript
const dish = React.createElement("h1", null, "Baked Salmon");

ReactDOM.render(dish, document.getElementById("root"));
```

Here is the resulting HTML in the browser:

```html
<body>
  <div id="root">
    <h1>Baked Salmon</h1>
  </div>
</body>
```

> Note: It is common convention to give the target container the id `root`, so do that.

Before, only one element could be rendered at a time. As of 2017, an array of elements can be rendered as well.

```javascript
const dish = React.createElement("h1", null, "Baked Salmon");
const dessert = React.createElement("h2", null, "Coconut Cream Pie");

ReactDOM.render([dish, dessert], document.getElementById("root"));
```

This would render the two elements inside the target container as sibling elements:

```html
<body>
  <div id="root">
    <h1>Baked Salmon</h1>
    <h2>Coconut Cream Pie</h2>
  </div>
</body>
```

##### Children

React renders child elements using the `children` property of the element. Each React element has a `props` object that contains all of its attributes and properties, including `children`. Consider the following HTML:

```html
<ul>
  <li>2 lb salmon</li>
  <li>5 sprigs fresh rosemary</li>
  <li>2 tablespoons olive oil</li>
  <li>2 small lemons</li>
  <li>1 teaspoon kosher salt</li>
  <li>4 cloves of chopped garlic</li>
</ul>
```

This would created as React elements like this:

```javascript
React.createElement(
  "ul",
  null,
  React.createElement("li", null, "2 lb salmon"),
  React.createElement("li", null, "5 sprigs fresh rosemary"),
  React.createElement("li", null, "2 tablespoons olive oil"),
  React.createElement("li", null, "2 small lemons"),
  React.createElement("li", null, "1 teaspoon kosher salt"),
  React.createElement("li", null, "4 cloves of chopped garlic")
);
```

And would result in this object:

```javascript
{
    "type": "ul",
    "props": {
    "children": [
    { "type": "li", "props": { "children": "2 lb salmon" } … },
    { "type": "li", "props": { "children": "5 sprigs fresh rosemary"} … },
    { "type": "li", "props": { "children": "2 tablespoons olive oil" } … },
    { "type": "li", "props": { "children": "2 small lemons"} … },
    { "type": "li", "props": { "children": "1 teaspoon kosher salt"} … },
    { "type": "li", "props": { "children": "4 cloves of chopped garlic"} … }
    ]
    ...
    }
}
```

To create an entire section of HTML with React elements, multiple calls to `React.createElement()` would be used:

```javascript
React.createElement(
  "section",
  { id: "baked-salmon" },
  React.createElement("h1", null, "Baked Salmon"),
  React.createElement(
    "ul",
    { className: "ingredients" },
    React.createElement("li", null, "2 lb salmon"),
    React.createElement("li", null, "5 sprigs fresh rosemary"),
    React.createElement("li", null, "2 tablespoons olive oil"),
    React.createElement("li", null, "2 small lemons"),
    React.createElement("li", null, "1 teaspoon kosher salt"),
    React.createElement("li", null, "4 cloves of chopped garlic")
  ),
  React.createElement(
    "section",
    { className: "instructions" },
    React.createElement("h2", null, "Cooking Instructions"),
    React.createElement("p", null, "Preheat the oven to 375 degrees."),
    React.createElement("p", null, "Lightly coat aluminum foil with oil."),
    React.createElement("p", null, "Place salmon on foil."),
    React.createElement(
      "p",
      null,
      "Cover with rosemary, sliced lemons, chopped garlic."
    ),
    React.createElement(
      "p",
      null,
      "Bake for 15-20 minutes until cooked through."
    ),
    React.createElement("p", null, "Remove from oven.")
  )
);
```

But, React has a major strength that can compact and modularize this code significantly: the ability to separate data from UI elements. Since React is just JavaScript, data can be stored in variables and arrays, and then used to dynamically generate the React elements. Here is an example of that:

```javascript
const items = [
  "2 lb salmon",
  "5 sprigs fresh rosemary",
  "2 tablespoons olive oil",
  "2 small lemons",
  "1 teaspoon kosher salt",
  "4 cloves of chopped garlic"
];

React.createElement(
  "ul",
  { className: "ingredients" },
  items.map(ingredient => React.createElement("li", null, ingredient))
);
```

This is a prime example of the functional programming concept of *data transformation* discussed earlier.

However, running this code as is will result in a warning in the console:

```Warning: Each child in an array or iterator should have a unique "key" prop...
```

When building a list of child elements using an array, React likes each element to have a unique `key` property to help it update the DOM efficiently. This can be done by including a `key` property in the attributes object (the 2nd argument) of `React.createElement()`:

```javascript
React.createElement(
  "ul",
  { className: "ingredients" },
  items.map((ingredient, i) =>
    React.createElement("li", { key: i }, ingredient)
  )
);
```

#### React Components

Even more powerful than React elements are *React components*. Components allow for the creation of reusable, self-contained pieces of UI that can manage their own data and behavior. A component is essentially a JavaScript function that returns React elements. Here is an example:

```javascript
function IngredientsList() {
  return React.createElement(
    "ul",
    { className: "ingredients" },
    React.createElement("li", null, "1 cup unsalted butter"),
    React.createElement("li", null, "1 cup crunchy peanut butter"),
    React.createElement("li", null, "1 cup brown sugar"),
    React.createElement("li", null, "1 cup white sugar"),
    React.createElement("li", null, "2 eggs"),
    React.createElement("li", null, "2.5 cups all purpose flour"),
    React.createElement("li", null, "1 teaspoon baking powder"),
    React.createElement("li", null, "0.5 teaspoon salt")
  );
}

ReactDOM.render(
  React.createElement(IngredientsList, null, null),
  document.getElementById("root")
);
```

Now, making this a bit more dynamic:

```javascript
function IngredientsList(props) {
  return React.createElement(
    "ul",
    { className: "ingredients" },
    props.items.map((ingredient, i) =>
      React.createElement("li", { key: i }, ingredient)
    )
  );
}
```

This uses the `props` object of the React element to pass in data to the component.

Even better is to destructure the `items` property from the `props` object:

```javascript
function IngredientsList({ items }) {
  return React.createElement(
    "ul",
    { className: "ingredients" },
    items.map((ingredient, i) =>
      React.createElement("li", { key: i }, ingredient)
    )
  );
}
```

### Chapter 5: React With JSX

Here is a look at how JavaScript translates to JSX:

```javascript
//JavaScript
React.createElement(IngredientsList, {list: [...]});

//JSX
<IngredientsList list={[...]} />
```

These two evaluate to the same thing in the browser DOM, but the JSX version is much more concise and readable.

#### JSX Tips

##### Children

Just like HTML, JSX elements can be nested:

```jsx
<IngredientsList>
  <Ingredient />
  <Ingredient />
  <Ingredient />
</IngredientsList>
```

##### `className`

Because `class` is a reserved word in JavaScript, JSX uses `className` to set the CSS class of an element:

```jsx
<h1 className="fancy">Baked Salmon</h1>
```

##### Javascript Expressions

JSX allows for JavaScript expressions to be embedded inside of curly braces `{}`. This allows for dynamic data to be rendered in the UI:

```jsx
<h1>{title}</h1>
```

Values that are not strings should be written as JS expressions as well:

```jsx
<input type="checkbox" defaultChecked={false} />
```

Also, the javascript that is inside the curly braces will be evaluated before rendering, so functions can be called, or other operations can be performed:

```jsx
<h1>{"Hello" + title}</h1>

<h1>{title.toLowerCase().replace}</h1>
```

JSX is JavaScript, so JSX can be placed inside of JavaScript expressions. This is useful for mapping over arrays to create lists of elements:

```jsx
<ul>
  {props.ingredients.map((ingredient, i) => (
    <li key="{i}">{ingredient}</li> //Note how the JSX is inside the JS expression
  ))}
</ul>
```

#### React Fragments

React won't render multiple sibling elements as a component (this means Javascript function that are components can't return sibling elements). It will only render a single root element. But, wrapping multiple elements in a `<div>` or other container element can make the DOM messy. React Fragments solve this problem by allowing multiple elements to be grouped together without adding an extra node to the DOM. This is done using the special `<React.Fragment>` element, or its shorthand syntax `<>...</>`.

Here is an example:

```jsx
function Cat({ name }) {
  return (
    <React.Fragment>
      <h1>The cat's name is {name}</h1>
      <p>He's good.</p>
    </React.Fragment>
  );
}
```

Or, the shorthand syntax:

```jsx
function Cat({ name }) {
  return (
    <>
      <h1>The cat's name is {name}</h1>
      <p>He's good.</p>
    </>
  );
}
```

Both of these will render the same HTML:

```html
<div id="root">
  <h1>The cat's name is Jungle</h1>
  <p>He's good</p>
</div>
```

### Chapter 11: React Router

#### Setting Up React Router

To use React Router, the `react-router-dom` library must be installed. This library provides the core routing functionality for React applications running in the browser.

Instead of rendering an `<App />` component directly to the DOM, the `BrowserRouter` component from `react-router-dom` is used to wrap the entire application. This component listens for changes to the URL and manages the routing logic.

```jsx
import React from "react";
import { render } from "react-dom";
import App from "./App";

import { BrowserRouter as Router } from "react-router-dom";

render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
```

Now, in the `App` component, the `Routes` component is used to define the different routes in the application. Each route is defined using the `Route` component:

```jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Home,
  About,
  Events,
  Products,
  Contact
} from "./pages";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/about"
          element={<About />}
        />
        <Route
          path="/events"
          element={<Events />}
        />
        <Route
          path="/products"
          element={<Products />}
        />
        <Route
          path="/contact"
          element={<Contact />}
        />
      </Routes>
    </div>
  );
}
```

The `Route` component takes two main props: `path`, which defines the URL path for the route, and `element`, which defines the React element to render when the route is matched.

Under the hood, the `Routes` and `Route` components use the `useRoutes` hook to manage the routing logic. You can also use this hook directly:

```jsx
import { useRoutes } from "react-router-dom";

function App() {
  let element = useRoutes([
    { path: "/", element: <Home /> },
    {
      path: "about",
      element: <About />,
      children: [
        {
          path: "services",
          element: <Services />
        },
        { path: "history", element: <History /> },
        {
          path: "location",
          element: <Location />
        }
      ]
    },
    { path: "events", element: <Events /> },
    { path: "products", element: <Products /> },
    { path: "contact", element: <Contact /> },
    { path: "*", element: <Whoops404 /> },
    {
      path: "services",
      redirectTo: "about/services"
    }
  ]);
  return element;
}
```

Because it is unlikely that a page will be navigated by typing in the URL directly, navigation links are needed. This is done using the `Link` component from `react-router-dom`:

```jsx
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div>
      <h1>[Company Website]</h1>
      <nav>
        <Link to="about">About</Link>
        <Link to="events">Events</Link>
        <Link to="products">Products</Link>
        <Link to="contact">Contact Us</Link>
      </nav>
    </div>
  );
}
```

These are essentially anchor tags that update the URL without causing a full page reload.

#### Router Features

To nest routing, the `Outlet` component is used to render child routes inside a parent route component. Here is an example of that:

```jsx
import {
  Link,
  useLocation,
  Outlet
} from "react-router-dom";

export function About() {
  return (
    <div>
      <h1>[About]</h1>
      <Outlet />
    </div>
  );
}
```

Sometimes paths will need to be changed. Some users may have old paths bookmarked, so the `Redirect` component is used to redirect from one path to another:

```jsx
import {
  Routes,
  Route,
  Redirect
} from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        // Other Routes
        <Redirect
          from="services"
          to="about/services"
        />
      </Routes>
    </div>
  );
}
```
#### Useful Hooks

Parameters can be passed in the URL as well. This is done by defining a route with a colon `:` followed by the parameter name:

```jsx
<Routes>
        <Route
          path="/"
          element={<ColorList />}
        />
        <Route
          path=":id" //This is the parameter
          element={<ColorDetails />}
        />
      </Routes>
```

Accessing the parameter is done using the `useParams` hook:

```jsx
import { useParams } from "react-router-dom";

export function ColorDetails() {
  let params = useParams();
  console.log(params);
  return (
    <div>
      <h1>Details</h1>
    </div>
  );
}
```

The `useLocation` hook can be used to access the current URL location object, which contains information about the current URL, including the pathname, search parameters, and hash fragment:

```jsx
export function Whoops404() {
  let location = useLocation();
  console.log(location);
  return (
    <div>
      <h1>
        Resource not found at {location.pathname}
      </h1>
    </div>
  );
}
```

The `useNavigate` hook is used to programmatically navigate to a different route:

```jsx
let navigate = useNavigate();

return (
  <section
    className="color"
    onClick={() => navigate(`/${id}`)}
  >
    // Color component
  </section>
);
```

## Programming Typescript by Boris Cherny

### Chapter 3: Types

The following sections will have examples of TypeScript's type system for the main primitive types.

#### Type Annotations

This is a function with no type annotations:

```typescript
function squareOf(n) {
  return n * n
}
squareOf(2)     // evaluates to 4
squareOf('z')   // evaluates to NaN
```

Using a type annotation, the parameter `n` becomes *constrained* to only accept numbers:

```typescript
function squareOf(n: number) {
  return n * n
}
squareOf(2)     // evaluates to 4
squareOf('z')   // Error TS2345: Argument of type '"z"' is not assignable to
                // parameter of type 'number'.
```

#### Type Aliases

Type aliases allow you to create a new name for a type. This is especially useful for complex types like object shapes or union types.

```typescript
type Age = number

type Person = {
  name: string
  age: Age
}
```

#### Union and Intersection Types

If types are thought of as *sets*, than these concepts become pretty self-explanatory. A *union type* is the *set union* of multiple types, while an *intersection type * is the *set intersection* of multiple types.

```typescript
type Cat = {name: string, purrs: boolean}
type Dog = {name: string, barks: boolean, wags: boolean}
type CatOrDogOrBoth = Cat | Dog
type CatAndDog = Cat & Dog
```

```typescript
// Cat
let a: CatOrDogOrBoth = {
  name: 'Bonkers',
  purrs: true
}

// Dog
a = {
  name: 'Domino',
  barks: true,
  wags: true
}

// Both
a = {
  name: 'Donkers',
  barks: true,
  purrs: true,
  wags: true
}

//Cat&Dog
let b: CatAndDog = {
  name: 'Domino2',
  barks: true,
  purrs: true,
  wags: true
}
```

#### `any` Type

```typescript
let a: any = 666            // any
let b: any = ['danger']     // any
let c = a + b               // any
```

#### `unknown` Type

```typescript
let a: unknown = 30         // unknown
let b = a === 123           // boolean
let c = a + 10              // Error TS2571: Object is of type 'unknown'.
if (typeof a === 'number') {
  let d = a + 10            // number
}
```

#### `boolean` Type

```typescript
let a: unknown = 30         // unknown
let b = a === 123           // boolean
let c = a + 10              // Error TS2571: Object is of type 'unknown'.
if (typeof a === 'number') {
  let d = a + 10            // number
}
```

#### `number` Type

```typescript
let a = 1234                // number
var b = Infinity * 0.10     // number
const c = 5678              // 5678
let d = a < b               // boolean
let e: number = 100         // number
let f: 26.218 = 26.218      // 26.218
let g: 26.218 = 10          // Error TS2322: Type '10' is not assignable
                            // to type '26.218'.
```

#### `bigInt` Type

```typescript
let a = 1234n               // bigint
const b = 5678n             // 5678n
var c = a + b               // bigint
let d = a < 1235            // boolean
let e = 88.5n               // Error TS1353: A bigint literal must be an integer.
let f: bigint = 100n        // bigint
let g: 100n = 100n          // 100n
let h: bigint = 100         // Error TS2322: Type '100' is not assignable
                            // to type 'bigint'.
```

> Note: `bigInt` is not supported in all JavaScript runtimes. While it has been around since Nov 2020 and is widely supported, some older environments may not support it.

#### `string` Type

```typescript
let a = 'hello'             // string
var b = 'billy'             // string
const c = '!'               // '!'
let d = a + ' ' + b + c     // string
let e: string = 'zoom'      // string
let f: 'john' = 'john'      // 'john'
let g: 'john' = 'zoe'       // Error TS2322: Type "zoe" is not assignable
                            // to type "john".
```

#### Objects

The `object` type represents an object, but doesn't specify its properties:

```typescript
let a: object = {
  b: 'x'
}

a.b   // Error TS2339: Property 'b' does not exist on type 'object'.
```

The best method is to use *object literal syntax*, letting TypeScript infer the type:

```typescript
let a = {
  b: 'x'
}            // {b: string}
a.b          // string

let b = {
  c: {
    d: 'f'
  }
}  // {c: {d: string}}
```

If desired, the shape of the object can be explicitly defined:

```typescript
let a: {b: number} = {
  b: 12
}            // {b: number}
```

Once an object shape is defined, Typescript will enforce both property types and property presence:

```typescript
let a: {b: number}

a = {}  // Error TS2741: Property 'b' is missing in type '{}'
        // but required in type '{b: number}'.

a = {
  b: 1,
  c: 2  // Error TS2322: Type '{b: number; c: number}' is not assignable
}       // to type '{b: number}'. Object literal may only specify known
        // properties, and 'c' does not exist in type '{b: number}'.
```

When object shape is varying or not known ahead of time, there are 2 main options: optional properties and index signatures.

```typescript
let a: {
  b: number // 1
  c?: string // 2
  [key: number]: boolean // 3
}
```

To break this down:

1. `b` is a required property of type `number`.
2. `c` is an optional property of type `string`. The `?` say to TypeScript "this property may be here, or it may not. If it is, it needs to be a string".
3. `[key: number]: boolean` is an index signature. It says "this object may have properties with numeric keys, and if they exist, their values need to be booleans".

Here are some valid and invalid assignments for this object type:

```typescript
a = {b: 1}
a = {b: 1, c: undefined}
a = {b: 1, c: 'd'}
a = {b: 1, 10: true}
a = {b: 1, 10: true, 20: false}
a = {10: true}          // Error TS2741: Property 'b' is missing in type
                        // '{10: true}'.
a = {b: 1, 33: 'red'}   // Error TS2741: Type 'string' is not assignable
                        // to type 'boolean'.
```

Note that the key type in the index signature can only be `string` or `number`. Also it does not have to be called `key`; any valid identifier name will work.

```typescript 
let airplaneSeatingAssignments: {
  [seatNumber: string]: string
} = {
  '34D': 'Boris Cherny',
  '34E': 'Bill Gates'
}
```

Object fields can also be made read-only using the `readonly` modifier:

```typescript
let user: {
  readonly firstName: string
} = {
  firstName: 'abby'
}

user.firstName // string
user.firstName =
  'abbey with an e' // Error TS2540: Cannot assign to 'firstName' because it
                    // is a read-only property.
```

#### Arrays

Arrays are actually special types of objects in JavaScript. In TypeScript, there are 2 main ways to define array types: using square brackets (`T[]`) or the generic `Array<T>` syntax.

```typescript
let a = [1, 2, 3]           // number[]
var b = ['a', 'b']          // string[]
let c: string[] = ['a']     // string[]
let d = [1, 'a']            // (string | number)[]
const e = [2, 'b']          // (string | number)[]

let f = ['red']
f.push('blue')
f.push(true)                // Error TS2345: Argument of type 'true' is not
                            // assignable to parameter of type 'string'.

let g = []                  // any[]
g.push(1)                   // number[]
g.push('red')               // (string | number)[]

let h: number[] = []        // number[]
h.push(1)                   // number[]
h.push('red')               // Error TS2345: Argument of type '"red"' is not
                            // assignable to parameter of type 'number'.
```

When Typescript cannot infer the type of an array, it defaults to `any[]`. Then once the array leaves its scope of definition, it has a fixed type assigned based on the elements that were added to it while in scope.

```typescript
function buildArray() {
  let a = []                // any[]
  a.push(1)                 // number[]
  a.push('x')               // (string | number)[]
  return a
}

let myArray = buildArray()  // (string | number)[]
myArray.push(true)          // Error 2345: Argument of type 'true' is not
                            // assignable to parameter of type 'string | number'.
```

Tuples are arrays with a fixed number of elements whose types are known. Tuples must be explicitly typed when they are defined:

```typescript
let a: [number] = [1]

// A tuple of [first name, last name, birth year]
let b: [string, string, number] = ['malcolm', 'gladwell', 1963]

b = ['queen', 'elizabeth', 'ii', 1926]  // Error TS2322: Type 'string' is not
                                        // assignable to type 'number'.
```

Tuples also support optional elements and rest elements:

```typescript
// Optional elements
// An array of train fares, which sometimes vary depending on direction
let trainFares: [number, number?][] = [
  [3.75],
  [8.25, 7.70],
  [10.50]
]

// Equivalently:
let moreTrainFares: ([number] | [number, number])[] = [
  // ...
]

// Rest elements
// A list of strings with at least 1 element
let friends: [string, ...string[]] = ['Sara', 'Tali', 'Chloe', 'Claire']

// A heterogeneous list
let list: [number, boolean, ...string[]] = [1, false, 'a', 'b', 'c']
```

#### Absence Types

There are 4 main types that represent the absence of a value in TypeScript: `void`, `null`, `undefined`, and `never`. Below is an example of each.

```typescript
// (a) A function that returns a number or null
function a(x: number) {
  if (x < 10) {
    return x
  }
  return null
}

// (b) A function that returns undefined
function b() {
  return undefined
}

// (c) A function that returns void
function c() {
  let a = 2 + 2
  let b = a * a
}

// (d) A function that returns never
function d() {
  throw TypeError('I always error')
}

// (e) Another function that returns never
function e() {
  while (true) {
    doSomething()
  }
}
```

#### Enums

These are a way to define a set of named constants, either numeric or string-based. Think of them as objects that have the keys fixed at compile time. 

```typescript
enum Language {
  English,
  Spanish,
  Russian
}
```

TypeScript will automatically infer a number as the value for each member of your enum, but you can also set values explicitly, as is done below.

```typescript
enum Language {
  English = 0,
  Spanish = 1,
  Russian = 2
}
```

There are lots of potential pitfalls for enums in TypeScript, so generally try to avoid them if possible.

### Chapter 4: Functions

#### Declaring and Invoking Functions

JavaScript and TypeScript support at least 5 ways to declare functions:

```typescript
// Named function
function greet(name: string) {
  return 'hello ' + name
}

// Function expression
let greet2 = function(name: string) {
  return 'hello ' + name
}

// Arrow function expression
let greet3 = (name: string) => {
  return 'hello ' + name
}

// Shorthand arrow function expression
let greet4 = (name: string) =>
  'hello ' + name

// Function constructor
let greet5 = new Function('name', 'return "hello " + name')
```

Remember that function expressions and arrow functions are not hoisted, so they must be defined before they are invoked. Named functions are hoisted.

TypeScript will infer types throughout the body of a function, but parameters should be explicitly typed. The return type is inferred, but can also be explicitly defined:

```typescript
function add(a: number, b: number) {
  return a + b
}

// or:

function add(a: number, b: number): number {
  return a + b
}
```

#### Optional and Default Parameters

Like in object fields and tuple elements, function parameters can be made optional with the `?` modifier. Note that optional parameters must come **after all required parameters**.:

```typescript
function log(message: string, userId?: string) {
  let time = new Date().toLocaleTimeString()
  console.log(time, message, userId || 'Not signed in')
}

log('Page loaded') // Logs "12:38:31 PM Page loaded Not signed in"
log('User signed in', 'da763be') // Logs "12:38:31 PM User signed in da763be"
```

Like JavaScript, TypeScript also supports default parameters. These parameters are treated as optional, and will take on the default value if no argument is provided for them. Importantly, default parameters do not have to come after all required parameters:

```typescript
function log(message: string, userId = 'Not signed in') {
  let time = new Date().toISOString()
  console.log(time, message, userId)
}

log('User clicked on a button', 'da763be')
log('User signed out')
```

Default parameters do not need a `?` modifier, and do not need to be explicitly typed. *I'll find myself using default parameters over optional parameters often*.

#### Rest Parameters

Just like JavaScript, TypeScript supports rest parameters, which collect multiple arguments into an array and support variadic (variable number of arguments) function:

```typescript
function sumVariadicSafe(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}

sumVariadicSafe(1, 2, 3) // evaluates to 6
```

This is much safer than using the `arguments` object, which is of type `any`:

```typescript
function sumVariadic(): number {
  return Array
    .from(arguments)
    .reduce((total, n) => total + n, 0) //: any
}

sumVariadic(1, 2, 3) // evaluates to 6
```

Thus, prefer rest parameters over the `arguments` object.

A function can only have one rest parameter, and it must be the last parameter in the function's parameter list.

#### Call Signatures

Without a call signature, a function is just a value of type `Function`, which is not very useful or safe. It is similar to the `object` type for objects, acting as just a catch-all. Call signatures define the parameter and return types of a function. The syntax for a call signature *also called a *type signature*) is similar to an arrow function, but it only contains **type-level code**:

```typescript
type Sum = (a: number, b: number) => number
```

> It is important to make clear the distinction between **type-level code** and **value-level code**. Type-level code is only used by the TypeScript compiler at compile time for type checking, and does not exist in the emitted JavaScript. Value-level code exists at runtime in the emitted JavaScript.
> 
> A good way to think about the difference is that all JavaScript valid code is value-level, while code that is valid only in TypeScript is type-level.
>
> To be extra clear, below is an example that has **all of the type-level code bolded**, and the rest is value-level code:

```typescript
function area(radius: **number**): **number | null** {
  if (radius < 0) {
    return null
  }
  return Math.PI * (radius ** 2)
}

let r: **number** = 3
let a = area(r)
if (a !== null) {
  console.info('result:', a)
}
```

Below is an example that shows the relationship between a call signature and its implementation:

```typescript
type Log = (message: string, userId?: string) => void

let log: Log = ( //1
  message, //2
  userId = 'Not signed in' //3
) => { //4
  let time = new Date().toISOString()
  console.log(time, message, userId)
}
```

Now to break this down:

1. Implementing a call signature requires using a function expression or arrow function, rather than a named function/function declaration. The function expression is explicitly typed as `Log`
2. The parameters do not need to be explicitly typed, since they already were in the call signature.
3. Default parameters have their values assigned in the implementation, not the call signature, because default values are value-level code, which cannot exist in the call signature.
4. The type of the return value does not need to be explicitly defined, since it was also already defined in the call signature.

#### Contextual Typing

The other way that TypeScript infers types for function parameters is called *contextual typing*. This occurs when a function is assigned to a variable or passed as an argument, and its type is already annotated:

```typescript
function times(
  f: (index: number) => void,
  n: number
) {
  for (let i = 0; i < n; i++) {
    f(i)
  }
}
```

Here, `f()` already has a type annotation, so if `times` is called with an arrow function declared in-line, the passed in function does not need to be explicitly typed:

```typescript
times(n => console.log(n), 4)
```

TypeScript can infer that `n` is a number based on the type annotation of `f` in the `times` function.

Note that this only works when the function is declared in-line. If the function is defined separately, it must be explicitly typed:

```typescript
function f(n) { // Error TS7006: Parameter 'n' implicitly has an 'any' type.
  console.log(n)
}

times(f, 4)
```

### Chapter 5: Classes and Interfaces

To define a class use the `class` keyword, and to extend it use the `extends` keyword:

```typescript
// Represents a chess game
class Game {}

// A chess piece
class Piece {}

// A set of coordinates for a piece
class Position {}

// ...
class King extends Piece {}
class Queen extends Piece {}
class Bishop extends Piece {}
class Knight extends Piece {}
class Rook extends Piece {}
class Pawn extends Piece {}
```

Some more details for the Piece class:

```typescript
type Color = 'Black' | 'White'
type File = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'
type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 //1

class Position {
  constructor(
    private file: File, //2
    private rank: Rank
  ) {}
}

class Piece {
  protected position: Position //3
  constructor(
    private readonly color: Color, //4
    file: File,
    rank: Rank
  ) {
    this.position = new Position(file, rank)
  }
}
```

When a constructor parameter is `private` or `protected`, it automatically creates a field on the class with that name and type, and assigns the parameter value to it. Basically, a body to the constructor is not needed if it would just be setting parameters to fields.

Like objects, classes have 3 main access modifiers for their fields and methods: `public`, `private`, and `protected`. Public is accessible from anywhere and is the default access level. Private is only accessible within the class itself. Protected is accessible within the class and its subclasses.

Properties can also be marked as `readonly`, which means they can only be assigned once, either at declaration or in the constructor:

If we don't want a certain class to be instantiated, but only its subclasses, we can make it an `abstract` class:

```typescript
// ...
abstract class Piece {
  // ...
  moveTo(position: Position) {
    this.position = position
  }
  abstract canMoveTo(position: Position): boolean
}
```

Now, all subclasses of `Piece` must implement the `canMoveTo()` method, and have a default implementation of `moveTo()`.

```typescript
class King extends Piece {
  canMoveTo(position: Position) {
    let distance = this.position.distanceFrom(position)
    return distance.rank < 2 && distance.file < 2
  }
}
```

And if we try to instantiate `Piece` directly:

```typescript
new Piece('White', 'E', 1)  // Error TS2511: Cannot create an instance
                            // of an abstract class.
```

#### Using `this` as a Return Type

When a method returns an instance of its class, it can be a bit tedious if the method is inherited by subclasses. Here is an example:

```typescript
class Set {
  has(value: number): boolean {
    // ...
  }
  add(value: number): Set {
    // ...
  }
}

class MutableSet extends Set {
  delete(value: number): boolean {
    // ...
  }
  add(value: number): MutableSet {
    // ...
  }
}
```

#### Accessors and Mutators

TypeScript supports slick `get` and `set` keywords to define accessors and mutators for class properties:

```typescript
class Person {
    private _age: number;
    private _firstName: string;
    private _lastName: string;

    public get age() {
        return this._age;
    }
    public set age(theAge: number) {
        if (theAge <= 0 || theAge >= 200) {
            throw new Error('The age is invalid');
        }
        this._age = theAge;
    }
}

let p: Person = new Person();
p.age = 45;
console.log(p.age);

```

Because the signature must be repeated in the subclass, it partially defeats the purpose of inheritance. To fix this, TypeScript supports using `this` as a return type, which refers to the type of the current class instance:

```typescript
class Set {
  has(value: number): boolean {
    // ...
  }
  add(value: number): this {
    // ...
  }
}
```

#### Interfaces

Interfaces and type aliases are very similar in TypeScript. Both can be used to define the shape of an object, and often can be used interchangeably. However, there are 3 subtle differences:

1. Type aliases are more general, and their RHS can be any valid type or type operator, while interfaces can only describe object shapes. For example, the following have no way to be expressed as interfaces:
```typescript
type A = number
type B = A | string
```

2. When interfaces are extended, TypeScript will ensure that the interface is assignable to the extension. Type aliases do not have this check, instead they result in overloading signatures. For example:
```typescript
interface A {
  good(x: number): string
  bad(x: number): string
}

interface B extends A {
  good(x: string | number): string
  bad(x: string): string  // Error TS2430: Interface 'B' incorrectly extends
}                         // interface 'A'. Type 'number' is not assignable
                          // to type 'string'.
```

3. Interfaces can be *merged* when they have the same name, while type aliases cannot. For example:
```typescript
// User has a single field, name
interface User {
  name: string
}

// User now has two fields, name and age
interface User {
  age: number
}

let a: User = {
  name: 'Ashley',
  age: 30
}

//Invalid with type aliases

type User = {  // Error TS2300: Duplicate identifier 'User'.
  name: string
}

type User = {  // Error TS2300: Duplicate identifier 'User'.
  age: number
}
```

Implementing an interface in a class is similar to extending a class, except the implementing class must implement all properties and methods declared the interface:

```typescript
interface Animal {
  eat(food: string): void
  sleep(hours: number): void
}

class Cat implements Animal {
  eat(food: string) {
    console.info('Ate some', food, '. Mmm!')
  }
  sleep(hours: number) {
    console.info('Slept for', hours, 'hours')
  }
}
```

Interfaces can declare instance properties, but they cannot declare access modifiers. They can specifiy that a property is `readonly`, however.

More than one interface can be implemented by a class, separated by commas:

```typescript
interface Animal {
  readonly name: string
  eat(food: string): void
  sleep(hours: number): void
}

interface Feline {
  meow(): void
}

class Cat implements Animal, Feline {
  name = 'Whiskers'
  eat(food: string) {
    console.info('Ate some', food, '. Mmm!')
  }
  sleep(hours: number) {
    console.info('Slept for', hours, 'hours')
  }
  meow() {
    console.info('Meow')
  }
}
```

#### Classes are Structurally Typed

In TypeScript, types are *structurally typed*, meaning that two types are considered compatible if their structures match, regardless of their names or declarations.

```typescript
class Zebra {
  trot() {
    // ...
  }
}

class Poodle {
  trot() {
    // ...
  }
}

function ambleAround(animal: Zebra) {
  animal.trot()
}

let zebra = new Zebra
let poodle = new Poodle

ambleAround(zebra)   // OK
ambleAround(poodle)  // OK
```

The only exception to this is when a class has private or protected members. In that case, the types are only compatible if they are instances of that class.

```typescript
class A {
  private x = 1
}
class B extends A {}
function f(a: A) {}

f(new A)   // OK
f(new B)   // OK

f({x: 1})  // Error TS2345: Argument of type '{x: number}' is not
           // assignable to parameter of type 'A'. Property 'x' is
           // private in type 'A' but not in type '{x: number}'.
```

#### Classes Declare Both Values and Types

Most things in TypeScript are either a value or a type. Generally TypeScript can infer from context whether to use the value or type:

```typescript
// values
let a = 1999
function b() {}

// types
type a = number
interface b {
  (): void
}

// ...
if (a + 1 > 3) //... // TypeScript infers from context that you mean the value a
let x: a = 3         // TypeScript infers from context that you mean the type a
```

However, classes (and enums) are special in that they declare both a value and a type with the same name:

```typescript
class C {}
let c: C //1
  = new C //2

enum E {F, G}
let e: E //3
  = E.F //4
```

Breaking this down:

1. In this context, `C` refers to the type of instances of the class `C`.
2. This context refers to the value of the class `C`, which is its constructor function.
3. Here, `E` refers to the type of the enum `E`.
4. And here, `E` refers to the value of the enum `E`, which is an object containing its members.


// TODO: Get code for constructor interfaces 

### Chapter 8: Asynchronous Programming, Concurrency, and Parallelism

