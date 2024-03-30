<template>
  <div id="app">
    <v-alert v-model="showError" border="top" color="red" dense dismissible elevation="13" outlined prominent shaped text type="error"> {{ errorMessage }} </v-alert>
  <v-app id="inspire">

    <table>
      <tr>
        <td>
          <v-card class="purchase-card" outlined>
            <v-card-title>Purchases</v-card-title>

            <v-card>
              <div>
              <table>
                <tr>
                  <td>
                    <v-label>Purchase Date</v-label>
                  </td>
                  <td>
                    <v-label>Vendor ID</v-label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <v-text-field v-model="defaultItem.purchaseDate" outlined dense  type="date">
                    </v-text-field>
                  </td>
                  <td><v-text-field v-model="defaultItem.vendorId" outlined dense @keydown.enter="pushNew()" ref="firstText"></v-text-field></td>
                </tr>
              </table>
            </div>
            </v-card>

            <div>
              <v-data-table :headers="headers" :items="purchasesArray" :search="search" class="elevation-1" fixed-header height="300px">
                <v-divider inset></v-divider>

                <template v-slot:item.id="{ item }">
                  <span>{{item.id}}</span>
                </template>

                <template v-slot:item.purchaseDate="{ item }">
                  <v-text-field v-model="editedItem.purchaseDate" :hide-details="true" dense single-line v-if="item.id === editedItem.id" >
                    <template v-slot:append-outer>
                      <date-picker v-model="editedItem.purchaseDate" />
                    </template>
                  </v-text-field>
                  <span v-else>{{item.purchaseDate}}</span>
                </template>

                <template v-slot:item.vendorId="{ item }">
                  <v-text-field v-model="editedItem.vendorId" :hide-details="true" dense single-line v-if="item.id === editedItem.id" ></v-text-field>
                  <span v-else>{{item.vendorId}}</span>
                </template>

                <template v-slot:item.actions="{ item }">

                  <div v-if="item.id === editedItem.id">
                    <v-icon color="red" class="mr-3" @click="close">
                      mdi-window-close
                    </v-icon>
                    <v-icon color="green"  @click="save">
                      mdi-content-save
                    </v-icon>
                  </div>

                  <div v-else>
                    <v-icon style="width: 5px; height: 10px; margin: 3px;" color="green" class="mr-3" @click="editItem(item)">
                      mdi-pencil
                    </v-icon>
                    <v-icon style="width: 5px; height: 10px; margin: 3px;" color="red" @click="deleteItem(item)">
                      mdi-delete
                    </v-icon>
                    <v-icon style="width: 5px; height: 10px; margin: 15px;" color="blue" @click="showItem(item)">
                      mdi-format-list-bulleted
                    </v-icon>
                  </div>

                  <v-dialog v-model="showDialog" width="unset" persistent :retain-focus="false">
                    <purchase-details v-if="showDialog" v-bind:purchaseinfo="shownItem" :key="dialogKey" @close="closeDialog"></purchase-details>
                  </v-dialog>
                </template>

                <template v-slot:no-data>
                  <v-btn color="primary" @click="initialize">Reset</v-btn>
                </template>


              </v-data-table>


              
            </div>

          <v-card>
            <v-btn color="success" style="margin-left: 10px;margin-bottom: 10px; margin-top: 10px;">Save Changes</v-btn>
          </v-card>

          </v-card>
        </td>

        <td>
          <v-card class="purchase-card" outlined>
            <v-card-title>Filter Purchase</v-card-title>

            <v-card>
              <div style="margin-left: 10px;">
              <table>
                <tr>
                  <td>
                    <v-label>From Date</v-label>
                  </td>
                  <td style="margin-top: 10px;">
                    <v-text-field v-model="fromDate" outlined dense  type="date"></v-text-field>
                  </td>
                </tr>
                <tr>
                  <td>
                    <v-label>To Date</v-label>
                  </td>
                  <td>
                    <v-text-field v-model="toDate" outlined dense  type="date"></v-text-field>
                  </td>
                </tr>  

                <tr>
                  <td>
                    <v-btn color="secondary" @click="findPurchases()">Search</v-btn>
                  </td>
                </tr>
              </table>
            </div>
            </v-card>

          </v-card>
        </td>        
      </tr>
  </table>

  </v-app>
  </div>
</template>

