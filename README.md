[![npm version](https://badge.fury.io/js/magik-react-hooks.svg)](https://badge.fury.io/js/magik-react-hooks)
[![codecov](https://codecov.io/gh/inmagik/magik-react-hooks/branch/master/graph/badge.svg)](https://codecov.io/gh/inmagik/magik-react-hooks)

# magik-react-hooks
A collection of common (and useful) hooks

## Install

```bash
npm install --save magik-react-hooks
```

or

```bash
yarn add magik-react-hooks
```

## Docs

Available hooks

* useConstant
* usePrevious
* useDebounce
* useDebounceCallback
* useMemoCompare
* useModalTrigger

### useConstant
Keeps a constant value stable across renders

```js
import useConstant from 'magik-react-hooks/useConstant'

const constant = useConstant(23)
const anotherConstant = useConstant(() => 42)
```

### usePrevious
Injects into the current render the value of its argument during the previous render

```js
import usePrevious from 'magik-react-hooks/usePrevious'

const prev = usePrevious(someProp)
const anotherPrev = usePrevious(someFunc)
```

### useDebounce
Used to debounce a state. It is useful when you have a state that changes quickly and you need to debounce the execution of a side effect which depends on that state. This hook takes as argument the state to debounce and the debounce time (in milliseconds), and returns the debounced value.

```js
import useDebounce from 'magik-react-hooks/useDebounce'

const [state, setState] = useState(0)
const debouncedValue = useDebounce(state, time)
```

### useDebounceCallback
This hook works just like `useCallback`, but returns a function that calls your callback in a debouced fashion.

```js
import useDebounceCallback from 'magik-react-hooks/useDebounceCallback'

const [state, setState] = useState(0)
const debCallback = useDebounceCallback(fun, delay = 0, [ /* deps of fun */ ])
```

### useMemoCompare
This hooks allows to keep a stable reference to some object as long as the object remains the same (in terms of deep equality), even if you allocate it each render

```js
import useMemoCompare from 'magik-react-hooks/useMemoCompare'

const [value, setValue] = useState("")
const stableObject = useMemoCompare({ label: "some", value: value })

useEffect(() => {
  // this runs only when value changes
  console.log(value)
}, [stableObject])
```

### useModalTrigger
This hook aims at easing out modal management. When dealing with lists of objects, one of the possible implementations of the list/detail pattern is to open a modal to read or edit one object selected from the list. This implies that the modal rendering has a hard dependency on the selected item, and that when no item is selected the modal should not be mounted (or otherwise its render method must be carefully written). A naive solution for this situation is the following

```js
const [selectedItem, setSelectedItem] = useState(null)

return (
  <>
    {/* list is rendered here */}
    {selectedItem && (
      <Modal
        isOpen={true}
        toggle={() => setSelectedItem(null)}
        item={selectedItem}
      >
        {/* modal body omitted */}
      </Modal>
    )}
  </>
)
```

This has the drawback of tying together the open state of the modal and its context. This works, but makes it impossibile to have a closing animation on the modal, as it is unmounted as soon as the selectedItem becomes null.

While using this hook you can separate the context of the modal and the "open" state while exploiting an underline reducer that syncs them when needed

```js

const [{ isOpen, value }, { open, toggle, close, onClosed }] = useModalTrigger()

// This is the way you open the modal "passing" it an item
// The arg of the open function is used to populate the "value" part of the state of the trigger
const onItemSelected = useCallback(item => { open(item) }, [ open ])

return (
  <>
    {/* list is rendered here */}
    {value && (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        item={value}
        onClosed={onClosed} {/* Note this line */}
      >
        {/* modal body omitted */}
      </Modal>
    )}
  </>
)

```

By doing so, the modal can be closed before being unmounted, and a proper animation can happen in the meanwhile.

## License

MIT © [Inmagik s.r.l.](https://github.com/inmagik)
