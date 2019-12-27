import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';


const firebaseHelper = require('firebase-functions-helper');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const app = express();
app.use(cors({ origin: true}));
const main = express();
const storeCollection = 'store';
main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

export const storedb = functions.https.onRequest(main);

// Add new contact
app.post('/store', async (req, res) => {
    try {
        const store = {
            titulo: req.body['titulo'],
            precio: req.body['precio'],
            cantidad: req.body['cantidad'],
            estado: req.body['estado'],
            tipo: req.body['tipo'],
            posicion: req.body['posicion'],
            descripcion: req.body['descripcion'],
            foto:req.body['foto'],
            usuario: req.body['usuario'],

        }
const newDoc = await firebaseHelper.firestore
            .createNewDocument(db, storeCollection, store);
        res.status(201).send(`Created a new contact: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`Contact should only contains firstName, lastName and email!!!`)
    }        
})

// View all contacts
app.get('/store', (req, res) => {
    firebaseHelper.firestore
        .backup(db, storeCollection)
        .then((data: any) => res.status(200).send(data))
        .catch((error: any) => res.status(400).send(`Cannot get contacts: ${error}`));
})

// View a contact
app.get('/store/:storeId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, storeCollection, req.params.storeId)
        .then((doc: any) => res.status(200).send(doc))
        .catch((error: any) => res.status(400).send(`Cannot get contact: ${error}`));
})

// Update new contact
app.patch('/store/:storeId', async (req, res) => {
    const updatedDoc = await firebaseHelper.firestore
        .updateDocument(db, storeCollection, req.params.storeId, req.body);
    res.status(204).send(`Update a new contact: ${updatedDoc}`);
})

// Delete a contact 
app.delete('/store/:storeId', async (req, res) => {
    const deletedStore = await firebaseHelper.firestore
        .deleteDocument(db, storeCollection, req.params.storeId);
    res.status(204).send(`Contact is deleted: ${deletedStore}`);
})