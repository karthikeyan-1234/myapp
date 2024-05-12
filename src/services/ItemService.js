import axios from "axios";

class ItemService{
    myVar = 1;
constructor(){

}

async GetAllItems() {
  return await axios.get('https://localhost:7195/api/item/GetAllItemsAsync').then(response => {
    return response.data;
  })

  }

async SaveItem(item){

  console.log("Saving item in service..");
  console.log(item);

  return await axios.put("https://localhost:7195/api/item/UpdateItem",item).then(response => {
    return response.data;
  })

}

async AddItem(item)
{
  console.log("Adding item in service..");
  console.log(item);

  return await axios.post("https://localhost:7195/api/item/AddNewItem",item).then(response => {
    return response.data;
  },error => {
    console.log(error);
  })
}

async DeleteItem(item)
{
  return await axios.delete(`https://localhost:7195/api/item/DeleteItem?itemid=${item.id}`).then(response => {
    return response.data;
  },error => {
    console.log(error);
  })
}


async SaveItems(itemsArray){
}

async GetItemDetails(id){
  return await axios.get(`https://localhost:7195/api/item/GetByItemId?id=${id}`).then(response => {
    return response.data;
  },error => {
    console.log(error);
  })
}

};


export default new ItemService();