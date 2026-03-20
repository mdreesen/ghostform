import { d as defineEventHandler, r as readMultipartFormData, c as createError } from '../../nitro/nitro.mjs';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'ipx';

const analyze_image = `Analyze this construction project photo for a Construction company.
In this image, we need to determine updates or upgrades that need to be done
`;

const index_post = defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  const file = formData == null ? void 0 : formData.find((item) => item.name === "image");
  if (!file || !file.data) {
    throw createError({ statusCode: 400, message: "No image provided" });
  }
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    // Or your preferred 2026 model
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: analyze_image },
          {
            type: "image",
            // PASS THE RAW DATA BUFFER DIRECTLY
            image: file.data
          }
        ]
      }
    ]
  });
  return { analysis: text };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
