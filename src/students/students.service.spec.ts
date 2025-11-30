import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentEntity } from './entities/student.entity';

describe('StudentsService - findAll', () => {
  let service: StudentsService;

  const mockQueryBuilder: any = {
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[{ id: 'uuid1', name: 'Alice', createdAt: new Date() }], 1]),
  };

  const mockRepo = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        { provide: getRepositoryToken(StudentEntity), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    jest.clearAllMocks();
  });

  it('returns paginated data with defaults', async () => {
    const res = await service.findAll();
    expect(res.meta.currentPage).toBe(1);
    expect(res.meta.itemsPerPage).toBe(10);
    expect(res.meta.totalItems).toBe(1);
    expect(res.data).toHaveLength(1);
    expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('student');
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
  });

  it('applies numeric coercion and caps limit', async () => {
    mockQueryBuilder.getManyAndCount.mockResolvedValueOnce([[{ id: 'uuid1' }], 200]);
    const res = await service.findAll({ page: 2.7 as any, limit: 200 as any });
    expect(res.meta.currentPage).toBe(2);
    expect(res.meta.itemsPerPage).toBe(100);
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith((2 - 1) * 100);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(100);
  });

  it('handles string values for page/limit', async () => {
    const res = await service.findAll({ page: '2' as any, limit: '5' as any });
    expect(res.meta.currentPage).toBe(2);
    expect(res.meta.itemsPerPage).toBe(5);
  });
});
