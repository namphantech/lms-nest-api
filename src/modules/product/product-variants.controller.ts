import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { createProductVaraintDto } from './dto/create-product-variant.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductVariantService } from './product-variants.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductVariantOptionDto } from './dto/create-product-variant-option.dto';

@Controller('api/product-variants')
@ApiTags('product-variants')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post('/')
  async addProductVariant(@Body() dto: createProductVaraintDto) {
    return await this.productVariantService.createProductVariant(dto);
  }
  @Post('/option-value')
  async addProductVariantOption(@Body() dto: CreateProductVariantOptionDto) {
    const productVariant = await this.productVariantService.findOne({
      where: {
        id: dto.productVariantId,
      },
      select: ['id'],
    });
    if (!productVariant) {
      throw new HttpException('Not found productVariantID', 400);
    }

    const optionValues = [];
    for (const optionvalue of dto.value) {
      const saveOptionValue =
        await this.productVariantService.createVariantOption({
          value: optionvalue,
          variant: productVariant,
        });
      optionValues.push(saveOptionValue);
    }
    return optionValues;
  }
}
