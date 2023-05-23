export default class Token {
  constructor(public readonly value: string) {
    this.assertLengthIsValid(value)
  }

  private assertLengthIsValid(value: string) {
    if (value.length != 32) {
      throw new Error('Token should be of 32 characters length')
    }
  }
}
