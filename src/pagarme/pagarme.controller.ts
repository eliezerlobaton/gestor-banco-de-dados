import { Controller, Get, Param } from '@nestjs/common';

import { PagarmeService } from './pagarme.service';

@Controller('pagarme')
export class PagarmeController {
  constructor(private readonly pagarmeService: PagarmeService) { }


  @Get(':filename')
  async getXlsxData(@Param('filename') filename: string): Promise<{ [key: string]: any }[]> {
    return await this.pagarmeService.pagarmeImport(filename);
  }

  // @Post('import')
  // @UseInterceptors(FileInterceptor('file'))
  // async importUsers(@UploadedFile() file: Express.Multer.File) {
  //   const filePath = file.path;
  //   return await this.pagarmeService.pagarmeImport(filePath);
  // }
}
