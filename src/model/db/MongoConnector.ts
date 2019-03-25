import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017';

export default class MongoConnector {

  public getAll(col: string, callback: (docs: any) => void){
    MongoClient.connect(url, function(err, client) {
      console.log("Connected successfully to server");
     
      const collection = client.db('battleship').collection(col);
      collection.find({}).toArray(function(err, result) {
        client.close();
        callback(result);
      });
    });
  }

  public get(col: string, doc: any, callback: (docs: any) => void){
    MongoClient.connect(url, function(err, client) {
      console.log("Connected successfully to server");
     
      const collection = client.db('battleship').collection(col);
      collection.find(doc).toArray(function(err, result) {
        client.close();
        callback(result);
      });
    });
  }

  public insert(col: string, doc: any, callback: (docs: any) => void){
    MongoClient.connect(url, function(err, client) {
      console.log("Connected successfully to server");
     
      const collection = client.db('battleship').collection(col);
      collection.insertOne(doc, (err, result) =>{
        client.close();
        callback(result);
      });
    });
  }

  public update(col: string, doc: any, docToUpdate: any, callback: (docs: any) => void){
    MongoClient.connect(url, function(err, client) {
      console.log("Connected successfully to server");
     
      const collection = client.db('battleship').collection(col);
      collection.updateOne(doc, { $set: docToUpdate }, (err, result) =>{
        client.close();
        callback(result);
      });
    });
  }

  public delete(col: string, doc: any, callback: (docs: any) => void){
    MongoClient.connect(url, function(err, client) {
      console.log("Connected successfully to server");
     
      const collection = client.db('battleship').collection(col);
      collection.deleteOne(doc, (err, result) => {
        client.close();
        callback(result);
      });
    });
  }

}
