import get from 'lodash/get'
import map from 'lodash/map'
import ALL_BOTS from '../workers/listBots'
import puppeteer from 'puppeteer'

export const demo3 = async (req, res) => {
  const browser = await puppeteer.launch()
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
    // tắt trình duyệt
  }
  await browser.close()

  res.send({ articles })

}


export const startLienMinh360 = async (req, res) => {
  const bot = get(ALL_BOTS, ['lienminh360', 'bot'])
  if (bot) {
    bot.start()
    res.json({ message: 'Ok' })
  } else {
    res.status(404).json({ message: 'Not found' })
  }
}


export const getAll = async (req, res) => {
  const bots = []
  map(ALL_BOTS, (bot => bots.push({
    name: bot.name,
    isRunning: get(bot, ['bot', 'isRunning'], false),
  })))

  res.json({ bots })
}

export const countAll = async (req, res) => {
  const count = Object.keys(ALL_BOTS).length

  res.json({ count })
}



export const start = async (req, res) => {
  const { name } = req.body
  const bot = get(ALL_BOTS, [name, 'bot'])
  if (bot) {
    bot.start()
    res.json({ message: 'Ok' })
  } else {
    res.status(404).json({ message: 'Not found' })
  }
}

export const stop = async (req, res) => {
  const { name } = req.body
  const bot = get(ALL_BOTS, [name, 'bot'])
  if (bot) {
    bot.stop()
    res.json({ message: 'Ok' })
  } else {
    res.status(404).json({ message: 'Not found' })
  }
}

export const toggle = async (req, res) => {
  const { name } = req.body
  const bot = get(ALL_BOTS, [name, 'bot'])
  if (bot) {
    bot.toggle()
    res.json({ message: 'Ok' })
  } else {
    res.status(404).json({ message: 'Not found' })
  }
}