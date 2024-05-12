import axios from "axios";

class PurchaseService{
    myVar = 1;
constructor(){

}

async GetAllPurchases() {
  return await axios.get('https://localhost:7195/api/Purchase/GetAllPurchases').then(response => {
    return response.data;
  })

}

async GetAllPurchasesWithVendorNames() {
  return await axios.get('https://localhost:7195/api/Purchase/GetPurchasesWithVendorNames').then(response => {
    return response.data;
  })

}

async SavePurchase(item){
  return await axios.put("https://localhost:7195/api/Purchase/UpdatePurchase",item).then(response => {
    return response.data;
  })
}

async AddPurchase(item)
{
  return await axios.post("https://localhost:7195/api/Purchase/AddNewPurchase",item).then(response => {
    return response.data;
  })
}


async DeletePurchase(item)
{
  return await axios.delete(`https://localhost:7195/api/Purchase/DeletePurchase?purchaseid=${item.id}`).then(response => {
    return response.data;
  },error => {
    console.log(error);
  })
}


  async SavePurchases(PurchasesArray){
  }

  async GetPurchaseDetails(id){
    return await axios.get('https://localhost:7195/api/Purchase/GetAllPurchases').then(response => {
      return response.data;
    })
  }

};


export default new PurchaseService();