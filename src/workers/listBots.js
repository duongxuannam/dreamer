import botTinMoi from './botTinMoi'
import botLienMinh360 from './botLienMinh360'

export default {
  tinmoi: {
    name: 'tinmoi',
    bot: new botTinMoi(),
  },
  lienminh360: {
    name: 'tinmoi',
    bot: new botLienMinh360(),
  },
}