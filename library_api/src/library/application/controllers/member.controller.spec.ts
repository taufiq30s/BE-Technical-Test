import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { MemberController } from './member.controller';
import { MemberRepository } from '../../infrastructure/repositories/member.repository';
import { MemberService } from '../../domain/services/member.service';
import { Member } from 'src/library/domain/entities/members.entity';
import { MemberDto } from '../dto/member.dto';

describe('MemberController', () => {
  let controller: MemberController;
  let repository: MemberRepository;

  // Initialize Mock Data Source
  const mockDataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        MemberService,
        MemberRepository,
        {
          provide: DataSource,
          useValue: mockDataSource
        }
      ],
    }).compile();

    controller = module.get<MemberController>(MemberController);
    repository = module.get<MemberRepository>(MemberRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of members', async () => {
    const mockMember: Member[] = [
      {
          code: "M001",
          name: "Angga",
          borrows: []
      },
      {
          code: "M002",
          name: "Ferry",
          borrows: []
      },
      {
          code: "M003",
          name: "Putri",
          borrows: [{
            id: "<test_id>",
            member: null,
            book: null,
            borrowed_at: "2024-07-31 11:13",
            due_at: "2024-08-05 11:13",
            returned_at: null
          }]
      },
    ];

    // Return mock data when execute this repo
    jest.spyOn(repository, 'getMembers').mockResolvedValue(mockMember);

    expect(await controller.getMembers()).toEqual({
      success: true,
      data: [
        new MemberDto("M001", "Angga", 0),
        new MemberDto("M002", "Ferry", 0),
        new MemberDto("M003", "Putri", 1),
      ]
    });
  });
});
