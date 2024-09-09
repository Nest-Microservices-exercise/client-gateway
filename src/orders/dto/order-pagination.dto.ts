import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/pagination.dto";
import { OrderStatusList } from "../enum/order.enum";

export class OrderPaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `status must be one of ${Object.values(OrderStatusList)}`
    })
    status: OrderStatusList
}