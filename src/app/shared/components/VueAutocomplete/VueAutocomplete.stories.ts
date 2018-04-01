import { storiesOf }                  from '@storybook/vue';
import { action }                     from '@storybook/addon-actions';
import VueInfoAddon                   from 'storybook-addon-vue-info';
import VueAutocomplete                from './VueAutocomplete.vue';
import { AutocompleteOptionsFixture } from './fixtures/IAutocompleteFixture';

const story = (storiesOf('VueAutocomplete', module) as any);

story.addDecorator(VueInfoAddon);

story.add('Default', () => ({
  components: { VueAutocomplete },
  data(): any {
    return {
      autocompleteOptions: [],
    };
  },
  methods:    {
    onRequest(query: string) {
      action('@request');

      const returnOptions: boolean = Math.random() > 0.5 || query.indexOf('foo') > -1;

      if (returnOptions) {
        this.autocompleteOptions = AutocompleteOptionsFixture;
      } else {
        this.autocompleteOptions = [];
      }

    },
    request: action('@request'),
    change:  action('@change'),
  },
  template:   `<vue-autocomplete
            :options="autocompleteOptions"
            :max-options="3"
            placeholder="Type something (e.g. foo)"
            @request="onRequest"
            @request="request"
            @change="change"/>`,
}));
