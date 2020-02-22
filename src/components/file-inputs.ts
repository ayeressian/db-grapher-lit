import { html, customElement, css, CSSResult, TemplateResult, LitElement } from 'lit-element';
import { actions as schemaAction } from '../store/slices/schema';
import store from '../store/store';
import { validateJson } from '../validateSchema';
import { actions as welcomeDialogActions } from '../store/slices/welcome-dialog';

const INVALID_JSON_MSG = 'Selected file does not contain valid JSON.';
const INVALID_FILE_FORMAT = 'Selected file does not have correct Db designer file format';

@customElement('dbg-file-inputs')
export default class extends LitElement {
  private resolveLoaded?: Function;
  private loaded: Promise<null> = new Promise((resolve) => this.resolveLoaded = resolve);
  private sqlFileInput?: HTMLInputElement;
  private dbgFileInput?: HTMLInputElement;

  firstUpdated() {
    this.dbgFileInput = this.shadowRoot!.querySelector<HTMLInputElement>('#dbgFileInput')!;
    this.sqlFileInput = this.shadowRoot!.querySelector<HTMLInputElement>('#sqlFileInput')!;
    this.resolveLoaded!();
  }
  
  static get styles(): CSSResult {
    return css`
      input {
        display: none;
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    store.subscribe(() => {
      const state = store.getState();
      if (state.dialog.fileDialog.fileOpenDialog) {
        this.loaded.then(() => {
          this.dbgFileInput!.click();
        });
      }

      if (state.dialog.fileDialog.fileSqlOpenDialog) {
        this.loaded.then(() => {
          this.sqlFileInput!.click();
        });
      }
    });
  }

  render(): TemplateResult {
    return html`
      <input
        id='dbgFileInput'
        type='file'
        accept='application/json'
        @change=${this.fileOpenChange}
      />
      <input
        id='sqlFileInput'
        type='file'
        @change=${this.importSqlFileChange}
      />
    `;
  }

  private fileOpenChange = (event: Event) => {
    const reader = new FileReader();
    reader.readAsText((<HTMLInputElement>event.target).files![0]);
    reader.onload = (readerEvent) => {
      let schema;
      try {
        schema = JSON.parse(readerEvent.target!.result as string);
      } catch (e) {
        alert(INVALID_JSON_MSG);
        return;
      }
      const jsonValidation = validateJson(schema);
      if (!jsonValidation) {
        alert(INVALID_FILE_FORMAT);
        return;
      }
      store.dispatch(schemaAction.setSchema(schema));
      store.dispatch(welcomeDialogActions.close());
    };
  };
  private importSqlFileChange = () => {};
}