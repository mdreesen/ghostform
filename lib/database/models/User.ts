import mongoose, { Schema } from "mongoose";
import env from "../../env";

mongoose.connect(`${env.MONGO_URI}`);
mongoose.Promise = global.Promise;

const lead = new Schema(
    {
        source: String || undefined,
        name: String || undefined,
        age: Number || undefined,
        email: String || undefined,
        phone: String || undefined,
        best_communication_method: String || undefined,
        address: String || undefined,
        want_to_move: String || undefined,
        buy_sell_both: String || undefined,
        price: Number || undefined,
        sqft: Number || undefined,
        bedrooms: Number || undefined,
        bathrooms: Number || undefined,
        budget: Number || undefined,
        notes: String || undefined,
        seeing_an_agent: String || undefined,
        ai_analysis: String || undefined,
        status: String || undefined,
        date: String || undefined,
    }, { timestamps: false });

const userSchema = new Schema(
    {
        company: String,
        company_hashed: String,
        role: String,
        category: String,
        category_hashed: String,
        qr_code_slug: String,
        total_scans: Number,
        leads_captured: Number,
        name: String,
        email: String,
        email_hashed: String,
        phone: String,
        password: String,
        region: String,
        country: String,
        reset_password_token: String,
        privacy_policy: Boolean,
        paid: Boolean,
        paid_tier: String,
        calendar_link: String,
        leads: [lead],
        createdAt: String,
        updatedAt: String
    }, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;