import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Sentiment } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, sentiment

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  sentiment = await Sentiment.create({ url: 'https://url', entities: ['test'] })
})

test('POST /sentiments 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, url: 'test', entities: ['test'] })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.url).toEqual('test')
  expect(body.entities).toEqual(['test'])
})

test('POST /sentiments 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /sentiments 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /sentiments 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /sentiments/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${sentiment.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(sentiment.id)
})

test('GET /sentiments/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /sentiments/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${sentiment.id}`)
    .send({ access_token: adminSession, url: 'test', entities: ['test'] })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(sentiment.id)
  expect(body.url).toEqual('test')
  expect(body.entities).toEqual(['test'])
})

test('PUT /sentiments/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${sentiment.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /sentiments/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${sentiment.id}`)
  expect(status).toBe(401)
})

test('PUT /sentiments/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: adminSession, url: 'test', entities: ['test'] })
  expect(status).toBe(404)
})

test('DELETE /sentiments/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${sentiment.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /sentiments/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${sentiment.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /sentiments/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${sentiment.id}`)
  expect(status).toBe(401)
})

test('DELETE /sentiments/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
