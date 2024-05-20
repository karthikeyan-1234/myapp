<template>
    <div>
      
      <v-card-text>
        <h1>Reports</h1>
      </v-card-text>
      <v-spacer></v-spacer>

      <v-row align="stretch">
        <v-col cols="6">
      <v-card style="width:900px;height: 800px;">
        <v-card-title>Purchase Report
                  <v-spacer></v-spacer>
            </v-card-title>
            <PurchaseReport></PurchaseReport>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card style="width:900px;height: 800px;">
        <v-card-title>Sales Report
                  <v-spacer></v-spacer>
          </v-card-title>
          <SalesReport></SalesReport>
      </v-card>
    </v-col>
    </v-row>
    </div>
  </template>


  
  <script>

import PurchaseReport from './reports/PurchaseReport.vue'
import SalesReport from './reports/SalesReport.vue'

  export default {
    name: 'reports',

    components: {
      PurchaseReport,
      SalesReport
    },
  }
</script>