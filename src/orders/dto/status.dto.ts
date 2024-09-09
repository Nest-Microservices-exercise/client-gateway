import { IsEnum, IsOptional } from "class-validator";
import { OrderStatusList } from "../enum/order.enum";

export class StatusDto {
    @IsEnum(OrderStatusList, {
        message: `status must be one of ${Object.values(OrderStatusList)}`
    })
    @IsOptional()
    status: OrderStatusList
}