import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Post } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, post

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  post = await Post.create({})
})

test('POST /posts 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, title: 'test', author: 'test', image: 'test', theme: 'test', text: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.author).toEqual('test')
  expect(body.image).toEqual('test')
  expect(body.theme).toEqual('test')
  expect(body.text).toEqual('test')
})

test('POST /posts 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /posts 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /posts 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /posts/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${post.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(post.id)
})

test('GET /posts/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /posts/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${post.id}`)
    .send({ access_token: adminSession, title: 'test', author: 'test', image: 'test', theme: 'test', text: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(post.id)
  expect(body.title).toEqual('test')
  expect(body.author).toEqual('test')
  expect(body.image).toEqual('test')
  expect(body.theme).toEqual('test')
  expect(body.text).toEqual('test')
})

test('PUT /posts/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${post.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /posts/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${post.id}`)
  expect(status).toBe(401)
})

test('PUT /posts/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: adminSession, title: 'test', author: 'test', image: 'test', theme: 'test', text: 'test' })
  expect(status).toBe(404)
})

test('DELETE /posts/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${post.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /posts/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${post.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /posts/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${post.id}`)
  expect(status).toBe(401)
})

test('DELETE /posts/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
