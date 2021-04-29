import { HttpException } from '@nestjs/common'
import { createQueryBuilder } from 'typeorm'
import { QueryFilterDto } from '../dto'

export class FilterBuilder {
  private queryBuilder: any
  private filter: any
  private orderBy: any
  private _model: any

  constructor(model: any, queryParams: QueryFilterDto) {
    this.filter = queryParams.filter
    this.orderBy = queryParams.orderBy
    this._model = model
  }
  private isJSON = (str: any) => {
    try {
      return JSON.parse(str) && !!str
    } catch (e) {
      return false
    }
  }

  private filterBuilder = (): any => {
    if (!this.isJSON(this.filter)) {
      throw new HttpException('Filter must be a object', 400)
    }
    const getFilters = JSON.parse(this.filter)
    if (getFilters) {
      for (const [field, value] of Object.entries(getFilters)) {
        if (typeof value === 'object') {
          const operator = Object.keys(value)[0]
          const data = Object.values(value)[0]
          if (operator === '$in') {
            this.queryBuilder.where(`model."${field}" IN (:...in`, {
              in: data
            })
          }
          if (operator === '$nin') {
            this.queryBuilder.where(`model."${field}" NOT IN (:...nin)`, {
              nin: data
            })
          }
          if (operator === '$eq') {
            this.queryBuilder.where(`model."${field}" = :eq`, { eq: data })
          }
          if (operator === '$neq') {
            this.queryBuilder.where(`model."${field}" != :neq`, { neq: data })
          }
          if (operator === '$lt') {
            this.queryBuilder.where(`model."${field}" < :lt`, { lt: data })
          }
          if (operator === '$lte') {
            this.queryBuilder.where(`model."${field}" <= :lte`, { lte: data })
          }
          if (operator === '$gt') {
            this.queryBuilder.where(`model."${field}" > :gt`, { gt: data })
          }
          if (operator === '$gte') {
            this.queryBuilder.where(`model."${field}" >= :gte`, { gte: data })
          }
          if (operator === '$like') {
            this.queryBuilder.where(`${field} ilike :like`, {
              like: `%${data}%`
            })
          }
        }
      }
    }
    return this.queryBuilder
  }

  private orderByBuilder = (): any => {
    const field = this.orderBy.split(':')[0]
    const sortBy = this.orderBy.split(':')[1].toUpperCase()
    if (['ASC', 'DESC'].includes(sortBy)) {
      this.queryBuilder.orderBy(`model."${field}"`, sortBy)
    }
    return this.queryBuilder
  }

  public queryFilterBuilder = (): any => {
    this.queryBuilder = createQueryBuilder(this._model, 'model')
    /* Filter */
    if (this.filter) {
      if (!this.isJSON(this.filter)) {
        throw new HttpException('Filter must be a object', 400)
      }
      this.queryBuilder = this.filterBuilder()
    }

    /* orderBy */
    if (this.orderBy) {
      this.queryBuilder = this.orderByBuilder()
    }

    return this.queryBuilder
  }
}
