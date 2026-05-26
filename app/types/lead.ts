import type { ImagePart } from "~/types/image";

  export interface Lead {
    _id?: string;
    status: string;
    source?: string;
    name: string;
    age?: number;
    email: string;
    phone?: number;
    address?: string;
    date?: string;
    best_communication_method?: string;
    want_to_move?: string;
    buy_sell_both?: string;
    price?: number;
    sqft?: number;
    bedrooms?: number;
    bathrooms?: number;
    budget?: number;
    seeing_an_agent?: string;
    notes?: string;
    ai_analysis: string;
    imagePart?: ImagePart;
}