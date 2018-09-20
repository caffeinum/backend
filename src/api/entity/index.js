import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show } from './controller'
import { schema } from './model'
export Entity, { schema } from './model'

const router = new Router()
const { name, post, salience, sentiment, magnitude, mentions } = schema.tree

/**
 * @api {post} /entities Create entity
 * @apiName CreateEntity
 * @apiGroup Entity
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam name Entity's name.
 * @apiParam post Entity's post.
 * @apiParam salience Entity's salience.
 * @apiParam sentiment Entity's sentiment.
 * @apiParam magnitude Entity's magnitude.
 * @apiParam mentions Entity's mentions.
 * @apiSuccess {Object} entity Entity's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Entity not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  token({ required: true, roles: ['admin'] }),
  body({ name, post, salience, sentiment, magnitude, mentions }),
  create)

/**
 * @api {get} /entities Retrieve entities
 * @apiName RetrieveEntities
 * @apiGroup Entity
 * @apiUse listParams
 * @apiSuccess {Object[]} entities List of entities.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /entities/:id Retrieve entity
 * @apiName RetrieveEntity
 * @apiGroup Entity
 * @apiSuccess {Object} entity Entity's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Entity not found.
 */
router.get('/:id',
  show)

export default router