<style>
.purchase-card{
margin-left:50px;
margin-top:50px;
height: 100px;
max-height: 120px;
}

.v-data-table__wrapper {
max-height: none !important;
}

.v-data-table__wrapper thead {
position: sticky;
top: 0;
z-index: 1;
background-color: white;
}
</style>

<script>

import purchaseService from '../services/PurchaseService'
import DatePicker from "../components/DatePicker.vue";
import moment from 'moment';
import PurchaseDetails from './PurchaseDetails.vue';

export default {
  name: 'Purchases',
  components: {
    DatePicker,
    PurchaseDetails
  },
  data: () => ({
  dialogKey:0,
  errorMessage:'',
  showError:false,
  showDialog: false,
  max_id: -1,
  search: '',
  headers: [
    {
      text: 'Id',
      value: 'id',
      sortable: true,
      width: '100px'
    },
    {
      text: 'Purchases Date',
      value: 'purchaseDate',
      sortable: false
    },
    {
      text: 'Vendor ID',
      value: 'vendorId',
      sortable: false
    },
    { text: 'Actions', value: 'actions', sortable: false , width: "100px"},
  ],
  purchasesArray: [],
  editedItem: {
    id: 0,
    purchaseDate: '',
    vendorId: 0
  },
  defaultItem: {
    id: -1,
    purchaseDate: moment().format('yyyy-MM-DD'),
    vendorId: 0
  },
  shownItem:{
  },
  oldItem:{},
  isEdited: false,
  fromDate:moment().format('yyyy-MM-DD'),
  toDate:moment().format('yyyy-MM-DD')
}),
created () {
  this.initialize();
},
async mounted(){
},
methods: {
  closeDialog() {
      // Close the dialog
      this.showDialog = false;
    },
  async initialize () {
    try {
      var res = await purchaseService.GetAllPurchases();
      this.purchasesArray = JSON.parse(JSON.stringify(res));
    } catch (error) {
      this.errorMessage = error.message;
      this.showError = true;
    }

  },
  editItem(item) {
    this.oldItem = item;
    this.editedItem = JSON.parse(JSON.stringify(item));
    this.isEdited = true;
  },
  showItem(item) {
    this.dialogKey++;
    this.showDialog = !this.showDialog;
    this.shownItem = {};
    this.shownItem = item;
  },
  deleteItem(item) {
    const index = this.purchasesArray.indexOf(item);
    confirm('Are you sure you want to delete this item?') && this.purchasesArray.splice(index, 1);
  },
  resetDefaultItem(){
    this.defaultItem = {};
    this.defaultItem.purchaseDate = moment().format('yyyy-MM-DD');
    this.$refs["firstText"].focus();
  },
  pushNew(){
    this.isEdited = false;
    if(this.purchasesArray.length > 0)
    {
      this.max_id = 0;
      this.purchasesArray.forEach(purchase => {
        if(purchase.id > this.max_id) this.max_id = purchase.id;
      });
      this.defaultItem.id = this.max_id + 1;
    }
    else
      this.defaultItem.id = 1;
    this.addNew();
    this.isEdited = true;
    this.save();
    this.resetDefaultItem();
  },
  addNew() {
    if(this.isEdited) return;
    console.log("Adding new item");
    this.purchasesArray.unshift(JSON.parse(JSON.stringify(this.defaultItem)));
    this.editItem(this.defaultItem);
  },
  save () {
    if(!this.isEdited) return;

    if(this.editedItem.id == -1 || this.editedItem.id == undefined)
    {
      Object.assign(this.purchasesArray[0],this.editedItem);
      if(this.purchasesArray.length > 1)
        this.purchasesArray[0].id = this.purchasesArray[1].id + 1;
    }
    else
    {
      var index = this.purchasesArray.indexOf(this.oldItem);
      if(index != -1)
        Object.assign(this.purchasesArray[index],this.editedItem);
    }

    this.isEdited = false;
    this.close()
  },
  close () {
  this.editedItem = {};
  this.isEdited = false;
  },
  async findPurchases(){
    try {
      var res = await purchaseService.FindPurchases(this.fromDate,this.toDate);
      this.purchasesArray = JSON.parse(JSON.stringify(res));
    } catch (error) {
      this.errorMessage = error.message;
      this.showError = true;
    }
  }
  }
  
}
</script>