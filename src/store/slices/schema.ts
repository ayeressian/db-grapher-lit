import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deepCopy } from '../../util';
import { Schema } from 'db-viewer-component';

type Data = {
  past: Schema[],
  present?: Schema,
  future: Schema[]
};

const slice = createSlice({
  initialState: {
    past: [],
    future: []
  } as Data,
  name: 'schema',
  reducers: {
    set: (state, action: PayloadAction<Schema | null>): Data => {
      const {past, present} = deepCopy(state);
      if (present) past.push(present);
      return {
        past,
        present: action.payload ?? undefined,
        future: []
      };
    },
    undo: (state): Data => {
      let {past, present, future} = deepCopy(state);
      if (past.length > 0) {
        future.push(present);
        present = past.pop();
      }
      return {
        past,
        future,
        present,
      };
    },
    redo: (state): Data => {
      let {past, present, future} = deepCopy(state);
      if (future.length > 0) {
        past.push(present);
        present = future.pop();
      }
      return {
        past,
        future,
        present,
      };
    },
  },
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
