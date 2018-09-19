import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Sentiment, { schema } from './model'

const router = new Router()
const { url, entities } = schema.tree

/**
 * @api {post} /sentiments Create sentiment
 * @apiName CreateSentiment
 * @apiGroup Sentiment
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam url Sentiment's url.
 * @apiParam entities Sentiment's entities.
 * @apiSuccess {Object} sentiment Sentiment's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Sentiment not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  token({ required: true, roles: ['admin'] }),
  body({ url, entities }),
  create)

/**
 * @api {get} /sentiments Retrieve sentiments
 * @apiName RetrieveSentiments
 * @apiGroup Sentiment
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of sentiments.
 * @apiSuccess {Object[]} rows List of sentiments.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /sentiments/:id Retrieve sentiment
 * @apiName RetrieveSentiment
 * @apiGroup Sentiment
 * @apiSuccess {Object} sentiment Sentiment's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Sentiment not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /sentiments/:id Update sentiment
 * @apiName UpdateSentiment
 * @apiGroup Sentiment
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam url Sentiment's url.
 * @apiParam entities Sentiment's entities.
 * @apiSuccess {Object} sentiment Sentiment's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Sentiment not found.
 * @apiError 401 admin access only.
 */
router.put('/:id',
  token({ required: true, roles: ['admin'] }),
  body({ url, entities }),
  update)

/**
 * @api {delete} /sentiments/:id Delete sentiment
 * @apiName DeleteSentiment
 * @apiGroup Sentiment
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Sentiment not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
