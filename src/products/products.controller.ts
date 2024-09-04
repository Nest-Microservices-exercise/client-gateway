import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/pagination.dto';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {

  constructor(@Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy) { }

  @Post()
  createProduct() {
    return 'Crea un producto';
  }

  @Get()
  findAllProducts(@Query() paginatationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'findAllProducts' }, paginatationDto)
  }

  @Get(':id')
  async finOne(@Param('id') id: string) {

    try {
      const product = await firstValueFrom(
        this.productsClient.send({ cmd: 'findOneProduct' }, { id })
      );

      return product;

    } catch (error) {
      throw new BadRequestException(error);
    }

  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return 'Esta función elimina el producto ' + id;
  }

  @Patch(':id')
  patchProduct(@Param('id') id: string, @Body() body: any) {
    return 'Esta función edita el producto ';
  }

}
