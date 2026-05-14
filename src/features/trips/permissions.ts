import type { TripParticipant, TripRole } from "@/features/trips/types";

const editableRoles = new Set<TripRole>(["owner", "editor"]);

export function canEditTrip(participant: TripParticipant | null | undefined) {
  return (
    Boolean(participant) &&
    participant?.invitationStatus === "accepted" &&
    editableRoles.has(participant.role)
  );
}

export function canPreviewTrip(participant: TripParticipant | null | undefined) {
  return Boolean(participant);
}
