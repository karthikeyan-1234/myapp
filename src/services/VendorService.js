import axios from "axios";

class VendorService{
    myVar = 1;
constructor(){

}

async GetAllVendors() {
  return await axios.get('https://localhost:7195/api/Vendor/GetAllVendors').then(response => {
    return response.data;
  })

}

async SaveVendor(item){
  return await axios.put("https://localhost:7195/api/Vendor/UpdateVendor",item).then(response => {
    return response.data;
  })

}

async AddVendor(item)
{
  return await axios.post("https://localhost:7195/api/Vendor/AddNewVendor",item).then(response => {
    return response.data;
  },error => {
    console.log(error);
  })
}

async DeleteVendor(item)
{
  return await axios.delete(`https://localhost:7195/api/Vendor/DeleteVendor?vendorid=${item.id}`).then(response => {
    return response.data;
  },error => {
    console.log(error);
  })
}


  async SaveVendors(VendorsArray){
  }

  async GetVendorDetails(id){
    // Simulate fetching data from an API
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Dummy data for demonstration
          const Vendors = [
            { id: 1, vendor_name: 'Vendor1', address: "address 1", mobile: 91761494912 },
            { id: 2, vendor_name: 'Vendor2', address: "address 2", mobile: 91761494913 },
            { id: 3, vendor_name: 'Vendor3', address: "address 3", mobile: 91761494914 },
          ];
          resolve(Vendors);
        }, 1000); // Simulate delay of 1 second
      });
  }

};


export default new VendorService();