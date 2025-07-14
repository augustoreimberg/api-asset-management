import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    let data = value;

    if (typeof (value as any)?.body === 'string') {
      try {
        data = JSON.parse((value as any).body);
      } catch (error) {
        throw new BadRequestException('Invalid JSON body');
      }
    }

    try {
      const response = this.schema.parse(data);
      return response;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        });
      }

      throw new BadRequestException('Validation failed');
    }
  }
}
