/**
 * OpenAPI definition
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { UserStatsDto } from './userStatsDto';
import { UserProfileDto } from './userProfileDto';


export interface UserDto { 
    id?: number;
    firstName?: string;
    lastName?: string;
    userName?: string;
    token?: string;
    userProfileDto?: UserProfileDto;
    userStatsDto?: UserStatsDto;
}

