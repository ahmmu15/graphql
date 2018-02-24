// bring stuff from graphql lib

const {
    GraphQLObjectType,
    // bring any types u wanna use in db
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql')


// hardcoded data for testing
const customers = [
    {id:'1', name: 'John Doe', email: 'john@domain.com', age: 20},
    {id:'2', name: 'Steve Doe', email: 'stv@domain.com', age: 33},
    {id:'3', name: 'Sarah Doe', email: 'sarah@domain.com', age: 19}
]

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
                // because we have hardcoded data for now => we gonna loop throgh the customers and see if the id match the id that requested => if so, then output it
                for(let i = 0; i < customers.length; i++) {
                    if(customers[i].id == args.id) {
                        return customers[i]
                    }
                }
           }
        },
        // query all customers
        customers: {
            // set type to list bcz we're getting a group of customers
            type: new GraphQLList(CustomerType),
            // we dont need args => because we dont need to filter anything, we're grabbing evrything
            resolve(parentValue, args) {
                // because we're using hardcoded data => we gonna just return everything
                return customers
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})