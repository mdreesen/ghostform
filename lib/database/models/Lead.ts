import mongoose, { Schema } from 'mongoose'

const leadSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Vital index for instant dashboard lookup grouping
    },
    company_name: String, // Attach company name to lead
    company_email: String, // Attach compnay email to lead
    source: String,
    name: String,
    age: Number,
    email: String,
    phone: String, // Kept as string to preserve leading zeros or symbols safely
    best_communication_method: String,
    address: String,
    want_to_move: String,
    buy_sell_both: String,
    price: Number,
    sqft: Number,
    bedrooms: Number,
    bathrooms: Number,
    budget: Number,
    notes: String,
    seeing_an_agent: String,
    ai_analysis: String,
    status: { type: String, default: 'new' },
    date: { type: String, default: () => new Date().toISOString() },
    reminderSent: { type: Boolean, default: false },
    reminderStatus: {
        type: String,
        enum: ['none', 'scheduled', 'sent'],
        default: 'none' // 'none' means automation is disabled for this specific lead
      },
      reminderScheduledAt: {
        type: Date,
        required: false
      },

    // Deep-dive questionnaire answers. Written by THIS app and read by the
    // dashboard — both share one database, so there is no cross-origin call
    // and no CORS involved.
    qualification: {
      sentAt: Date,
      completedAt: Date,
      intent: String,
      answers: { type: Object, default: {} }
    }
}, { timestamps: true }) // Automates true createdAt/updatedAt tracking lines

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema)