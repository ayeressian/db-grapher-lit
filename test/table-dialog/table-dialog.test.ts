import TableDialog from "../../src/components/dialog/table-dialog/table-dialog";
import { initComponentTest, removeElement, getTagName } from "../helper";
import store from "../../src/store/store";
import { actions as tableDialogAction } from "../../src/store/slices/dialog/table-dialog";
import { expect } from "chai";

describe("table-dialog", function () {
  let tableDialog: TableDialog;
  let shadowRoot: ShadowRoot;

  beforeEach(async function (): Promise<void> {
    tableDialog = (await initComponentTest({
      elementType: "dbg-table-dialog",
      noUpdate: true,
    })) as TableDialog;
    store.dispatch(tableDialogAction.openCreate({ x: 0, y: 0 }));
    await tableDialog.updateComplete;
    shadowRoot = tableDialog.shadowRoot!;
  });
  afterEach(function (): void {
    removeElement(tableDialog);
  });

  it("should render properly", function () {
    expect(getTagName("dbg-table-dialog-columns", shadowRoot)).to.not.be
      .undefined;
    expect(getTagName("dbg-table-dialog-fk-columns", shadowRoot)).to.not.be
      .undefined;
    expect(getTagName('[data-testid="table-name"]', shadowRoot)).to.equal(
      "INPUT"
    );
    expect(getTagName('[data-testid="save-btn"]', shadowRoot)).to.equal(
      "BUTTON"
    );
    expect(getTagName('[data-testid="cancel-btn"]', shadowRoot)).to.equal(
      "BUTTON"
    );
  });

  describe("when table name is not set", function () {
    it("should not close the dialog on save", function () {
      (
        shadowRoot.querySelector(
          '[data-testid="save-btn"]'
        ) as HTMLButtonElement
      ).click();
      expect(getTagName('[data-testid="table-dialog"]', shadowRoot)).to.not
        .undefined;
    });
  });

  describe("when table name is set", () => {
    beforeEach(function () {
      (
        shadowRoot.querySelector(
          '[data-testid="table-name"]'
        ) as HTMLInputElement
      ).value = "test";
    });
    it("should close the dialog on save", async () => {
      (
        shadowRoot.querySelector(
          '[data-testid="save-btn"]'
        ) as HTMLButtonElement
      ).click();
      await tableDialog.updateComplete;
      expect(getTagName('[data-testid="table-dialog"]', shadowRoot)).undefined;
    });
  });
});
