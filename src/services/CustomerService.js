import axios from "axios";

class CustomerService{
    myVar = 1;
constructor(){

}

async GetAllCustomers() {
  console.log("Inside GetAllCustomers service function..");
  return await axios.get('https://localhost:7195/api/Customer/GetAllCustomers').then(response => {
    console.log(response);
    return response.data;
  })

}

async SaveCustomer(item){

  console.log("Saving customer in service..");
  console.log(item);

  return await axios.put("https://localhost:7195/api/Customer/UpdateCustomer",item).then(response => {
    return response.data;
  })

}

async AddCustomer(item)
{
  console.log("Adding customer in service..");
  console.log(item);

  return await axios.post("https://localhost:7195/api/Customer/AddNewCustomer",item).then(response => {
    return response.data;
  },error => {
    console.log(error);
  })
}

async DeleteCustomer(item)
{
  return await axios.delete(`https://localhost:7195/api/Customer/DeleteCustomer?customerid=${item.id}`).then(response => {
    return response.data;
  },error => {
    console.log(error);
  })
}


  async SaveCustomers(CustomersArray){
  }

  async GetCustomerDetails(id){
    // Simulate fetching data from an API
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Dummy data for demonstration
          const Customers = [
            { id: 1, customer_name: 'Customer1', address: "address 1", mobile: 91761494912 },
            { id: 2, customer_name: 'Customer2', address: "address 2", mobile: 91761494913 },
            { id: 3, customer_name: 'Customer3', address: "address 3", mobile: 91761494914 },
          ];
          resolve(Customers);
        }, 1000); // Simulate delay of 1 second
      });
  }

};


export default new CustomerService();