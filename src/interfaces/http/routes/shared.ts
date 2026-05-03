import { SystemController } from "../../../modules/system/interfaces/http/system-controller";
import { SystemService } from "../../../modules/system/application/services/system-service";
import { InMemorySystemRepository } from "../../../modules/system/infrastructure/repositories/in-memory-system-repository";

const systemRepository = new InMemorySystemRepository();
const systemService = new SystemService(systemRepository);

export const systemController = new SystemController(systemService);
