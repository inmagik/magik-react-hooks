class DefaultDateLibrary {
  constructor(arg) {
    if (arg instanceof Date)
      this.date = arg
    else
      this.date = new Date(arg)
  }

  format() {
    return this.date.toISOString()
  }

  toDate() {
    return this.date
  }
}

const DefaultDateLibraryEntry = arg => {
  return new DefaultDateLibrary(arg)
}

export const qpDate = (dateLibrary = DefaultDateLibraryEntry, format = 'YYYY-MM-DD HH:mm') => ({
  encode: data => data && dateLibrary(data).format(format),
  decode: data => data && dateLibrary(data).toDate()
})
