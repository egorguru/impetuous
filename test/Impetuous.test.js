const Impetuous = require('../index')

describe('Impetuous', () => {
  const impetuous = new Impetuous()
  const value = 'mock'
  impetuous.add('GET', '/static/path', value)
  impetuous.add('GET', '/dynamic/path/:value1', value)
  impetuous.add('GET', '/dynamic/:value1/path/:value2', value)

  it('find static path', () => {
    const res = impetuous.find('GET', '/static/path')
    expect(res).toEqual({ value })
  })
  it('find dynamic path with one param', () => {
    const res = impetuous.find('GET', '/dynamic/path/mock')
    expect(res).toEqual({
      value,
      params: { value1: 'mock' }
    })
  })
  it('find dynamic path with two param', () => {
    const res = impetuous.find('GET', '/dynamic/mock1/path/mock2')
    expect(res).toEqual({
      value,
      params: { value1: 'mock1', value2: 'mock2' }
    })
  })
  it('find static path with slash at the end', () => {
    const res = impetuous.find('GET', '/static/path/')
    expect(res).toEqual({ value })
  })
  it('find dynamic path with slash at the end', () => {
    const res = impetuous.find('GET', '/dynamic/path/mock/')
    expect(res).toEqual({
      value,
      params: { value1: 'mock' }
    })
  })
})