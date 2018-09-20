import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy, search, showSentiment, getEntities } from './controller'
import { schema } from './model'
export Post, { schema } from './model'

const router = new Router()
const { title, url, author, image, search_query, keywords, summary, text, publishedAt } = schema.tree

/**
 * @api {post} /posts Create post
 * @apiName CreatePost
 * @apiGroup Post
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam title Post's title.
 * @apiParam url Post's url – should be unique.
 * @apiParam author Post's author.
 * @apiParam image Post's image.
 * @apiParam search_query Post's search_query.
 * @apiParam summary Post's summary.
 * @apiParam text Post's text.
 * @apiSuccess {Object} post Post's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Post not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  token({ required: true, roles: ['admin'] }),
  body({ title, url, author, image, search_query, keywords, summary, text, publishedAt }),
  create)

/**
 * @api {get} /posts Retrieve posts
 * @apiName RetrievePosts
 * @apiGroup Post
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of posts.
 * @apiSuccess {Object[]} rows List of posts.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /posts/search/:q Find posts
 * @apiName FindPost
 * @apiGroup Post
 * @apiSuccess {Object[]} post Post's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Post not found.
 */
router.get('/search/:q',
  search)

router.get('/search',
  search)

/**
 * @api {get} /posts/:id Retrieve post
 * @apiName RetrievePost
 * @apiGroup Post
 * @apiSuccess {Object} post Post's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Post not found.
 */
router.get('/:id',
  show)


/**
 * @api {get} /posts/:id Retrieve post
 * @apiName RetrievePost
 * @apiGroup Post
 * @apiSuccess {Object} post Post's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Post not found.
 */
router.get('/:id/sentiment',
  showSentiment)


/**
 * @api {get} /posts/:id Retrieve post entities
 * @apiName RetrievePost
 * @apiGroup Post
 * @apiSuccess {Object} post Post's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Post not found.
 */
router.get('/:id/entities',
  getEntities)


/**
 * @api {put} /posts/:id Update post
 * @apiName UpdatePost
 * @apiGroup Post
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam title Post's title.
 * @apiParam author Post's author.
 * @apiParam image Post's image.
 * @apiParam search_query Post's search_query.
 * @apiParam text Post's text.
 * @apiSuccess {Object} post Post's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Post not found.
 * @apiError 401 admin access only.
 */
router.put('/:id',
  token({ required: true, roles: ['admin'] }),
  body({ title, url, author, image, search_query, keywords, summary, text, publishedAt }),
  update)

/**
 * @api {delete} /posts/:id Delete post
 * @apiName DeletePost
 * @apiGroup Post
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Post not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
