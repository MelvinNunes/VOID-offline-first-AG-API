import { z } from "zod";

export const ProductRequest = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
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
