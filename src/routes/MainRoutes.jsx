import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import BranchMaster from 'views/pages/masters/branchMaster/BranchMaster';
import BranchMasterList from 'views/pages/masters/branchMaster/BranchMasterList';
import InvoiceEntry from 'views/pages/transactions/InvoiceEntry';
import Invoice_React from 'views/pages/transactions/Invoice_React';
import Invoice_React_Entry from 'views/pages/transactions/Invoice_React_Entry';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const PurchaseOrderPage = Loadable(lazy(() => import('views/purchase-order/PurchaseOrder')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: '/Master/BranchMasterList',
      element: <BranchMasterList />
    },
    {
      path: '/Transaction/InvoiceEntry',
      element: <InvoiceEntry />
    },
    {
      path: '/Transaction/Invoice_React',
      element: <Invoice_React />
    },
    {
      path: '/Transaction/Invoice_React_Entry',
      element: <Invoice_React_Entry />
    },

    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    // {
    //   path: 'icons',
    //   children: [
    //     {
    //       path: 'tabler-icons',
    //       element: <UtilsTablerIcons />
    //     }
    //   ]
    // },
    // {
    //   path: 'icons',
    //   children: [
    //     {
    //       path: 'material-icons',
    //       element: <UtilsMaterialIcons />
    //     }
    //   ]
    // },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: '/master/purchase-order',
      element: <PurchaseOrderPage />
    }
  ]
};

export default MainRoutes;
