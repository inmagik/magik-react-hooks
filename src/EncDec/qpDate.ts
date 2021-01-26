import { ParamEncDecObj } from './encdec'

class DefaultDateLibrary {
  date: Date

  constructor(arg: Date | string | number) {
    if (arg instanceof Date) this.date = arg
    else this.date = new Date(arg)
  }

  format() {
    return this.date.toISOString()
  }

  toDate() {
    return this.date
  }
}

const DefaultDateLibraryEntry = (arg: Date | string | number) => {
  return new DefaultDateLibrary(arg)
}

interface DateLibaryKlass {
  format(f: string): string
  toDate(): Date
}
type DateLibary = (arg: Date | string | number) => DateLibaryKlass

export const qpDate = (
  dateLibrary: DateLibary = DefaultDateLibraryEntry,
  format = 'YYYY-MM-DD HH:mm'
): ParamEncDecObj<Date | undefined, Date | null | undefined> => ({
  encode: data => data && dateLibrary(data).format(format),
  decode: data => (data ? dateLibrary(data as string).toDate() : undefined)
})
