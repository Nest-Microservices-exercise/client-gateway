import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/pagination.dto';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

  constructor(@Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy) { }

  @Post()
  createProduct(@Body() createProductDtio: CreateProductDto) {
    return this.productsClient.send({ cmd: 'createProduct' }, createProductDtio).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

  @Get()
  findAllProducts(@Query() paginatationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'findAllProducts' }, paginatationDto)
  }

  @Get(':id')
  async finOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'findOneProduct' }, { id }).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: string) {
    return this.productsClient.send({ cmd: 'removeProduct' }, { id }).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

  @Patch(':id')
  patchProduct(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProductDto) {
    return this.productsClient.send({ cmd: 'updateProduct' }, { id, ...body }).pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

}
