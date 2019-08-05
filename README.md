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

const [params, setParams] = useQueryParams(encDec, opts)
```

The `opts` parameter is an object that is passed as the second parameter to `query-string.stringify()`, and can be used to control the behaviour of the `query-string` library. Usually, you want to skip URL encoding, like

```js
const [params, setParams] = useQueryParams(encDec, { encode: false })
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
import { qpDate, qpInt, qpFloat } from '@inmagik/magik-react-hooks/qpUtils'
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

When writing your own encoders and decoders, you can take those as examples

### useQueryParam
Injects in the current component the a param set in the query string, optionally transformed with a decoder/encoder

```js
import useQueryParam from '@inmagik/magik-react-hooks/useQueryParam'

const [myParam, setMyParam] = useQueryParam(paramName, defaultValue, encDec, opts)
```

The `opts` parameter is an object that is passed as the second parameter to `query-string.stringify()`, and can be used to control the behaviour of the `query-string` library. Usually, you want to skip URL encoding, like

```js
const [myParam, setMyParam] = useQueryParam(paramName, defaultValue, encDec, { encode: false })
```

The `encDec` param is the encoder and decoder. This param is used when converting data to be written in the query string and the other way round. There are two options for this param

1. A function with the signature `(fromQs: any, toQs: any) => any`
  
  In this case, the same function is used both for encoding and decoding. In encoding mode, the first parameter is `undefined` and the second one holds the param to be written in the query string. The returned value is merged in current query params and then passed in `query-string.stringify()`. In decoding mode, the first parameter holds the output of `query-string.parse()[paramName]`, while the second one is undefined. In this last case, the return value of the function is returned from the hook as the `myParam` entity. If no param with the given name could be found in the query string, the default value is returned without invoking the decoder.

2. An object with the signature `{ encoding: any => any, decoding: any => any }`

  This is similar to the previous case, except that we have distinct functions for distinct operations and we don't need to discuss about `undefined` positionals to understand the operating mode.

The `setMyParam` function returned by the hook is used to change the value of the parameter in the query string, and it is expected to be invoked with the next value for the parameter (like native `useState` without functional updates)

The common encoders and decoders presented in previous section (`qpInt`, `qpFloat` and `qpDate`) are granted to work also with `useQueryParam`

## License

MIT © [Inmagik s.r.l.](https://github.com/inmagik)
