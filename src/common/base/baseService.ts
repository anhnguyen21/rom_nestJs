import { paginate } from 'nestjs-typeorm-paginate'
import { HttpException } from '@nestjs/common'
import { FilterBuilder } from './builder/filterBuilder'
import { QueryFilterDto } from './dto'

export class BaseService<FindAllModelResponse, FindOneModelResponse> {
  _model: any
  constructor(model: any) {
    this._model = model
  }

  async findAll(queryParams: QueryFilterDto): Promise<FindAllModelResponse> {
    try {
      const filterBuilder = new FilterBuilder(this._model, queryParams)
      const query = filterBuilder.queryFilterBuilder()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /* @ts-ignore */
      return paginate(query, queryParams)
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string): Promise<FindOneModelResponse> {
    try {
      const result = await this._model.findOne({ id })
      if (!result) {
        throw new HttpException('Data not found', 404)
      }
      return result
    } catch (error) {
      throw error
    }
  }
}
