<template>
    <div id="app">
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
                            <td><v-label>Qty</v-label></td>
                            <td><v-label>Rate</v-label></td>                        
                        </tr>
                        <tr>
                            <td><v-text-field v-model="defaultItem.item_name" outlined dense @keydown.enter="selectElement('qtyRef')" ref="firstText"></v-text-field></td>
                            <td><v-text-field v-model="defaultItem.qty" outlined dense @keydown.enter="selectElement('rateRef')"  ref="qtyRef"></v-text-field></td>
                            <td><v-text-field v-model="defaultItem.rate" outlined dense @keydown.enter="pushNew()" ref="rateRef"></v-text-field></td>
                        </tr>
                    </table>
                </div>
            </v-card>

            <div>
                <v-data-table :headers="headers" :loading="loadTable" loading-text="Data loading.." :items="purchasesArray" :search="search" class="elevation-1" fixed-header height="300px">
                    <v-divider inset></v-divider>

                    <template v-slot:item.amount="{ item }"> <span>{{item.qty * item.rate}}</span> </template>

                    <template v-slot:item.item_name="{ item }">
                        <v-text-field v-model="editedItem.item_name" :hide-details="true" dense single-line v-if="item.id === editedItem.id" ></v-text-field>
                        <span v-else>{{item.item_name}}</span>
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
                        <v-icon style="width: 5px; height: 10px; margin: 3px;" color="red" class="mr-3" @click="deleteItem(item)">
                            mdi-delete
                        </v-icon>
                        </div>
                    </template>
                </v-data-table>
            </div>

            <v-card>
                <v-btn color="success" style="margin-left: 5px;margin-bottom: 5px; margin-top: 5px;">Save Changes</v-btn>
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

import purchaseService from '../services/PurchaseService'
import moment from 'moment';

export default {
  name: 'PurchaseDetails',
  props: ['purchaseinfo'],
  data: () => ({
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
      value: 'purchase_id',
      sortable: false
    },
    {
      text: 'Item',
      value: 'item_name',
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
      value: 'qty',
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
  }),
  components: {
  },
  created: async function(){   
    console.log("Created..!!");
    console.log(this.purchaseinfo.id);

    var res = await purchaseService.GetPurchaseDetails(this.purchaseinfo.id);
    this.purchasesArray = JSON.parse(JSON.stringify(res));
    this.loadTable = false;
    this.$refs["firstText"].focus();
  },
  methods:{
    selectElement(ref){
        this.$refs[ref].focus();
    },
    closeDialog(){
        this.$emit('close');
    },
    editItem(item) {
    this.oldItem = item;
    this.editedItem = JSON.parse(JSON.stringify(item));
    this.isEdited = true;
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
    this.defaultItem.purchase_id = this.purchaseinfo.id;
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
  }
}
</script>