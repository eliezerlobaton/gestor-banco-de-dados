import { HotmartPageInfoDto } from './hotmart-page-info.dto';

export class HotmartPaginatedResponseDto<ItemsDto> {
  items: ItemsDto[];
  page_info: HotmartPageInfoDto;
}
