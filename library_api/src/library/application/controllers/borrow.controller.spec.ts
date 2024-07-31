import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { BorrowController } from './borrow.controller';
import { BorrowRepository } from '../../infrastructure/repositories/borrow.repository';
import { BorrowService } from '../../domain/services/borrow.service';
import { MemberRepository } from '../../infrastructure/repositories/member.repository';
import { BookRepository } from '../../infrastructure/repositories/book.repository';
import { Book } from '../../domain/entities/book.entity';
import { Member } from '../../domain/entities/members.entity';
import { Borrow } from '../../domain/entities/borrow.entity';
import { BorrowRequestDto, BorrowResponseDto } from '../dto/borrow.dto';

describe('BorrowController', () => {
  let controller: BorrowController;
  let repository: BorrowRepository;
  let memberRepository: MemberRepository;
  let bookRepository: BookRepository;

  const mockDataSource = {
    transaction: jest.fn(),
    createEntityManager: jest.fn(),
  };

  const mockEntityManager = {
    save: jest.fn(),
    findOne: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowController],
      providers: [
        BorrowService,
        BorrowRepository,
        MemberRepository,
        BookRepository,
        {
          provide: DataSource,
          useValue: mockDataSource
        }
      ],
    }).compile();

    controller = module.get<BorrowController>(BorrowController);
    repository = module.get<BorrowRepository>(BorrowRepository);
    memberRepository = module.get<MemberRepository>(MemberRepository);
    bookRepository = module.get<BookRepository>(BookRepository);

    // Mock transaction method
    (mockDataSource.transaction as jest.Mock).mockImplementation(
      async (callback: (manager: any) => Promise<any>) => {
        return callback(mockEntityManager);
      });
    
    // Mock entity method
    (mockEntityManager.findOne as jest.Mock).mockImplementation(
      async (entity: any, option: any) => {
        if (entity === Book) {
          return bookRepository.findOne(option);
        }
        return null;
      }
    )
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be store borrowing book', async () => {
    const mockBook: Book =
    {
        code: "SHR-1",
        title: "A Study in Scarlet",
        author: "Arthur Conan Doyle",
        stock: 1
    };
    const mockMember: Member =
    {
        code: "M001",
        name: "Angga",
        borrows: []
    };
    const mockDate = new Date().getTime();
    const mockBorrow: Borrow =
    {
      id: 'a6s5d4a64d6a4da4da64d6a4',
      member: mockMember,
      book: mockBook,
      borrowed_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      due_at: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 19).replace('T', ' '),
      returned_at: null
    } 
    const body: BorrowRequestDto = {
      member_code: mockMember.code,
      book_code: mockBook.code
    };
    const expectedRespose: BorrowResponseDto = {
      id: mockBorrow.id,
      member_code: mockMember.code,
      book: { ...mockBook, stock: mockBook.stock - 1},
      due_at: mockBorrow.due_at,
      borrowed_at: mockBorrow.borrowed_at,
      returned_at: mockBorrow.returned_at
    };

    jest.mock('uuid', () => ({ v4: () => 'a6s5d4a64d6a4da4da64d6a4' }));
    jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    jest.spyOn(memberRepository, 'getUserWithPenaltized').mockResolvedValue(null);
    jest.spyOn(repository, 'countBorrowed').mockResolvedValue(0);
    jest.spyOn(memberRepository, 'findOne').mockResolvedValue(mockMember);
    jest.spyOn(bookRepository, 'findOne').mockResolvedValue(mockBook);
    
    (mockEntityManager.save as jest.Mock).mockImplementation(async (entity: any) => {
      if (entity instanceof Borrow) {
        return mockBorrow;
      } else if (entity instanceof Book) {
        return { ...mockBook, stock: mockBook.stock - 1};
      }
    });

    expect(await controller.create(body)).toEqual({
      success: true,
      data: expectedRespose
    })
  });

  it('should be penaltized', async () => {
    const mockMember: Member =
    {
        code: "M001",
        name: "Angga",
        borrows: [],
        penaltized_until: "2024-08-05 11:30"
    };

    const body: BorrowRequestDto = {
      member_code: mockMember.code,
      book_code: "TEST-1"
    };

    jest.spyOn(memberRepository, 'findOne').mockResolvedValue(mockMember);
    jest.spyOn(memberRepository, 'getUserWithPenaltized').mockResolvedValue(mockMember);
    
    expect(await controller.create(body)).toEqual({
      success: false,
      message: "This member have been penaltized!"
    });
  });

  it('should be rejected because borrow more than 2 books', async() => {
    const mockMember: Member =
    {
        code: "M001",
        name: "Angga",
        borrows: [{
            id: 'a6s5d4a64d6a4da4da64d6a4',
            member: null,
            book: null,
            borrowed_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            due_at: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 19).replace('T', ' '),
            returned_at: null
          },
          {
            id: 'a6s5d4a64d6a4da4da54d6a4',
            member: null,
            book: null,
            borrowed_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            due_at: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 19).replace('T', ' '),
            returned_at: null
          },
        ]
    };

    const body: BorrowRequestDto = {
      member_code: mockMember.code,
      book_code: "TEST-1"
    };

    jest.spyOn(memberRepository, 'findOne').mockResolvedValue(mockMember);
    jest.spyOn(memberRepository, 'getUserWithPenaltized').mockResolvedValue(null);
    jest.spyOn(repository, 'countBorrowed').mockResolvedValue(2);

    expect(await controller.create(body)).toEqual({
      success: false,
      message: "Borrowed books Limit Exceed"
    });
  });

  it('should be rejected because member not found', async () => {
    const body: BorrowRequestDto = {
      member_code: "M123",
      book_code: "TEST-1"
    };

    jest.spyOn(memberRepository, 'findOne').mockResolvedValue(null);

    expect(await controller.create(body)).toEqual({
      success: false,
      message: "Member Not Found!"
    });
  });

  it('should be rejected because book not found', async() => {
    const mockMember: Member =
    {
        code: "M001",
        name: "Angga",
        borrows: [],
        penaltized_until: "2024-08-05 11:30"
    };

    const body: BorrowRequestDto = {
      member_code: "M001",
      book_code: "TEST-1"
    };

    jest.spyOn(memberRepository, 'findOne').mockResolvedValue(mockMember);
    jest.spyOn(memberRepository, 'getUserWithPenaltized').mockResolvedValue(null);
    jest.spyOn(repository, 'countBorrowed').mockResolvedValue(0);
    jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);

    expect(await controller.create(body)).toEqual({
      success: false,
      message: "Book Not Found!"
    });
  });

  it('should be rejected because book out of stock', async() => {
    const mockMember: Member =
    {
        code: "M001",
        name: "Angga",
        borrows: [],
        penaltized_until: "2024-08-05 11:30"
    };

    const mockBook: Book =
    {
        code: "SHR-1",
        title: "A Study in Scarlet",
        author: "Arthur Conan Doyle",
        stock: 0
    };

    const body: BorrowRequestDto = {
      member_code: "M001",
      book_code: "SHR-1"
    };

    jest.spyOn(memberRepository, 'findOne').mockResolvedValue(mockMember);
    jest.spyOn(memberRepository, 'getUserWithPenaltized').mockResolvedValue(null);
    jest.spyOn(repository, 'countBorrowed').mockResolvedValue(0);
    jest.spyOn(bookRepository, 'findOne').mockResolvedValue(mockBook);

    expect(await controller.create(body)).toEqual({
      success: false,
      message: "Book out of stock"
    });
  });
});
