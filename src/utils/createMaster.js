import User from '../models/user'

const createMaster = async () => {
  const admin = await User.findOne({
    username: 'nammm',
  })
  if (!admin) {
    const user = new User({
      username: 'nammm',
      fullname: 'Admin master',
      email: 'duongxuannam1995@gmail.com',
      phone: '9999999999',
      password: 'matkhaulagi1995',
      role: 'admin',
      active: true,
    })
    await user.save()
  }
}

export default createMaster