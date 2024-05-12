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
              <v-data-table :headers="headers" :items="itemsArray" :search="search" class="elevation-1" fixed-header height="300px">
                <v-divider inset></v-divider>

                <template v-slot:item.id="{ item }">
                  <span>{{item.id}}</span>
                </template>

                <template v-slot:item.purchaseDate="{ item }">
                  <v-text-field v-model="formattedPurchaseDate" :hide-details="true" dense single-line v-if="item.id === editedItem.id" >
                    <template v-slot:append-outer>
                      <date-picker v-model="editedItem.purchaseDate" />
                    </template>
                  </v-text-field>
                  <span v-else>{{formatDate(item.purchaseDate)}}</span>
                </template>

                <template v-slot:item.vendorId="{ item }">
                  <v-select v-model="item" :items="getVendorNames" item-text="vendorName" item-value="vendorId" dense single-line  hide-details  @change="onVendorChange(item)"
                  v-if="item.id === editedItem.id"></v-select>
                  <span v-else>{{ item.vendorName }}</span>
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

import PurchaseService from '../services/PurchaseService'
import VendorService from '@/services/VendorService';
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
  itemsArray: [],
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
  toDate:moment().format('yyyy-MM-DD'),
  vendors:[],
  vendorList:[]
}),
async created () {
  await this.initialize();
},
async mounted(){

},
computed: {
  formattedPurchaseDate() {
    return moment(this.editedItem.purchaseDate).format('YYYY-MM-DD');
  },
  getVendorNames() {
      return this.vendorList.map(res => {
        return {
          vendorId : res.id,
          vendorName: res.vendor_name
        }
      });
  }
},
methods: 
{
  onVendorChange(vendorId) {
  var foundVendor = this.vendorList.filter((vendor)=>{
    return vendor.id == vendorId
  })
  this.editedItem.vendorId = vendorId;
  this.editedItem.vendorName = foundVendor ? foundVendor[0].vendor_name : 'No Vendor';
  },
  formatDate(dateString) {
    return moment(dateString).format('YYYY-MM-DD');
  },
  closeDialog() {
      this.showDialog = false;
  },
  async initialize () {
      await PurchaseService.GetAllPurchasesWithVendorNames().then(res => {
        console.log("Response from GetAllPurchasesWithVendorNames..");
        console.log(res);
        this.itemsArray = JSON.parse(JSON.stringify(res));
      },err => {
        this.errorMessage = err.message;
        this.showError = true;
      });

      await VendorService.GetAllVendors().then(res => {
        console.log("Response from VendorService.GetAllVendors..");
        console.log(res);
        if (res && Array.isArray(res)) {
      this.vendorList = res;
    } else {
      console.error('Invalid response from VendorService.GetAllVendors():', res);
    }      },err => {
      this.errorMessage = err.message;
      this.showError = true;
    });
  },
  editItem(item) {
    this.oldItem = item;
    this.editedItem = JSON.parse(JSON.stringify(item));
    console.log("Editing item..");
    console.log(this.editedItem);
    this.isEdited = true;
  },
  showItem(item) {
    this.dialogKey++;
    this.showDialog = !this.showDialog;
    this.shownItem = {};
    this.shownItem = item;
  },
  async deleteItem(item) {
    const index = this.itemsArray.indexOf(item);
    if(confirm('Are you sure you want to delete this item?')){
      await PurchaseService.DeletePurchase(item).then(response=> {
        this.itemsArray.splice(index, 1);
      })
    }  
  },
  resetDefaultItem(){
    this.defaultItem = {};
    this.$refs["vendorName"].focus();
  },
  selectRate(){
    this.$refs["vendorName"].focus();
  },
  async pushNew(){
    this.isEdited = false;
    await this.addNew().then(response=> {
      this.resetDefaultItem();
      this.$refs["itemName"].focus();   
    }); 
  },
  async addNew() {
    if(this.isEdited) return;
    console.log("Adding new item");
    await PurchaseService.AddPurchase(this.defaultItem).then(response => {
      this.itemsArray.unshift(JSON.parse(JSON.stringify(response)));
      this.editItem(response);
      this.isEdited = false;
    },err=> {
      console.log(err);
      this.errorMessage = err.message + " - " + err.response.data;
      this.showError = true;
    })
  },
  async save () {
    if(!this.isEdited) return;

    if(this.editedItem.id == -1 || this.editedItem.id == undefined)
    {
      Object.assign(this.itemsArray[0],this.editedItem);
      if(this.itemsArray.length > 1)
        this.itemsArray[0].id = this.itemsArray[1].id + 1;
    }
    else
    {
      var index = this.itemsArray.indexOf(this.oldItem);
      if(index != -1)
        Object.assign(this.itemsArray[index],this.editedItem);
    }

    await PurchaseService.SavePurchase(this.editedItem).then(response => {
    },error=> {
      console.log(error);
    });

    this.isEdited = false;
    this.close()
  },
  close () {
  this.editedItem = {};
  this.isEdited = false;
  }
}  
  
}
</script>