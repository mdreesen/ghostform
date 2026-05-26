import { Buffer } from 'node:buffer';

export interface ImagePart {
    name: string;
    filename: string;
    type: string;
    data: Buffer
  }