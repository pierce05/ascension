import { AscensionSystem, ThemeOption } from "../entities/system";

export interface SystemRepository {
  findCurrent(): Promise<AscensionSystem>;
  updateTheme(theme: ThemeOption): Promise<AscensionSystem>;
}
