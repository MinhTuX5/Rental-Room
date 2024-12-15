export class BaseDicStore {
  constructor(api) {
    const me = this;
    me.state = {
      items: [],
      codeField: '',
      nameField: ''
    };

    me.actions = {};
  }
}