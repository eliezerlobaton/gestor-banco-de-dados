import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { Produtos } from 'src/produtos/entities/produtos.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
    @InjectRepository(Produtos)
    private readonly produtosRepository: Repository<Produtos>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const produtos = [];
    for (const produtoId of createCategoryDto.produtoIds) {
      const produto = await this.produtosRepository.findOne({
        where: {
          id: produtoId,
        },
      });
      produtos.push(produto);
    }
    return this.repository.save({ name: createCategoryDto.name, produtos });
  }

  findAll() {
    return this.repository.find({
      relations: {
        produtos: true,
      },
    });
  }

  async findOne(id: number) {
    const category = await this.repository.findOne({
      relations: {
        produtos: true,
      },
      where: {
        id,
      },
    });
    if (!category)
      throw new NotFoundException(`category with id ${id} not found`);
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const produtos = [];
    for (const produtoId of updateCategoryDto.produtoIds) {
      const produto = await this.produtosRepository.findOne({
        where: {
          id: produtoId,
        },
      });
      if (!category.produtos.find((produto) => produto.id === produtoId))
        produtos.push(produto);
    }
    category.name = updateCategoryDto.name;
    category.produtos = produtos.concat(category.produtos);
    return this.repository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    return this.repository.remove(category);
  }

  async removeProduct(id: number, productId: number) {
    const category = await this.findOne(id);
    category.produtos = category.produtos.filter(
      (produto) => produto.id !== productId,
    );
    return this.repository.save(category);
  }
}
