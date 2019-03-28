import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const articleSchema = new Schema({
  excerpt: { type: String },
  status: { type: String, default: 'draft' },   // draft, pendingReview, approved, published 
  featuredImage: { type: Object },

  urlImg: { type: String },
  title: { type: String },
  description: { type: String },
  href: { type: String },

  content: { type: String },
  tags: [{ type: String }],
  isHot: { type: Boolean, default: false },
  isSpecial: { type: Boolean, default: false },
  countLikes: { type: Number, default: 0 },
  countComments: { type: Number, default: 0 },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  flag: { type: Number, default: 1 },   // 1 - new article 
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

articleSchema.plugin(uniqueValidator)

export default mongoose.model('Article', articleSchema)