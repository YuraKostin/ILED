# I.L.E.D.

I.L.E.D - discriminated union for joyful development with React

I.L.E.D. is an abbreviation of Initial, Loading, Error and Data - the most common states of things in dynamic web development.

## Examples

### Basic TypeScript example
```ts
// Describe some state where there is no any valuable data at Initial and Loading states
// and object with string message at Error state
// and also some User info at Data state
type State = ILED<null, null, ErrorMessage, User>;

type ErrorMessage = {
  message: string;
};

type User = {
  name: string;
  age: number;
}

const stringFromILEDState = (state: State): string => {
  // Start to narrowing state value depending on its type
  switch(state.type) {
    case 'Initial':
      return 'It is initial state, there is no data yet';
    case 'Loading':
      return 'Loading data...';
    case 'Error':
      return `Something went wrong: ${state.message}`;
    case 'Data':
      return `User name is ${state.name} and user age is ${state.age}`;
    // There is no possible `type` here, so, this default case is impossible to be reached
    default:
      return type;
  }
}

const initialState = { type: 'Initial', data: null };
const loadingState = { type: 'Loading', data: null };
const errorState = { type: 'Error', data: { message: 'Error message' } };
const dataState = { type: 'Data', data: { name: 'John', age: 38 } };

console.log(
  stringFromILEDState(initialState)
) // 'It is initial state, there is no data yet'

console.log(
  stringFromILEDState(loadingState)
) // 'Loading data...'

console.log(
  stringFromILEDState(errorState)
) // 'Something went wrong: Error message'

console.log(
  stringFromILEDState(dataState)
) // 'User name is John and user age is 38'
```

### Basic react example

```tsx
// Describe application state where there is no any valuable data at Initial and Loading states
// and object with string message at Error state
// and also some User info at Data state
type State = ILED<null, null, ErrorMessage, User>;

type ErrorMessage = {
  message: string;
};

type User = {
  name: string;
  age: number;
}

// Just an example function, which emulates request to API
const emulateUserRequest = () => Promise.resolve({ name: 'John', age: 38 });

const App = () => {
  // Define a state using the `State` type as a generic parameter into `useState` hook and Initial type value as initial value
  const [state, setState] = useState<State>({ type: 'Initial', data: null });
  
  const loadUser = () => {
    setState({
      type: 'Loading',
      data: null,
    });
    
    setTimeout(() => {
      emulateUserRequest()
        .then(data => setState({
          type: 'Data',
          data,
        }))
        .catch(error => ({
          type: 'Error',
          data: {
            message: error.message
          }
        }))
    }, 2000);
  }
  
  return (
    <FoldILED
      state={state} // pass state
      onInitial={() => <button onClick={loadUser}>Load user</button>} // render button which load user on Initial state
      onLoading={() => <span>Loading...</span>} // render `Loading...` on Loading state
      onError={({ message }) => <span>{message}</span>} // render error message on Error state
      onData={({ name, age }) => (
        <p>
          <span>Name: {name}</span>
          <span>Age: {age}</span>
        </p>
      )} // render user data on Data state
    />
  )
}
```

### Nested state

Sometimes you may want to build some complex state

Let's imagine you have
1. Books and reviews for them
2. Initially you're able to load just book information
3. When book uploaded, you can press button and then fetch all reviews

So the state could look like

```ts
import {ILED} from "./types";

type State = ILED<
    null, // No payload on initial 
    null, // No payload on book loading
    LoadingError, // Object with message if something went wrong
    ILED<
        // Nested initial state with already existing book information
        {book: Book},
        // Nested loading state with already existing book information. Loading reviews in process
        {book: Book},
        // Nested error state with already existing book information. Loading was failed
        {book: Book, error: LoadingError},
        // Book and reviews 
        {book: Book; reviews: Array<Review>} 
    >
>;

type Book = {
    id: number;
    title: string;
    author: string;
    pages: number;
    language: string;
    genre: string;
    published: string;
}

type Review = {
    id: number;
    bookId: number;
    title: string;
    text: string;
    author: string;
}

type LoadingError = {message: string};
```

### Types constructors for creating Initial, Loading, Error and Data structures

```ts
import {dataOf, errorOf, initialOf, loadingOf} from "./index";

type State = ILED<null, null, ErrorMessage, User>;

type ErrorMessage = {
    message: string;
};

type User = {
    name: string;
    age: number;
}

const initialState = initialOf(null); // {type: 'Initial', data: null}
const loadingState = loadingOf(null); // {type: 'Loading', data: null}
const errorState = errorOf({message: 'Oops!'}); // {type: 'Error', data: {message: 'Oops!'}}
const dataState = dataOf({name: 'John', age: 38}); // {type: 'Data', data: {name: 'John', age: 38}}
```

For nested states you can wrap calls of constructors inside each other

```ts
import {ILED} from "./types";
import {dataOf, initialOf} from "./index";

type State = ILED<null, null, null, ILED<boolean, string, number, Array<string>>>;

const state: State = dataOf(initialOf(true)); // {type: 'Data', data: {type: 'Initial', data: true}}
```

There is a caveat for literals. If you need literal, you should use `as const` for the literal type value

```ts
import {dataOf, initialOf} from "./index";

type State = ILED<null, null, null, ILED<1, 2, 3, 4>>;

const state: State = dataOf(initialOf(1 as const)); // {type: 'Data', data: {type: 'Initial', data: 1}}
```

## FAQ

### Why should I use the package?
`ILED` type helps you discriminate your data between different states of your app or whatever. 

`Fold` kind components helps you fold your `ILED` state into `null` or JSX.Element.

So if you have some data, which can be different between Initial, Loading, Error and Data states, 
ILED kind types helps you to manage all this stuff easier.

### What about rerenders? | TODO
