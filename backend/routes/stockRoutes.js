const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const StockData = require('../models/stockData');
const StockItem =require('../models/stockItems')
const StockHistory = require('../models/stockHistory');
const ApprovedRequest = require('../models/approvedRequest');

// POST request to add a new stock item
router.post('/add', async (req, res) => {
  const { name, quantity, pricePerUnit } = req.body;
  let totalAmount = quantity * pricePerUnit;

  try {
    const newItem = new StockItem({
      name,
      quantity,
      pricePerUnit,
      totalAmount,
    });

    await newItem.save();

    // Create corresponding stock data for the new item
    const stockData = new StockData({
      itemId: newItem._id,
      entry: {
        quantity: newItem.quantity,
        pricePerUnit: newItem.pricePerUnit,
        totalAmount: newItem.totalAmount
      },
      exit: {
        quantity: 0,
        pricePerUnit: 0,
        totalAmount: 0
      },
      balance: {
        quantity: newItem.quantity,
        pricePerUnit: newItem.pricePerUnit,
        totalAmount: newItem.totalAmount
      }
    });

    await stockData.save(); // Save the stock data

    // Create corresponding initial stock history for the new item
    const stockHistory = new StockHistory({
      itemId: newItem._id,
      entry: {
        quantity: newItem.quantity,
        pricePerUnit: newItem.pricePerUnit,
        totalAmount: newItem.totalAmount
      },
      exit: {
        quantity: 0,
        pricePerUnit: 0,
        totalAmount: 0
      },
      balance: {
        quantity: newItem.quantity,
        pricePerUnit: newItem.pricePerUnit,
        totalAmount: newItem.totalAmount
      }
    });

    await stockHistory.save(); // Save the stock history

    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).send({ success: false, error: error.message });
  }
});

// DELETE /api/stocks/:id - Delete stock item and related stock data and stock histories
router.delete('/:id', async (req, res) => {
  try {
    const stock = await StockItem.findOneAndDelete({ _id: req.params.id });
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    res.json({ message: 'Stock item and related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


//// GET request to fetch all stock items
router.get('/', async (req, res) => {
  try {
    const items = await StockItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Fetch all stock entries with item names
router.get('/', async (req, res) => {
try {
const stocks = await StockData.find().populate('itemId', 'name');
res.json(stocks);
} catch (error) {
res.status(500).json({ message: 'Error fetching stocks', error });
}
});


// Update stock entry
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { entry, exit } = req.body;

try {
const stock = await StockData.findById(id);
if (!stock) {
return res.status(404).send('Stock entry not found');
}

// Update the stock entry and balance
     if (entry) {

     stock.entry = {
     quantity: entry.quantity || O,
     pricePerUnit: entry.pricePerUnit || stock.entry.pricePerUnit,
     totalAmount: entry.quantity * (entry.pricePerUnit || stock.entry.pricePerUnit)
     };
     //make exit quantity and amount equal to zero while enrty updated
     stock.exit.quantity = 0;
     stock.exit.totalAmount = 0;

     stock.balance.quantity +=  stock.entry.quantity;
     stock.balance.totalAmount += stock.entry.totalAmount;
     stock.balance.pricePerUnit = stock.entry.pricePerUnit; // Update price per unit based on the last entry
     }
  

await stock.save();
   // Update the corresponding StockItems
   const stockItem = await StockItem.findById(stock.itemId); // Assuming `itemId` is used to reference `StockItem`
   if (stockItem) {
     stockItem.quantity = stock.balance.quantity;
     stockItem.pricePerUnit = stock.balance.pricePerUnit;
     stockItem.totalAmount = stock.balance.totalAmount;
     await stockItem.save();
   }
// Log the update to the StockHistory collection
const stockHistory = new StockHistory({
itemId: stock.itemId,
entry: stock.entry,
exit: stock.exit,
balance: stock.balance,
updatedAt: Date.now() // Set the updated date
});
await stockHistory.save();

res.json(stock);
} catch (error) {
res.status(500).send('Error updating stock: ' + error.message);
}
});

// Fetch stock entries for an item
router.get('/:itemId', async (req, res) => {
const { itemId } = req.params;

// Check if itemId is a valid ObjectId
if (!isValidObjectId(itemId)) {
  return res.status(400).send('Invalid itemId');
  }
  
  console.log(`Fetching stock entries for itemId: ${itemId}`); // Log itemId
  
  try {
  const stockEntries = await StockData.find({ itemId }).populate('itemId');
  console.log(`Stock entries found: ${stockEntries.length}`); // Log number of stock entries found
  res.status(200).json(stockEntries);
  } catch (error) {
  console.error('Error fetching stock entries:', error);
  res.status(400).json({ message: 'Error fetching stock entries', error });
}
});



// Fetch stock history for an item with date range
router.get('/history/:itemId', async (req, res) => {
const { itemId } = req.params;
const { startDate, endDate } = req.query;

try {
const query = { itemId };

if (startDate && endDate) {
query.updatedAt = {
$gte: new Date(startDate),
$lte: new Date(endDate)
};
}

const stockHistory = await StockHistory.find(query).populate('itemId');
res.status(200).json(stockHistory);
} catch (error) {
res.status(400).json({ message: 'Error fetching stock history', error });
}
});

// Fetch stock history for a specific month,detting stock report
router.get('/history/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);
  
    try {
    const stockHistory = await StockHistory.find({
    updatedAt: {
    $gte: startDate,
    $lt: endDate
    }
  }).populate('itemId', 'name');
  res.json(stockHistory);
  } catch (error) {
  res.status(500).json({ message: 'Error fetching stock history', error });
  }
  });

module.exports = router;

