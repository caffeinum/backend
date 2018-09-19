import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
  title: {
    type: String,
  },
  url: {
    type: String,
    match: /^https?:\/\//,
    required: true,
    unique: true,
    trim: true,
  },
  author: {
    type: String,
  },
  image: {
    type: String,
  },
  search_query: {
    type: String,
  },
  summary: {
    type: String,
  },
  text: {
    type: String,
  },
  keywords: {
    type: [String],
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id },
  },
})

postSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      title: this.title,
      url: this.url,
      author: this.author,
      image: this.image,
      search_query: this.search_query,
      text: this.text,
      summary: this.summary,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }

    return full ? {
      ...view,
      sentiment: this.sentiment || {},
      // add properties for a full view
    } : view
  },
}

const model = mongoose.model('Post', postSchema)

export const schema = model.schema
export default model
