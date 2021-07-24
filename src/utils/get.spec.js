import get from './get'
describe('get function', () => {
    const testObj = {
        name: 'John Doe',
        age: 34,
        address: {
            city: 'Nairobi',
            street: 'Ngong Rd'
        }
    }
    it('should return default value passed', () => {
        expect(get(testObj, 'country', 'June')).toBe('June')
    })

    it('should return correct vale if exist', () => {
        expect(get(testObj, 'address.street')).toBe('Ngong Rd')
    })

    it('should return undefined if no default value is provided for a non-existent property', () => {
        expect(get(testObj, 'profession')).toBe(undefined)
    })
  })
  