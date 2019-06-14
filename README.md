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
Injects in the current component the params set in the query string

```js
import useQueryParams from '@inmagik/magik-react-hooks/useQueryParams'

const params = useQueryParams()
```


## License

MIT © [Inmagik s.r.l.](https://github.com/inmagik)
