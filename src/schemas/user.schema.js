const { z } = require('zod');

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  uid: z.string().min(1, "UID is required")
});

const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  profile_complete: z.boolean().optional()
});

module.exports = { userSchema, userUpdateSchema };
