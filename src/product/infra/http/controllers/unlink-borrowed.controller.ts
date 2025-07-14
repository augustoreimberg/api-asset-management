import {
  BadRequestException,
  Controller,
  Put,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { UnlinkBorrowedProductUseCase } from 'src/product/domain/application/use-cases/unlink-borrowed-product';
import { ResourceNotFound } from 'src/core/errors/resource-not-found';
import { Public } from '../../auth/public';
import { unlinkBorrowedMock } from 'test/mocks/product/product';

export const unlinkBorrowedBodySchema = z.object({
  id: z.string().uuid(),
  backAt: z.coerce.date(),
  reasonBack: z.string().min(3).max(255),
});
export type unlinkBorrowedBodySchema = z.infer<typeof unlinkBorrowedBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(unlinkBorrowedBodySchema);

@ApiTags('Borrowed')
@Controller()
@Public()
export class UnlinkBorrowedController {
  constructor(
    private unlinkBorrowedProductUseCase: UnlinkBorrowedProductUseCase,
  ) {}
  @Put('unlink-borrowed')
  @ApiOperation({ summary: 'Edit Borrowed' })
  @ApiBody({
    description: 'Borrowed edit payload',
    required: true,
    schema: { example: unlinkBorrowedMock },
  })
  @ApiResponse({
    status: 201,
    description: 'Borrowed with id:${id} unlinked',
  })
  @ApiResponse({ status: 404, description: 'Borrowed not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async handle(@Body(bodyValidationPipe) body: unlinkBorrowedBodySchema) {
    const { id: id, ...data } = body;
    const cleanBody = {
      ...data,
      backAt: data.backAt ?? undefined,
      reasonBack: data.reasonBack ?? undefined,
    };
    const response = await this.unlinkBorrowedProductUseCase.execute({
      id: id,
      ...cleanBody,
    });
    if (response.isLeft()) {
      const error = response.value;
      if (error instanceof ResourceNotFound) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
    return { message: `Borrowed with id:${body.id} unlinked` };
  }
}
