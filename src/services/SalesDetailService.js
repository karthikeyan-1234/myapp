import axios from "axios";

class SaleDetailService{

    baseUrl;

    constructor(){
        this.baseUrl = "https://localhost:7195/api/SaleDetails/";
    }

    async GetSaleDetailById(id){
        return await axios.get(`${this.baseUrl}GetSaleDetailsById?Id=${id}`).then(response =>{
            return response.data;
        })
    }

    async AddSaleDetail(item)
    {
      return await axios.post(`${this.baseUrl}AddNewSaleDetail`,item).then(response => {
        return response.data;
      })
    }

    async DeleteSaleDetail(item)
    {
        return await axios.delete(`${this.baseUrl}DeleteSaleDetail?Id=${item.id}`).then(response => {
            return response.data;
        })
    }

    async SaveSaleDetail(item){
        return await axios.put(`${this.baseUrl}UpdateSaleDetail`,item).then(response => {
          return response.data;
        })
      
    }
    
}

export default new SaleDetailService();