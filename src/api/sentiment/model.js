import mongoose, { Schema } from 'mongoose'

const sentimentSchema = new Schema({
  url: {
    type: String
  },
  entities: {
    type: [Schema.Types.Mixed]
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

sentimentSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      url: this.url,
      entities: this.entities,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('sentiments', sentimentSchema)

export const schema = model.schema
export default model
