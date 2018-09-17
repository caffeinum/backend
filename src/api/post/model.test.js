import { Post } from '.'

let post

beforeEach(async () => {
  post = await Post.create({ title: 'test', url: 'https://example.com', author: 'test', image: 'test', theme: 'test', text: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = post.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(post.id)
    expect(view.title).toBe(post.title)
    expect(view.author).toBe(post.author)
    expect(view.image).toBe(post.image)
    expect(view.theme).toBe(post.theme)
    expect(view.text).toBe(post.text)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = post.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(post.id)
    expect(view.title).toBe(post.title)
    expect(view.author).toBe(post.author)
    expect(view.image).toBe(post.image)
    expect(view.theme).toBe(post.theme)
    expect(view.text).toBe(post.text)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
