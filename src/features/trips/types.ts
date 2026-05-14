export type TripRole = "owner" | "editor" | "viewer";

export type Trip = {
  id: string;
  ownerId: string;
  name: string;
  destination: string;
  startsOn: string;
  endsOn: string;
  defaultCurrency: string;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TripParticipant = {
  id: string;
  tripId: string;
  userId: string | null;
  displayName: string;
  email: string | null;
  role: TripRole;
  invitationStatus: "invited" | "previewing" | "accepted";
};
