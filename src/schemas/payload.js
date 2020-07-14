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
        fontColor: { type: 'string' },
        lineColor: { type: 'string' },
        gridColor: { type: 'string' }
      },
      required: ['fontPath', 'fontSize', 'fontColor', 'lineColor', 'gridColor']
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
              type: { type: 'string', enum: ['linear', 'dotted'] },
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
                  position: { type: 'string', enum: ['left', 'right'] },
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
            required: ['label', 'type', 'data', 'yAxis']
          }
        }
      },
      required: ['labels', 'datasets']
    }
  },
  required: ['width', 'height', 'styling', 'data']
}

module.exports = payloadSchema
