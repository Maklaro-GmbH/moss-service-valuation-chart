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
        fontColor: { type: 'string' }
      },
      required: ['fontPath', 'fontSize', 'fontColor']
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
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    '[a-z]+': { type: 'string' },
                    y: { type: 'number' }
                  },
                  required: ['y']
                }
              },
              yAxis: {
                type: 'object',
                properties: {
                  position: { type: 'string' },
                  label: { type: 'string' },
                  ticks: {
                    type: 'object',
                    properties: {
                      maxTicksLimit: { type: 'integer' },
                      min: { type: 'integer' },
                      max: { type: 'integer' }
                    },
                    required: ['maxTicksLimit', 'min', 'max']
                  }
                },
                required: ['position', 'label', 'ticks']
              }
            },
            required: ['label', 'data', 'yAxis']
          }
        }
      },
      required: ['labels', 'datasets']
    }
  },
  required: ['width', 'height', 'styling', 'data']
}

module.exports = payloadSchema
