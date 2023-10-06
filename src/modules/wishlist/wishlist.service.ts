import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddToWishlistDto } from './dto/addToWishlist';
import { Wishlist } from '../entities/wishlist.entity';
import { User } from './../entities';
import { ProductService } from './../product';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private productsService: ProductService,
  ) {}

  async addToWishlist(
    addToWishlistDto: AddToWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlistItems = await this.getUserWishlistItems(user.id);

    const product = await this.productsService.findOne({
      where: {
        id: addToWishlistDto.productId,
      },
    });

    for await (const item of wishlistItems) {
      if (item.product?.id === product?.id) {
        const errMsg = `Product with id: ${product.id} is already in your wishlist`;
        throw new ConflictException(errMsg);
      }
    }

    const wishlist = await this.wishlistRepository.save({
      user: user.id,
      product,
    });

    // await this.wishlistRepository.save(wishlist);
    return wishlist;
  }

  async getWishlistItems(userId: number): Promise<Wishlist[]> {
    const wishlist: Wishlist[] = await this.getUserWishlistItems(userId);
    return wishlist;
  }

  async deleteWishlistItem(userId: number, productId: number): Promise<void> {
    const wishlistItem = await this.getWishlistItemById(userId, productId);
    await this.wishlistRepository.remove(wishlistItem);
  }

  private async removeWishlistItem(productId: number): Promise<void> {
    const wishlistItem = await this.wishlistRepository.findOne({
      where: {
        product: { id: productId },
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException();
    }

    await this.wishlistRepository.remove(wishlistItem);
  }

  async deleteWishlistItems(user: User): Promise<void> {
    const wishlistItems = await this.getUserWishlistItems(user.id);
    await this.wishlistRepository.remove(wishlistItems);
  }

  private async getWishlistItemById(
    userId: number,
    productId: number,
  ): Promise<Wishlist> {
    const wishlistItem = await this.wishlistRepository.findOne({
      where: {
        user: userId,
        product: { id: productId },
      },
    });
    if (!wishlistItem) {
      throw new NotFoundException();
    }

    return wishlistItem;
  }

  public async deleteProductWishlistItems(productId: number): Promise<void> {
    const wishlistItems: Wishlist[] = await this.getAllWishlistItems();
    for (const wishlistItem of wishlistItems) {
      if (wishlistItem?.product?.id === Number(productId)) {
        await this.removeWishlistItem(wishlistItem?.product?.id);
      }
    }
  }

  private async getAllWishlistItems() {
    // this.myLogger.warn(this.getAllWishlistItems.name + ' is triggered');
    const wishlistItems = await this.wishlistRepository
      .createQueryBuilder('wishlist')
      .innerJoinAndSelect('wishlist.product', 'product')
      .getMany();
    return wishlistItems;
  }

  private async getUserWishlistItems(userId: number): Promise<any> {
    return await this.wishlistRepository
      .createQueryBuilder('wishlist')
      .innerJoinAndSelect('wishlist.product', 'product')
      .where('user= :userId', { userId })
      .addOrderBy('createdAt', 'DESC')
      .getMany();
  }
}
