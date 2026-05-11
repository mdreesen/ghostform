import mongoose, { Schema } from "mongoose";
import env from "../../env";

mongoose.connect(`${env.MONGO_URI}`);
mongoose.Promise = global.Promise;

const lead = new Schema(
    {
        name: String || undefined,
        email: String || undefined,
        phone: String || undefined,
        age: String || undefined,
        address: String || undefined,
        ai_analysis: String || undefined,

        // Realtor Data
        want_to_move: String || undefined,
        buy_sell_both: String || undefined,
        home_price: String || undefined,
        home_sqft: String || undefined,
        home_bedrooms: String || undefined,
        home_bathrooms: String || undefined,
        budget: String || undefined,
        message: String || undefined,
        //
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
        first_name: String,
        last_name: String,
        email: String,
        email_hashed: String,
        phone: String,
        leads: [lead],
        password: String,
        street_address: String,
        city: String,
        country: String,
        postal_code: String,
        reset_password_token: String,
        privacy_policy: Boolean,
        createdAt: String,
        updatedAt: String
    }, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;