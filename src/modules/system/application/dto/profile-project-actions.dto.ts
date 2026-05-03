import { ActiveProject, AvatarVariant } from "../../domain/entities/system";

export type UpdateProfileDto = {
  profileName: string;
  title: string;
  className: string;
  username: string;
  quote: string;
  bio: string;
  guild: string;
  bannerTitle: string;
  evolutionStage: string;
  presenceLabel: string;
  avatarInitials: string;
  avatarVariant: AvatarVariant;
  avatarSigil: string;
};

export type UpdateProjectDto = {
  projectId: string;
  progress: number;
  status: ActiveProject["status"];
};
