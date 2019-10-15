
import { renderHook, act } from '@testing-library/react-hooks'
import '@testing-library/jest-dom/extend-expect'
import useQueryParams from '../useQueryParams'

describe('useQueryParams', () => {
  it('should parse a query string with "?" with not much effort', () => {
    const qs = '?a=1&b=ciao&c=1&c=2&c=3&d=due parole'

    const { result } = renderHook(() => useQueryParams(qs, () => { }))

    const [params] = result.current

    expect(params).toEqual({
      a: "1",
      b: "ciao",
      c: ["1", "2", "3"],
      d: "due parole"
    })
  })

  it('should parse a query string without "?" with not much effort', () => {
    const qs = 'a=1&b=ciao&c=1&c=2&c=3&d=due parole'

    const { result } = renderHook(() => useQueryParams(qs, () => { }))

    const [params] = result.current

    expect(params).toEqual({
      a: "1",
      b: "ciao",
      c: ["1", "2", "3"],
      d: "due parole"
    })
  })

  it('should write a query string with not much effort', () => {
    const qs = ''

    const store = {}

    const setter = arg => store.value = arg

    const { result } = renderHook(() => useQueryParams(qs, setter))

    act(() => {
      result.current[1]({
        a: 1,
        b: 2,
        c: [1, "a", "d"],
        d: "due parole"
      })
    })

    expect(store.value).toMatch("a=1")
    expect(store.value).toMatch("b=2")
    expect(store.value).toMatch("c=1")
    expect(store.value).toMatch("c=a")
    expect(store.value).toMatch("c=d")
    expect(store.value).toMatch("d=due%20parole")
  })

  it('can accept a decoder (functional form)', () => {
    const qs = '?a=1&b=ciao&c=1&c=2&c=3&d=due parole'

    const decoder = jest.fn(data => {
      return {
        a: data.a ? parseInt(data.a, 10) : undefined,
        b: data.b,
        c: data.c.map(i => parseInt(i, 10)).reverse(),
        d: data.d.toUpperCase(),
        e: 123,
      }
    })

    const { result } = renderHook(() => useQueryParams(qs, () => { }, decoder))

    const [params] = result.current

    expect(params).toEqual({
      a: 1,
      b: "ciao",
      c: [3, 2, 1],
      d: "DUE PAROLE",
      e: 123
    })

    expect(decoder).toHaveBeenCalledTimes(1)
  })

  it('can accept a decoder (object form)', () => {
    const qs = '?a=1&b=ciao&c=1&c=2&c=3&d=due parole'

    const decoder = jest.fn(data => {
      return {
        a: data.a ? parseInt(data.a, 10) : undefined,
        b: data.b,
        c: data.c.map(i => parseInt(i, 10)).reverse(),
        d: data.d.toUpperCase(),
        e: 123,
      }
    })

    const { result } = renderHook(() => useQueryParams(qs, () => { }, { decode: decoder }))

    const [params] = result.current

    expect(params).toEqual({
      a: 1,
      b: "ciao",
      c: [3, 2, 1],
      d: "DUE PAROLE",
      e: 123
    })

    expect(decoder).toHaveBeenCalledTimes(1)
  })

  it('can accept a decoder (partial function form)', () => {
    const qs = '?a=1&b=ciao&c=1&c=2&c=3&d=due parole'

    const decoderForA = jest.fn(data => {
      return data !== undefined && data !== null ? parseInt(data, 10) : data
    })

    const decoderForC = jest.fn(data => {
      return data !== undefined && data !== null ? data.map(i => parseInt(i, 10) + 1) : data
    })

    const { result } = renderHook(() => useQueryParams(qs, () => { }, { a: decoderForA, c: decoderForC }))

    const [params] = result.current

    expect(params).toEqual({
      a: 1,
      b: "ciao",
      c: [2, 3, 4],
      d: "due parole",
    })

    expect(decoderForA).toHaveBeenCalledTimes(1)
    expect(decoderForA).toHaveBeenCalledWith("1", undefined)

    expect(decoderForC).toHaveBeenCalledTimes(1)
    expect(decoderForC).toHaveBeenCalledWith(["1", "2", "3"], undefined)
  })

  it('can accept a decoder (partial object form)', () => {
    const qs = '?a=1&b=ciao&c=1&c=2&c=3&d=due parole'

    const decoderForA = jest.fn(data => {
      return data !== undefined && data !== null ? parseInt(data, 10) : data
    })

    const decoderForC = jest.fn(data => {
      return data !== undefined && data !== null ? data.map(i => parseInt(i, 10) + 1) : data
    })

    const { result } = renderHook(() => useQueryParams(qs, () => { }, { a: { decode: decoderForA }, c: { decode: decoderForC } }))

    const [params] = result.current

    expect(params).toEqual({
      a: 1,
      b: "ciao",
      c: [2, 3, 4],
      d: "due parole",
    })

    expect(decoderForA).toHaveBeenCalledTimes(1)
    expect(decoderForA).toHaveBeenCalledWith("1")

    expect(decoderForC).toHaveBeenCalledTimes(1)
    expect(decoderForC).toHaveBeenCalledWith(["1", "2", "3"])
  })

  it('should accept an encoder (functional form)', () => {
    const qs = ''

    const store = {}

    const encoder = (fromQs, toQs) => {
      if (toQs === undefined) {
        return fromQs
      }
      return {
        a: String.fromCharCode(toQs.a + 65),
        b: toQs.b.toString(),
        c: toQs.c.join(','),
        d: toQs.d
      }
    }

    const setter = arg => {
      store.value = arg
    }

    const { result } = renderHook(() => useQueryParams(qs, setter, encoder))

    act(() => {
      result.current[1]({
        a: 1,
        b: 2,
        c: [1, "a", "d"],
        d: "due parole"
      })
    })

    expect(store.value).toMatch("a=B")
    expect(store.value).toMatch("b=2")
    expect(store.value).toMatch("c=1%2Ca%2Cd")
    expect(store.value).toMatch("d=due%20parole")
  })

  it('should accept an encoder (object form)', () => {
    const qs = ''

    const store = {}

    const encoder = toQs => {
      return {
        a: String.fromCharCode(toQs.a + 65),
        b: toQs.b.toString(),
        c: toQs.c.join(','),
        d: toQs.d
      }
    }

    const setter = arg => {
      store.value = arg
    }

    const { result } = renderHook(() => useQueryParams(qs, setter, { encode: encoder }))

    act(() => {
      result.current[1]({
        a: 1,
        b: 2,
        c: [1, "a", "d"],
        d: "due parole"
      })
    })

    expect(store.value).toMatch("a=B")
    expect(store.value).toMatch("b=2")
    expect(store.value).toMatch("c=1%2Ca%2Cd")
    expect(store.value).toMatch("d=due%20parole")
  })

  it('should accept an encoder (partial function form)', () => {
    const qs = ''

    const store = {}

    const encoderForA = (str, val) => {
      if (val === undefined) return str
      return String.fromCharCode(val + 65)
    }

    const encoderForC = (str, val) => {
      if (val === undefined) return str
      return val.join("OoO")
    }

    const setter = arg => {
      store.value = arg
    }

    const { result } = renderHook(() => useQueryParams(qs, setter, { a: encoderForA, c: encoderForC }))

    act(() => {
      result.current[1]({
        a: 1,
        b: 2,
        c: [1, "a", "d"],
        d: "due parole"
      })
    })

    expect(store.value).toMatch("a=B")
    expect(store.value).toMatch("b=2")
    expect(store.value).toMatch("c=1OoOaOoOd")
    expect(store.value).toMatch("d=due%20parole")
  })

  it('should accept an encoder (partial object form)', () => {
    const qs = ''

    const store = {}

    const encoderForA = val => {
      return String.fromCharCode(val + 65)
    }

    const encoderForC = val => {
      return val.join("OoO")
    }

    const setter = arg => {
      store.value = arg
    }

    const { result } = renderHook(() => useQueryParams(qs, setter, { a: { encode: encoderForA }, c: { encode: encoderForC } }))

    act(() => {
      result.current[1]({
        a: 1,
        b: 2,
        c: [1, "a", "d"],
        d: "due parole"
      })
    })

    expect(store.value).toMatch("a=B")
    expect(store.value).toMatch("b=2")
    expect(store.value).toMatch("c=1OoOaOoOd")
    expect(store.value).toMatch("d=due%20parole")
  })

  it('should discard invalid encoder/decoder', () => {
    const qs = ''

    const store = {}

    const setter = arg => {
      store.value = arg
    }

    const { result } = renderHook(() => useQueryParams(qs, setter, { a: "ciao" }))

    act(() => {
      result.current[1]({
        a: 1,
        b: 2,
      })
    })

    expect(store.value).toMatch("a=1")
    expect(store.value).toMatch("b=2")
  })


})