import axios from "axios";

class ItemService{
    myVar = 1;
constructor(){

}

async GetAllItems() {
    return await axios.get('https://localhost:7195/api/item/GetAllItems').then(response => {
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
  // Simulate fetching data from an API
  return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Dummy data for demonstration
        const items = [
          { id: 1, item_name: 'item1', rate: 230.10 },
          { id: 2, item_name: 'item2', rate: 521.10 },
          { id: 3, item_name: 'item3', rate: 324.20 }, 
          { id: 4, item_name: 'item4', rate: 821.10 },
        ];
        resolve(items);
      }, 1000); // Simulate delay of 1 second
    });
}

};


export default new ItemService();