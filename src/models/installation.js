import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

// Define schema installation
const installationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  notificationToken: { type: String },
  nameDevice: { type: String },
  identity: { type: String, unique: true },
  platform: { type: String },
  appVersion: { type: String },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

installationSchema.plugin(uniqueValidator)

export default mongoose.model('Installation', installationSchema)