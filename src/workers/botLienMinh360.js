import puppeteer from 'puppeteer'
import { findIndex } from 'lodash'
import BotCore from './botCore'
import logger from '../utils/logger'
import Article from '../models/article'

export default class BotLienMinh360 extends BotCore {
  constructor(name = 'lienminh360') {
    super(name)
  }

  async runTask() {
    try {
      const browser = await puppeteer.launch()
      const prevArticles = await Article.find().sort({ createdAt: 'desc' }).limit(5)
      // Mở 1 page mới
      const page = await browser.newPage()
      // đi đến trang lienminh360f
      await page.goto('http://lienminh360.vn/')

      await page.waitFor(2000)

      const articles = await page.evaluate(() => {
        const arr = document.querySelectorAll('div.lastest-post  div.single-article')   //eslint-disable-line
        const articlesHandle = []
        arr.forEach(item => {
          const hrefHandle = item.children[0].children[0]
          const imgHandle = item.children[0].children[0].children
          const titleHandle = item.children[1].children[0]
          const descriptionHandle = item.children[1].children[1]

          const href = hrefHandle.getAttribute('href').trim()
          const urlImg = imgHandle[0].getAttribute('src').trim()
          const title = titleHandle.textContent.trim()
          const description = descriptionHandle.textContent.trim()
          articlesHandle.push({
            urlImg,
            title,
            description,
            href,
          })
        })

        return articlesHandle
      })
      for (let i = 0; i < articles.length; i++) {
        const index = findIndex(prevArticles, item => item.href === articles[i].href)
        if (index >= 0) {
          continue
        }
        await page.goto(articles[i].href, {
          // Set timeout cho page
          timeout: 3000000,
        })
        await page.waitFor(2000)
        const contentPage = await page.evaluate(() => {
          const contentHandle = document.querySelector('div.contpost') //eslint-disable-line

          const content = contentHandle.innerHTML

          return content
        })
        articles[i].content = contentPage
        const article = new Article({
          title: articles[i].title,
          content: contentPage,
          urlImg: articles[i].urlImg,
          description: articles[i].description,
          href: articles[i].href,
        })

        await article.save()

        // tắt trình duyệt
      }
      await browser.close()

    } catch (error) {
      logger.error(error)
    }
  }
}