// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const masters = {
  id: 'pages',
  title: 'Masters',
  caption: '',
  type: 'group',
  children: [
    {
      id: 'branchMaster',
      title: 'BranchMaster',
      type: 'item',
      icon: icons.IconKey,
      url: '/Master/BranchMasterList',
    }
  ]
};

export default masters;
