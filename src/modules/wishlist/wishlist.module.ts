import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from '../auth/auth.module';
// import { ProductsModule } from '../products/products.module';
import { WishlistController } from './wishlist.controller';
import { Wishlist } from '../entities/wishlist.entity';
import { WishlistService } from './wishlist.service';
import { Product } from './../entities';
import { ProductModule } from 'modules/product';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, Product]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ProductModule,
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
