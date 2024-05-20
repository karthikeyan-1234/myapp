<template>
    <div id="app">
      <v-card outlined>
        <v-row align="stretch">
          <v-col><v-label  class="centered-text">From Date</v-label></v-col>
          <v-col>              
            <v-text-field class="centered-text" v-model="formattedFromDate" :hide-details="true" dense single-line>
                    <template v-slot:append-outer>
                      <date-picker class="centered-text" v-model="fromDate" />
                    </template>
              </v-text-field>   
            </v-col>
  
            <v-col><v-label>To Date</v-label></v-col>
          <v-col>              
            <v-text-field class="centered-text" v-model="formattedToDate" :hide-details="true" dense single-line>
                    <template v-slot:append-outer>
                      <date-picker class="centered-text" v-model="toDate" />
                    </template>
              </v-text-field>   
          </v-col>
          <v-col>
            <v-btn>Generate</v-btn>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
      </v-card>

    </br>
  
      <div>
        <v-data-table :headers="headers" :items="reportArray" class="elevation-1" fixed-header height="500px"   :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}" :items-per-page="30">
          <v-divider inset></v-divider>
        </v-data-table>
      </div>
    </div>
  </template>
  
  <style>
  .centered-text .v-input__control {
    text-align: center;
  }
  
  .centered-text input {
    text-align: center;
  }
  </style>
    
  <script>
  
  import moment from 'moment';
  import DatePicker from "../../components/DatePicker.vue";
  
  
  export default {
    name: 'PurchaseReport',
    components: {
      DatePicker
    },
    data:() =>({
      fromDate:moment().format('yyyy-MM-DD'),
      toDate:moment().format('yyyy-MM-DD'),
      reportArray:[],
      headers:[
              {
                  text: 'Date',
                  value: 'date',
                  sortable: true,
                  width: '100px'
              },
              {
                  text: 'Sales Number',
                  value: 'id',
                  sortable: true,
                  width: '150px'
              },
              {
                  text: 'Customer Name',
                  value: 'customer_name',
                  sortable: true,
                  width: '100px'
              },
              {
                  text: 'Total Amount',
                  value: 'amount',
                  sortable: true,
                  width: '100px'
              },
              {
                  text: 'Total Items',
                  value: 'items',
                  sortable: true,
                  width: '100px'
              }
      ],
    }),
    computed: {
      formattedFromDate() {
        return moment(this.fromDate).format('YYYY-MMM-DD');
      },
      formattedToDate() {
        return moment(this.toDate).format('YYYY-MMM-DD');
      }
    }
  }
  </script>