import chai from "chai";
import chaiDom from "chai-dom";
chai.use(chaiDom);

import "../src/components/import-components";

import "./dialog.test";
import "./side-panel.test";
import "./new-open-dialog.test";
import "./top-menu.test";
import "./table-dialog/table-dialog.test";
import "./table-dialog/column.test";
