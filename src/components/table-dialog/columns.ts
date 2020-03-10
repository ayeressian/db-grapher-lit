import { customElement, LitElement, TemplateResult, html, property, CSSResult } from 'lit-element';
import commonTableStyles from './common-table-styles';

export interface ColumnChangeEventDetail {
  column: IColumnNoneFkSchema;
  index: number;
}

export interface ColumnRemoveDetail {
  index: number;
}

export type ColumnRemoveEvent = CustomEvent<ColumnRemoveDetail>;

@customElement('dbg-table-dialog-columns')
export default class extends LitElement {
  @property( { type : Object } ) schema?: ISchema;
  @property( { type : Number } ) tableIndex?: number;

  #form?: HTMLFormElement;
  
  static get styles(): CSSResult {
    return commonTableStyles;
  }

  #onColumnChange = (index: number, column: IColumnNoneFkSchema) => {
    const detail: ColumnChangeEventDetail = {
      column,
      index,
    };
    const event = new CustomEvent('dbg-column-change', { detail });
    this.dispatchEvent(event);
  }

  #renderColumn = (column: IColumnNoneFkSchema, index: number): TemplateResult => {
    const onColumnChange = (type: keyof IColumnNoneFkSchema) => (event: InputEvent) => {
      const element = event.target as HTMLInputElement;
      switch(type){
        case 'nn':
        case 'uq':
        case 'pk':
          column[type] = element.checked;
          break;
        default:
          column[type] = element.value;
          break;
      }
      
      this.#onColumnChange(index, column);
    };
    return html`
      <tr>
        <td>
          <input
            @input="${onColumnChange('name')}"
            .value="${column.name}"
            required
          />
        </td>
        <td>
          <input
            @input="${onColumnChange('type')}"
            .value="${column.type}"
            required
          />
        </td>
        <td>
          <input
            type='checkbox'
            @change="${onColumnChange('pk')}"
            .value="${column.pk}"
          />
        </td>
        <td>
          <input
            type='checkbox'
            @change="${onColumnChange('uq')}"
            .value="${column.uq}"
          />
        </td>
        <td>
          <input
            type='checkbox'
            @change="${onColumnChange('nn')}"
            .value="${column.nn}"
          />
        </td>
        <td>
          <button @click="${(event: Event) => this.#removeColumn(event, index)}">Remove</button>
        </td>
      </tr>
    `;
  }

  #renderColumns = (): TemplateResult => {
    const currentTable = this.schema?.tables[this.tableIndex!];
    const result: TemplateResult[] = [];
    currentTable?.columns.forEach((column, index) => {
      if (!(column as IColumnFkSchema).fk) {
        result.push(this.#renderColumn(column as IColumnNoneFkSchema, index));
      }
    });
    return html`${result}`;
  }

  firstUpdated() {
    this.#form = this.shadowRoot!.querySelector('form')!;
  }

  validate() {
    return this.#form!.reportValidity();
  }
  
  render(): TemplateResult {
    return html`
      <div>
        <form>
          <table class="table">
            <thead>
              <tr>
                <th>Columns</th>
              </tr>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>PK</th>
                <th>UQ</th>
                <th>NN</th>
                <th/>
              </tr>
            </thead>
            <tbody>${this.#renderColumns()}</tbody>
          </table>
          <button @click="${this.#addColumn}">Add column</button>
        </form>
      </div>`;
  }

  #addColumn = async (event: Event) => {
    event.preventDefault();
    const newEvent = new CustomEvent('dbg-add-column');
    this.dispatchEvent(newEvent);

    //TODO find better way to solve firefox red boarder issue
    await this.updateComplete;
    await this.updateComplete;
    this.#form?.reset();
  }

  #removeColumn = (event: Event, index: number) => {
    event.preventDefault();

    const detail: ColumnRemoveDetail = {
      index,
    };
    const newEvent = new CustomEvent('dbg-remove-column', { detail });
    this.dispatchEvent(newEvent);
  };
}