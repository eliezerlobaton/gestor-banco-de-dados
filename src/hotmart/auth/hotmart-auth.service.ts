import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { HotmartAuthenticateDto } from '../dto/hotmart-authenticate.dto';
import { HotmartAuthenticateResponseDto } from '../dto/hotmart-authenticate-response.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HotmartAuthService {
  private logger = new Logger(HotmartAuthService.name);

  constructor(private readonly http: HttpService) {}

  async authenticate(
    credentials: HotmartAuthenticateDto,
  ): Promise<HotmartAuthenticateResponseDto> {
    try {
      return (
        await lastValueFrom(
          this.http.post(
            credentials.url,
            {},
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${credentials.api_key}`,
              },
            },
          ),
        )
      ).data;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
}
