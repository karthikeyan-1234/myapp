<template>
    <nav>
        <v-app-bar  color="red" dark app >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="text-uppercase ">
                <span class="font-weight-light">Business</span>
                <span> Manager</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu offset-y>
       <template v-slot:activator="{ on }">
         <v-btn
           text
           v-on="on"
         >
           <v-icon left>expand_more</v-icon>
             <span>Menu</span>
         </v-btn>
       </template>
       <v-list flat>
         <v-list-item v-for="link in links"  :key="link.text" router :to="link.route" active-class="border">
           <v-list-item-title >{{link.text}}</v-list-item-title>
         </v-list-item>
       </v-list>
             </v-menu>
             <v-btn text>
                 <span>Exit</span>
                 <v-icon right>exit_to_app</v-icon>
              </v-btn>
        </v-app-bar>
       <v-navigation-drawer  v-model="drawer" dark app class="red darken-4">
           <v-list flat>
               <v-list-item v-for="link in links"  :key="link.text" router :to="link.route" active-class="border">
                   <v-list-item-action>
                      <v-icon >{{link.icon}}</v-icon>
                   </v-list-item-action>
                   <v-list-item-content >
                       <v-list-item-title >{{link.text}}</v-list-item-title>
                   </v-list-item-content>
               </v-list-item>
           </v-list>
       </v-navigation-drawer>
    </nav>
 </template>
 <script>
 export default {
    data: () => ({
       drawer: true,
       links :[
           {icon: 'dashboard', text:'Purchases', route: '/PurchaseScreen'},
           {icon: 'shop_two', text:'Masters', route: '/masterdetails'},
           {icon: 'folder', text:'Sales', route: '/sales'},
           {icon: 'person', text:'Reports', route: '/reports'}
       ]
      
     })
 
    
 }
 </script>
 <style scoped>
 .border {
   border-left: 4px solid #0ba518;
 }
 </style>