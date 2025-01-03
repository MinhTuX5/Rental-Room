import BaseStore from "./baseStore";

class BaseDicStore extends BaseStore {
  constructor(api) {
    super(api);
    const me = this;
    me.state = {
      ...me.state,
      items: [],
      totalItems: 0,
      idField: "",
      codeField: "",
      nameField: "",
      numberFields: [],
      enumFields: [],
      dateFields: []
    };

    me.actions = {
      ...me.actions,
    };
  }
}

export default BaseDicStore;
