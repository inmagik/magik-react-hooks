# magik-react-hooks

> Collection of common (and useful) hooks

## Install

```bash
npm install --save @inmagik/magik-react-hooks
```

or

```bash
yarn add @inmagik/magik-react-hooks
```

> Remember to setup .npmrc file

## Docs

Available hooks

* useConstant
* usePrevious
* useRawWs _(requires reconnectingwebsocket)_
* useJsonWs _(requires reconnectingwebsocket)_
* useRouter _(requires react-router)_
* useQueryParams _(requires query-string)_

### useConstant
Keeps a constant value stable across renders

```js
import useConstant from '@inmagik/magik-react-hooks/useConstant'

const constant = useConstant(23)
const anotherConstant = useConstant(() => 42)
```

### usePrevious
Injects into the current render the value of its argument during the previous render

```js
import usePrevious from '@inmagik/magik-react-hooks/usePrevious'

const prev = usePrevious(someProp)
const anotherPrev = usePrevious(someFunc)
```

### useRawWs
Manages a connection to a server via WebSocket protocol

The configuration of the hook requires the URL the server is listening to and second parameter, which
acts as a callback. 

This second parameter can either be a function with two arguments

```js
import useRawWs from '@inmagik/magik-react-hooks/useRawWs'


// eventType is either `open`, `message` or `close`
useRawWs(WS_URL, (eventType, event) => { /* handle event */ })
```

or an object with the following structure

```js
import useRawWs from '@inmagik/magik-react-hooks/useRawWs'

const handlers = {
  open: event => { /* handle open event */ },
  message: event => { /* handle message event */ },
  close: event => { /* handle close event */ },
}

// eventType is either `open`, `message` or `close`
useRawWs(WS_URL, handlers)
```

### useJsonWs
Simplified version of useRawWs, useful when the socket uses JSON encoded messages and the open and close events don't need to be handled

```js
import useJsonWs from '@inmagik/magik-react-hooks/useJsonWs'

useJsonWs(WS_URL, data => { /* some data have been received... */})
```

> `data` has already been `JSON.parse`d when the handler is called

### useRouter
Injects React Router context into current component

```js
import useRouter from '@inmagik/magik-react-hooks/useRouter'

const { history, location } = useRouter()
```

### useQueryParams
Injects in the current component the params set in the query string, optionally transformed with a decoder/encoder

```js
import useQueryParams from '@inmagik/magik-react-hooks/useQueryParams'

const params = useQueryParams(encDec, opts)
```

The `opts` parameter is an object that is passed as the second parameter to `query-string.stringify()`, and can be used to control the behaviour of the `query-string` library. Usually, you want to skip URL encoding, like

```js
const [params, setParams] = useQueryParams(encDec, { encode: false })
```

The `encDec` param is the encoder and decoder. This param is used when converting data to be written in the query string and the other way round. There are several options for this param

1. A function with the signature `(fromQs: any, toQs: any) => any`
  
  In this case, the same function is used both for encoding and decoding. In encoding mode, the first parameter is `undefined` and the second one holds the whole date object to be written in the qyuery string, and the return value is passed in `query-string.stringify()`. In decoding mode, the first parameter holds the output of `query-string.parse()`, while the second one is undefined. In this last case, the return value of the function is returned from the hook as the `params` entity

2. An object with the signature `{ encoding: any => any, decoding: any => any }`

  This is similar to the previous case, except that we have distinct functions for distinct operations and we don't need to discuss about `undefined` positionals to understand the operating mode.

3. An object with the signature `{ [prop]: { encoding: any => any, decoding: any => any }}`

  This case allows to define distinct encoder and decoder functions for arbitrary keys.

4. An object with the signature `{ [prop]: (fromQs: any, toQs: any) => any}`

  This case allows to use the function format on a single key. The same considerations, with respect to `undefined` positionals, made at point (1) hold

5. A mixture of (2), (3) and (4)

  You can also specify a global encoder and key-based decoders, or any combination. Keep in mind that key-based decoders and encoders take priority over global `encode` and `decode` functions, and that the global `encode` and `decode` functions are not automatically memoized, while key-based ones are.

The library ships with some common encoders and decoders, which are 

```js
import { qpDate, qpInt, qpFloat } from '@inmagik/magik-react-hooks/useQueryParams'
```

They should be used with pattern (4), like

```js

const [params, setParams] = useQueryParams({
  from: qpDate(),
  to: qpDate()
})
```

Remember to invoke them

The `qpDate` invocation supports two optional params:
* `dateLib`: a moment-like date library
* `format`: the encoding format for dates (ignored if first param is left to default value)

The `qpInt` invocation supports one (optional) param: the `radix` (defaults to 10)

The `qpFloat` invocation does not support any param

The `TestComponent` in the `example` is built using this hook


## License

MIT © [Inmagik s.r.l.](https://github.com/inmagik)
