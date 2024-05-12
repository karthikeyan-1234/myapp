import axios from "axios";

class PurchaseDetailService{

    baseUrl;

    constructor(){
        this.baseUrl = "https://localhost:7195/api/PurchaseDetails/";
    }

    async GetPurchaseDetailById(id){
        return await axios.get(`${this.baseUrl}GetPurchaseDetailsById?Id=${id}`).then(response =>{
            return response.data;
        })
    }

    async AddPurchaseDetail(item)
    {
      return await axios.post(`${this.baseUrl}AddNewPurchaseDetail`,item).then(response => {
        return response.data;
      })
    }

    async DeletePurchaseDetail(item)
    {
        return await axios.delete(`${this.baseUrl}DeletePurchaseDetail?Id=${item.id}`).then(response => {
            return response.data;
        })
    }

    async SavePurchaseDetail(item){
        return await axios.put(`${this.baseUrl}UpdatePurchaseDetail`,item).then(response => {
          return response.data;
        })
      
    }
    
}

export default new PurchaseDetailService();