import { defineComponent } from 'vue-demi'
import { connect, mapProps, h, mapReadPretty } from '@formily/vue'
import {
  Checkbox as VanCheckbox,
  CheckboxGroup as VanCheckboxGroup,
} from 'vant'
import {
  composeExport,
  transformComponent,
  resolveComponent,
} from '../__builtins__'
import { PreviewText } from '../preview-text'

import type { CheckboxGroup as VanCheckboxGroupProps } from 'vant'

const TransformVanCheckbox = transformComponent(VanCheckbox, {
  change: 'input',
})

const CheckboxOption = defineComponent({
  name: 'FCheckboxOption',
  inheritAttrs: false,
  props: {
    option: {
      type: Object,
      default: null,
    },
  },
  setup(customProps, { attrs, slots, listeners }) {
    return () => {
      const props = attrs as any
      const option = customProps?.option
      if (option) {
        const children = {
          default: () => [
            resolveComponent(slots.default ?? option.label, { option }),
          ],
        }
        const newProps = {} as any
        Object.assign(newProps, option)
        newProps.label = option.value
        delete newProps.value

        return h(
          VanCheckbox,
          {
            attrs: {
              ...newProps,
            },
          },
          children
        )
      }

      return h(
        TransformVanCheckbox,
        {
          attrs: {
            ...props,
          },
          on: listeners,
        },
        {
          default: () => [props.label],
        }
      )
    }
  },
})

export type CheckboxGroupProps = VanCheckboxGroupProps & {
  value: any[]
  options?: Array<string>
}

const TransformVanCheckboxGroup = transformComponent(VanCheckboxGroup, {
  change: 'input',
})

const CheckboxGroupOption = defineComponent<CheckboxGroupProps>({
  name: 'FCheckboxGroupOption',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  setup(customProps, { attrs, slots, listeners }) {
    return () => {
      const options = customProps.options || []
      const children =
        options.length !== 0
          ? {
              default: () =>
                options.map((option) => {
                  if (typeof option === 'string') {
                    return h(
                      Checkbox,
                      {
                        props: {
                          option: {
                            label: option,
                            name: option,
                          },
                        },
                      },
                      slots?.option
                        ? { default: () => slots.option({ option }) }
                        : {}
                    )
                  } else {
                    return h(
                      Checkbox,
                      {
                        props: {
                          option,
                        },
                      },
                      slots?.option
                        ? { default: () => slots.option({ option }) }
                        : {}
                    )
                  }
                }),
            }
          : slots
      return h(
        TransformVanCheckboxGroup,
        {
          attrs: {
            ...attrs,
          },
          on: listeners,
        },
        children
      )
    }
  },
})

const CheckboxGroup = connect(
  CheckboxGroupOption,
  mapProps({ dataSource: 'options' }),
  mapReadPretty(PreviewText.Checkbox, {
    multiple: true,
  })
)

export const Checkbox = composeExport(connect(CheckboxOption), {
  Group: CheckboxGroup,
})

export default Checkbox
