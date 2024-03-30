<template>
    <div class="about">
        <v-expansion-panels>

            <v-expansion-panel>
                <v-expansion-panel-header icon-rotate>
                    Item Master
                    <template v-slot:actions>
                        <v-icon color="teal">mdi-check</v-icon>
                    </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <ItemMaster></ItemMaster>
                </v-expansion-panel-content>               
            </v-expansion-panel>

            <v-divider style="margin-top: 50px;" inset></v-divider>

            <v-expansion-panel>
                <v-expansion-panel-header icon-rotate>
                    Vendor Master
                    <template v-slot:actions>
                        <v-icon color="teal">mdi-check</v-icon>
                    </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <VendorMaster></VendorMaster>
                </v-expansion-panel-content>                           
            </v-expansion-panel>

            <v-divider style="margin-top: 50px;" inset></v-divider>

            <v-expansion-panel>
                <v-expansion-panel-header icon-rotate>
                    Customer Master
                    <template v-slot:actions>
                        <v-icon color="teal">mdi-check</v-icon>
                    </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <CustomerMaster></CustomerMaster>
                </v-expansion-panel-content>                                 
            </v-expansion-panel>

        </v-expansion-panels>
    </div>
  </template>
  
  <script>
import ItemMaster from './partials/ItemMaster.vue';
import VendorMaster from './partials/VendorMaster.vue';
import CustomerMaster from './partials/CustomerMaster.vue'


  export default {
    name: 'MasterDetails',

    components: {
        ItemMaster,
        VendorMaster,
        CustomerMaster
    },
  }
</script>