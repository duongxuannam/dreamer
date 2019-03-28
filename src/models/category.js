import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'
import * as regexp from '../utils/regexp'
import ServerError from '../utils/serverError'

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  flag: { type: Number, default: 1 },   // 1 - new category 
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })


categorySchema.methods.joiValidate = function (obj) {
  const schema = {
    name: Joi.string().regex(regexp.categoryNameRule).required(),
    slug: Joi.string().min(6).max(30).regex(regexp.slugRule).required(),
  }
  return new Promise((resolve, reject) => (
    Joi.validate(obj, schema, (err, result) => {
      if (err) return reject(new ServerError(err.message, 400))
      resolve(result)
    })
  ))
}

export default mongoose.model('Category', categorySchema)