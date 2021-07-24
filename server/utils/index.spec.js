const { checkWin } = require('./index')

describe('checkWin', () => {
    it('should return draw for similar choices', () => {
        expect(checkWin('Paper', 'Paper')).toBe('draw')
        expect(checkWin('Rock', 'Rock')).toBe('draw')
        expect(checkWin('Scissor', 'Scissor')).toBe('draw')
    })

    it('returns win true for paper-rock', () => {
        expect(checkWin('Paper', 'Rock')).toBe(true)
    })

    it('returns win true for scissors-paper', () => {
        expect(checkWin('Scissor', 'Paper')).toBe(true)
    })

    it('returns win true for rock-scissor', () => {
        expect(checkWin('Rock', 'Scissor')).toBe(true)
    })
  })
  