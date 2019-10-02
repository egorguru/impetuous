const Impetuous = require('../index')

describe('Impetuous', () => {
  const impetuous = new Impetuous()
  const handler = 'mock'
  impetuous.add('GET', '/static/path', handler)
  impetuous.add('GET', '/dinamic/path/:value1', handler)
  impetuous.add('GET', '/dinamic/:value1/path/:value2', handler)

  it('find static path', () => {
    const res = impetuous.find('GET', '/static/path')
    expect(res).toEqual({ handler, query: {} })
  })
  it('find dinamic path with one param', () => {
    const res = impetuous.find('GET', '/dinamic/path/mock')
    expect(res).toEqual({
      handler,
      params: { value1: 'mock' },
      query: {}
    })
  })
  it('find dinamic path with two param', () => {
    const res = impetuous.find('GET', '/dinamic/mock1/path/mock2')
    expect(res).toEqual({
      handler,
      params: { value1: 'mock1', value2: 'mock2' },
      query: {}
    })
  })
  it('find static path with query param', () => {
    const res = impetuous.find('GET', '/static/path?param1=mock')
    expect(res).toEqual({
      handler,
      query: { param1: 'mock' }
    })
  })
  it('find dinamic path with query param', () => {
    const res = impetuous.find('GET', '/dinamic/path/mock?param1=mock')
    expect(res).toEqual({
      handler,
      params: { value1: 'mock' },
      query: { param1: 'mock' }
    })
  })
  it('find static path with slash at the end', () => {
    const res = impetuous.find('GET', '/static/path/')
    expect(res).toEqual({ handler, query: {} })
  })
  it('find dinamic path with slash at the end', () => {
    const res = impetuous.find('GET', '/dinamic/path/mock/')
    expect(res).toEqual({
      handler,
      params: { value1: 'mock' },
      query: {}
    })
  })
})