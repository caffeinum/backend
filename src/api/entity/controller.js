import { success, notFound } from '../../services/response/'
import { Entity } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Entity.create(body)
    .then((entity) => entity.view(true))
    .then(success(res, 201))
    .catch(next)

export const createMany = ({ bodymen: { entities, post } }, res, next) =>
  Promise.all(entities.map(entity =>
    Entity.create(entity)
  ))
  .then(entities => entities.map( entity => entity.view(true) ))
  .then(success(res, 201))
  .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Entity.find(query, select, cursor)
    .then((entities) => entities.map((entity) => entity.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Entity.findById(params.id)
    .then(notFound(res))
    .then((entity) => entity ? entity.view() : null)
    .then(success(res))
    .catch(next)
