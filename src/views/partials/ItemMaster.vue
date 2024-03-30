<template>
    <div id="app">
        <v-card style="width:800px;height: 570px;">

            <v-card>
              <div>
              <table>
                <tr>
                    <td>
                        <v-label>Item Name</v-label>
                    </td>
                    <td>
                        <v-label>Rate</v-label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <v-text-field v-model="defaultItem.item_name"  @keydown.enter="selectRate()" ref="itemName" outlined dense>
                        </v-text-field>
                    </td>
                    <td>
                        <v-text-field v-model="defaultItem.rate" outlined dense @keydown.enter="pushNew()" ref="firstText"></v-text-field>
                    </td>
                </tr>
                </table>
                </div>
            </v-card>

            <div>
              <v-data-table :sort-by="[{ key: 'item_name', order:'desc'}]" :headers="headers" :items="itemsArray" item-key="item_name" :search="search" class="elevation-1" fixed-header height="300px">

                <template v-slot:item.item_name="{ item }">
                  <v-text-field v-model="editedItem.item_name" :hide-details="true" dense single-line v-if="item.id === editedItem.id" ></v-text-field>
                  <span v-else>{{item.item_name}}</span>
                </template>

                <template v-slot:item.rate="{ item }">
                  <v-text-field v-model="editedItem.rate" :hide-details="true" dense single-line v-if="item.id === editedItem.id" ></v-text-field>
                  <span v-else>{{item.rate}}</span>
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
import ItemService from '@/services/ItemService';
import moment from 'moment';

export default {
  name: 'ItemMaster',
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
      text: 'Item Name',
      value: 'item_name',
      sortable: false
    },
    {
      text: 'Rate',
      value: 'rate',
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
      console.log("Calling item service get all items...");
      await ItemService.GetAllItems().then(res => {
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
      await ItemService.DeleteItem(item).then(response=> {
        this.itemsArray.splice(index, 1);
      })
    }
  },
  resetDefaultItem(){
    this.defaultItem = {};
    this.defaultItem.purchaseDate = moment().format('yyyy-MM-DD');
    this.$refs["firstText"].focus();
  },
  selectRate(){
    this.$refs["firstText"].focus();
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
    await ItemService.AddItem(this.defaultItem).then(response => {
      this.itemsArray.unshift(JSON.parse(JSON.stringify(response)));
      this.editItem(response);
      this.isEdited = false;
    },error=> {
      
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

    await ItemService.SaveItem(this.editedItem).then(response => {
      console.log("Item updated..!");
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