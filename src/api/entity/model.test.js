import { Entity } from '.'

let entity

beforeEach(async () => {
  entity = await Entity.create({ name: 'test', post: 'test', salience: 0.1, sentiment: -0.1, magnitude: 0.5, mentions: ['test'] })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = entity.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(entity.id)
    expect(view.name).toBe(entity.name)
    expect(view.post).toBe(entity.post)
    expect(view.salience).toBe(entity.salience)
    expect(view.sentiment).toBe(entity.sentiment)
    expect(view.magnitude).toBe(entity.magnitude)
    expect(view.mentions).toBe(entity.mentions)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = entity.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(entity.id)
    expect(view.name).toBe(entity.name)
    expect(view.post).toBe(entity.post)
    expect(view.salience).toBe(entity.salience)
    expect(view.sentiment).toBe(entity.sentiment)
    expect(view.magnitude).toBe(entity.magnitude)
    expect(view.mentions).toBe(entity.mentions)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
