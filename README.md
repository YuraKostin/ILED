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

```ts
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
        .catch(error => {
          type: 'Error',
          data: {
            message: error.message
          }
        })
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


## FAQ

### Why should I use the package?
`ILED` type helps you discriminate your data between different states of your app or whatever. 

`Fold` kind components helps you fold your `ILED` state into `null` or JSX.Element.

So if you have some data, wich can be different between Initial, Loading, Error and Data states, ILED kind types helps you to manage all this stuff easier.

### What about rerenders? | TODO
