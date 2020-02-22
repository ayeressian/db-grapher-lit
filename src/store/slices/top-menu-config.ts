import { createSlice } from '@reduxjs/toolkit';
import TopMenuConfig from './top-menu-config-interface';

const config = {
  items: [{
      id: 'file',
      title: 'File',
      items: [{
          id: 'new',
          title: 'New Schema'
        },
        {
          id: 'open',
          title: 'Open Schema'
        },
        {
          id: 'downloadSchema',
          title: 'Download'
        }
      ]
    }, {
      title: 'import/export',
      items: [{
        id: 'exportSql',
        title: 'Export SQL'
      }, {
        id: 'importSql',
        title: 'Import SQL'
      }]
    },
    {
      id: 'help',
      title: 'Help',
      items: [{
        id: 'reportIssue',
        title: 'Report an issue'
      }, {
        id: 'about',
        title: 'About'
      }]
    }
  ],
  rightItems: [{
      id: 'gitHub',
      title: 'GitHub'
    },
    {
      id: 'downloadApp',
      title: 'Download'
    }
  ]
};

const slice = createSlice({
  initialState: config as TopMenuConfig,
  name: 'top-menu-config',
  reducers: {},
});

export default slice;

export const reducer = slice.reducer;
export const actions = slice.actions;
