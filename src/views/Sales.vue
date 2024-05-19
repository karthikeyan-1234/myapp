<template>
  <div id="app">
      <v-alert v-model="showError" border="top" color="red" dense dismissible elevation="13" outlined prominent shaped text type="error"> {{ errorMessage }} </v-alert>

      <v-app id="inspire">
          <v-card>
              <div>
                  <table>
                      <tr>
                          <td><v-label>Item</v-label></td>
                          <td><v-label>Rate</v-label></td>                        
                          <td><v-label>Quantity</v-label></td>

                          <td><v-btn @click="createNewSales()">Add Sales</v-btn></td>
                          <td>&nbsp;</td>
                          <td><b>  Customer  </b></td>
                          <td><v-autocomplete class="centered-text" :items="getCustomerNames" v-model="customer.id" item-text="customerName"  item-value="customerId" ref="customerRef"></v-autocomplete></td>

                          <td><b>  Sales  </b></td>
                          <td><v-text-field class="centered-text" v-model="saleId" @change="loadDetails(saleId)"></v-text-field></td>

                          <td><b>  Date  </b></td>
                          <td><v-text-field class="centered-text" v-model="salesDate" readonly></v-text-field></td>


                      </tr>
                      <tr>
                          <td><v-autocomplete :items="getItemNames" v-model="newItem.id" item-text="itemName"  item-value="itemId" ref="itemRef" @change="getRate(newItem.id)"></v-autocomplete></td>
                          <td><v-text-field v-model="newItem.rate" outlined dense ref="rateRef"></v-text-field></td> 
                          <td><v-text-field v-model="newItem.quantity" outlined dense ref="quantityRef" @keydown.enter="addItem(newItem)"></v-text-field></td>   
                      </tr>
                  </table>
              </div>
          </v-card>




          <v-card>
              <v-data-table     :footer-props="{ 'items-per-page-options': [5, 10, 25, -1] }" :headers="headers" :items="salesList" class="elevation-1" fixed-header height="300px">
                  <v-divider inset></v-divider>

                  <template v-slot:footer>
                      <v-footer>
                          <b>Total: <i>{{tableTotal}}</i></b>
                      </v-footer>
                  </template>

                  <template v-slot:item.amt="{ item }"> <span>{{item.quantity * item.rate}}</span> </template>

                  <template v-slot:item.itemName="{ item }">
                    <v-autocomplete v-if="item.id === editedItem.id" v-model="selectedDropDownItem" :items="getItemNames" item-text="itemName" item-value="itemId" @change="updateItem(selectedDropDownItem,item.id)"></v-autocomplete>
                    <span v-else>{{item.itemName}}</span>
                  </template>

                  <template v-slot:item.quantity="{ item }">
                    <v-text-field v-if="item.id === editedItem.id" v-model="editedItem.quantity"></v-text-field>
                      <span v-else>{{item.quantity}}</span>
                  </template>


                  <template v-slot:item.actions="{ item }">
                      <div v-if="item.id === editedItem.id">
                          <v-icon color="red" class="mr-3" @click="closeEditing()">mdi-window-close</v-icon>
                          <v-icon color="green"  @click="saveItem(item)">mdi-content-save</v-icon>
                      </div>

                      <div v-else>
                          <v-icon style="width: 5px; height: 10px; margin: 3px;" color="green" class="mr-3" @click="editItem(item)">mdi-pencil</v-icon>
                          <v-icon style="width: 5px; height: 10px; margin: 3px;" color="red" class="mr-3" @click="deleteItem(item)">mdi-delete</v-icon>
                      </div>
                  </template>

              </v-data-table>
          </v-card>
      </v-app>

  </div>
</template>

<style>

.centered-text .v-input__control {
text-align: center;
}

