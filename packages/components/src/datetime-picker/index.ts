import { ref, defineComponent } from 'vue-demi'
import { observer } from '@formily/reactive-vue'
import { connect, mapProps, mapReadPretty, h } from '@formily/vue'
import { DatetimePicker as VanDatetimePicker, Popup as VanPopup } from 'vant'
import { FormItem } from '../form-item'
import { PreviewText } from '../preview-text'

import type { DatetimePicker as VanDatetimePickerProps } from 'vant'

export type DatetimePickerProps = VanDatetimePickerProps

const BaseDatetimePicker = observer(
  defineComponent({
    name: 'FBaseDatetimePicker',
    setup(props, { attrs, emit, slots }) {
      const show = ref(false)
      return () => {
        const {
          formItemProps = {},
          popupProps = {},
          datetimePickerProps = {},
          fieldListeners = {},
          popupListeners = {},
          datetimePickerListeners = {},
        } = attrs as any
        return h(
          'div',
          {},
          {
            default: () => [
              h(
                FormItem,
                {
                  attrs: {
                    value: attrs.value,
                    readonly: true,
                    clickable: true,
                    ...formItemProps,
                  },
                  on: {
                    click: () => {
                      show.value = true
                    },
                    ...fieldListeners,
                  },
                },
                slots
              ),
              h(
                VanPopup,
                {
                  attrs: {
                    value: show.value,
                    round: true,
                    position: 'bottom',
                    ...popupProps,
                  },
                  on: {
                    input: (val) => {
                      show.value = val
                    },
                    ...popupListeners,
                  },
                },
                {
                  default: () => [
                    h(
                      VanDatetimePicker,
                      {
                        attrs: {
                          showToolbar: true,
                          ...datetimePickerProps,
                        },
                        on: {
                          cancel: () => {
                            show.value = false
                          },
                          confirm: (val) => {
                            emit('change', val)
                            show.value = false
                          },
                          ...datetimePickerListeners,
                        },
                      },
                      {}
                    ),
                  ],
                }
              ),
            ],
          }
        )
      }
    },
  })
)

export const DatetimePicker = connect(
  BaseDatetimePicker,
  mapProps({ readOnly: 'readonly' }),
  mapReadPretty(PreviewText.DatetimePicker)
)

export default DatetimePicker
