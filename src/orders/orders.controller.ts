import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/pagination.dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  async createOrder(@Body() createProductDtio: CreateOrderDto) {
    try{
      const order = await firstValueFrom(
        this.client.send('createOrder', createProductDtio)
      )
      return order;
    }catch(error){
      throw new RpcException(error)
    }
    
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('findAllOrders', orderPaginationDto)
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('findOneOrder', { id })
      )
      return order;
    } catch (error) {
      throw new RpcException(error)
    }

  }


  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto) {
    try {
      const order = await firstValueFrom(
        this.client.send('findAllOrders', { ...paginationDto, status: statusDto.status, })
      )
      return order;
    } catch (error) {
      throw new RpcException(error)
    }

  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto) {
    try {
      return this.client.send('changeOrderStatus', { id, status: statusDto.status })
    } catch (error) {
      throw new RpcException(error)
    }

  }

}
