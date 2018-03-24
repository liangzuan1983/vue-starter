<template>
  <form :class="[$style.vueForm, cssClass]" :name="schema.name" :id="schema.id" @submit.prevent="submitForm()"
        method="post">

    <div v-for="(element, idx) in elements" :key="idx">
      <slot v-if="element.type === 'slot'" :name="element.model" />
      <vue-form-item
        v-else
        :key="idx"
        :element="element" />
    </div>

    <vue-button
      primary
      :disabled="submitDisabled(elements)"
      v-if="schema.submitText">
      {{ schema.submitText }}
    </vue-button>

    <vue-button
      v-if="schema.cancellationText"
      @click.prevent="reset(true)">
      {{ schema.cancellationText }}
    </vue-button>

    <slot />
  </form>
</template>

<script lang="ts">
  import VueFormItem                                     from './VueFormItem.vue';
  import VueButton                                       from '../VueButton/VueButton.vue';
  import { IFormElement, IFormSchema, IFormValidResult } from './IFormSchema';
  import cloneDeep                                       from 'lodash/cloneDeep';

  export default {
    name:       'VueForm',
    components: {
      VueFormItem,
      VueButton,
    },
    props:      {
      cssClass: {
        type:    String,
        default: 'vueForm',
      },
      schema:   {
        type:     Object,
        required: true,
      },
    },
    data(): any {
      return {
        elements: [],
      };
    },
    computed:   {},
    methods:    {
      isValid(element: IFormElement): boolean {
        if (!element.value || !element.isValid) {
          return true;
        }

        return element.isValid(element).isValid;
      },
      submitDisabled(elements: IFormElement[]): boolean {
        const max: number = elements.length;

        for (let i = 0; i < max; i++) {
          const element: IFormElement = elements[i];

          if (this.isValid(element) === false) {
            return true;
          }

          if (element.required && !element.value) {
            return true;
          }

          // if (element.elements) {
          //   return this.submitDisabled(element.elements);
          // }
        }

        return false;
      },
      submitForm(): void {
        const model: any = {};

        this.$data.elements.forEach((element: IFormElement) => {
          if (element.type !== 'slot') {
            model[element.model] = element.value;
          }
        });

        if (this.submitDisabled() === false) {
          this.$emit('submit', model, this.reset);
        }
      },
      reset(emit: boolean = false) {
        const elements: IFormElement[] = cloneDeep(this.schema.elements);
        const isValid = (): IFormValidResult => {
          return {
            isValid: true,
          };
        };

        this.$data.elements = elements.map((element: IFormElement, idx: number) => {
          element.value = element.value || null;
          element.isValid = element.isValid ? element.isValid : isValid;

          return element;
        });

        if (emit) {
          this.$emit('reset');
        }
      },
    },
    created() {
      this.reset();
    },
    watch:      {
      schema(newSchema: IFormSchema) {
        this.$data.elements.forEach((element: IFormElement, idx: number) => {
          element.label = newSchema.elements[idx].label;
        });
      },
    },
  };
</script>

<style lang="scss" module>
  @import "../../styles";

  .vueForm {
    display: block;

    button {
      margin-top:    $grid-unit * 5;
      margin-bottom: 0;
    }

    :global {
      .vueGrid {
        margin:  0 -$screen-phone-gutter;
        padding: 0;

        @include media(tabletPortrait) {
          margin:  0 -$screen-tablet-portrait-gutter;
          padding: 0;
        }

        @include media(tabletLandscape) {
          margin:  0 -$screen-tablet-landscape-gutter;
          padding: 0;
        }

        @include media(smallDesktop) {
          margin:  0 -$screen-small-desktop-gutter;
          padding: 0;
        }

        @include media(largeDesktop) {
          margin:  0 -$screen-large-desktop-gutter;
          padding: 0;
        }
      }
    }
  }
</style>
