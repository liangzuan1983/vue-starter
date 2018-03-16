<template>
  <keep-alive v-else :class="$style.vueFormItem">
    <component
      :key="element.model"
      :is="element.type"
      v-bind="getComponentProps(element)"
      v-on="getComponentHandler(element)">
      <vue-form-item v-for="(child, idx) in element.elements" :key="idx" :element="child" />
    </component>
  </keep-alive>
</template>

<script lang="ts">
  import VueInput         from '../VueInput/VueInput.vue';
  import VueCheckBox      from '../VueCheckBox/VueCheckBox.vue';
  import VueGrid          from '../VueGrid/VueGrid.vue';
  import VueGridItem      from '../VueGridItem/VueGridItem.vue';
  import { IFormElement } from './IFormSchema';

  export default {
    name:       'VueFormItem',
    components: {
      VueInput,
      VueCheckBox,
      VueGrid,
      VueGridItem,
    },
    props:      {
      element: {
        type:     Object,
        required: true,
      },
    },
    methods:    {
      isValid(element: IFormElement): boolean {
        if (!element.value || !element.isValid) {
          return true;
        }

        return element.isValid(element.value);
      },
      getComponentProps(element: IFormElement): any {
        const isValid: boolean = this.isValid(element);
        if (element.type === 'vue-input') {
          return {
            placeholder: element.label || '',
            required:    element.required || false,
            type:        element.inputType || 'text',
            value:       element.value,
            name:        element.model,
            isValid:     isValid,
            message:     isValid ? '' : element.invalidText,
          };
        } else if (element.type === 'vue-check-box') {
          return {
            label:   element.label || '',
            checked: element.value,
            name:    element.model,
          };
        }
      },
      getComponentHandler(element: IFormElement): any {
        if (element.type === 'vue-input') {
          return {
            change: (e: any) => {
              element.value = e.target.value;
              this.$forceUpdate();
            },
          };
        } else if (element.type === 'vue-check-box') {
          return {
            click: () => {
              element.value = !element.value;
              this.$forceUpdate();
            },
          };
        }
      },
    },
  };
</script>

<style lang="scss" module>
  @import "../../styles";

  .vueFormItem {
  }
</style>
