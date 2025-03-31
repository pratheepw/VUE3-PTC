<script setup lang="ts">
import { SubTitle } from 'chart.js';
import { title } from 'process';

const shortcuts = [
  // {
  //   icon: 'tabler-calendar',
  //   title: 'Calendar',
  //   subtitle: 'Appointments',
  //   to: { name: 'apps-calendar' },
  // },
  // {
  //   icon: 'tabler-file-dollar',
  //   title: 'Invoice App',
  //   subtitle: 'Manage Accounts',
  //   to: { name: 'apps-invoice-list' },
  // },
  {
    icon: 'tabler-user',
    title: 'Users',
    subtitle: 'Manage Users',
    to: { name: 'user-list' },
  },
  {
    icon: 'tabler-users',
    title: 'Role Management',
    subtitle: 'Manage Roles',
    to: { name: 'user-roles' },
  },
  {
    icon:'tabler-lock',
    title:'Permission',
    subtitle:'Manage Permissions',
    to:{name:'user-permissions'}
  }
  // {
  //   icon: 'tabler-device-desktop-analytics',
  //   title: 'Dashboard',
  //   subtitle: 'Dashboard Analytics',
  //   to: { name: 'dashboards-analytics' },
  // },

  // {
  //   icon: 'tabler-settings',
  //   title: 'Settings',
  //   subtitle: 'Account Settings',
  //   to: { name: 'pages-account-settings-tab', params: { tab: 'account' } },
  // },

]
</script>

<template>
  <Shortcuts :shortcuts="shortcuts" />
</template>
