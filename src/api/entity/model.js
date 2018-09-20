import mongoose, { Schema } from 'mongoose'

const entitySchema = new Schema({
  name: {
    type: String
  },
  post: {
    type: {type: Schema.Types.ObjectId, ref: 'Post' }
  },
  salience: {
    type: Number
  },
  sentiment: {
    type: Number
  },
  magnitude: {
    type: Number
  },
  mentions: {
    type: [Schema.Types.Mixed]
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

entitySchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      post: this.post,
      salience: this.salience,
      sentiment: this.sentiment,
      magnitude: this.magnitude,
      mentions: this.mentions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('entities', entitySchema)

export const schema = model.schema
export default model
