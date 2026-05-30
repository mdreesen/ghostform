import mongoose, { Schema } from 'mongoose'

const leadSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Vital index for instant dashboard lookup grouping
    },
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
    reminderSent: { type: Boolean, default: false }
}, { timestamps: true }) // Automates true createdAt/updatedAt tracking lines

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema)