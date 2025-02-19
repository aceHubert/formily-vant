import {
  provide,
  inject,
  InjectionKey,
  defineComponent,
  Ref,
  ref,
  watch,
} from 'vue-demi'
import { h } from '@formily/vue'
import { stylePrefix } from '../__builtins__'
import { useResponsiveFormLayout } from './useResponsiveFormLayout'

export type FormLayoutProps = {
  className?: string
  labelWidth?: number | string
  labelAlign?: 'right' | 'left'
  inputAlign?: 'right' | 'left'
  colon?: boolean
  size?: 'large'
  border?: boolean
  direction?: 'rtl' | 'ltr'
  shallow?: boolean
  spaceGap?: number
}

export const FormLayoutDeepContext: InjectionKey<Ref<FormLayoutProps>> = Symbol(
  'FormLayoutDeepContext'
)

export const FormLayoutShallowContext: InjectionKey<Ref<FormLayoutProps>> =
  Symbol('FormLayoutShallowContext')

export const useFormDeepLayout = (): Ref<FormLayoutProps> =>
  inject(FormLayoutDeepContext, ref({}))

export const useFormShallowLayout = (): Ref<FormLayoutProps> =>
  inject(FormLayoutShallowContext, ref({}))

export const useFormLayout = (): Ref<FormLayoutProps> => {
  const shallowLayout = useFormShallowLayout()
  const deepLayout = useFormDeepLayout()
  const formLayout = ref({
    ...deepLayout.value,
    ...shallowLayout.value,
  })

  watch(
    [shallowLayout, deepLayout],
    () => {
      formLayout.value = {
        ...deepLayout.value,
        ...shallowLayout.value,
      }
    },
    {
      deep: true,
    }
  )
  return formLayout
}

export const FormLayout = defineComponent<FormLayoutProps>({
  name: 'FFormLayout',
  inheritAttrs: true,
  props: {
    className: {},
    colon: { default: true },
    labelWidth: {},
    labelAlign: {},
    inputAlign: {},
    border: { default: true },
    size: {},
    direction: { default: 'ltr' },
    shallow: { default: true },
    spaceGap: {},
  },
  setup(customProps, { slots, refs }) {
    const { props } = useResponsiveFormLayout(customProps, refs)

    const deepLayout = useFormDeepLayout()
    const newDeepLayout = ref({
      ...deepLayout,
    })
    const shallowProps = ref({})

    watch(
      [props, deepLayout],
      () => {
        shallowProps.value = props.value.shallow ? props.value : undefined
        if (!props.value.shallow) {
          Object.assign(newDeepLayout.value, props.value)
        } else {
          if (props.value.size) {
            newDeepLayout.value.size = props.value.size
          }
          if (props.value.colon) {
            newDeepLayout.value.colon = props.value.colon
          }
        }
      },
      { deep: true, immediate: true }
    )

    provide(FormLayoutDeepContext, newDeepLayout)
    provide(FormLayoutShallowContext, shallowProps)

    const formPrefixCls = `${stylePrefix}-form`
    return () => {
      const classNames = {
        [`${formPrefixCls}-rtl`]: props.value.direction === 'rtl',
        [`${formPrefixCls}-${props.value.size}`]: !!props.value.size,
        [`${props.value.className}`]: props.value.className !== undefined,
      }
      return h(
        'div',
        {
          ref: 'root',
          class: classNames,
          style: 'color: ref;',
        },
        slots
      )
    }
  },
})

export default FormLayout
