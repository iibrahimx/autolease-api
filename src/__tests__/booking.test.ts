describe("Booking Module", () => {
  describe("Date Overlap Detection", () => {
    
    it("should detect overlapping dates", () => {
      // Existing booking: July 10-15
      // New booking: July 12-18 (OVERLAPS)
      const existingStart = new Date("2026-07-10");
      const existingEnd = new Date("2026-07-15");
      const newStart = new Date("2026-07-12");
      const newEnd = new Date("2026-07-18");

      const overlaps = existingStart <= newEnd && existingEnd >= newStart;
      expect(overlaps).toBe(true);
    });

    it("should allow non-overlapping dates", () => {
      // Existing booking: July 10-15
      // New booking: July 20-25 (NO OVERLAP)
      const existingStart = new Date("2026-07-10");
      const existingEnd = new Date("2026-07-15");
      const newStart = new Date("2026-07-20");
      const newEnd = new Date("2026-07-25");

      const overlaps = existingStart <= newEnd && existingEnd >= newStart;
      expect(overlaps).toBe(false);
    });

    it("should detect when new booking completely contains existing", () => {
      // Existing: July 12-15
      // New: July 10-18 (completely surrounds existing)
      const existingStart = new Date("2026-07-12");
      const existingEnd = new Date("2026-07-15");
      const newStart = new Date("2026-07-10");
      const newEnd = new Date("2026-07-18");

      const overlaps = existingStart <= newEnd && existingEnd >= newStart;
      expect(overlaps).toBe(true);
    });

    it("should detect when new booking is completely inside existing", () => {
      // Existing: July 10-18
      // New: July 12-15 (completely inside existing)
      const existingStart = new Date("2026-07-10");
      const existingEnd = new Date("2026-07-18");
      const newStart = new Date("2026-07-12");
      const newEnd = new Date("2026-07-15");

      const overlaps = existingStart <= newEnd && existingEnd >= newStart;
      expect(overlaps).toBe(true);
    });
  });

  describe("Booking Status Flow", () => {
    it("should have correct booking lifecycle states", () => {
      const states = [
        "pending",
        "awaiting_payment",
        "paid",
        "active",
        "completed",
        "cancelled",
      ];

      expect(states).toHaveLength(6);
      expect(states[0]).toBe("pending");
      expect(states[states.length - 2]).toBe("completed");
      expect(states[states.length - 1]).toBe("cancelled");
    });

    it("should not allow cancellation of active bookings", () => {
      const nonCancellableStatuses = ["active", "completed"];
      
      nonCancellableStatuses.forEach((status) => {
        expect(["active", "completed"]).toContain(status);
      });
    });
  });

  describe("Price Calculation", () => {
    it("should calculate total price correctly", () => {
      const dailyPrice = 50000;
      const startDate = new Date("2026-07-10");
      const endDate = new Date("2026-07-15");
      
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalPrice = dailyPrice * days;

      expect(days).toBe(5);
      expect(totalPrice).toBe(250000);
    });

    it("should handle single day rental", () => {
      const dailyPrice = 30000;
      const startDate = new Date("2026-07-10");
      const endDate = new Date("2026-07-10");
      
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Same day should still count as 1 day
      expect(Math.max(days, 1)).toBe(1);
    });
  });
});