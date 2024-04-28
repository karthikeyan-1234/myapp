import axios from "axios";

class PurchaseDetailService{

    baseUrl;

    constructor(){
        this.baseUrl = "https://localhost:7195/api/PurchaseDetails/";
    }

    async GetPurchaseDetailById(id){
        return await axios.get(`${this.baseUrl}GetPurchaseDetailsById?Id=${id}`).then(response =>{
            console.log(response.data);
            return response.data;
        })
    }

    async AddPurchaseDetail(item)
    {
      return await axios.post(`${this.baseUrl}AddNewPurchaseDetail`,item).then(response => {
        return response.data;
      },error => {
        console.log(error);
      })
    }

    async DeletePurchaseDetail(item)
    {
        return await axios.delete(`${this.baseUrl}DeletePurchaseDetail=${item.id}`).then(response => {
            return response.data;
        },error => {
            console.log(error);
        })
    }

    async SavePurchaseDetail(item){
        return await axios.put(`${this.baseUrl}UpdatePurchaseDetail`,item).then(response => {
          return response.data;
        })
      
      }
    
}

export default new PurchaseDetailService();