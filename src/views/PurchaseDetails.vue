<template>
    <div id="app">
      <v-alert v-model="showError" border="top" color="red" dense dismissible elevation="13" outlined prominent shaped text type="error"> {{ errorMessage }} </v-alert>      
        <v-card style="width:800px;height: 570px;">

            <v-card-title>Purchase Details of {{ purchaseinfo.id }}
                  <v-spacer></v-spacer>
                 <v-btn icon @click="closeDialog" >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card>
                <div>
                    <table>
                        <tr>
                            <td><v-label>Item</v-label></td>
                            <td><v-label>Quantity</v-label></td>
                            <td><v-label>Rate</v-label></td>                        
                        </tr>
                        <tr>
                            <td>
                              <v-autocomplete v-model="selectItem" :items="getItemNames" item-text="itemName" item-value="itemId" ref="firstText" dense single-line  hide-details></v-autocomplete>
                            </td>
                            <td><v-text-field v-model="defaultItem.quantity" outlined dense @keydown.enter="selectElement('rateRef')"  ref="quantityRef"></v-text-field></td>
                            <td><v-text-field v-model="defaultItem.rate" outlined dense @keydown.enter="pushNew()" ref="rateRef"></v-text-field></td> 
                        </tr>
                    </table>
                </div>
            </v-card>

            <div>
                <v-data-table :headers="headers" :loading="loadTable" loading-text="Data loading.." :items="purchasesArray" :search="search" class="elevation-1" fixed-header height="300px">
                    <v-divider inset></v-divider>

                    <template v-slot:item.rate="{ item }">
                      <v-text-field v-if="item.id === editedItem.id" v-model="editedItem.rate" outlined dense></v-text-field>
                        <span v-else>{{item.rate}}</span>
                    </template>

                    <template v-slot:item.quantity="{ item }">
                      <v-text-field v-if="item.id === editedItem.id" v-model="editedItem.quantity" outlined dense></v-text-field>
                        <span v-else>{{item.quantity}}</span>
                    </template>

                    <template v-slot:item.itemName="{ item }">
                      <v-autocomplete v-if="item.id === editedItem.id" v-model="editedItem" :items="getItemNames" item-text="itemName" item-value="itemId" ref="firstText" dense single-line  hide-details></v-autocomplete>
                      <span v-else>{{item.itemName}}</span>
                    </template>

                    <template v-slot:item.amount="{ item }"> <span>{{item.quantity * item.rate}}</span> </template>

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
                        <v-icon style="width: 5px; height: 10px; margin: 3px;" color="red" class="mr-3" @click="deleteItem(item)">
                            mdi-delete
                        </v-icon>
                        </div>
                    </template>
                </v-data-table>
            </div>

            <v-card>
                <v-btn color="success" style="margin-left: 5px;margin-bottom: 5px; margin-top: 5px;" @click="LoadData()">Save Changes</v-btn>
            </v-card>
        </v-card>
    </div>
</template>

<style>
.purchase-card{
width:800px;
max-width: 500px;
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

import purchaseDetailService from '../services/PurchaseDetailService'
import moment from 'moment';
import ItemService from '@/services/ItemService';
import PurchaseDetailService from '../services/PurchaseDetailService';

export default {
  name: 'PurchaseDetails',
  props: ['purchaseinfo'],
  data: () => ({
    errorMessage:'',
    showError:false,
    purchasesArray: [],
    dialog: false,
    loadTable: true,
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
    headers: [
    {
      text: 'Id',
      value: 'id',
      sortable: true,
    },
    {
      text: 'Purchase Id',
      value: 'purchaseId',
      sortable: false
    },
    {
      text: 'Item',
      value: 'itemName',
      sortable: false,
      width: '300px'
    },
    {
      text: 'Rate',
      value: 'rate',
      sortable: false
    },    
    {
      text: 'Quantity',
      value: 'quantity',
      sortable: false
    },
    {
      text: 'Amount',
      value: 'amount',
      sortable: false
    },    
    { text: 'Actions', value: 'actions', sortable: false , width: "100px"},
    ],
    purchasesArray: [],
    search: '',
    itemList:[],
    item:{},
    selectItem:null
  }),
  components: {
  },
  async created(){
    await this.initialize();
  },
  async mounted(){
    console.log("Mounted hook...");
    await this.LoadData();
  },
  computed:{
    getItemNames(){

      console.log("Get item names");
      console.log(this.itemList);

      return this.itemList.map(res => {
        return {
          itemId : res.id,
          itemName: res.item_name
        }
      });
    }
  },
  methods:{

  async LoadData(){
    await purchaseDetailService.GetPurchaseDetailById(this.purchaseinfo.id).then(res => {
      this.purchasesArray = res;
      this.loadTable = false;
      this.$refs["firstText"].focus();
      console.log("Purchases Array...");
      console.log(this.purchasesArray);
    },err => {
      this.errorMessage = err.message;
      this.showError = true;
    });
  },
  selectElement(ref){
        this.$refs[ref].focus();
  },
  closeDialog(){
        this.$emit('close');
  },
  async initialize () {
    await ItemService.GetAllItems().then(res => {
        console.log("Response from ItemService.GetAllItems..");
        console.log(res);
        if (res && Array.isArray(res)) {
            this.itemList = res;
        } 
        else {
        console.error('Invalid response from ItemService.GetAllItems():', res);
        }   
      },err => {
      this.errorMessage = err.message;
      this.showError = true;
    });
  },
  editItem(item) {
    this.oldItem = item;
    console.log("Editing item..");
    console.log(item);
    console.log("Select item..");
    console.log(this.selectItem);
    this.editedItem = item;
    this.isEdited = true;
  },
  async deleteItem(item) {
    const index = this.purchasesArray.indexOf(item);
    console.log(item);
    if(confirm('Are you sure you want to delete this item?')){
      await PurchaseDetailService.DeletePurchaseDetail(item).then(res=>{
        this.purchasesArray.splice(index, 1);
      },err => {
        this.errorMessage = err.message + " - " + err.response.data;
        this.showError = true;        
      })
    } 
  },
  resetDefaultItem(){
    this.defaultItem = {};
    this.defaultItem.purchaseDate = moment().format('yyyy-MM-DD');
    this.$refs["firstText"].focus();
  },
  async pushNew(){
    this.isEdited = false;
    this.defaultItem.purchaseid = this.purchaseinfo.id;
    console.log("Trying to add new item");
    console.log(this.selectItem);
    this.defaultItem.itemId =  this.selectItem;
    await this.addNew();
    this.isEdited = true;
    await this.save();
    this.resetDefaultItem();
  },
  async addNew() {
    if(this.isEdited) return;

    this.defaultItem.purchaseid = this.purchaseinfo.id;

    await PurchaseDetailService.AddPurchaseDetail(this.defaultItem).then(response=>{
      console.log("Result of AddPurchse Detail");
      console.log(response);
      this.defaultItem.id = response.id;
      this.purchasesArray.unshift(JSON.parse(JSON.stringify(this.defaultItem)));
      this.editItem(this.defaultItem);
    },err=> {
      this.errorMessage = err.message + " - " + err.response.data;
      this.showError = true;
    })
  },
  async save () {

    console.log("Editing item..");

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

    console.log("Saving item..");
    console.log(this.editedItem);

    await PurchaseDetailService.SavePurchaseDetail(this.editedItem).then(response => {
    },err => {
      this.errorMessage = err.message + " - " + err.response.data;
      this.showError = true;      
    })

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