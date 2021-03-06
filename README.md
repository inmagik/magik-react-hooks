[![Build Status](https://travis-ci.com/inmagik/magik-react-hooks.svg?branch=master)](https://travis-ci.com/inmagik/magik-react-hooks)
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
* useRouter _(requires react-router)_  **:warning: Deprecated!**
* useQueryParams _(requires query-string)_
* useQueryParam _(requires query-string)_
* useRouterQueryParams _(requires query-string and react-router)_
* useRouterQueryParam _(requires query-string and react-router)_
* useDebounce
* useDebounceCallback
* useRouterDebounceQueryParams
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

### useRouter :warning: Deprecated!
Injects React Router context into current component

```js
import useRouter from 'magik-react-hooks/useRouter'

const { history, location } = useRouter()
```

use:
```js
import { useLocation, useHistory } from 'react-router'
```
instead.

### useQueryParams
Injects in the current component the params set in the query string, optionally transformed with a decoder/encoder

```js
import useQueryParams from 'magik-react-hooks/useQueryParams'

const [params, setParams] = useQueryParams(queryString, setQueryString, encDec, opts)
```

The `queryString` parameter is the querystring to parse and to extract params from
The `setQueryString` callback is called whenever there is the need to update the querystring (for instance, because `setParams` was called)

The `opts` parameter is an object that is passed as the second parameter to `query-string.stringify()`, and can be used to control the behaviour of the `query-string` library. Usually, you want to skip URL encoding, like

```js
// Assuming get_current_querystring and set_current_querystring to be (well) defined
const qs = get_current_querystring()
const setQs = qs => set_current_querystring(qs)
const [params, setParams] = useQueryParams(qs, setQs, encDec, { encode: false })
```

The `encDec` param is the encoder and decoder. This param is used when converting data to be written in the query string and the other way round. There are several options for this param

1. A function with the signature `(fromQs: any, toQs: any) => any`

  In this case, the same function is used both for encoding and decoding. In encoding mode, the first parameter is `undefined` and the second one holds the whole data object to be written in the query string, and the returned value is passed in `query-string.stringify()`. In decoding mode, the first parameter holds the output of `query-string.parse()`, while the second one is undefined. In this last case, the return value of the function is returned from the hook as the `params` entity

2. An object with the signature `{ encoding: any => any, decoding: any => any }`

  This is similar to the previous case, except that we have distinct functions for distinct operations and we don't need to discuss about `undefined` positionals to understand the operating mode.

3. An object with the signature `{ [prop]: { encoding: any => any, decoding: any => any }}`

  This case allows to define distinct encoder and decoder functions for arbitrary keys. The logic is always the same except that if you define an encoder/decoder for a given prop, those functions will be invoked with the corresponding prop from the data object, and not with the whole object.

4. An object with the signature `{ [prop]: (fromQs: any, toQs: any) => any}`

  This case allows to use the function format on a single key. In encoding mode, the first parameter is `undefined` and the second one holds the value of `prop` in the data object to be written to the query string, and the returned value is merged with the other keys and then passed in `query-string.stringify()`. In decoding mode, the first parameter holds the output of `query-string.parse()[prop]`, while the second one is undefined. In this last case, the return value of the function is merged with the other values and returned from the hook as the `params` entity

5. A mixture of (2), (3) and (4)

  You can also specify a global encoder and key-based decoders, or any combination. Refer to the `TestComponent` defined in the example.

The library ships with some common encoders and decoders, which are

```js
import {
  qpDate,
  qpInt,
  qpFloat,
  qpBool,
  qpNullable
} from 'magik-react-hooks/qpUtils'
```

They should be used with pattern (4), like

```js
// Assuming get_current_querystring and set_current_querystring to be (well) defined
const qs = get_current_querystring()
const setQs = qs => set_current_querystring(qs)
const [params, setParams] = useQueryParams(qs, setQs, {
  from: qpDate(),
  to: qpDate()
})
```

In order to allow for custom configuration of basic props, the library exports encoder/decoder builders, which must be invoked with configuration arguments to return the valid encoder/decoder

The `qpDate` invocation supports two optional params:
* `dateLib`: a moment-like date library
* `format`: the encoding format for dates (ignored if first param is left to default value)

The `qpInt` invocation supports one (optional) param: the `radix` (defaults to 10)

The `qpFloat` invocation does not support any param

The `qpBool` invocation supports two arguments: the former is the encoding of the boolean value `true`, the latter is the same for `false`. Both them are coerced to strings, so pass suitable values.

The `qpNullable` encoder is a sort of meta-encoder: its invocation requires you to pass another encoder as the first parameter (this can be another `qpXXX` or a custom encoder), which will be used to encode/decode the value when it is not null, and a string that is used to represent the value `null` in the querystring (this should be a value that is not part of the data domain)

Feel free to refer to the implementation of those encoders and decoders when you need to write some custom one

### useRouterQueryParams
Same as `useQueryParams`, but it reads from and writes to React Router's `location.search`, hence the signature becomes:

```js
import useRouterQueryParams from 'magik-react-hooks/useRouterQueryParams'

const [params, setParams] = useRouterQueryParams(encDec, opts)
```

Obviously, you can use this in a component that is a (deep) child of a `Router`

### useQueryParam
Injects in the current component the a param set in the query string, optionally transformed with a decoder/encoder

```js
import useQueryParam from 'magik-react-hooks/useQueryParam'

const [myParam, setMyParam] = useQueryParam(
  queryString,
  setQueryString,
  paramName,
  defaultValue,
  encDec,
  opts
)
```

The `queryString` parameter is the querystring to parse and to extract params from
The `setQueryString` callback is called whenever there is the need to update the querystring (for instance, because `setParams` was called)

The `paramName` and `defaultValue` parameters have a pretty obvious meaning: they are the name of the param to return and the value to return in case the param is not found in the querystring

The `opts` parameter is an object that is passed as the second parameter to `query-string.stringify()`, and can be used to control the behaviour of the `query-string` library. Usually, you want to skip URL encoding, like

```js
// Assuming get_current_querystring and set_current_querystring to be (well) defined
const qs = get_current_querystring()
const setQs = qs => set_current_querystring(qs)
const [myParam, setMyParam] = useQueryParam(
  qs, setQs, paramName, defaultValue, encDec, { encode: false }
)
```

The `encDec` param is the encoder and decoder. This param is used when converting data to be written in the query string and the other way round. There are two options for this param

1. A function with the signature `(fromQs: any, toQs: any) => any`

  In this case, the same function is used both for encoding and decoding. In encoding mode, the first parameter is `undefined` and the second one holds the param to be written in the query string. The returned value is merged in current query params and then passed in `query-string.stringify()`. In decoding mode, the first parameter holds the output of `query-string.parse()[paramName]`, while the second one is undefined. In this last case, the return value of the function is returned from the hook as the `myParam` entity. If no param with the given name could be found in the query string, the default value is returned without invoking the decoder.

2. An object with the signature `{ encoding: any => any, decoding: any => any }`

  This is similar to the previous case, except that we have distinct functions for distinct operations and we don't need to discuss about `undefined` positionals to understand the operating mode.

The `setMyParam` function returned by the hook is used to change the value of the parameter in the query string, and it is expected to be invoked with the next value for the parameter (like native `useState` without functional updates)

The common encoders and decoders presented in previous section (`qpInt`, `qpFloat` and `qpDate`) are granted to work also with `useQueryParam`

### useRouterQueryParam
Same as `useQueryParam`, but it reads from and writes to React Router's `location.search`, hence the signature becomes:

```js
import useRouterQueryParam from 'magik-react-hooks/useRouterQueryParam'

const [params, setParams] = useRouterQueryParam(paramName, defaultValue, encDec, opts)
```

Obviously, you can use this in a component that is a (deep) child of a `Router`

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

### useRouterDebounceQueryParams
This hook solves one of the major problems in react development: state debouncing. The common case for this is when you have a text input writing a value in the query string, which in turn is used to filter results of a REST API call. In this situation, you need both the real-time updated state (to feed the input) and a debounced state (to avoid repeated and useless API calls). This hooks hence returns a state and its debounced version, plus some helpers to set it immediately and in a debounced way. All control is then up to you

```js
import useRouterDebounceQueryParams from 'magik-react-hooks/useRouterDebounceQueryParams'

const [
  liveState, setLiveState, 
  debouncedState, setDebouncedState
] = useRouterDebounceQueryParams(qpEncoder, options)
```

`setLiveState` is immediate, and updates at the same time `liveState` and `debouncedState`, while `setDebouncedState` updates `liveState` immediately and `debouncedState` when `setDebouncedState` calls stop for a while. 

You can configure the delay with `options.delay`, default value is 200ms.

In short, `liveState` is always the up-to-date state, while `debouncedState` follows it according to debouncing mechanics. The query string follows the same dynamics of `debouncedState`. This allows for a better UX when using the browser navigation buttons.


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
