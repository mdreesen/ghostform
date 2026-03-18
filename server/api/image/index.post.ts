// server/api/analyze-image.post.ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { analyze_image } from '~/utils/analyze/image';

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  const file = formData?.find((item) => item.name === 'image');

  if (!file || !file.data) {
    throw createError({ statusCode: 400, message: 'No image provided' });
  }

  const { text } = await generateText({
    model: openai('gpt-4o-mini'), // Or your preferred 2026 model
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: analyze_image },
          { 
            type: 'image', 
            // PASS THE RAW DATA BUFFER DIRECTLY
            image: file.data 
          },
        ],
      },
    ],
  });

  return { analysis: text };
});