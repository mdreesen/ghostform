import type { ImagePart } from "~/types/image";

export interface Lead {
    source?: string;
    name: string;
    age?: string;
    email: string;
    phone?: string;
    best_communication_method?: string;
    address?: string;
    want_to_move?: string;
    buy_sell_both?: string;
    price?: string;
    sqft?: string;
    bedrooms?: string;
    bathrooms?: string;
    budget?: string;
    notes?: string;
    seeing_an_agent?: string;
    imagePart?: ImagePart;
  }