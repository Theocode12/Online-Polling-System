import { DeepPartial, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

export abstract class BaseService<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async getRepository(): Promise<Repository<T>> {
    return this.repository;
  }

  async createAndSave(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(relations: string[] = []): Promise<T[]> {
    return await this.repository.find({ relations });
  }

  async findOneOrFail(id: any, relations: string[] = []): Promise<T> {
    const primaryColumn = this.repository.metadata.primaryColumns[0]?.propertyName || 'id';
  
    return await this.repository.findOneOrFail({
      where: { [primaryColumn]: id } as FindOptionsWhere<T>,
      relations,
    }).catch(() => {
      throw new Error(`${this.getEntityName()} not found`);
    });
  }

  async updateAndReturn(id: string, updateDto: Partial<T>): Promise<T> {
    await this.repository.update(id, updateDto);
    return await this.findOneOrFail(id);
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.repository.delete(id);
    return { message: `${this.getEntityName()} deleted successfully` };
  }

  private getEntityName(): string {
    return this.repository.metadata.name;
  }
}
