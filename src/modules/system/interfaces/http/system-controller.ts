import { Request, Response } from "express";
import { SystemService } from "../../application/services/system-service";

export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  public getCurrentSystem = async (_request: Request, response: Response): Promise<void> => {
    const system = await this.systemService.getCurrentSystem();

    response.status(200).json({
      data: system,
    });
  };

  public updateTheme = async (request: Request, response: Response): Promise<void> => {
    const system = await this.systemService.updateTheme({
      theme: request.body.theme,
    });

    response.status(200).json({
      data: system,
    });
  };
}
