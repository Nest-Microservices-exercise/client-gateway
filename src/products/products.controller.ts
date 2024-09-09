import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, } from 'rxjs';
import { PaginationDto } from 'src/common/pagination.dto';
import { NATS_SERVICE, } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  createProduct(@Body() createProductDtio: CreateProductDto) {
    return this.client.send({ cmd: 'createProduct' }, createProductDtio).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

  @Get()
  findAllProducts(@Query() paginatationDto: PaginationDto) {
    return this.client.send({ cmd: 'findAllProducts' }, paginatationDto)
  }

  @Get(':id')
  async finOne(@Param('id') id: string) {
    return this.client.send({ cmd: 'findOneProduct' }, { id }).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: string) {
    return this.client.send({ cmd: 'removeProduct' }, { id }).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

  @Patch(':id')
  patchProduct(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProductDto) {
    return this.client.send({ cmd: 'updateProduct' }, { id, ...body }).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

}
