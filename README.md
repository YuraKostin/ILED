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

const initialState = { type: 'Initial', initial: null };
const loadingState = { type: 'Loading', loading: null };
const errorState = { type: 'Error', error: { message: 'Error message' } };
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
const emulateUserRequest = () => Promise.resolve({name: 'John', age: 38});

const App = () => {
    // Define a state using the `State` type as a generic parameter into `useState` hook and Initial type value as initial value
    const [state, setState] = useState<State>({type: 'Initial', initial: null});

    const loadUser = () => {
        setState({
            type: 'Loading',
            initial: null,
        });

        setTimeout(() => {
            emulateUserRequest()
                .then(data => setState({
                    type: 'Data',
                    data,
                }))
                .catch(error => setState({
                    type: 'Error',
                    error: {
                        message: error.message
                    }
                }))
        }, 2000);
    };

    const incrementAge = () => {
        setState(prevState => {
            if (prevState.type === 'Data') {
                return {
                    name: prevState.data.name, 
                    age: prevState.data.age + 1
                };
            }
            
            return prevState;
        });
    };

    return (
        <DetailedILEDFolding
            state={state} // pass state
            onInitial={() => (
                <button onClick={loadUser}>
                    Load user
                </button>
            )} // render button which load user on Initial state
            onLoading={() => <span>Loading...</span>} // render `Loading...` on Loading state
            onError={({message}) => <span>{message}</span>} // render error message on Error state
            onData={({name, age}) => (
                <p>
                    <span>Name: {name}</span>
                    <span>Age: {age}</span>
                    <button onClick={incrementAge}>Increment age</button>
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

const initialState = initialOf(null); // {type: 'Initial', initial: null}
const loadingState = loadingOf(null); // {type: 'Loading', loading: null}
const errorState = errorOf({message: 'Oops!'}); // {type: 'Error', error: {message: 'Oops!'}}
const dataState = dataOf({name: 'John', age: 38}); // {type: 'Data', data: {name: 'John', age: 38}}
```

For nested states you can wrap calls of constructors inside each other

```ts
import {ILED} from "./types";
import {dataOf, initialOf} from "./index";

type State = ILED<null, null, null, ILED<boolean, string, number, Array<string>>>;

const state: State = dataOf(initialOf(true)); // {type: 'Data', data: {type: 'Initial', initial: true}}
```

There is a caveat for literals. If you need literal, you should use `as const` for the literal type value

```ts
import {dataOf, initialOf} from "./index";

type State = ILED<null, null, null, ILED<1, 2, 3, 4>>;

const state: State = dataOf(initialOf(1 as const)); // {type: 'Data', data: {type: 'Initial', initial: 1}}
```

### Updating state values using endomorphisms

Wow-wow, wait! Endomorphisms? Isn't it a something from functional programming? Absolutely. But let's see is it really
as scary as it sound

Endomorphism is just something like a mapping. But when you use `Array.prototype.map` you are able 
to change the type of values, so `Array.prototype.map` let us make mapping from `A` to `B` like
`[1,2,3].map(String) // ['1', '2', '3']`.

On the other side endomorphism is a mapping where input and output types are the same.
So, if you have an array of `Todo` items like `['Learn JS', 'Learn TS']` you can describe an endomorphism like
```ts
const addTodo = (todo: Todo, todos: Todo[]): Todo[] => todos.concat(todo);

const twoThingsToDo = ['Learn JS', 'Learn TS'] // Array of strings;
const threeThingsToDo = addTodo('LEarn FP', twoTodo) // Also array of strings;
```

So, when you want to update your ILED state you have two options:

Firstly, you may describe full ILED endomorphism, passing functions for each possible 
ILED states: initial, loading, error and data.

```ts
type State = ILED<null, null, ErrorMessage, User>;

type ErrorMessage = {
    message: string;
};

type User = {
    name: string;
    age: number;
}

const initialState1: State = initialOf(null);
const initialState2 = endomorphism(
    initialState1,
    {
        initial: (nullValue) => null,
        loading: (nullValue) => null,
        error: (errorMessageString) => ({
            message: 'Another error message'
        }),
        data: ({name, age}) => ({
            name,
            age: age + 1
        })
    }
); // {type: 'Initial': initial: null}

const dataState1: State = dataOf({name: 'John', age: 38});
const dataState2 = endomorphism(
    dataState1,
    {
        initial: (nullValue) => null,
        loading: (nullValue) => null,
        error: (errorMessageString) => ({
            message: 'Another error message'
        }),
        data: ({name, age}) => ({
            name,
            age: age + 1
        })
    }
); // {type: 'Data', data: {name: 'John', age: 39}}

```

Another option is to call endomorphism for certain state. If current ILED state is differ, then
nothing will change

```ts
type State = ILED<null, null, ErrorMessage, User>;

type ErrorMessage = {
    message: string;
};

type User = {
    name: string;
    age: number;
}

const errorState1: State = errorOf({message: 'Some error message'});
const errorState2 = errorEndomorphism(
    errorState1,
    ({message}) => ({
        message: 'Another error message'
    })
); // {type: 'Error', {message: 'Another error message'}}

const dataState1: State = dataOf({name: 'John', age: 38});
const dataState2 = dataEndomorphism(
    dataState1,
    ({name, age}) => ({
        name,
        age: age + 1
    })
); // {name: 'John', age: 39}

```

#### Summing up all we have learned...

```tsx
type State = ILED<null, null, ErrorMessage, User>;

type ErrorMessage = {
    message: string;
};

type User = {
    name: string;
    age: number;
}

const emulateUserRequest = () => Promise.resolve({name: 'John', age: 38});

const App = () => {
    const [state, setState] = useState<State>(initialOf(null));

    const loadUser = () => {
        setState(loadingOf(null));

        setTimeout(() => {
            emulateUserRequest()
                .then(data => setState(dataOf(data)))
                .catch(error => setState(errorOf({message: error.message})))
        }, 2000);
    };
    
    const incrementAge = () => {
        setState(prevState => dataEndomorphism(
            prevState,
            ({name, age}) => ({name, age: age + 1})
        ));
    };

    return (
        <DetailedILEDFolding
            state={state} // pass state
            onInitial={() => (
                <button onClick={loadUser}>
                    Load user
                </button>
            )} // render button which load user on Initial state
            onLoading={() => <span>Loading...</span>} // render `Loading...` on Loading state
            onError={({message}) => <span>{message}</span>} // render error message on Error state
            onData={({name, age}) => (
                <p>
                    <span>Name: {name}</span>
                    <span>Age: {age}</span>
                    <button onClick={incrementAge}>Increment age</button>
                </p>
            )} // render user data on Data state
        />
    )
}
```

### Different components for state folding

#### DetailedILEDFolding
`DetailedILEDFolding` uses for cases, when there are mostly different components must be
rendered for different states.

```tsx

type State = ILED<null, null, ErrorMessage, User>;

<DetailedILEDFolding
    state={state}
    onInitial={() => <LoadUserButton />}
    onLoading={() => <Loader />}
    onError={({message}) => <LoadingError message={message} />}
    onData={({name, age}) => <UserCard name={name} age={age} />}
/>
```

#### ILEDFolding
`ILEDFolding` uses for cases, when there is just one component enough to display the state

```tsx
import {DetailedILEDFolding, ILEDFolding} from "./FoldILED";

type State = ILED<
    NewTodo,
    NewTodo,
    { newTodo: NewTodo, message: ErrorMessage },
    { newTodo: NewTodo, user: User }
>;

type NewTodo = ILE<
    { title: NewTodoTitle },
    { title: NewTodoTitle },
    { title: NewTodoTitle; error: ErrorMessage }
>;

type NewTodoTitle = string;

type ErrorMessage = string;

<DetailedILEDFolding
    state={state}
    onInitial={() => (
        <>
            <ILEDFolding 
                viewForAllState={(state) => (
                    <div>
                        <input type="text" value={state.}>
                    </div>
                )}
            />
            <LoadUserButton/>
        </>
    )}
    onLoading={() => <Loader/>}
    onError={({message}) => <LoadingError message={message}/>}
    onData={({name, age}) => <UserCard name={name} age={age}/>}
/>
```

### Picking certain types
What will you do, if there shouldn't be certain part of ILED sum type in some situation?

To be honest, there are to obvious options:
1. Use certain - Initial, Loading, Error and Data types and combine them the way you need
2. Use Extract utility type to do something wierd like `Extract<ILED<1,2,3,4>, {type: 'Data'}>`, which infers `{type: 'Data', data: 4}`

So, in my opinion the first option misses the context of our target type, and the second one is just ugly.
That is why I have decided to add small utility type. 

Let's say besides, a lot of properties, we have a paginator property, which can be in one of three states - Initial, Loading, Error.
More than this, it can be only Initial on initial state, only Loading, on loading state, and Error or Data, on error or data state:

```ts
import {ILE, ILED, PickType} from "./types";

type State = ILED<
    SomeProps & PickType<Paginator, 'Initial'>,
    SomeProps & {paginator: PickType<Paginator, 'Loading'>},
    SomeProps & {paginator: PickType<Paginator, 'Initial' | 'Error'>},
    SomeProps & {paginator: PickType<Paginator, 'Initial' | 'Error'>}
>;

type Paginator = ILE<null, null, { message: string }>;

type SomeProps = {
    a: string;
    b: number;
    c: boolean
};
```

Well yeah... You may say "Hey, man, it is ugly too!". So, let me try to explain some pros of the approach:
1. This way we can see the type - Paginator, which presents the part of the domain we are dealing with to achieve our goals
2. Doing this, instead of using just `{paginator: Paginator}` makes us unavailable to represent invalid state for our imaginable task

It will look cleaner, if we put different paginator state types in their own types:

```ts
import {ILE, ILED, PickType} from "./types";

type State = ILED<
    SomeProps & PaginatorInitial,
    SomeProps & PaginatorLoading,
    SomeProps & (PaginatorInitial | PaginatorError),
    SomeProps & (PaginatorInitial | PaginatorError)
>;

type Paginator = ILE<null, null, { message: string }>;
type PaginatorInitial = {paginator: PickType<Paginator, 'Initial'>};
type PaginatorLoading = {paginator: PickType<Paginator, 'Loading'>};
type PaginatorError = {paginator: PickType<Paginator, 'Error'>};

type SomeProps = {
    a: string;
    b: number;
    c: boolean
};
```



## FAQ

### Why should I use the package?
`ILED` type helps you discriminate your data between different states of your app or whatever. 

`Fold` kind components helps you fold your `ILED` state into JSX.Element or `null`.

So if you have some data, which can be different between Initial, Loading, Error and Data states, 
ILED kind types helps you to manage all this stuff easier.

### What about rerenders? | TODO
