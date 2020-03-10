import { customElement, LitElement, TemplateResult, html, property, CSSResult } from 'lit-element';
import commonTableStyles from './common-table-styles';

export interface FkColumnChangeEventDetail {
  column: IColumnFkSchema;
  index: number;
}

@customElement('dbg-table-dialog-fk-columns')
export default class extends LitElement {
  @property( { type : Object } ) schema?: ISchema;
  @property( { type : Number } ) tableIndex?: number;

  #form?: HTMLFormElement;

  static get styles(): CSSResult {
    return commonTableStyles;
  }

  #onColumnChange = (index: number, column: IColumnFkSchema) => {
    const detail: FkColumnChangeEventDetail = {
      column,
      index,
    };
    const event = new CustomEvent('dbg-fk-column-change', { detail });
    this.dispatchEvent(event);
  }

  #renderColumn = (column: IColumnFkSchema, index: number): TemplateResult => {
    const onColumnChange = (type: keyof Omit<IColumnFkSchema, 'fk'>) => (event: InputEvent) => {
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
    const onFkTableSelect = (event: InputEvent) => {
      const element = (event.target as HTMLSelectElement);
      column.fk!.table = element.options[element.selectedIndex].value;
      this.#onColumnChange(index, column);
      this.requestUpdate();
    };
    const onFkColumnSelect = (event: InputEvent) => {
      const element = (event.target as HTMLSelectElement);
      column.fk!.column = element.options[element.selectedIndex].value;
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
          <select
            @change="${onFkTableSelect}"
            .value="${column.fk?.table}"
          >
            ${this.schema?.tables.map(({ name }) => html`<option value=${name}>${name}</option>`)}
          </select>
        </td>
        <td>
          <select
            @change="${onFkColumnSelect}"
            .value="${column.fk?.column}"
          >
            ${this.#getFkColumns(column.fk!.table).map(({name}) => html`<option value="${name}">${name}</option>`)}
          </select>
        </td>
      </tr>
    `;
  }

  #renderColumns = (): TemplateResult => {
    const currentTable = this.schema?.tables[this.tableIndex!];
    const result: TemplateResult[] = [];
    currentTable?.columns.forEach((column, index) => {
      if ((column as IColumnFkSchema).fk) {
        result.push(this.#renderColumn(column, index));
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
                <th>Foreign Key Columns</th>
              </tr>
              <tr>
                <th>Name</th>
                <th>PK</th>
                <th>UQ</th>
                <th>NN</th>
                <th>Foreign Table</th>
                <th>Foreign Column</th>
              </tr>
            </thead>
            <tbody>${this.#renderColumns()}</tbody>
          </table>
          <button @click="${this.#addColumn}">Add relation</button>
        </form>
      </div>`;
  }

  #addColumn = (event: Event) => {
    event.preventDefault();
    const newEvent = new CustomEvent('dbg-add-fk-column');
    this.dispatchEvent(newEvent);
  }

  #getFkColumns = (tableName: string) => {
    const table = this.schema?.tables.find(table => table.name === tableName) ?? this.schema?.tables[this.tableIndex!];
    return table?.columns.filter(({pk, uq, nn}) => pk || (nn && uq)) || [];
  };
}