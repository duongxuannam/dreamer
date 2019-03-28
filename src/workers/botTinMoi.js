import axios from 'axios'
import find from 'lodash/find'
import get from 'lodash/get'
import BotCore from './botCore'
import logger from '../utils/logger'
import Category from '../models/category'
import Article from '../models/article'
import User from '../models/user'
import ServerError from '../utils/serverError'
import { ARTICLE_STATUS, ROLES } from '../utils/constants'

export default class BotTinMoi extends BotCore {
  constructor(name = 'tinmoi') {
    super(name)

    this.baseURL = 'http://m.tinmoi.vn/api'
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        // if (error.response) {
        //   return Promise.reject({ code: error.response.status, message: error.response.data.message }) // eslint-disable-line
        // }

        // if (error.request) {
        //   return Promise.reject({ message: 'No response was received' }) // eslint-disable-line
        // }

        return Promise.reject(error)
      }
    )

    this.mapCategories = [
      {
        source: 'Doi-song',
        destination: 'phong-cach-song',
      },
      {
        source: 'Giai-tri',
        destination: 'giai-tri',
      },
    ]
  }

  runTask() {
    this.mapCategories.forEach(async category => {
      try {
        const listCat = await this.api.get('/listcat')
        const source = find(listCat, cat => cat.meta_slug === category.source)
        const destination = await Category.findOne({ slug: category.destination }).exec()

        if (!source || !destination) throw new ServerError('Category not found', 404)

        const articles = await this.api.get(`/list/${source.id}/p/1`)

        for (let i = 0; i < articles.length; i++) {
          let article = await Article.findOne({ slug: articles[i].meta_slug }).exec()

          if (article) {
            logger.info('Article is existed')
            continue
          }

          const data = await this.api.get(`/art/${articles[i].id}`)
          const author = await User.findOne({ role: ROLES.EDITOR }).exec()

          if (!data) {
            logger.info('Article not found')
            continue
          }

          article = new Article({
            title: data.title,
            slug: data.meta_slug,
            excerpt: data.meta_description,
            status: ARTICLE_STATUS.PUBLISHED,
            featuredImage: {
              original: get(data, ['avatar_info', 'nature_url']),
              small: get(data, ['avatar_info', 'upload_url_huge']),
              medium: get(data, ['avatar_info', 'nature_url']),
              large: get(data, ['avatar_info', 'nature_url']),
            },
            content: data.content_text,
            tags: [],
            isHot: true,
            isSpecial: true,
            author: author._id,
            createdBy: author._id,
            category: destination._id,
          })

          await article.save()
        }
      } catch (error) {
        logger.error(error)
      }
    })
  }
}