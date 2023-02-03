import type { ISchema } from '@formily/vue'

export const Space: ISchema = {
  type: 'object',
  properties: {
    align: {
      type: 'string',
      default: 'center',
      enum: ['start', 'end', 'center', 'baseline'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        allowClear: true,
      },
    },
    direction: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        defaultValue: 'horizontal',
        optionType: 'button',
      },
    },
    size: {
      type: 'number',
      default: 8,
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
      'x-component-props': {},
    },
    // split: {
    //   'x-visible': false,
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    // },
    // wrap: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    // },
  },
}
