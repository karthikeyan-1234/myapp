import axios from "axios";

class SalesService{
    myVar = 1;
constructor(){

}

async GetAllSales() {
  return await axios.get('https://localhost:7195/api/Sale/GetAllSales').then(response => {
    return response.data;
  })

}

async GetAllSalessWithVendorNames() {
  return await axios.get('https://localhost:7195/api/Sale/GetSalessWithVendorNames').then(response => {
    return response.data;
  })

}

async SaveSales(item){
  return await axios.put("https://localhost:7195/api/Sale/UpdateSale",item).then(response => {
    return response.data;
  })
}

async AddSales(item)
{
  return await axios.post("https://localhost:7195/api/Sale/AddNewSale",item).then(response => {
    return response.data;
  })
}


async DeleteSales(item)
{
  return await axios.delete(`https://localhost:7195/api/Sale/DeleteSale?purchaseid=${item.id}`).then(response => {
    return response.data;
  },error => {
    console.log(error);
  })
}


  async SaveSales(SalessArray){
  }

  async GetSalesById(id)
  {
    return await axios.get(`https://localhost:7195/api/Sale/GetBySaleId?id=${id}`).then(response => {
      return response.data;
    },error => {
      console.log(error);
    })    
  }

  async GetSalesDetails(id){
    return await axios.get('https://localhost:7195/api/Sale/GetAllSales').then(response => {
      return response.data;
    })
  }

};


export default new SalesService();