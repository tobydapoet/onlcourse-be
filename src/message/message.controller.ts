import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MessageMapper } from './mappers/message.mapper';

@ApiBearerAuth()
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('2users')
  @ApiQuery({
    name: 'user1',
    type: String,
  })
  @ApiQuery({
    name: 'user2',
    type: String,
  })
  async getChatBetweenTwoUsers(
    @Query('user1') user1: string,
    @Query('user2') user2: string,
  ) {
    const messages = await this.messageService.getChatBetweenTwoUsers(
      user1,
      user2,
    );
    return messages.map(MessageMapper.toResponse);
  }

  @Get('user/:id')
  @ApiParam({ name: 'id', type: String })
  async getAllConversations(@Param('id') id: string) {
    const messages = await this.messageService.getAllConversations(id);
    return messages.map(MessageMapper.toResponse);
  }

  @Public()
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('files'))
  async create(
    @Body() createChatDto: CreateMessageDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    try {
      const res = await this.messageService.create(createChatDto, files);
      return {
        res: MessageMapper.toResponse(res),
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id') id: string,
    @Body() updateChatDto: UpdateMessageDto,
  ) {
    try {
      const res = await this.messageService.update(id, updateChatDto);
      return {
        res: res ? MessageMapper.toResponse(res) : null,
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }
}
