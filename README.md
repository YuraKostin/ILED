# I.L.E.D.

I.L.E.D - discriminated union for joyful development with React

I.L.E.D. is an abbreviation of Initial, Loading, Error and Data - the most common states of things in dynamic web development.

## Examples | TODO

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

// Just an example function, which emulates response from API
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
      onInitial={() => <button onClick={loadUser}>Load user</button>} // show button which load user on Initial state
      onLoading={() => <span>Loading...</span>}  // show `Loading...` on Loading state
      onError={({ message }) => <span>{message}</span>}  // show error message on Error state
      onData={({ name, age }) => (
        <p>
          <span>Name: {name}</span>
          <span>Age: {age}</span>
        </p>
      )}  // show user data on Data state
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
