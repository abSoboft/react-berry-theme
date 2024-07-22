import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

const transaction = {
    id: 'pages',
    title: 'Transaction',
    caption: '',
    type: 'group',
    children: [
      {
        id: 'invoiceEntry',
        title: 'InvoiceEntry',
        type: 'item',
        icon: icons.IconKey,
        url: '/Transaction/InvoiceEntry',
      },
      {
        id: 'invoiceReact',
        title: 'Invoice React',
        type: 'item',
        icon: icons.IconKey,
        url: '/Transaction/Invoice_React',
      }
    ]
  }

export default transaction
