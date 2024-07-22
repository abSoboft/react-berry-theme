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
    },
    {
      id: 'purchaseOrder',
      title: 'Purchase Order',
      type: 'item',
      icon: icons.IconKey,
      url: '/master/purchase-order',
    },
  ]
};

export default masters;
