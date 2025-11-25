import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { StudentEntity } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginatedResponseDto, PaginationQueryDto, PaginationMetaDto } from './dto/pagination.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly repo: Repository<StudentEntity>,
  ) {}

  async create(dto: CreateStudentDto): Promise<StudentEntity> {
    const toCreate = this.repo.create({
      ...dto,
      enrollmentDate: new Date(),
      enrolledCoursesCount: 0,
      completedCoursesCount: 0,
      isEmailVerified: !!dto.isEmailVerified,
      isMobileVerified: !!dto.isMobileVerified,
      isActive: dto.isActive ?? true,
    } as Partial<StudentEntity>);

    try {
      return await this.repo.save(toCreate);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        // Postgres duplicate key error code '23505' — adapt for other DBs
        const code = (err as any).code;
        if (code === '23505') throw new ConflictException('Duplicate entry — unique constraint violated');
      }
      throw new InternalServerErrorException('Failed to create student');
    }
  }

  async findAll(query?: PaginationQueryDto): Promise<PaginatedResponseDto<StudentEntity>> {
    const page = query?.page && query.page > 0 ? Math.floor(query.page) : 1;
    const limit = query?.limit && query.limit > 0 ? Math.floor(query.limit) : 10;
    const offset = (page - 1) * limit;

    try {
      const [data, totalItems] = await this.repo.findAndCount({
        order: { createdAt: 'ASC' as const },
        skip: offset,
        take: limit,
      });

      const totalPages = Math.max(1, Math.ceil(totalItems / limit));

      const meta: PaginationMetaDto = {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };

      return { data, meta };
    } catch (err) {
      throw new InternalServerErrorException('Failed to fetch students');
    }
  }

  async findOne(id: string): Promise<StudentEntity> {
    try {
      const item = await this.repo.findOne({ where: { id } });
      if (!item) throw new NotFoundException(`Student with id ${id} not found`);
      return item;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to fetch student');
    }
  }

  async update(id: string, dto: UpdateStudentDto): Promise<StudentEntity> {
    try {
      const toUpdate = await this.repo.preload({ id, ...dto } as any);
      if (!toUpdate) throw new NotFoundException(`Student with id ${id} not found`);
      return await this.repo.save(toUpdate);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const code = (err as any).code;
        if (code === '23505') throw new ConflictException('Duplicate entry — unique constraint violated');
      }
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to update student');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const res = await this.repo.delete(id);
      if (res.affected === 0) throw new NotFoundException(`Student with id ${id} not found`);
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to delete student');
    }
  }
}
