class PurchaseService{
    myVar = 1;
constructor(){

}

async GetAllPurchases() {
    // Simulate fetching data from an API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Dummy data for demonstration
        const purchases = [
          { id: 1, purchaseDate: '2024-03-16', vendorId: 101 },
          { id: 2, purchaseDate: '2024-03-15', vendorId: 102 },
          { id: 3, purchaseDate: '2024-03-14', vendorId: 103 },
          { id: 4, purchaseDate: '2024-03-13', vendorId: 104 }
        ];
        resolve(purchases);
      }, 1000); // Simulate delay of 1 second
    });

  }


  async FindPurchases(fromDate,toDate){
    // Simulate fetching data from an API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Dummy data for demonstration
        const purchases = [
          { id: 1, purchaseDate: '2024-03-16', vendorId: 101 },
          { id: 2, purchaseDate: '2024-03-15', vendorId: 102 },
        ];
        resolve(purchases);
      }, 1000); // Simulate delay of 1 second
    });  
  } 

  async SavePurchases(purchasesArray){
  }

  async GetPurchaseDetails(id){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Dummy data for demonstration
        const purchaseDetails = [
          { id: 1, purchase_id: id, item_name: 'item 1', rate: 500.45, qty: 10 },
          { id: 2, purchase_id: id, item_name: 'item 2', rate: 420.45, qty: 15 },
          { id: 3, purchase_id: id, item_name: 'item 3', rate: 352.45, qty: 21 },
          { id: 4, purchase_id: id, item_name: 'item 4', rate: 586.45, qty: 18 },
        ];
        resolve(purchaseDetails);
      }, 1000); // Simulate delay of 1 second
    });
  }

};


export default new PurchaseService();