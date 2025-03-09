
import {plainToInstance} from "class-transformer";
import {Region} from "../../domain/models/region.model";
import {RegionSchema} from "../database/schemas/region.schema";

export class RegionMapper {
    static toSchemaFromDomain(region: Region): RegionSchema {
        return plainToInstance(RegionSchema, region);
    }

    static toDomainFromSchema(regionSchema: RegionSchema): Region {
        return plainToInstance(Region, regionSchema, {excludeExtraneousValues: true});
    }
}