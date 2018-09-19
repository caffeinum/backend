import { Sentiment } from '.'

let sentiment

beforeEach(async () => {
  sentiment = await Sentiment.create({ url: 'test', entities: ['test'] })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = sentiment.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(sentiment.id)
    expect(view.url).toBe(sentiment.url)
    expect(view.entities).toBe(sentiment.entities)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = sentiment.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(sentiment.id)
    expect(view.url).toBe(sentiment.url)
    expect(view.entities).toBe(sentiment.entities)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
