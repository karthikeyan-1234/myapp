<template>
    <div id="app">
      <v-alert v-model="showError" border="top" color="red" dense dismissible elevation="13" outlined prominent shaped text type="error"> {{ errorMessage }} </v-alert>
        <v-card style="width:800px;height: 570px;">

            <v-card>
              <div>
              <table>
                <tr>
                    <td>
                        <v-label>Vendor Name</v-label>
                    </td>
                    <td>
                        <v-label>Address</v-label>
                    </td>
                    <td>
                        <v-label>Mobile No</v-label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <v-text-field v-model="defaultItem.vendor_name"  @keydown.enter="selectRate()" ref="vendorName" outlined dense>
                        </v-text-field>
                    </td>
                    <td>
                        <v-text-field v-model="defaultItem.address" outlined dense @keydown.enter="pushNew()" ref="address"></v-text-field>
                    </td>
                    <td>
                        <v-text-field v-model="defaultItem.mobile_no" outlined dense @keydown.enter="pushNew()" ref="mobile"></v-text-field>
                    </td>
                </tr>
                </table>
                </div>
            </v-card>

            <div>
              <v-data-table :sort-by="[{ key: 'vendorName', order:'desc'}]" :headers="headers" :items="itemsArray" item-key="vendorName" :search="search" class="elevation-1" fixed-header height="300px">

                <template v-slot:item.vendor_name="{ item }">
                  <v-text-field v-model="editedItem.vendor_name" :hide-details="true" dense single-line v-if="item.id === editedItem.id" ></v-text-field>
                  <span v-else>{{item.vendor_name}}</span>
                </template>

                <template v-slot:item.address="{ item }">
                  <v-text-field v-model="editedItem.address" :hide-details="true" dense single-line v-if="item.id === editedItem.id" ></v-text-field>
                  <span v-else>{{item.address}}</span>
                </template>
                
                <template v-slot:item.mobile_no="{ item }">
                  <v-text-field v-model="editedItem.mobile_no" :hide-details="true" dense single-line v-if="item.id === editedItem.id" ></v-text-field>
                  <span v-else>{{item.mobile_no}}</span>
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
<script>
import VendorService from '@/services/VendorService';
import moment from 'moment';

export default {
  name: 'VendorMaster',
  components: {
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
    },
    {
      text: 'Vendor Name',
      value: 'vendor_name',
      sortable: false
    },
    {
      text: 'Address',
      value: 'address',
      sortable: false
    },
    {
      text: 'Mobile No',
      value: 'mobile_no',
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
  isEdited: false
}),
async created () {
  await this.initialize();
},
async mounted(){
},
methods: {
  closeDialog() {
      this.showDialog = false;
    },
  async initialize () {
      console.log("Calling initialize function..");

      await VendorService.GetAllVendors().then(res => {
        this.itemsArray = JSON.parse(JSON.stringify(res));
      },err => {
        this.errorMessage = err.message;
        this.showError = true;
      });
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
  async deleteItem(item) {
    const index = this.itemsArray.indexOf(item);
    if(confirm('Are you sure you want to delete this item?')){
      await VendorService.DeleteVendor(item).then(response=> {
        this.itemsArray.splice(index, 1);
      })
    }  },
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
    },err => {
        this.errorMessage = err.message;
        this.showError = true;
      }); 
  },
  async addNew() {
    if(this.isEdited) return;
    console.log("Adding new item");
    await VendorService.AddVendor(this.defaultItem).then(response => {
      this.itemsArray.unshift(JSON.parse(JSON.stringify(response)));
      this.editItem(response);
      this.isEdited = false;
    },err => {
        this.errorMessage = err.message;
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

    console.log("Saving changes of item..");
    console.log(this.editedItem);

    await VendorService.SaveVendor(this.editedItem).then(response => {
      console.log("Item updated..!");
    },err => {
        this.errorMessage = err.message;
        this.showError = true;
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