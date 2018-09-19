import { success, notFound } from '../../services/response/'
import { Post } from '.'
import { Sentiment } from '../sentiment'

export const create = ({ bodymen: { body } }, res, next) =>
  Post.create(body)
    .then((post) => post.view(true))
    .then(success(res, 201))
    .catch((err) => {
      /* istanbul ignore else */
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'url',
          message: 'this url already added',
        })
      } else {
        next(err)
      }
    })

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Post.count(query)
    .then(count => Post.find(query, select, cursor)
      .then((posts) => ({
        count,
        rows: posts.map((post) => post.view()),
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Post.findById(params.id)
    .then(notFound(res))
    .then((post) => post ? post.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Post.findById(params.id)
    .then(notFound(res))
    .then((post) => post ? Object.assign(post, body).save() : null)
    .then((post) => post ? post.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Post.findById(params.id)
    .then(notFound(res))
    .then((post) => post ? post.remove() : null)
    .then(success(res, 204))
    .catch(next)

const search = (search_query, res, next) =>
  Post.aggregate([
    { $match: { search_query } },
    {
      $lookup: {
        from: 'sentiments',
        localField: 'url',
        foreignField: 'url',
        as: 'sentiment',
      }
    }
  ])
    .then((posts) => posts.map(post => ({
        ...post,
        sentiment: post.sentiment[0] ? post.sentiment[0].entities[0] : [],
      })
    ))
    .then(success(res))
    .catch(next)

export const searchByQuery = ({ query: { q } }, res, next) =>
  search(q, res, next)

export const searchByParams = ({ params: { q } }, res, next) =>
  search(q, res, next)

export const showSentiment = ({ params }, res, next) =>
  Post.findById(params.id)
    .then(notFound(res))
    .then(post => post.url)
    .then(url => Sentiment.findOne({ url }))
    .then(notFound(res))
    .then((sentiment) => sentiment ? sentiment.view() : null)
    .then(success(res))
    .catch(next)