.centered-text input {
text-align: center;
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

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<script>
import DatePicker from "../components/DatePicker.vue";
import salesDetailService from '../services/SalesDetailService'
import salesService from '../services/SalesService'

import ItemService from '@/services/ItemService';
import CustomerService from '@/services/CustomerService';
import moment from 'moment';

export default{
  name: 'SalesScreen',
  components:{
      DatePicker,
  },
  data:() =>({
      showError:false,
      errorMessage:"Default Error Message..!!",
      headers:[
          {
              text: 'S.No',
              value: 'id',
              sortable: true,
              width: '100px'
          },
          {
              text: 'Description',
              value: 'itemName',
              sortable: true,
              width: '200px'
          },
          {
              text: 'Rate',
              value: 'rate',
              sortable: true,
              width: '100px'
          },
          {
              text: 'Qty',
              value: 'quantity',
              sortable: true,
              width: '70px'
          },
          {
              text: 'Amount',
              value: 'amt',
              sortable: true,
              width: '70px'
          },                  
          { text: 'Actions', value: 'actions', sortable: false , width: "100px"},
      ],
      salesList:[],
      newItem:{},
      customer:{},
      editedItem:{},
      selectedDropDownItem:{},
      selectedDropDownItem2:{},
      dataLoading: true,
      saleId:0,
      tableTotal:0.00,
      customerList:[],
      salesDate:new Date()
  }),
  async created(){
      await this.getAllItems();
      this.dataLoading = false;
      await this.loadDetails(this.saleId);
      await this.getAllCustomers();
      this.$refs["itemRef"].focus();

  },
  async mounted(){
  },
  computed:{
      getCustomerNames(){
          if (this.dataLoading || !this.customerList) {
               return []; // Return empty array if data is still loading or itemList is not yet populated
          }

          return this.customerList.map(res => {
              return {
                  customerId : res.id,
                  customerName: res.customer_name
              }
          });

      },
      getItemNames(){

          if (this.dataLoading || !this.itemList) {
               return []; // Return empty array if data is still loading or itemList is not yet populated
          }

          return this.itemList.map(res => {
              return {
                  itemId : res.id,
                  itemName: res.item_name
              }
          });
      }
  },
  methods:{

      //General operations

      async createNewSales(){
          const currentDate = new Date();
          const newPR = {
              salesDate: currentDate,
              customerId: this.customer.id
          }
          console.log(newPR);
          await salesService.AddSales(newPR).then(res => {
              console.log(res);
              this.saleId = res.id;
              this.salesList = [];
          },
          err => {
              this.errorMessage = err.message;
              this.showError = true;
          });
      },

      async getRate(itemId)
      {
        console.log("GetRate for item..{",itemId,"}");
        console.log(itemId);
        console.log(this.itemList);

          var foundItem = this.itemList.find(item =>  item.id === itemId);
          this.newItem.rate = foundItem.sell_rate;
          this.newItem.saleId = this.saleId;
          this.newItem.quantity = '';
          this.newItem.itemId = itemId;
          this.$refs["quantityRef"].focus();
      },

      async getAllCustomers(){
          await CustomerService.GetAllCustomers().then(res => {
              if (res && Array.isArray(res)) {
                  this.customerList = res;
              } 
              else {
                  console.error('Invalid response from CustomerService.GetAllItems():', res);
              }   
          },err => {
              this.errorMessage = err.message;
              this.showError = true;
              });
      },

      updateItem(selectedDropDownItem,entryId){

          var foundItem = this.itemList.find(item =>  item.id === selectedDropDownItem);

          for(let i =0;i<this.salesList.length;i++)
          {
              if(this.salesList[i].id === entryId)
              {
                  this.salesList[i].itemId = foundItem.id;
                  this.salesList[i].itemName = foundItem.item_name;
                  this.salesList[i].rate = foundItem.rate;

                  this.editedItem = this.salesList[i];
              }
          }
          
      },

      async getAllItems(){
          await ItemService.GetAllItems().then(res => {
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

      focusAndSelect() {
      // Focus on the autocomplete input field
      const inputElement = this.$refs.itemRef.$refs.input;
      inputElement.focus();

      // Select the entire text
      inputElement.select();
      },

      //Entry operations

      //Set an entry to edit mode

      editItem(item)
      {
          this.editedItem = item;
          this.selectedDropDownItem = item;
      },

      //Close the edit mode

      closeEditing(){
          this.editedItem = {};
      },

      //CRUD operations

      //Get Sales with detail

      async loadDetails(id){

          await salesService.GetSalesById(id).then(response=>{
              console.log("Load Sales Details..!!");
              console.log(response);
          },err=>{
              this.errorMessage = err.message;
              this.showError = true;                
          })

          await salesDetailService.GetSaleDetailById(id).then(response => {
              this.salesList = response;
              this.tableTotal = 0;
              for(let i=0;i<this.salesList.length;i++){
                  this.tableTotal = this.tableTotal + (this.salesList[i].rate * this.salesList[i].quantity);
              }
          },err => {
              this.errorMessage = err.message;
              this.showError = true;
          })
      },

      //Add Sales with detail

      async addItem(item)
      {
          item.saleId = this.saleId;
          await salesDetailService.AddSaleDetail(item).then(response => {
          },err =>{
              console.log(err);
              this.errorMessage = err.message;
              this.showError = true;
              return;
          })

          await this.loadDetails(this.saleId);
          this.$refs["itemRef"].focus();
      },

      //Delete Sales with detail

      async deleteItem(item)
      {
          item.saleId = this.saleId;
          await salesDetailService.DeleteSaleDetail(item).then(response => {
          },err =>{
              console.log(err);
              this.errorMessage = err.message;
              this.showError = true;                
              return;
          })

          await this.loadDetails(this.saleId);
      },

      //Save Edited Sales with detail

      async saveItem(item)
      {
          item.saleId = this.saleId;
          await salesDetailService.SaveSaleDetail(item).then(response => {
          },err =>{
              console.log(err);
              this.closeEditing();
              this.errorMessage = err.message;
              this.showError = true;                
              return;
          })
         this.closeEditing();
      }
  }
}
</script>