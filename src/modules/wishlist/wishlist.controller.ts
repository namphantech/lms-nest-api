import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesAllowed } from '../common/decorators/roles.decorator';
import { Roles } from './../common/constants/index';
import { AddToWishlistDto } from './dto/addToWishlist';
import { Wishlist } from '../entities/wishlist.entity';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUser } from 'modules/common/decorators';
import { User } from 'modules/entities';

@ApiTags('wishlist')
@Controller('api/wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @UseGuards(AuthGuard())
  @Post('')
  addToWishlist(
    @Body() wishlistDto: AddToWishlistDto,
    @GetCurrentUser() user: User,
  ): Promise<Wishlist> {
    return this.wishlistService.addToWishlist(wishlistDto, user);
  }

  @UseGuards(AuthGuard())
  @Get('')
  getWishlistProducts(@GetCurrentUser() user: User): Promise<Wishlist[]> {
    return this.wishlistService.getWishlistItems(user.id);
  }

  @UseGuards(AuthGuard())
  @Delete('/:productId')
  deleteWishlistItem(
    @GetCurrentUser() user: User,
    @Param('productId') productId,
  ): Promise<void> {
    return this.wishlistService.deleteWishlistItem(user.id, productId);
  }

  @UseGuards(AuthGuard())
  @Delete('')
  deleteWishlistItems(@GetCurrentUser() user: User): Promise<void> {
    return this.wishlistService.deleteWishlistItems(user);
  }
}
