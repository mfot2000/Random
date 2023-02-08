//Connect to mongo server, database, collection 
const connection = new Mongo( `localhost:27017` ),
    db = connection.getDB( `ClassCorp` ),
    collection = db.getCollection( `Employees` );

let result, // result of inserts, updates, deletes
    cursor; //results of finds

print (`insert a Document into the database`);
/*result = collection.insertOne( {
    empID: 1001,
    name: `Thea`,
    salary: 90000
});
print(result);
print (``);
*/
result = collection.insertMany([
    {
    empID: 1001,
    name: `Thea`,
    salary: 90000
    },
    {
    empID: 1002,
    name: `Vicky`,
    salary: 95000
    },
    {
    empID: 1003,
    name: `Jordan`,
    salary: 80000
    },
    {
    empID: 1004,
    name: `Taylor`,
    salary: 85000
    }
]);
print(result);
print (``);

//Option 1
print(`find one document`);
cursor = collection.find( { empID: 1002 });
while ( cursor.hasNext( )) {
    printjson( cursor.next());
}
print();
//option 2
//comparison operator
print(`find with $eq 1002`); //$eq is comparison operator, default is implied. EQ is used explicitly
result = collection.find( { empID: {$eq: 1002 } } );
while ( cursor.hasNext( )) {
    printjson( cursor.next() );
}
print(``);
//option 3
//instead of setting it equal to cursor, delete it
print(`find with $eq 1002`); //$eq is comparison operator, default is implied. EQ is used explicitly
collection.find( { empID: {$eq: 1002 } } )
.forEach ( (doc) => {
    printjson( doc ); //instead of cursor.next()
    print( doc.empID, `\t`, doc.name, `\t`, doc.salary );
});
print(``);
//3 options show same exact results

print(`find with $ne 1002`); //$ne is not equal to 1002
collection.find( { empID: {$ne: 1002 } } )
.forEach ( (doc) => {
    print( `${doc.empID}\t${doc.name}\t${doc.salary}` );
});
print(``);

print(`find with $in 1002,1003`); //$in operator to find multiple values
collection.find( { empID: {$in: [ 1002, 1003 ] } } )
.forEach ( (doc) => {
    print( `${doc.empID}\t${doc.name}\t${doc.salary}` );
});
print(``);

//We are looking for salary
print(`find with >= 85000, <= 90000`); //$operator gte (greater than or equal to)
collection.find( { salary: {$gte: 85000, $lte: 90000 } } ) //operator $lte (less than or equal to)
.forEach ( (doc) => {
    print( `${doc.empID}\t${doc.name}\t${doc.salary}` );
});
print(``);

//We are looking for salary
//first param: filter criteria
//second param: list of properties we want to get back
print(`find with >= 85000, <= 90000 projection`);
collection.find( 
    { salary: {$gte: 85000, $lte: 90000 } },
    {empID: 1, name: 1, _id:0 } //0 means itll exclude
    ) 
.sort( { name: 1 } ) //-1 sorts descending | you can add more properties too
.forEach ( (doc) => {
    printjson( doc );
});
print(``);

/* Analogous to this in mySQL
SELECT empID, name
FROM Employees
WHERE salary >= 85000
    AND salary <= 90000
ORDER NY name ASC;
*/

//count - its showing it is deprecated (for professor)
//count is method of cursor being returned
print(`find with >= 85000, <= 90000 count`);
let count = collection.find({ salary: {$gte: 85000, $lte: 90000 } })
.count();
print(`count: ${count}`);

//latest version
print(`find with >= 85000, <= 90000 count`);
count = collection.countDocuments({ salary: {$gte: 85000, $lte: 90000 } });
print(`count: ${count}`);


//---------------------------------------------------------------
//updates employees' salaries


//updates!
print(`Jordan gets a raise`);
result = collection.updateOne(
    { name: `Jordan` },
    { $set: { salary: 81000 } }
);
printjson( result );
print();

print(`show everyone's salaries`);
collection.find( {} )
.sort( {salary: 1} )
.forEach( (doc)  => {
    print( `${doc.empID}\t${doc.name}\t${doc.salary}` );
});
print();

//----------------------------------------------
//everyone gets a raise

print(`everyone gets a raise now`);
result = collection.updateOne(
    { salary: { $lt: 95000}}, //first param: match criteria salary //$lt less than
    { $inc: { salary: 1000 } }
);
printjson( result );
print();

print(`show everyone's salaries`);
collection.find( {} )
.sort( {salary: 1} )
.forEach( (doc)  => {
    print( `${doc.empID}\t${doc.name}\t${doc.salary}` );
});
print();

//----------------------------------------------------
// add new employee to collection

print( `upsert a new employee Sophia`);
result = collection.updateOne(
    { name: `Sophia` },
    {
        $set: {
            empID: 1005,
            name: `Sophia`,
            salary:85000
        }
    },
    { upsert: true } //third parameter
);
printjson( result );
print();

print(`show everyone's salaries`);
collection.find( {} )
.sort( {salary: 1} )
.forEach( (doc)  => {
    print( `${doc.empID}\t${doc.name}\t${doc.salary}` );
});
print();

print("We'll delete everyone");
result = collection.deleteMany({}); //empty object to delete everyone
printjson( result );

