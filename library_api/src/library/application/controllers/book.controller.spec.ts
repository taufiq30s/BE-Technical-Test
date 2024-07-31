import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from '../../domain/services/book.service';
import { BookDto } from '../dto/book.dto';
import { BookRepository } from '../../infrastructure/repositories/book.repository';
import { DataSource } from 'typeorm';
import { Book } from 'src/library/domain/entities/book.entity';

describe('BookController', () => {
  let controller: BookController;
  let repository: BookRepository;

  const mockDataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        BookService,
        BookRepository,
        {
          provide: DataSource,
          useValue: mockDataSource
        }
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    repository = module.get<BookRepository>(BookRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of book', async () => {
    const mockBook: Book[] = [
      {
        code: "JK-45",
        title: "Harry Potter",
        author: "J.K Rowling",
        stock: 1
      },
      {
          code: "SHR-1",
          title: "A Study in Scarlet",
          author: "Arthur Conan Doyle",
          stock: 1
      },
      {
          code: "TW-11",
          title: "Twilight",
          author: "Stephenie Meyer",
          stock: 0
      },
      {
          code: "HOB-83",
          title: "The Hobbit, or There and Back Again",
          author: "J.R.R. Tolkien",
          stock: 1
      },
      {
          code: "NRN-7",
          title: "The Lion, the Witch and the Wardrobe",
          author: "C.S. Lewis",
          stock: 1
      },
    ];

    jest.spyOn(repository, 'getBooks').mockResolvedValue(mockBook);
    expect(await controller.findAll()).toEqual({
      success: true,
      data: [
        new BookDto("JK-45", "Harry Potter", "J.K Rowling", 1),
        new BookDto("SHR-1", "A Study in Scarlet", "Arthur Conan Doyle", 1),
        new BookDto("TW-11", "Twilight", "Stephenie Meyer", 0),
        new BookDto("HOB-83", "The Hobbit, or There and Back Again", "J.R.R. Tolkien", 1),
        new BookDto("NRN-7", "The Lion, the Witch and the Wardrobe", "C.S. Lewis", 1)
      ]
    });
  });
});
