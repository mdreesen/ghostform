import { Buffer } from 'node:buffer';

export interface Lead {
  name: string;
  email: string;
  address: string;
  goal: string;
  sqft: string;
  budget: string;
  message: string;
  imagePart?: ImagePart;
}

export interface Company {
  category: string;
  company_name: string;
  company_email: string;
  imagePart?: ImagePart;
}

export interface ImagePart {
  name: string;
  filename: string;
  type: string;
  data: Buffer
}

export interface LeadAndCompany {
  name: string;
  email: string;
  address: string;
  goal: string;
  sqft: string;
  budget: string;
  message: string;
  category: string;
  company_name: string;
  company_email: string;
  imagePart?: ImagePart;
}