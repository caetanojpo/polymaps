import {plainToInstance} from "class-transformer";
import {Region} from "../../domain/models/region.model";
import {RegionSchema} from "../database/schemas/region.schema";
import {CreateRegionDto} from "../../application/dtos/region/create-region.dto";
import {UpdateRegionDto} from "../../application/dtos/region/update-region.dto";
import {RegionResponseDTO} from "../../application/dtos/region/region-response.dto";
import {UserMapper} from "./user.mapper";

export class RegionMapper {
    static toSchemaFromDomain(region: Region): RegionSchema {
        return plainToInstance(RegionSchema, region);
    }

    static toDomainFromSchema(regionSchema: RegionSchema): Region {

        const region = plainToInstance(Region, regionSchema, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true
        });

        if (regionSchema.owner && typeof regionSchema.owner !== 'string') {
            region.owner = UserMapper.toDomainFromSchema(regionSchema.owner);
        }

        return region;
    }

    static toDomainFromCreateRegionDTO(createRegionDto: CreateRegionDto): Region {
        return plainToInstance(Region, createRegionDto);
    }

    static toDomainFromUpdateUserDTO(updateRegionDto: UpdateRegionDto): Region {
        return plainToInstance(Region, updateRegionDto);
    }

    static toRegionResponseFromDomain(region: Region): RegionResponseDTO {
        const regionResponseDTO = plainToInstance(RegionResponseDTO, region, {excludeExtraneousValues: true});

        if (region.owner) {
            regionResponseDTO.owner = UserMapper.toUserResponseFromDomain(region.owner);
        }
        return regionResponseDTO;
    }
}