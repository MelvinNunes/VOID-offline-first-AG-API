import { z } from "zod";

const ProductRequest = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive().optional(),
  quantity: z.number().int().positive().optional(),
  components: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .optional(),
});
