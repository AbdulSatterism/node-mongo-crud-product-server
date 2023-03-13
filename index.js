const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// name : crudProduct
//pass : amarProduct

const uri = "mongodb+srv://crudProduct:amarProduct@cluster0.hlsud.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCollection = client.db('crudProduct').collection('products');

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result)
        });

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const product = req.body;
            const option = { upsert: true };
            const updatedProduct = {
                $set: {
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    image: product.image
                }
            }
            const result = await productCollection.updateOne(filter, updatedProduct, option);
            res.send(result)

        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally {

    }
}

run().catch(error => console.log(error))

// async function run() {
//     try {
//         const productCollection = client.db('crudProduct').collection('products');

//         app.get('/products', async (req, res) => {
//             const query = {};
//             const cursor = productCollection.find(query);
//             const products = await cursor.toArray();
//             res.send(products)
//         });

//         app.post('/products', async (req, res) => {
//             const product = req.body;
//             const result = await productCollection.insertOne(product);
//             res.send(result)
//         });

//         app.delete('/products/:id', async (req, res) => {
//             const id = req.params.id;
//             const query = { _id: new ObjectId(id) };
//             const result = await productCollection.deleteOne(query);
//             res.send(result)
//             console.log(result)
//         })
//     }

//     finally {

//     }
// }

// run().catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send("product node crud is running");
});



app.listen(port, () => {
    console.log(`port is running on ${port}`)
})