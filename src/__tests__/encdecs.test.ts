
import { qpInt, qpFloat, qpDate, qpBool, qpNullable } from '../qpUtils'
import { makeParamEncDec } from '../EncDec/encdec'

describe('qpInt', () => {
  it('should handle int values with not much effort', () => {
    const encdec = makeParamEncDec(qpInt())

    expect(encdec.encode(1)).toBe("1")
    expect(encdec.decode("23")).toBe(23)
    expect(encdec.encode(null)).toBeFalsy()
    expect(encdec.encode(null)).not.toBe(0)
    expect(encdec.encode(undefined)).toBeUndefined()
    expect(encdec.decode(undefined)).toBeUndefined()
  })

  it('should change radix when told', () => {
    const encdec = makeParamEncDec(qpInt(16))

    expect(encdec.encode(17)).toBe("11")
    expect(encdec.decode("A0")).toBe(160)
  })
})

describe('qpFloat', () => {
  it('should handle float values with not much effort', () => {
    const encdec = makeParamEncDec(qpFloat())

    expect(encdec.encode(1.23)).toBe("1.23")
    expect(encdec.decode("23.42")).toBe(23.42)
    expect(encdec.encode(null)).toBeFalsy()
    expect(encdec.encode(null)).not.toBe(0)
    expect(encdec.encode(undefined)).toBeUndefined()
    expect(encdec.decode(undefined)).toBeUndefined()
  })
})

describe('qpDate', () => {
  it('should handle ISO date strings', () => {
    const encdec = makeParamEncDec(qpDate())
    expect(encdec.encode(new Date(Date.UTC(2019, 9, 17, 13, 42, 33, 0)))).toBe('2019-10-17T13:42:33.000Z')
    expect((encdec.decode("2019-10-17T13:42:33.000Z") as Date).getUTCDate()).toBe(17)
    expect((encdec.decode("2019-10-17T13:42:33.000Z") as Date).getUTCMonth()).toBe(9)
    expect((encdec.decode("2019-10-17T13:42:33.000Z") as Date).getUTCFullYear()).toBe(2019)
    expect((encdec.decode("2019-10-17T13:42:33.000Z") as Date).getUTCHours()).toBe(13)
    expect((encdec.decode("2019-10-17T13:42:33.000Z") as Date).getUTCMinutes()).toBe(42)
    expect((encdec.decode("2019-10-17T13:42:33.000Z") as Date).getUTCSeconds()).toBe(33)
    expect((encdec.decode("2019-10-17T13:42:33.000Z") as Date).getUTCMilliseconds()).toBe(0)
    expect(encdec.encode(null)).toBeFalsy()
    expect(encdec.encode(null)).not.toBe(0)
    expect(encdec.encode(undefined)).toBeUndefined()
    expect(encdec.decode(undefined)).toBeUndefined()
  })
})

describe('qpBool', () => {
  it('should deal with boolean values', () => {
    const encdec = makeParamEncDec(qpBool("true", "false"))

    expect(encdec.encode(true)).toBe("true")
    expect(encdec.encode(false)).toBe("false")
    expect(encdec.encode(null)).toBe(undefined)
    expect(encdec.encode(undefined)).toBe(undefined)

    expect(encdec.decode("true")).toBe(true)
    expect(encdec.decode("false")).toBe(false)
    expect(encdec.decode(undefined)).toBe(undefined)
    expect(encdec.decode("blabla")).toBe(undefined)
  })
  it('should provide sensible defaults', () => {
    const encdec = makeParamEncDec(qpBool())

    expect(encdec.encode(true)).toBe("1")
    expect(encdec.encode(false)).toBe("0")

    expect(encdec.decode("1")).toBe(true)
    expect(encdec.decode("0")).toBe(false)
  })
})

describe('qpNullable', () => {
  it('should stringify null values', () => {
    const spy = jest.fn()
    const encdec = makeParamEncDec(qpNullable(spy, "UUUU"))

    expect(encdec.encode(null)).toBe("UUUU")
    expect(encdec.decode("UUUU")).toBe(null)
    expect(spy).not.toHaveBeenCalled()
  })
  it('should use default is representation is not specified', () => {
    const spy = jest.fn()
    const encdec = makeParamEncDec(qpNullable(spy))

    expect(encdec.encode(null)).toBe("null")
    expect(encdec.decode("null")).toBe(null)
    expect(spy).not.toHaveBeenCalled()
  })
  it('should call nested parser for non null values', () => {
    const decode = jest.fn(() => 'a')
    const encode = jest.fn(() => 'b')

    const encdec = makeParamEncDec(qpNullable({ decode, encode }, "UUUU"))

    expect(encdec.decode("XXX")).toBe('a')
    expect(decode).toHaveBeenCalledWith("XXX")

    expect(encdec.encode(123)).toBe('b')
    expect(encode).toHaveBeenCalledWith(123)
  })
})