export interface Payload {
  readonly data: PayloadData
  readonly height: number
  readonly styling: Styling
  readonly width: number
}

export interface PayloadData {
  readonly datasets: readonly PayloadDataset[]
  readonly labels: readonly string[]
}

export interface PayloadDataset {
  readonly data: readonly DataSetData[]
  readonly label: string
  readonly type: DatasetType
  readonly yAxisLabel: string
}

export interface DataSetData {
  readonly date: string
  readonly y: number
}

export enum DatasetType {
  Purchase = 'purchase',
  Rental = 'rental'
}

export interface Styling {
  readonly fontPath: string
  readonly fontSize: number
  readonly gridColor: string
  readonly lineColor: string
  readonly textColor: string
}

export const payloadSchema = {
  type: 'object',
  properties: {
    width: { type: 'integer' },
    height: { type: 'integer' },
    styling: {
      type: 'object',
      properties: {
        fontPath: { type: 'string' },
        fontSize: { type: 'integer' },
        textColor: { type: 'string' },
        lineColor: { type: 'string' },
        gridColor: { type: 'string' }
      },
      required: ['fontPath', 'fontSize', 'textColor', 'lineColor', 'gridColor']
    },
    data: {
      type: 'object',
      properties: {
        labels: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        datasets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              type: { type: 'string', enum: ['purchase', 'rental'] },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    date: { type: 'string' },
                    y: { type: 'number' }
                  },
                  required: ['y', 'date']
                }
              },
              yAxisLabel: { type: 'string' }
            },
            required: ['label', 'type', 'data', 'yAxisLabel']
          }
        }
      },
      required: ['labels', 'datasets']
    }
  },
  required: ['width', 'height', 'styling', 'data']
} as const

export default payloadSchema
