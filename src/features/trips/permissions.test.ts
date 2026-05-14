import { describe, expect, it } from "vitest";
import { canEditTrip, canPreviewTrip } from "@/features/trips/permissions";
import type { TripParticipant } from "@/features/trips/types";

const baseParticipant: TripParticipant = {
  id: "participant-1",
  tripId: "trip-1",
  userId: "user-1",
  displayName: "Ava",
  email: "ava@example.com",
  role: "editor",
  invitationStatus: "accepted"
};

describe("trip permissions", () => {
  it("allows accepted editors to edit", () => {
    expect(canEditTrip(baseParticipant)).toBe(true);
  });

  it("does not allow invited editors to edit", () => {
    expect(
      canEditTrip({ ...baseParticipant, invitationStatus: "invited" })
    ).toBe(false);
  });

  it("allows invited users to preview", () => {
    expect(
      canPreviewTrip({ ...baseParticipant, invitationStatus: "previewing" })
    ).toBe(true);
  });
});
