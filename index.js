const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;



// middleware 
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iwfbnfv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();

    const toyCollection = client.db('toyDB').collection('toy');

    app.get('/toy',async(req,res) =>{
       const result =  await toyCollection.find().limit(20).toArray();
       
       res.send(result)
    })


    app.get('/toys/category',async(req,res) =>{
      const category = req.query.category;
      const query = {subCategory:category};
       const cursor = toyCollection.find(query);
       const result = await cursor.toArray();
       res.send(result)
    })

    // app.get("/toyDetails/:id" ,async(req,res) =>{
    //   const id = req.params.id;
    //   console.log(id);
    //   const query = id;
    //   const cursor = toyCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result)
    // })


    app.get("/myToys/:email",async(req,res) =>{
        console.log(req.params.email);
        const query = {};
        const options ={
          sort:{
            "price": 1

          }
        }


        if(req.params.email){
          const result = await toyCollection.find( query,options ,{email:req.params.email}).toArray();
          return  res.send(result)
        }
     res.send([]);

    })



    app.get('/searchToys', async(req,res)=>{
          const query = req.query.text;
          console.log(query);
          const result =  await toyCollection.find( { 'name' : { '$regex' : query, '$options' : 'i' } } ).toArray();
        
          res.send(result)
         
    })

    app.post('/toy' ,async(req,res)  =>{
                const newToy = req.body;
                console.log(newToy);
                const result = await toyCollection.insertOne(newToy);
                res.send(result);


    })








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/',(req,res) => {
    res.send('Rhythmic music server is running')
})


app.listen(port ,() => {
    console.log(`Rhythmic music melody is running on port: ${port}`);
} )