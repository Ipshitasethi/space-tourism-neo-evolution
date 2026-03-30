const { z } = require('zod');

const bookingSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  missionId: z.string().regex(/^MSN-\d{3}$/, "Invalid Mission ID format (MSN-XXX)"),
  cabinClass: z.enum(["Economy", "Business", "First"]),
  passengerId: z.string().regex(/^PSG-[A-Z0-9]{6}$/, "Format must be PSG-XXXXXX"),
  specialRequirements: z.string().max(500, "Maximum 500 characters").optional()
});

module.exports = { bookingSchema };
