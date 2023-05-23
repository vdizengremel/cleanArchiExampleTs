import Token from '../token'

describe('Token', () => {
  it('should throw error when value is not of 32 characters length', () => {
    const value = generateStringOfLength(31)
    expect(() => new Token(value)).toThrowError(
      new Error('Token should be of 32 characters length')
    )
  })

  it('should throw error when value is not of 32 characters length', () => {
    const value = generateStringOfLength(32)
    const token = new Token(value)
    expect(token.value).toEqual(value)
  })

  function generateStringOfLength(wantedLength: number): string {
    let generatedString = ''

    for (let i = 1; i <= wantedLength; i++) {
      generatedString = generatedString + 'a'
    }

    return generatedString
  }
})
