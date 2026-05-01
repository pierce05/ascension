import { AppError } from "../../../../core/errors/app-error";
import { AscensionSystem } from "../../domain/entities/system";
import { SystemRepository } from "../../domain/repositories/system-repository";
import { UpdateThemeDto } from "../dto/update-theme.dto";

export class SystemService {
  constructor(private readonly systemRepository: SystemRepository) {}

  public async getCurrentSystem(): Promise<AscensionSystem> {
    return this.systemRepository.findCurrent();
  }

  public async updateTheme(input: UpdateThemeDto): Promise<AscensionSystem> {
    if (input.theme !== "crimson" && input.theme !== "violet") {
      throw new AppError("Theme must be either crimson or violet.", 400, "INVALID_THEME");
    }

    return this.systemRepository.updateTheme(input.theme);
  }
}
