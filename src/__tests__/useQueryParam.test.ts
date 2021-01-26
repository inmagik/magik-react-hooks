import { renderHook, act } from '@testing-library/react-hooks'
import '@testing-library/jest-dom/extend-expect'
import useQueryParam from '../useQueryParam'
import { ParsedQueryItem } from '../EncDec/encdec'

describe('useQueryParam', () => {
  it('should parse a query string with "?" with not much effort', () => {
    const qs = '?a=1&b=ciao&c=1&c=2&c=3&d=due parole'

    const { result } = renderHook(() =>
      useQueryParam(qs, () => {}, 'a', 'null')
    )

    const [param] = result.current

    expect(param).toEqual('1')
  })

  it('should parse a query string without "?" with not much effort', () => {
    const qs = 'a=1&b=ciao&c=1&c=2&c=3&d=due parole'

    const { result } = renderHook(() => useQueryParam(qs, () => {}, 'c', []))

    const [params] = result.current

    expect(params).toEqual(['1', '2', '3'])
  })

  it('should use default value if param is not present', () => {
    const qs = 'a=1&b=ciao&c=1&c=2&c=3&d=due parole'

    const { result } = renderHook(() =>
      useQueryParam(qs, () => {}, 'e', '@null@')
    )

    const [params] = result.current

    expect(params).toEqual('@null@')
  })

  it('should write a query string with not much effort', () => {
    const qs = 'b=ciao'

    const store = {
      value: null
    }

    const setter = (arg: any) => (store.value = arg)

    const { result } = renderHook(() =>
      useQueryParam(qs, setter, 'a', 'default_value')
    )

    act(() => {
      result.current[1](123)
    })

    expect(store.value).toMatch('a=123')
    expect(store.value).toMatch('b=ciao')
  })

  it('can accept a decoder (functional form)', () => {
    const qs = '?a=1&b=ciao&c=1&c=2&c=3&d=due parole'

    const decoder = jest.fn((data, x: number | undefined) => {
      return data ? parseInt(data, 10) : undefined
    })

    const { result } = renderHook(() =>
      useQueryParam(qs, () => {}, 'a', '123', decoder)
    )

    const [param] = result.current

    expect(param).toEqual(1)

    expect(decoder).toHaveBeenCalledTimes(1)
    expect(decoder).toHaveBeenCalledWith('1', undefined)
  })

  it('can accept a decoder (object form)', () => {
    const qs = '?a=1&b=ciao&c=1&c=2&c=3&d=due parole'

    const decoder = jest.fn(data => {
      return data ? parseInt(data, 10) : undefined
    })

    const { result } = renderHook(() =>
      useQueryParam(qs, () => {}, 'a', 'ciao', { decode: decoder })
    )

    const [param] = result.current

    expect(param).toEqual(1)

    expect(decoder).toHaveBeenCalledTimes(1)
  })

  it('does not call the decoder when returning default value', () => {
    const qs = '?a=1&b=ciao&c=1&c=2&c=3&d=due parole'

    const decoder = jest.fn(data => {
      return data ? parseInt(data, 10) : undefined
    })

    const { result } = renderHook(() =>
      useQueryParam(qs, () => {}, 'e', 'ciao', { decode: decoder })
    )

    const [param] = result.current

    expect(param).toEqual('ciao')

    expect(decoder).toHaveBeenCalledTimes(0)
  })

  it('should accept an encoder (functional form)', () => {
    const qs = 'b=2'

    const store = { value: null }

    const encoder = (fromQs: ParsedQueryItem, toQs: number | undefined) => {
      if (toQs === undefined) {
        throw '???'
        // ???
        // return String.fromCharCode(0) - 65
      }
      return String.fromCharCode(toQs + 65)
    }

    const setter = (arg: any) => {
      store.value = arg
    }

    const { result } = renderHook(() =>
      useQueryParam(qs, setter, 'a', 'ciao', encoder)
    )

    act(() => {
      result.current[1](1)
    })

    expect(store.value).toMatch('a=B')
    expect(store.value).toMatch('b=2')
  })

  it('should accept an encoder (object form)', () => {
    const qs = 'b=2'

    const store = { value: null }

    const encoder = (toQs: number) => {
      return String.fromCharCode(toQs + 65)
    }

    const setter = (arg: any) => {
      store.value = arg
    }

    const { result } = renderHook(() =>
      useQueryParam(qs, setter, 'a', 'ciao', { encode: encoder })
    )

    act(() => {
      result.current[1](1)
    })

    expect(store.value).toMatch('a=B')
    expect(store.value).toMatch('b=2')
  })
})
