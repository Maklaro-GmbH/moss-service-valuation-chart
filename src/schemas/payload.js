const payloadSchema = {
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
}

module.exports = payloadSchema
