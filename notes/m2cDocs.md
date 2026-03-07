# CS340: Milestone 2 Part C

James Teuscher

## Question 1

This question is about the code involved in getting and displaying a user's story. For Milestone 2 Part A I was asked to redesign my Tweeter UI code (including the "user story" code) based on the MVP pattern. I have answered the following and provide a simple UML class diagram and a simple UML sequence diagram to support my answers:

1. Which types (classes, interfaces, react components) play each of the key roles in the pattern (model, view, presenter)? How are those types related in your design, and how do they avoid breaking the dependency-rule of layered architectures?
2. In brief what are 2 or 3 reasons why the MVP pattern is an effective choice for your design? You may want to refer to your diagram to support your reasoning.

**Answers**

1. - **Model**: My service classes, `UserService` and`StatusService` fulfill the model role in this context. They contain the logic that does not rely on the presenters and how I change input handling. These include consistent operations like logging in and out, registering a user, and retrieving user posts (stories). These relate to other types in my design by the dependencies that the presenters have on them. These avoid breaking the dependency rule of layered architecture because none of my service classes, including these 2, depend on anything from outer layers. They have no dependencies on the presenter or the view layers.
   - **Presenter**: My presenter classes, found in the `src/presenter` module, fulfill the presenter role in the tweeter application. The presenters specific to getting and displaying a user's story include `NavBarPresenter`, `PagedPresenter`, `Presenter`, `StatusItemPresenter`, and `StoryPresenter`. These relate to the service by calling methods on them, such as `loadMoreStoryItems`, and they relate to the Views by passing the results to them to be displayed. These types avoid breaking the dependency-rule by only calling on methods from the services they depend on or internal methods, and by defining the view interfaces that they need internally, rather than another method that causes them to depend on the views.
   - **View**: To display a user's story, the components `ItemScroller`, `StatusItem`, and `Post` are used for the view layer. The `ItemScroller` displays a list of `StatusItem` components, which each contain a `Post` component. These components deal strictly with displaying output and directly handling input, which is passed to the presenters. These follow the dependency rule by depending on the presenter layer, and not directly interacting with the model layer.
2. One reason the MVP patter is an effective choice for my design is because it creates more testable code. Even after refactoring and separating out the different layers, I needed some help and explanation to understand how to properly mock and spy 

