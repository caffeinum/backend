import { success, notFound } from '../../services/response/'
import { Post } from '.'
import { Entity } from '../entity'
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

export const findNotProcessed = ({ params }, res, next) =>
  Post.aggregate([
    {
      $lookup: {
        from: 'entities',
        localField: '_id',
        foreignField: 'post',
        as: 'entities'
      }
    },
    {
      $match: {
        "entities": { $exists: true, $size: 0 },
      }
    }
  ])
    .then(success(res, 200))
    .catch(next)

export const getEntities = ({ params }, res, next) =>
  Post.findById(params.id)
    .then(notFound(res))
    .then(post => Entity.find({ post: post.id }))
    .then(entities => entities.map(entity => entity.view()))
    .then(success(res, 200))
    .catch(next)


const aggregatePostsWithEntities = ({ q, isProcessed }) => {
  let query = []

  if (q !== undefined) {
    query.push({ $match: { search_query: q } })
  }

  query.push({
    $lookup: {
      from: 'entities',
      localField: '_id',
      foreignField: 'post',
      as: 'entities',
    }
  })

  query.push({
    $lookup: {
      from: 'sentiments',
      localField: 'url',
      foreignField: 'url',
      as: 'sentiments',
    }
  })

  // query.push({
  //   $sort: {
  //     'entities[$search_query]': 1
  //   }
  // })

  if (isProcessed !== undefined) {
    query.push({
      $match: {
        "entities": (isProcessed !== 'false' && isProcessed != 0)
          ? { $exists: true, $ne:  [] }
          : { $exists: true, $size: 0 }
      }
    })
  }

  return Post.aggregate(query)
}

const findPosts = ({ q, isProcessed, filterOutput }) =>
  aggregatePostsWithEntities({ q, isProcessed })
    .then((posts) => posts.map(post => {
      let entity

      try {
        entity = post.sentiments[0].entities[0][q]
          || post.entities[q]
          || {}
      } catch (err) {
        entity = {}
      }

      return {
        ...post,
        entity,
      }
    }))
    .then((posts) => posts.sort((post1, post2) => {
      try {
        const s1 = parseFloat(post1.entity.sentiment) || 0
        const s2 = parseFloat(post2.entity.sentiment) || 0

        return s2 - s1
      } catch (err) {
        return 0
      }
    }))
    .then((posts) => (!filterOutput)
      ? posts
      : ({
        best: posts.filter((_, index) => {
          return index < 5
        }),
        worst: posts.filter((_, index) => {
          return index >= posts.length - 5
        }).reverse(),
      })
    )

export const search = ({ query, params }, res, next) =>
  findPosts({ ...params, ...query })
    .then(success(res))
    .catch(next)

export const showSentiment = ({ params }, res, next) =>
  Post.findById(params.id)
    .then(notFound(res))
    .then(post => post.url)
    .then(url => Sentiment.findOne({ url }))
    .then(notFound(res))
    .then((sentiment) => sentiment ? sentiment.view() : null)
    .then(success(res))
    .catch(next)
