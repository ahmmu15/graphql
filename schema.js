// bring stuff from graphql lib

const {
    GraphQLObjectType,
    // bring any types u wanna use in db
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull //to make any field required => not null
} = require('graphql')

const axios = require('axios')


// ==========================
// =====================
// == fetch the data
// =====================
// ==========================

// single customer query
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    // define the fields for the customer
    fields: () => ({
        id: {type: GraphQLString}, //define the type for each field
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt}
    })
})


// root query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',

    fields: {
        // we want to query indivtual customer && all customers
        customer: {
           type: CustomerType, //see above to see what is that
           //we wanna to setch the customer by its id
           args: {
               id: {type: GraphQLString}
           },
        //    resolve our response here
           resolve(parentValue, args) {
                // use axios to make a request
                // we're using the urls below => because json.server lib proovides us with that
                // and we can access specific id by that (ex: http://localhost:3000/customers/id)
                 // u can get the id by args.id
                return axios.get('http://localhost:3000/customers/' + args.id).then(res => res.data)
                }
           },

           // query all customers
           customers: {
               // set type to list bcz we're getting a group of customers
               type: new GraphQLList(CustomerType),
               // we dont need args => because we dont need to filter anything, we're grabbing evrything
               resolve(parentValue, args) {
                   // request using axios
                   // we dont need id (args.id) = bcz wer gettin all customers
                   return axios.get('http://localhost:3000/customers').then(res => res.data)
                   }
               }
        }
})





// ==========================
// =====================
// == mutate the data (aka. update, modify)
// =====================
// ==========================

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // add customer
        addCustomer: {
            type: CustomerType,
            // define the db types of fields u gonna update
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parentValue, args) {
                // make post request to update the data
                return axios.post('http://localhost:3000/customers', {
                    // second arg => thats an object with our submited data
                    name: args.name,
                    email: args.email,
                    age: args.age
                }).then(res => res.data)
            }
        },
        // remove customer
        removeCustomer: {
            type: CustomerType,
            // define the db types of fields u gonna update
            args: {
                // we just need an id to identify whos to remove
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args) {
                // make delete request to remove the user from database
                // we have to cancatenate the user id to the url => args.id
                return axios.delete('http://localhost:3000/customers/' + args.id).then(res => res.data)
            }
        },
        // edit customer
        editCustomer: {
            type: CustomerType,
            // define the db types of fields u gonna update
            args: {
                // we need an id to know which customer we should update
                // only the id is required => we dont want to force users to update all the fields :)
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                age: {type: GraphQLInt},
            },
            resolve(parentValue, args) {
                // make post request to edit the data
                // we need id here => so we know which customer we should update
                return axios.patch('http://localhost:3000/customers/' + args.id, args).then(res => res.data)
            }
        }
    }
})










module.exports = new GraphQLSchema({
    
    query: RootQuery,

    // es5 way
    // mutation: mutation

    // es6 way:
    mutation
})