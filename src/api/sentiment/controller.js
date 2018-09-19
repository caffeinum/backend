import { success, notFound } from '../../services/response/'
import { Sentiment } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Sentiment.create(body)
    .then((sentiment) => sentiment.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Sentiment.count(query)
    .then(count => Sentiment.find(query, select, cursor)
      .then((sentiments) => ({
        count,
        rows: sentiments.map((sentiment) => sentiment.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Sentiment.findById(params.id)
    .then(notFound(res))
    .then((sentiment) => sentiment ? sentiment.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Sentiment.findById(params.id)
    .then(notFound(res))
    .then((sentiment) => sentiment ? Object.assign(sentiment, body).save() : null)
    .then((sentiment) => sentiment ? sentiment.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Sentiment.findById(params.id)
    .then(notFound(res))
    .then((sentiment) => sentiment ? sentiment.remove() : null)
    .then(success(res, 204))
    .catch(next)
