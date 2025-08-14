import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from 'redis';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
    private uploadService: UploadService,
  ) {}
  async create(createChatDto: CreateMessageDto, files?: Express.Multer.File[]) {
    if (!files && !createChatDto.content) {
      throw new Error('Content cannot be empty!');
    }
    const imagesList: string[] = [];

    if (files) {
      for (const file of files) {
        const image = await this.uploadService.uploadFile(
          file,
          'message',
          'image',
        );
        if (image) {
          imagesList.push(image.url);
        }
      }
      createChatDto.images = imagesList;
    }

    const { receiver, sender, ...res } = createChatDto;

    const chat = this.messageRepo.create({
      receiver: { id: receiver },
      sender: { id: sender },
      ...res,
    });

    await this.cacheStorage.del(`chat:${sender}`);
    await this.cacheStorage.del(`chat:${receiver}`);

    return await this.messageRepo.save(chat);
  }

  async getChatBetweenTwoUsers(user1: string, user2: string) {
    return this.messageRepo.find({
      where: [
        {
          sender: { id: user1 },
          receiver: { id: user2 },
        },
        {
          sender: { id: user2 },
          receiver: { id: user1 },
        },
      ],
      order: { created_at: 'ASC' },
    });
  }

  async getAllConversations(userId: string) {
    const cachedKey = `chat:${userId}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const chats = await this.messageRepo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.sender', 'sender')
      .leftJoinAndSelect('chat.receiver', 'receiver')
      .where('sender.id = :userId OR receiver.id = :userId', { userId })
      .orderBy('chat.createdAt', 'DESC')
      .getMany();

    const map = new Map<string, (typeof chats)[0]>();

    for (const chat of chats) {
      const senderId = chat.sender.id;
      const receiverId = chat.receiver.id;

      const key = [senderId, receiverId].sort().join('_');

      if (!map.has(key)) {
        map.set(key, chat);
      }
    }
    const result = Array.from(map.values());

    await this.cacheStorage.set(cachedKey, JSON.stringify(result), {
      EX: 300,
    });

    return result;
  }

  async update(id: string, updateChatDto: UpdateMessageDto) {
    await this.messageRepo.update({ id }, updateChatDto);

    const chat = await this.messageRepo.findOne({
      where: { id },
    });

    if (chat) {
      const senderId = chat.sender.id;
      const receiverId = chat.receiver.id;
      await this.cacheStorage.del(`chat:${senderId}`);
      await this.cacheStorage.del(`chat:${receiverId}`);
    }

    return chat;
  }
}
